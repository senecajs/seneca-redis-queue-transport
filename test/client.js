var seneca = require('seneca')()
  .use('..')

  .client({type: 'redis-queue', pin: 'role:a,cmd:*'})
  .client({type: 'redis-queue', pin: 'role:b,cmd:*'})

setInterval(function () {
  seneca.act('role:a,cmd:foo,zed:10', console.log)
  seneca.act('role:b,cmd:foo,zed:20', console.log)
}, 1111)

// setTimeout(function() {
//   clearInterval(interval)
//   seneca.close()
// }, 10000)
