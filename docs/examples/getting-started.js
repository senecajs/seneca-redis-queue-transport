// A service and a client in one process, talking through Redis lists.
// Start Redis first: npm run services:up (host port 16383).
const Seneca = require('seneca')

const redis = {
  type: 'redis-queue',
  host: process.env.SENECA_TEST_REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.SENECA_TEST_REDIS_PORT || '16383', 10),
}

const service = Seneca({ log: 'silent' })
  .use('seneca-transport')
  .use(require('../../redis-queue-transport.js'))
  .add('color:red', function (msg, reply) {
    reply(null, { hex: '#FF0000', asked_by: msg.name })
  })
  .listen(redis)

service.ready(function () {
  const client = Seneca({ log: 'silent' })
    .use('seneca-transport')
    .use(require('../../redis-queue-transport.js'))
    .client(redis)

  client.ready(function () {
    client.act('color:red,name:alice', function (err, out) {
      if (err) throw err
      console.log('reply:', out)
      client.close(function () {
        service.close(function () {
          console.log('closed')
        })
      })
    })
  })
})
