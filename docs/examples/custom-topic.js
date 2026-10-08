// Use a named topic so that this service has its own pair of Redis lists.
// Start Redis first: npm run services:up (host port 16383).
const Seneca = require('seneca')

const redis = {
  type: 'redis-queue',
  host: process.env.SENECA_TEST_REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.SENECA_TEST_REDIS_PORT || '16383', 10),
  topic: 'math',
}

function make() {
  return Seneca({ log: 'silent' })
    .use('seneca-transport')
    .use(require('../../redis-queue-transport.js'))
}

const service = make()
  .add('math:sum', function (msg, reply) {
    reply(null, { sum: msg.left + msg.right })
  })
  .listen(redis)

service.ready(function () {
  const client = make().client(redis)

  client.ready(function () {
    client.act('math:sum,left:1,right:2', function (err, out) {
      if (err) throw err
      console.log('sum:', out.sum)
      client.close(() => service.close(() => console.log('closed')))
    })
  })
})
