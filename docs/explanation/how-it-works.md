# How the queue transport works

## Lists as queues

The transport uses two Redis lists per topic. Clients append requests to
`<topic>_act`; every listener blocks on that list with `BLPOP`, so each
request is taken by exactly one listener, in arrival order. This is what
makes it a queue transport: adding listeners spreads the load, and
requests wait in Redis while no listener is running.

Each client has its own reply list, `<topic>_res/<client instance id>`.
The listener knows the id from the `origin` field that seneca-transport
puts in each request. The client blocks on its reply list with `BRPOP`
and matches replies to callbacks by message id.

## Two connections per side

A Redis connection blocked in `BLPOP` or `BRPOP` cannot send other
commands, so each listener and each client opens one connection for the
blocking read and one for writing.

## Built on seneca-transport

The plugin does not encode messages itself. It uses the helpers of the
`transport/utils` export (`make_client`, `prepare_request`,
`handle_request`, `handle_response`, `parseJSON`, `stringifyJSON`). On
Seneca 3 those come with core. On Seneca 4 core has no network transport
and a smaller `transport/utils`, so `seneca-transport` must be loaded
first; the plugin checks this when it is defined.

## Closing

Seneca 4 closes an instance through `sys:seneca,cmd:close`; Seneca 3
through `role:seneca,cmd:close`. The plugin chooses the pattern from
`seneca.version` and overrides it for each listener and client. The
blocked reading connection is ended with `end(true)`, because a `QUIT`
command would wait behind the blocking read forever and keep the process
alive.

## Limits

* All listeners on a topic share one request list, whatever their pins,
  so a listener can receive messages it has no action for. Use one topic
  per service.
* Plugin level `host` and `port` are overridden by Seneca's own `listen` /
  `client` defaults; pass them on each call.
* The Redis client is the `redis` package version 2. See the issue tracker
  for known problems.
