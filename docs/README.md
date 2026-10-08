# seneca-redis-queue-transport documentation

The documentation follows the [Diátaxis](https://diataxis.fr/) structure.
Start with the tutorial, use the how-to guides for specific tasks, look
things up in the reference, and read the explanation to understand the
design.

## Tutorials

| Tutorial | What you build |
| -------- | -------------- |
| [Getting started](tutorials/getting-started.md) | A service and a client that exchange messages through Redis lists. |

The programs are in [examples](examples/).

## How-to guides

| Guide | Covers |
| ----- | ------ |
| [Use a named topic](how-to/use-a-named-topic.md) | Give a service its own pair of Redis lists. |
| [Run the tests locally](how-to/run-the-tests-locally.md) | Docker Compose, environment variables, Seneca 4 builds, Node 22. |
| [Migrate from Seneca 3](how-to/migrate-from-seneca-3.md) | What to change when moving an application to Seneca 4. |

## Reference

| Reference | Describes |
| --------- | --------- |
| [Options](reference/options.md) | Plugin options and the per `listen` / `client` connection settings. |
| [Messages](reference/messages.md) | The action patterns the plugin adds, and the Redis keys it uses. |

## Explanation

| Explanation | Discusses |
| ----------- | --------- |
| [How the queue transport works](explanation/how-it-works.md) | Lists, blocking reads, replies, closing, Seneca 3 versus 4, limits. |

## Feature index

Every option, action pattern and error of the plugin, with the page that
documents it. The plugin has no exports, decorations, error codes or
command line flags.

| Feature | Kind | Documented in |
| ------- | ---- | ------------- |
| `redis-queue` | option block | [Options](reference/options.md#plugin-options) |
| `redis-queue.type` | option | [Options](reference/options.md#plugin-options) |
| `redis-queue.host` | option | [Options](reference/options.md#plugin-options) |
| `redis-queue.port` | option | [Options](reference/options.md#plugin-options) |
| `redis-queue.timeout` | option | [Options](reference/options.md#plugin-options) |
| `type` | listen / client setting | [Options](reference/options.md#listen-and-client-settings) |
| `host` | listen / client setting | [Options](reference/options.md#listen-and-client-settings) |
| `port` | listen / client setting | [Options](reference/options.md#listen-and-client-settings) |
| `topic` | listen / client setting | [Options](reference/options.md#listen-and-client-settings) |
| `pin` | client setting | [Options](reference/options.md#listen-and-client-settings) |
| `role:transport,hook:listen,type:redis-queue` | action | [Messages](reference/messages.md#roletransporthooklistentyperedis-queue) |
| `role:transport,hook:client,type:redis-queue` | action | [Messages](reference/messages.md#roletransporthookclienttyperedis-queue) |
| `sys:seneca,cmd:close` (Seneca 4) / `role:seneca,cmd:close` (Seneca 3) | action override | [Messages](reference/messages.md#close-hooks) |
| `<topic>_act`, `<topic>_res/<client id>` | Redis keys | [Messages](reference/messages.md#redis-keys) |
| "load seneca-transport before this plugin" | definition error | [Messages](reference/messages.md#errors) |
