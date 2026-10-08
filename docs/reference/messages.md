# Messages

## role:transport,hook:listen,type:redis-queue

Called by Seneca for `seneca.listen({ type: 'redis-queue', ... })`.

* Parameters: the [listen settings](options.md#listen-and-client-settings).
* Effect: opens two Redis connections, starts a blocking `BLPOP` loop on
  `<topic>_act`, runs each message received, and pushes the reply with
  `LPUSH` to `<topic>_res/<origin>`. Registers a close hook.
* Reply: empty, once the connections are created.

## role:transport,hook:client,type:redis-queue

Called by Seneca for `seneca.client({ type: 'redis-queue', ... })`.

* Parameters: the [client settings](options.md#listen-and-client-settings).
* Effect: opens two Redis connections, starts a blocking `BRPOP` loop on
  `<topic>_res/<this instance id>`, and adds client actions for the `pin`
  (or for every unmatched message) that `RPUSH` the message to
  `<topic>_act`. Registers a close hook.
* Reply: the client definition from seneca-transport.

## Close hooks

Each listener and client adds an override of the close pattern:
`sys:seneca,cmd:close` on Seneca 4, `role:seneca,cmd:close` on Seneca 3.
It ends the Redis connections and then calls the prior close action.

## Redis keys

| Key | Type | Written by | Read by |
| --- | ---- | ---------- | ------- |
| `<topic>_act` | list | client, `RPUSH` | listener, `BLPOP` |
| `<topic>_res/<client instance id>` | list | listener, `LPUSH` | client, `BRPOP` |

`<topic>` is the `topic` setting, `seneca_any` by default. Values are the
JSON messages produced by seneca-transport.

## Errors

The plugin defines no error codes. Errors from actions travel back to the
client as normal Seneca error replies. Redis command errors are logged
with `seneca.log.error`.

| Error | When |
| ----- | ---- |
| `redis-queue-transport: load seneca-transport before this plugin, ...` | The plugin is loaded on an instance whose `transport/utils` export has no `make_client` (Seneca 4 without seneca-transport). Loading fails. |
