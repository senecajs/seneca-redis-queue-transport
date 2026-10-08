# Options

## Plugin options

Options passed with `seneca.use('@seneca/redis-queue-transport', options)`.
They are deep merged over the defaults, and over the instance `transport`
options block if there is one.

| Option | Type | Default | Effect |
| ------ | ---- | ------- | ------ |
| `redis-queue` | object | see below | Default settings for `type: 'redis-queue'` listeners and clients. |
| `redis-queue.type` | string | `'redis-queue'` | Carried into the settings; the transport type is the `type` of each call. |
| `redis-queue.host` | string | `'localhost'` | Redis host, used only when a call has no `host`. |
| `redis-queue.port` | number | `6379` | Redis port, used only when a call has no `port`. |
| `redis-queue.timeout` | number | `22222` | Carried into the settings; not read by this plugin. Use the Seneca `timeout` option for action timeouts. |

Seneca supplies `host` and `port` defaults (port 10101) to every `listen`
and `client` call, and those override `redis-queue.host` and
`redis-queue.port`. In practice, pass `host` and `port` on each call.

## Listen and client settings

The object passed to `seneca.listen(settings)` and
`seneca.client(settings)`.

| Setting | Type | Default | Effect |
| ------- | ---- | ------- | ------ |
| `type` | string | none | Must be `'redis-queue'` to select this transport. |
| `host` | string | Seneca default | Redis host. |
| `port` | number | Seneca default (10101) | Redis port. |
| `topic` | string | `'seneca_any'` | Prefix of the Redis list names (see [Messages](messages.md#redis-keys)). |
| `pin` | string or object | none | Client only: the patterns sent to Redis. Without a pin the client sends every message that has no local action. |

## Test settings

| Variable | Default | Effect |
| -------- | ------- | ------ |
| `SENECA_TEST_REDIS_HOST` | `127.0.0.1` | Redis host for the tests and examples. |
| `SENECA_TEST_REDIS_PORT` | `16383` | Redis port for the tests and examples. |
