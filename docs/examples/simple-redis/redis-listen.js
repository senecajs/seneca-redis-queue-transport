'use strict'

let seneca = require('seneca')()
seneca.use('../../../redis-queue-transport').ready(function () {
  this.add({foo: 'one'}, function (args, done) {
    done(null, {bar: args.bar})
  })
})

seneca.listen({type: 'redis-queue', pin: 'foo:one'})
