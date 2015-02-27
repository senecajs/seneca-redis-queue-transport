# seneca-redis-queue-transport - a [Seneca](http://senecajs.org) plugin

## Seneca Redis Queue Transport Plugin

This plugin provides transport for micro-service messages via Redis (list based) queues.
This lets you send messsages via [redis](http://redis.io/).

ALSO READ: The [seneca-transport](http://github.com/rjrodger/seneca-transport) readme has lots of introductory material about message transports. Start there if you have not used a message transport before.

For a gentle introduction to Seneca itself, see the
[senecajs.org](http://senecajs.org) site.

For questions:
[@zbangazbanga](http://twitter.com/zbangazbanga)
[@rjrodger](http://twitter.com/rjrodger)

Current Version: 0.1.0

Tested on: Seneca 0.6.1, Node 0.10.36


### Install

```sh
npm install seneca-redis-queue-transport
```

You'll also need [redis](http://redis.io/).


## Quick Example

```js
require('seneca')()
  .use('redis-queue-transport')
  .add('foo:two',function(args,done){ done(null,{bar:args.bar}) })
  .client( {type:'redis-queue',pin:'foo:one,bar:*'} )
  .listen( {type:'redis-queue',pin:'foo:two,bar:*'} )
```



