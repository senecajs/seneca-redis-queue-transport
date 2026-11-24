# Changes

## 1.0.0 2026-11-20

First version published as `@seneca/redis-queue-transport`. Versions up
to 0.3.0 were published as `seneca-redis-queue-transport`. Version 0.4.0
was never published; its changes are part of this release.

* Seneca 4: the peer dependencies are `seneca` `^4.0.0` and
  `@seneca/transport` `^9.0.0`. Seneca 3 is no longer supported; Seneca 3
  users stay on `seneca-redis-queue-transport@0.3`.
* Renamed from `seneca-redis-queue-transport` to
  `@seneca/redis-queue-transport`.
* Node.js 24 or later (`engines.node` `>=24`).
* Load `@seneca/transport` before this plugin, because Seneca 4 has no
  network transport in its core. Without it the plugin fails to load
  with a message that says so.
* Close hooks use `sys:seneca,cmd:close`.
* Fix: closing a client no longer hangs; its blocked `BRPOP` connection
  is ended instead of sent `QUIT`.
* Options are merged with `seneca.util.deep` in place of the deprecated
  `seneca.util.deepextend` (D2). The `redis-queue.timeout` default is
  now the Seneca `timeout` option minus 555, as intended; the old code
  set an unused top-level value on shared module state instead. The
  plugin does not read this setting.
* Tests use `node:test` in place of lab 11, against Redis
  (`npm run services:up` starts `redis:8.10` on host port 16383); tested
  on Node.js 26 with Redis 7. CI is provided as a patch in `.patches/`.
  The manual scripts `test/client.js`, `test/server.js` and
  `test/cluster.js`, which could not run on Seneca 4, are removed.
* The committed `.npmrc` that set `legacy-peer-deps` is removed.
* Obsolete tooling (Travis, coveralls, docco, pre-commit, eslint, Node 4
  Dockerfile) removed. Documentation reorganized into tutorials, how-to
  guides, reference and explanation under `docs/`.
