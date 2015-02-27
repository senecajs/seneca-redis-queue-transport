var seneca = require('seneca')()
  .use('..')

  .add('role:a,cmd:foo',function(args,done){
    done(null,{bar:args.zed+1,when:Date.now()})
  })

  .add('role:b,cmd:foo',function(args,done){
    done(null,{bar:args.zed+1,when:Date.now()})
  })

  .act('role:a,cmd:foo,zed:0',console.log)

  .listen({type:'redis-queue', pin:'role:a,cmd:*'})
  .listen({type:'redis-queue', pin:'role:b,cmd:*'})


//setTimeout(function() {
//  seneca.close()
//}, 10000)