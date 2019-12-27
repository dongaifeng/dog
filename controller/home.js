module.exports = app => ({

  index: async ctx => {
    let name = await app.$model.user.findAll()
    app.ctx.body =  name
  },
  detail: async ctx => {
    const name = await app.$service.user.getName()
    app.ctx.body = '从controller传出去的detail' + JSON.stringify(name)
  }
})