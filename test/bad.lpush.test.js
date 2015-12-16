/* Copyright (c) 2014 Richard Rodger, MIT License */
'use strict'

var Lab = require('lab')
var assert = require('assert')

var redisQueueTransport = require('../redis-queue-transport.js')

// Test shortcuts
var lab = exports.lab = Lab.script()
var describe = lab.describe
var test = lab.test

var internals = {
  defaults: {
    'redis-queue': {
      type: 'redis-queue',
      host: 'localhost',
      port: 6379
    }
  }
}

var lpush = require('redis').RedisClient.prototype.lpush

describe('redis-transport', function () {
  test('bad lpush client', function (fin) {
    var seneca_srv = require('seneca')({log: 'silent'})
      .use(redisQueueTransport)

    var service = foo_service(seneca_srv, internals.defaults['redis-queue'].type, internals.defaults['redis-queue'].port)

    service.ready(function () {
      var seneca_client = require('seneca')({
        log: 'silent', debug: {undead: true}, errhandler: function (err) {
          assert.equal('seneca: Action  failed: [TIMEOUT].', err.message)
          require('redis').RedisClient.prototype.lpush = lpush
          foo_close(client, service, fin)
        }, timeout: 111
      })
        .use(redisQueueTransport)

      var client = foo_run(seneca_client, internals.defaults['redis-queue'].type, internals.defaults['redis-queue'].port)
    })
  })

  test('bad lpush server', function (fin) {
    var seneca_srv = require('seneca')({log: 'silent'})
      .use(redisQueueTransport)

    var service = foo_service(seneca_srv, internals.defaults['redis-queue'].type, internals.defaults['redis-queue'].port)

    service.ready(function () {
      var seneca_client = require('seneca')({
        log: 'silent', debug: {undead: true}, errhandler: function (err) {
          assert.equal('seneca: Action  failed: [TIMEOUT].', err.message)
          require('redis').RedisClient.prototype.lpush = lpush
          foo_close(client, service, fin)
        }, timeout: 111
      })
        .use(redisQueueTransport)

      var server = true
      var client = foo_run(seneca_client, internals.defaults['redis-queue'].type, internals.defaults['redis-queue'].port, server)
    })
  })
})

function foo_plugin () {
  this.add('foo:1', function (args, done) {
    done(null, {dee: '1-' + args.bar})
  })
}

function foo_service (seneca, type, port) {
  return seneca
    .use(foo_plugin)
    .listen({type: type, port: (port < 0 ? -1 * port : port)})
}

function foo_run (seneca, type, port, server) {
  var pn = port < 0 ? -1 * port : port

  return seneca
    .client({type: type, port: pn})
    .ready(function () {
      if (server) {
        require('redis').RedisClient.prototype.lpush = function (key, arg, callback) {
          if (key && key === 'seneca_any_act') {
            lpush.call(this)
          }
          else {
            return callback('lpush err', null)
          }
        }
      }
      else {
        require('redis').RedisClient.prototype.lpush = function (key, arg, callback) {
          return callback('lpush err', null)
        }
      }

      this.act('foo:1,bar:"A"')
    })
}

function foo_close (client, service, fin) {
  client.close(function (err) {
    if (err) return fin(err)

    service.close(function (err) {
      return fin(err)
    })
  })
}
