/* Copyright (c) 2014-2015 Richard Rodger */
'use strict'

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe

var test = require('seneca-transport-test')

describe('redis-transport', function () {

  lab.test('happy-any', function (fin) {
    test.foo_test('redis-queue-transport', require, fin, 'redis-queue', -6379)
  })

  lab.test('happy-pin', function (fin) {
    test.foo_pintest('redis-queue-transport', require, fin, 'redis-queue', -6379)
  })
})
