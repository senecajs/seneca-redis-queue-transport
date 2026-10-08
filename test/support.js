/* Copyright (c) 2014-2026 Richard Rodger and other contributors, MIT License */
'use strict'

// Shared test settings. Defaults match docker-compose.yml (npm run services:up).
const Seneca = require('seneca')
const RedisQueueTransport = require('../redis-queue-transport.js')

const config = {
  type: 'redis-queue',
  host: process.env.SENECA_TEST_REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.SENECA_TEST_REDIS_PORT || '16383', 10),
}

// A Seneca instance with seneca-transport and this plugin loaded.
function make (opts) {
  return Seneca(Object.assign({ log: 'silent' }, opts))
    .use('seneca-transport')
    .use(RedisQueueTransport)
}

function foo_plugin () {
  const fafmap = (foo_plugin.fafmap = foo_plugin.fafmap || {})
  this.add('foo:1', function (args, done) {
    done(null, { dee: '1-' + args.bar })
  })
  this.add('nores:1', function (args, done) {
    done()
  })
  this.add('faf:1', function (args, done) {
    fafmap[args.k] = args.v
    done()
  })
}

function close (instances) {
  return Promise.all(
    instances.map((si) => new Promise((resolve) => si.close(() => resolve()))),
  )
}

module.exports = { config, make, foo_plugin, close, RedisQueueTransport }
