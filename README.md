![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] plugin

# @seneca/redis-queue-transport

A Seneca message transport over Redis lists used as queues. Clients push
requests onto a Redis list and any number of listeners take them off in
order, so work is shared between services and waits in Redis while no
service is running. Works with Seneca 4 and [@seneca/transport][] 9, on
Node.js 24 or later. Seneca 3 users stay on `seneca-redis-queue-transport`
0.3.

[![npm version][npm-badge]][npm-url]
[![Gitter][gitter-badge]][gitter-url]

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

## Install

```sh
npm install seneca@^4 @seneca/transport @seneca/redis-queue-transport
```

Releases up to 0.3.0 were published as `seneca-redis-queue-transport`.
From 1.0.0 the package is `@seneca/redis-queue-transport`. You also need
a Redis server.

## Quick Example

```js
const Seneca = require('seneca')
const redis = { type: 'redis-queue', host: '127.0.0.1', port: 6379 }

const service = Seneca()
  .use('@seneca/transport')
  .use('@seneca/redis-queue-transport')
  .add('color:red', (msg, reply) => reply(null, { hex: '#FF0000' }))
  .listen(redis)

const client = Seneca()
  .use('@seneca/transport')
  .use('@seneca/redis-queue-transport')
  .client(redis)

client.act('color:red', (err, out) => {
  console.log(out) // { hex: '#FF0000' }
  client.close(() => service.close())
})
```

## More Examples

* [Getting started](docs/tutorials/getting-started.md): a service and a
  client in one program, step by step.
* [Use a named topic](docs/how-to/use-a-named-topic.md).
* [Run the tests locally](docs/how-to/run-the-tests-locally.md).
* Runnable programs: [docs/examples](docs/examples/).

## Motivation

Request and response transports need the service to be up when the client
calls. A queue in Redis lets requests wait, and spreads them across as many
listeners as you run. See
[How the queue transport works](docs/explanation/how-it-works.md).

## Support

* Report problems on the [GitHub issue tracker][github issue].
* Seneca documentation: [senecajs.org][] and the
  [Seneca repository docs](https://github.com/senecajs/seneca/tree/master/docs).
* Commercial support: [Voxgig](https://www.voxgig.com).

## API

Full documentation index: [docs/README.md](docs/README.md).

| Item | Summary | Reference |
| ---- | ------- | --------- |
| `listen({ type: 'redis-queue', host, port, topic })` | Take requests from `<topic>_act`. | [Messages](docs/reference/messages.md) |
| `client({ type: 'redis-queue', host, port, topic, pin })` | Send requests to `<topic>_act`, read replies. | [Messages](docs/reference/messages.md) |
| Plugin option `redis-queue` | Default `host`, `port`, `timeout`. | [Options](docs/reference/options.md) |

## Contributing

The [Senecajs org][] encourages open participation. To run the tests you
need Docker and Node.js 24 or later:

```sh
npm run services:up    # redis:8.10 on host port 16383
npm install
npm test               # Seneca 4 and @seneca/transport are devDependencies
npm run services:down
```

The CI workflow is kept as a patch in [.patches](.patches/README.md); apply
it with `git am .patches/*.patch`.

## Background

Written by Cristian Ianto for Seneca 1 to 3. Version 1.0.0 is for
Seneca 4 only (see [CHANGES.md](CHANGES.md)).

| Plugin | Seneca | Node | Notes |
| ------ | ------ | ---- | ----- |
| 1.x | 4 (load `@seneca/transport` first) | 24 and later | |
| 0.3.x (`seneca-redis-queue-transport`) | 1 to 3 | 4, 6 | Not tested on current Node. |

License: [MIT][].

[npm-badge]: https://img.shields.io/npm/v/@seneca/redis-queue-transport.svg
[npm-url]: https://npmjs.com/package/@seneca/redis-queue-transport
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/senecajs/seneca
[MIT]: ./LICENSE
[Senecajs org]: https://github.com/senecajs/
[Seneca.js]: https://www.npmjs.com/package/seneca
[senecajs.org]: http://senecajs.org/
[@seneca/transport]: https://github.com/senecajs/seneca-transport
[github issue]: https://github.com/senecajs/seneca-redis-queue-transport/issues
