![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] transport plugin

# seneca-redis-queue-transport
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Gitter][gitter-badge]][gitter-url]

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

This plugin provides transport for micro-service messages via Redis (list based) queues.
This lets you send messsages via [redis](http://redis.io/).

ALSO READ: The [seneca-transport](http://github.com/rjrodger/seneca-transport) readme has lots of introductory material about message transports. Start there if you have not used a message transport before.

- __Node:__ 4, 6
- __License:__ [MIT][]

seneca-redis-queue-transport's source can be read in an annotated fashion by,

- running `npm run annotate`
- viewing [online](https://github.com/senecajs/seneca-redis-queue-transport/doc/redis-queue-transport.html).

The annotated source can be found locally at [./doc/redis-queue-transport.html]().

If you're using this module, and need help, you can:

- Post a [github issue][],
- Tweet to [@senecajs][],
- Ask on the [Gitter][gitter-url].

If you are new to Seneca in general, please take a look at [senecajs.org][]. We have everything from
tutorials to sample apps to help get you up and running quickly.

### Seneca compatibility

Supports Seneca versions **1.x** - **3.x**

## Install
To install, simply use npm. Remember you will need to install [Seneca.js][] if you haven't already.

```
npm install seneca-redis-queue-transport
```

You'll also need [redis](http://redis.io/).

## To run tests with Docker
Build the Redis Docker image:
```sh
npm run build
```
Start the Redis container:
```sh
npm run start
```
Stop the Redis container:
```sh
npm run stop
```
While the container is running you can run the tests into another terminal:
```sh
npm run test
```

## Quick Example

```js
require('seneca')()
  .use('redis-queue-transport')
  .add('foo:two',function(args,done){ done(null,{bar:args.bar}) })
  .client( {type:'redis-queue',pin:'foo:one,bar:*'} )
  .listen( {type:'redis-queue',pin:'foo:two,bar:*'} )
```

## Available Options

```js
require('seneca')()
  .use('redis-queue-transport', {
    'redis-queue': {
      timeout: 22222,
      type: 'redis-queue',
      host: 'localhost',
      port: 6379
    }
  })
```

## Contributing
The [Senecajs org][] encourage open participation. If you feel you can help in any way, be it with
documentation, examples, extra testing, or new features please get in touch.

## License
Copyright Richard Rodger and other contributors 2015-2016, Licensed under [MIT][].

[npm-badge]: https://badge.fury.io/js/seneca-redis-queue-transport.svg
[npm-url]: https://badge.fury.io/js/seneca-redis-queue-transport
[travis-badge]: https://travis-ci.org/senecajs/seneca-redis-queue-transport.svg
[travis-url]: https://travis-ci.org/senecajs/seneca-redis-queue-transport
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/senecajs/seneca

[MIT]: ./LICENSE
[Senecajs org]: https://github.com/senecajs/
[Seneca.js]: https://www.npmjs.com/package/seneca
[senecajs.org]: http://senecajs.org/
[redis]: http://redis.io/
[github issue]: https://github.com/senecajs/seneca-redis-queue-transport/issues
[@senecajs]: http://twitter.com/senecajs
