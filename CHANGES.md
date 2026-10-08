# Changes

## 0.4.0

* Seneca 4 support, including the `4.0.0-rc5` prerelease. Seneca 3 still
  works.
* Behaviour change: on Seneca 4 load `seneca-transport` before this plugin;
  without it the plugin fails to load with a clear message.
* Close hooks use `sys:seneca,cmd:close` on Seneca 4.
* Fix: closing a client no longer hangs; its blocked `BRPOP` connection is
  ended instead of sent `QUIT`.
* Tested on Node 24 and 22 against Redis 8.10 (Docker Compose:
  `npm run services:up`).
* Tests moved from lab 11 to `node:test`; obsolete tooling (Travis,
  coveralls, docco, pre-commit, Node 4 Dockerfile) removed.
* Documentation reorganized into tutorials, how-to guides, reference and
  explanation under `docs/`.
