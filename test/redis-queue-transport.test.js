/* Copyright (c) 2014-2026 Richard Rodger and other contributors, MIT License */
'use strict'

const { describe, test } = require('node:test')
const assert = require('node:assert')

const { config, make, foo_plugin, close } = require('./support')

// Callback style act as a promise.
function act (si, pattern) {
  return new Promise((resolve, reject) =>
    si.act(pattern, (err, out) => (err ? reject(err) : resolve(out))),
  )
}

function ready (si) {
  return new Promise((resolve) => si.ready(resolve))
}

describe('redis-transport', { timeout: 5000 }, function () {
  test('happy-any', async function () {
    const service = make().use(foo_plugin).listen(config)
    await ready(service)

    const client = make().client(config)
    await ready(client)

    try {
      assert.equal(
        JSON.stringify(await act(client, 'foo:1,bar:A')),
        '{"dee":"1-A"}',
      )
      assert.equal(
        JSON.stringify(await act(client, 'foo:1,bar:AA')),
        '{"dee":"1-AA"}',
      )
      const nores = await act(client, 'nores:1')
      assert.ok(null == nores || 0 === Object.keys(nores).length)

      // fire-and-forget
      const k = '' + Math.random()
      const v = '' + Math.random()
      client.act('faf:1,k:"' + k + '",v:"' + v + '"')
      await new Promise((resolve) => setTimeout(resolve, 222))
      assert.equal(foo_plugin.fafmap[k], v)
    } finally {
      await close([client, service])
    }
  })

  // Skipped since before the Seneca 4 upgrade: every listener uses the same
  // queue (topic seneca_any), so pinned listeners compete for messages.
  test.skip('happy-pin', function () {})

  test('options', async function () {
    const a = make({ timeout: 23555 })
    let so = a.options()
    assert.ok(null != so.timeout)
    assert.equal(so.timeout, 23555)

    const b = make({ timeout: 11111 })
    so = b.options()
    assert.equal(so.timeout, 11111)

    await close([a, b])
  })
})
