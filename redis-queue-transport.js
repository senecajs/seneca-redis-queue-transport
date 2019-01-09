/* jshint asi: true */
/* Copyright (c) 2015 Cristian Ianto, Richard Rodger MIT License */
'use strict'

var _ = require('lodash')
var Redis = require('redis')

var internals = {
  defaults: {
    'redis-queue': {
      timeout: 22222,
      type: 'redis-queue',
      host: 'localhost',
      port: 6379
    }
  }
}

module.exports = function (options) {
  var seneca = this
  var plugin = 'redis-queue-transport'
  var so = seneca.options()
  var tu

  internals.defaults.timeout = so.timeout ? (so.timeout - 555) : internals.defaults.timeout
  options = seneca.util.deepextend(internals.defaults, so.transport, options)

  tu = seneca.export('transport/utils')

  seneca.add({role: 'transport', hook: 'listen', type: 'redis-queue'}, hookListenRedis)
  seneca.add({role: 'transport', hook: 'client', type: 'redis-queue'}, hookClientRedis)

  function hookListenRedis (args, done) {
    var seneca = this
    var type = args.type
    var listenOptions = seneca.util.clean(_.extend({}, options[type], args))
    var useTopic = args.topic || 'seneca_any'
    var redisIn = Redis.createClient(listenOptions.port, listenOptions.host)
    var redisOut = Redis.createClient(listenOptions.port, listenOptions.host)

    handleEvents(redisIn)
    handleEvents(redisOut)

    function onMessage (topic, msgstr) {
      var data = tu.parseJSON(seneca, 'listen-' + type, msgstr)

      tu.handle_request(seneca, data, listenOptions, function (out) {
        if (out === null) {
          return
        }

        var outstr = tu.stringifyJSON(seneca, 'listen-' + type, out)
        redisOut.lpush(topic + '_res' + '/' + data.origin, outstr, function (err, reply) {
          if (err) {
            seneca.log.error('transport', 'redis-queue', err)
          }
        })
      })
    }

    var blockingRead = function blockingRead (topic) {
      redisIn.blpop(topic + '_act', 0, function (err, reply) {
        if (err) { return seneca.log.error('transport', 'server-redis-brpop', err) }
        if (reply && reply.length) {
          onMessage(topic, reply[1])
        }
        blockingRead(topic)
      })
    }
    blockingRead(useTopic)

    seneca.add('role:seneca,cmd:close', function (closeArgs, done) {
      var closer = this
      redisIn.end(true)
      redisOut.end(true)
      closer.prior(closeArgs, done)
    })

    seneca.log.info('listen', 'open', listenOptions, seneca)

    done()
  }

  function hookClientRedis (args, clientdone) {
    var seneca = this
    var type = args.type
    var clientOptions = seneca.util.clean(_.extend({}, options[type], args))
    var useTopic = args.topic || 'seneca_any'
    var redisIn
    var redisOut

    tu.make_client(makeSend, clientOptions, clientdone)

    redisIn = Redis.createClient(clientOptions.port, clientOptions.host)
    redisOut = Redis.createClient(clientOptions.port, clientOptions.host)

    handleEvents(redisIn)
    handleEvents(redisOut)

    function onMessage (topic, msgstr) {
      var input = tu.parseJSON(seneca, 'client-' + type, msgstr)
      tu.handle_response(seneca, input, clientOptions)
    }

    var blockingRead = function blockingRead (topic) {
      redisIn.brpop(topic + '_res' + '/' + seneca.id, 0, function (err, reply) {
        if (err) { return seneca.log.error('transport', 'server-redis-brpop', err) }
        if (reply && reply.length) {
          onMessage(topic, reply[1])
        }
        blockingRead(topic)
      })
    }

    blockingRead(useTopic)

    function makeSend (spec, topic, send_done) {
      send_done(null, function (localArgs, done, meta) {
        var outmsg = tu.prepare_request(this, localArgs, done, meta)
        var outstr = tu.stringifyJSON(seneca, 'client-' + type, outmsg)

        redisOut.rpush(useTopic + '_act', outstr, function (err, reply) {
          if (err) {
            seneca.log.error('transport', 'redis-queue', err)
          }
        })
      })

      seneca.add('role:seneca, cmd:close', function (closeArgs, done) {
        var closer = this
        redisIn.quit()
        redisOut.quit()
        closer.prior(closeArgs, done)
      })
    }
  }

  function handleEvents (redisclient) {
    redisclient.once('ready', function () {
      redisclient.on('error', function (err) {
        seneca.log.error('transport', 'redis', err)
      })
    })
  }

  return {
    name: plugin
  }
}
