module.exports = app => ({
  async getName(){
    return await app.$model.user.findAll()
  },
  getAge() {
    return app.$model.user.findAll()
  }
})