/* Copyright (c) 2014 Richard Rodger, MIT License */
'use strict'

var Lab = require('lab')
var Code = require('code')
var expect = Code.expect

var RedisQueueTransport = require('../redis-queue-transport.js')

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

var brpop = require('redis').RedisClient.prototype.brpop

describe('redis-transport', function () {
  test('brpop returns error', function (fin) {
    var seneca_srv = require('seneca')({ log: 'silent' })
      .use(RedisQueueTransport)

    var service = foo_service(seneca_srv, internals.defaults['redis-queue'].type, internals.defaults['redis-queue'].port)

    service.ready(function () {
      var seneca_client = require('seneca')({log: 'silent', debug: {undead: true}, errhandler: function (err) {
        expect(err.message).to.startWith('seneca: Action  failed: [TIMEOUT')
        require('redis').RedisClient.prototype.brpop = brpop
        fin()
      }, timeout: 111})
        .use(RedisQueueTransport)

      foo_run(seneca_client, internals.defaults['redis-queue'].type, internals.defaults['redis-queue'].port)
    })
  })

  /*
   * this test makes no sense - if brpop returns an empty reply skip and keep listening...
   *
  test('brpop returns empty reply', function (fin) {
    var seneca_srv = require('seneca')({ log: 'silent' })
      .use(RedisQueueTransport)

    var service = foo_service(seneca_srv, internals.defaults['redis-queue'].type, internals.defaults['redis-queue'].port)

    service.ready(function () {
      var seneca_client = require('seneca')({log: 'silent', debug: {undead: true}, errhandler: function (err) {
        expect(err.message).to.startWith('seneca: Action  failed: [TIMEOUT')
        require('redis').RedisClient.prototype.brpop = brpop
        foo_close(client, service, fin)
      }, timeout: 111})
        .use(RedisQueueTransport)

      var reply = []
      var client = foo_run(seneca_client, internals.defaults['redis-queue'].type, internals.defaults['redis-queue'].port, reply)
    })
  })
  */
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

function foo_run (seneca, type, port, reply) {
  var pn = port < 0 ? -1 * port : port

  return seneca
    .client({type: type, port: pn})
    .ready(function () {
      require('redis').RedisClient.prototype.brpop = function (key, timeout, callback) {
        return reply ? callback(null, reply) : callback('some err', null)
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
