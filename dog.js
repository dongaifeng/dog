const koa =  require('koa')

const { initRouter, initController, initService, loadConfig, initSchedule } = require('./loader')
/**
|--------------------------------------------------
| dog执行时 在实例上挂载各模块
|--------------------------------------------------
*/
class dog {
  constructor(conf){
    this.$app = new koa();
    loadConfig(this)
    this.$service = initService(this)
    this.$controller = initController(this)
    this.$router = initRouter(this);
    this.$app.use(this.$router.routes())
    initSchedule()
  }

  start(port){
    this.$app.listen(port, () => {
      console.log('监听端口'+ port)
    })
  }
}

module.exports = dog