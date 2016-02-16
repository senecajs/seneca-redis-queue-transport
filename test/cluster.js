/* Copyright (c) 2015 Cristian Ianto, MIT License */
'use strict'

var _ = require('lodash')
var Async = require('async')
var Cluster = require('cluster')
var Seneca = require('seneca')
var Code = require('code')
var expect = Code.expect

var NUM_TASKS = 20
var NUM_CLIENTS = 3
var NUM_SERVERS = 3

if (Cluster.isMaster) {
  var workers = {}
  var clientworkers = []
  var serverworkers = []

  var tasks = {}
  for (var idx = 0; idx < NUM_TASKS; idx++) {
    tasks[idx] = {id: idx}
  }

  var i
  var worker

  // start clients
  for (i = 0; i < NUM_CLIENTS; i++) {
    worker = Cluster.fork({TYPE: 'client'})
    workers[worker.id] = worker
    clientworkers.push(worker)
    worker.on('message', function (msg) {
      if (msg.event === 'callback') {
        console.log(_.padLeft(msg.task.id, 4, '0') + '-callback' + ' ' + this.process.pid)
        results[msg.task.id] = results[msg.task.id] || {}
        if (msg.err) {
          results[msg.task.id].errcount = (results[msg.task.id].errcount || 0) + 1
        }
        else {
          results[msg.task.id].cbcount = (results[msg.task.id].cbcount || 0) + 1
        }
      }
    })
  }

  // start servers
  var results = {}
  for (i = 0; i < NUM_SERVERS; i++) {
    worker = Cluster.fork()
    workers[worker.id] = worker
    serverworkers.push(worker)
    worker.on('message', function (msg) {
      if (msg.event === 'exec') {
        console.log(_.padLeft(msg.task.id, 4, '0') + '-exec' + ' ' + this.process.pid)
        results[msg.task.id] = results[msg.task.id] || {}
        results[msg.task.id].evcount = (results[msg.task.id].evcount || 0) + 1
      }
    })
  }

  Async.each(_.values(workers), function (worker, done) { // wait for all workers to start
    worker.on('message', function (msg) {
      if (msg.event === 'ready') {
        return done()
      }
    })
  }, function () { // then act
    // signal clients to act
    _.each(tasks, function (task, idx) {
      clientworkers[idx % NUM_CLIENTS].send({cmd: 'exec', task: task})
    })

    // allow enough time for the test to complete before killing the workers
    setTimeout(function () {
      _.each(workers, function (worker) {
        worker.kill()
      })
    }, 10 * 1e3)
  })

  Async.each(_.values(workers), function (worker, done) { // wait for all workers to exit
    worker.on('exit', function () {
      return done()
    })
  }, function () {
    _.each(tasks, function (task) {
      // actions handled by handle 'once' listeners should be processed once and only once
      expect(results[task.id]).to.exist()
      // no errors
      expect(results[task.id].errcount || 0).to.equal(0)
      // executed once
      expect(results[task.id].evcount).to.equal(1)
      // called back once
      expect(results[task.id].cbcount).to.equal(1)
    })
  })
}
else {
  var si = Seneca({
    timeout: 5 * 1e3
  })

  si.use('../redis-queue-transport')

  if (process.env['TYPE'] === 'client') {
    si.client({type: 'redis-queue', pin: 'role:test,cmd:*'})

    process.on('message', function (msg) {
      if (msg.cmd === 'exec') {
        si.act({role: 'test', cmd: 'exec', task: msg.task}, function (err) {
          if (err) {
            // console.error(err);
          }
          process.send({event: 'callback', task: msg.task, err: err})
        })
      }
    })
  }
  else {
    si.listen({type: 'redis-queue', pin: 'role:test,cmd:*', handle: 'once'})

    si.add({role: 'test', cmd: 'exec'}, function (args, done) {
      process.send({event: 'exec', task: args.task})
      return done()
    })
  }

  // signal worker ready
  si.ready(function () {
    process.send({event: 'ready'})
  })
}

