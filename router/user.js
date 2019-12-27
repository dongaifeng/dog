module.exports = {
  'get /': async app => {
    app.ctx.body = '使用app 传递参数' + app.$service.getName()
  },
  'get /info': app => {
    app.ctx.body = '用户的信息页'+ app.$service.getName()
  }
}






// module.exports = {
//   'get /': async ctx => {
//     ctx.body = '用户的首页'
//   },
//   'get /info': ctx => {
//     ctx.body = '用户的信息页'
//   }
// }