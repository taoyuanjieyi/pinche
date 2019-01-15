App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this;
  },

  /**
   * 设置全局变量
   */
  globalData: {
    openid: 0
  },

  getEnv: function(){
    return "prod"
  },
  getServerHost: function(){
    return "https://www.i5365.cn"
  },
  getServerAppUrl: function () {
    if ("pre" === this.getEnv() ){
      return this.getServerHost()+"/pinche_pre";
    } else if ("prod" === this.getEnv() ){
      return this.getServerHost() +"/pinche";
    }else{
      return this.getServerHost() +"/pinche_dev";
    }
  },
})
