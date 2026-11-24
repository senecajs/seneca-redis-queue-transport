# Migrate from Seneca 3

Goal: keep an application that uses this plugin working on Seneca 4.

1. Replace `seneca-redis-queue-transport` with this package, and install
   `@seneca/transport`:

   ```sh
   npm uninstall seneca-redis-queue-transport
   npm install seneca@^4 @seneca/transport @seneca/redis-queue-transport
   ```

2. Load `@seneca/transport` before this plugin, both by their full
   names. Seneca 4 has no network transport in core, and its core
   `transport/utils` export does not have the helpers this plugin uses:

```js
const seneca = require('seneca')()
  .use('@seneca/transport')
  .use('@seneca/redis-queue-transport')
```

   Without it the plugin fails to load with
   `redis-queue-transport: load @seneca/transport before this plugin`.

3. Pass `host` and `port` to every `listen` and `client` call. Seneca fills
   in its default transport port (10101) on those calls, which overrides
   the plugin's `redis-queue` option block (this is also true on Seneca 3).

4. Nothing else changes. Close hooks are registered on the Seneca 4 close
   pattern, so `seneca.close()` releases the Redis connections.

Version 1 runs on Seneca 4 only. Seneca 3 applications stay on
`seneca-redis-queue-transport` 0.3.
