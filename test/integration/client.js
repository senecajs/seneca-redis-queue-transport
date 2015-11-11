var Transport = require('./redis-queue-transport')
var Seneca = require('seneca')

Seneca({
  default_plugins: {
    transport: true
  }
})
  .use(Transport)
  .client({ host: 'server', port: 8000 })
  .act('color:red', console.log)
