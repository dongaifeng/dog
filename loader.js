const fs = require('fs')
const path = require('path')


const Router = require('koa-router')

/**
 * @param 文件夹名称
 * @param  回调函数  回调函数的参数（文件夹下的每个文件名， 每个文件导出的对象包含里面各方法）
*/
function loader(dir, callback) {
  const url = path.resolve(__dirname, dir) // 传入文件夹 的目录
  const files = fs.readdirSync(url)   // 获取文件夹下 文件名组成的数据

  files.forEach(filename => {
    filename = filename.replace('.js', '') // 去掉文件名的后缀
    const file = require(url + '/' + filename)  
    callback(filename, file)  // 回到函数的两个参数
  })
}


// 加载路由
function initRouter(app){
  const router = new Router()

  // 比如filename 是user  routes就是user导出的对象
  loader('router', (filename, routes) => {
    const prefix = filename == 'index' ? '' : `/${filename}` // 处理index文件

    routes = typeof routes === 'function' ? routes(app) : routes
    Object.keys(routes).forEach( key => {
      const [method, path] = key.split(' ')   // 用空格分隔 每个属性的key

      // prefix + path 组成路由路径
      router[method](prefix + path, async (ctx) => {
        app.ctx = ctx
        await routes[key](app)
      }) // 挂载路由   
      
    })
  })

  return router
}

// 加载controller
function initController(app) {
  const controllers = {}

  loader('controller', (filename, controller) => {
    controllers[filename] = controller(app)
  })

  return controllers
}

// 加载service
function initService(app) {
  const services = {}
  loader('service', (filename, service) => {
    services[filename] = service(app)
  })

  return services
}

const Sequelize = require('sequelize');

// 初始化config
function loadConfig(app) {
  loader('config', (filename, conf) => {

    // 加载数据库
    if(conf.db){
      app.$db = new Sequelize(conf.db)
      app.$model = {}
      loader('model', (filename, {schema, options}) => {
        app.$model[filename] = app.$db.define(filename, schema, options)
      })
      app.$db.sync()
    }

    // 加载中间件
    if(conf.middleware){
      conf.middleware.forEach(mid => {
        const midPath = path.resolve(__dirname, 'middleware', mid)
        app.$app.use(require(midPath))
      })
    }
  })
}


// 加载定时任务
const schedule = require('node-schedule')
function initSchedule(){
  loader('schedule', (filename, scheduleCongfig) => {
    schedule.scheduleJob(scheduleCongfig.interval, scheduleCongfig.handler)
  })
}


module.exports = { initRouter, initController, initService, loadConfig, initSchedule }