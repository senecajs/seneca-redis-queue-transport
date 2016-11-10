/* Copyright (c) 2014-2015 Richard Rodger */
'use strict'

var Lab = require('lab')
var Code = require('code')
var expect = Code.expect

var TransportTest = require('seneca-transport-test')

// Test shortcuts
var lab = exports.lab = Lab.script()
var describe = lab.describe
var test = lab.test

describe('redis-transport', { timeout: 5000 }, function () {
  function senecaInstance () {
    return require('seneca')({
      log: 'silent',
      timeout: null,
      url: 'redis://localhost:6379'
    }).use('../redis-queue-transport.js')
  }

  TransportTest.basictest({
    seneca: senecaInstance(),
    type: 'redis-queue',
    port: -6379,
    script: lab
  })

  TransportTest.basicpintest({
    seneca: senecaInstance(),
    type: 'redis-queue',
    port: -6379,
    script: lab
  })

  test('options', function (done) {
    var a = require('seneca')({
      log: 'silent',
      timeout: 23555
    })
      .use('../redis-queue-transport.js')

    var so = a.options()
    expect(so.timeout).to.exist()
    expect(so.timeout).to.equal(23555)

    var b = require('seneca')({
      log: 'silent',
      timeout: null
    })
      .use('../redis-queue-transport.js')

    so = b.options()
    expect(so.timeout).to.be.null()

    var c = require('seneca')({
      log: 'silent',
      timeout: null,
      url: 'redis://localhost:6379'
    })
      .use('../redis-queue-transport.js')

    so = c.options()
    expect(so.url).to.equal('redis://localhost:6379')

    done()
  })
})
