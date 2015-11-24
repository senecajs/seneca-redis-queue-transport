/* Copyright (c) 2014-2015 Richard Rodger */
'use strict'

var Lab = require('lab')
var TransportTest = require('seneca-transport-test')

// Test shortcuts
var lab = exports.lab = Lab.script()
var describe = lab.describe


describe('redis-transport', function () {
  lab.test('happy-any', function (done) {
    TransportTest.foo_test('redis-queue-transport', require, done, 'redis-queue', -6379)
  })

  lab.test('happy-pin', function (done) {
    TransportTest.foo_pintest('redis-queue-transport', require, done, 'redis-queue', -6379)
  })
})
