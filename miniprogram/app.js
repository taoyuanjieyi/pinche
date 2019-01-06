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
    return "pre"
  },
  getServerAppUrl: function () {
    if ("pre" === this.getEnv() ){
      return "https://www.i5365.cn/pinche_pre";
    } else if ("prod" === this.getEnv() ){
    return "https://www.i5365.cn/pinche";
    }else{
      return "https://www.i5365.cn/pinche_dev";
    }
  },
})
