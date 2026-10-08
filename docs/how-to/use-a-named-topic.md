# Use a named topic

Goal: give a service its own request list, so that it does not share the
default `seneca_any` queue with other services on the same Redis server.

1. Choose a topic name, for example `math`.
2. Pass the same `topic` to `listen` and to `client`:

```js
const redis = {
  type: 'redis-queue',
  host: '127.0.0.1',
  port: 16383,
  topic: 'math',
}

service.listen(redis)
client.client(redis)
```

3. The service now reads `math_act` and replies on
   `math_res/<client instance id>`.

The complete program is
[examples/custom-topic.js](../examples/custom-topic.js). It prints:

```
sum: 3
closed
```

Notes:

* Every listener on the same topic takes messages from the same list.
  Two services with different actions on one topic receive each other's
  messages, so use one topic per service.
* `pin` on `client` selects which messages the client sends to Redis. It
  does not select a list; `topic` does.
