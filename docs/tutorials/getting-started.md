# Getting started

In this tutorial you run a Seneca service and a Seneca client that talk to
each other through Redis lists. It takes about five minutes.

## What you need

* Node.js 22 or 24.
* Docker, to run Redis. Any Redis server you can reach works too.

## 1. Install

```sh
npm install seneca seneca-transport @seneca/redis-queue-transport
```

`seneca-transport` is required on Seneca 4: it provides the transport
utilities this plugin is built on.

## 2. Start Redis

From a clone of this repository:

```sh
npm run services:up
```

This starts `redis:8.10` with host port 16383. The examples read
`SENECA_TEST_REDIS_HOST` and `SENECA_TEST_REDIS_PORT` if you use another
server.

## 3. Write the program

This is [examples/getting-started.js](../examples/getting-started.js):

```js
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
```

In your own project replace `require('../../redis-queue-transport.js')`
with `'@seneca/redis-queue-transport'`.

## 4. Run it

```sh
node docs/examples/getting-started.js
```

Output (with `seneca@4.0.0-rc5`):

```
reply: { hex: '#FF0000', asked_by: 'alice' }
closed
```

## What happened

1. `listen` started a blocking read (`BLPOP`) on the Redis list
   `seneca_any_act`.
2. The client has no local `color:red` action, so `act` sent the message
   to Redis with `RPUSH seneca_any_act`.
3. The service popped the message, ran its action, and pushed the reply to
   `seneca_any_res/<client instance id>`.
4. The client, blocked on `BRPOP` of that list, received the reply and
   called your callback.
5. `close` ended both instances' Redis connections, so the process exits.

## Next steps

* [Use a named topic](../how-to/use-a-named-topic.md) to separate services.
* [Options](../reference/options.md) lists every setting.
* [How the queue transport works](../explanation/how-it-works.md).
