# Migrate from Seneca 3

Goal: keep an application that uses this plugin working on Seneca 4.

1. Install `seneca-transport` and load it before this plugin. Seneca 4 has
   no network transport in core, and its core `transport/utils` export
   does not have the helpers this plugin uses:

```js
const seneca = require('seneca')()
  .use('seneca-transport')
  .use('@seneca/redis-queue-transport')
```

   Without it the plugin fails to load with
   `redis-queue-transport: load seneca-transport before this plugin`.

2. Pass `host` and `port` to every `listen` and `client` call. Seneca fills
   in its default transport port (10101) on those calls, which overrides
   the plugin's `redis-queue` option block (this is also true on Seneca 3).

3. Nothing else changes. Close hooks are registered on the Seneca 4 close
   pattern automatically, so `seneca.close()` releases the Redis
   connections.

The same code also runs on Seneca 3.
