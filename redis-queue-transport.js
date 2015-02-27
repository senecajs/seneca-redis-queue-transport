/* Copyright (c) 2015 Cristian Ianto, Richard Rodger MIT License */
'use strict';

var _ = require('lodash')
var redis = require('redis')


module.exports = function (options) {
  var seneca = this
  var plugin = 'redis-queue-transport'

  var so = seneca.options()

  options = seneca.util.deepextend({
      'redis-queue': {
        timeout: so.timeout ? so.timeout - 555 : 22222,
        type: 'redis-queue',
        host: 'localhost',
        port: 6379
      }
    },
    so.transport,
    options
  )


  var tu = seneca.export('transport/utils')


  seneca.add({role: 'transport', hook: 'listen', type: 'redis-queue'}, hook_listen_redis)
  seneca.add({role: 'transport', hook: 'client', type: 'redis-queue'}, hook_client_redis)


  function hook_listen_redis(args, done) {
    var seneca = this
    var type = args.type
    var listen_options = seneca.util.clean(_.extend({}, options[type], args))

    var redis_in = redis.createClient(listen_options.port, listen_options.host)
    var redis_out = redis.createClient(listen_options.port, listen_options.host)

    handle_events(redis_in)
    handle_events(redis_out)

    function on_message(topic, msgstr) {
      var data = tu.parseJSON(seneca, 'listen-' + type, msgstr)

      tu.handle_request(seneca, data, listen_options, function (out) {
        if (null === out) return;
        var outstr = tu.stringifyJSON(seneca, 'listen-' + type, out)
        redis_out.lpush(topic + '_res', outstr, function(err, reply) {
          if (err) {
            seneca.log.error('transport', 'redis-queue', err)
          }
        })
      })
    }

    tu.listen_topics(seneca, args, listen_options, function (topic) {
      seneca.log.debug('listen', 'brpop', topic + '_act', listen_options, seneca)

      var waiting = false
      function next() {
        waiting = true
        redis_in.brpop(topic + '_act', 0, function(err, reply) {
          if (err) {
            seneca.log.error('transport', 'server-redis-brpop', err)
            waiting = false
            return;
          }
          if (!reply.length) {
            waiting = false
            return;
          }
          on_message(topic, reply[1])
          setImmediate(next)
        })
      }
      redis_in.on('idle', function() {
        setImmediate(function() {
          if (!waiting) {
            next()
          }
        })
      })
    })

    seneca.add('role:seneca,cmd:close', function (close_args, done) {
      var closer = this

      redis_in.end()
      redis_out.end()
      closer.prior(close_args, done)
    })

    seneca.log.info('listen', 'open', listen_options, seneca)

    done()
  }


  function hook_client_redis(args, clientdone) {
    var seneca = this
    var type = args.type
    var client_options = seneca.util.clean(_.extend({}, options[type], args))

    tu.make_client(make_send, client_options, clientdone)

    function make_send(spec, topic, send_done) {
      var redis_in = redis.createClient(client_options.port, client_options.host)
      var redis_out = redis.createClient(client_options.port, client_options.host)

      handle_events(redis_in)
      handle_events(redis_out)

      function on_message(topic, msgstr) {
        var input = tu.parseJSON(seneca, 'client-' + type, msgstr)
        tu.handle_response(seneca, input, client_options)
      }

      seneca.log.debug('client', 'brpop', topic + '_res', client_options, seneca)

      var waiting = false
      function next() {
        redis_in.brpop(topic + '_res', 0, function(err, reply) {
          if (err) {
            seneca.log.error('transport', 'client-redis-brpop', err)
            return;
          }
          if (!reply.length) {
            return;
          }
          on_message(topic, reply[1])
          setImmediate(next)
        })
      }
      redis_in.on('idle', function() {
        setImmediate(function() {
          if (!waiting) {
            next()
          }
        })
      })

      send_done(null, function (args, done) {
        var outmsg = tu.prepare_request(this, args, done)
        var outstr = tu.stringifyJSON(seneca, 'client-' + type, outmsg)

        redis_out.lpush(topic + '_act', outstr, function(err, reply) {
          if (err) {
            seneca.log.error('transport', 'redis-queue', err)
          }
        })
      })

      seneca.add('role:seneca,cmd:close', function (close_args, done) {
        var closer = this

        redis_in.end()
        redis_out.end()
        closer.prior(close_args, done)
      })
    }
  }


  function handle_events(redisclient) {
    // Die if you can't connect initially
    redisclient.on('ready', function () {
      redisclient.on('error', function (err) {
        seneca.log.error('transport', 'redis', err)
      })
    })
  }

  return {
    name: plugin
  }
}
