module.exports = {
  interval:'*/30 * * * * *',
  handler(){
      console.log('定时任务 嘿嘿 三秒执行一次'+ new Date())
  }
}