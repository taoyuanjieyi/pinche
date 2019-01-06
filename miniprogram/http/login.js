var commonUtil = require('../common/common.js');
var userRequest = require('./userRequest.js');
var wxPromise = require('../plugins/wxPromise.js');
const wxRequest = wxPromise.wxPromisify(wx.request);
var app = getApp()
//用户登陆
function checkLogin(callback, sessionInvalid) {
  //检查微信会话
  //var session = checkWxSession();
  // 检查平台 session 是否存在
  var session_id = commonUtil.getStorage("third_Session");
  if (commonUtil.isBlank(session_id) || sessionInvalid) {
      console.info("当前平台登录sesssion不存在，获取会话信息")
      wxLogin(callback);
  }else{
    // 获取用户信息
    var userInfo = commonUtil.getStorage("userInfo");
    console.info("当前登录用户信息", userInfo)
    if (commonUtil.isBlank(userInfo)){
      console.info("当前登录用户信息为空，查询用户信息")
      queryUserInfo(callback);
    } else if (!userInfo.bindMobile) {
      console.info("用户手机信息为空，跳转至绑定手机页面！")
      wx.redirectTo({
        url: '/pages/verification/verification'
      })
    }else{
      callback()
    }
  }
}

//检查微信会话
function checkWxSession() {
  wx.checkSession({
    success: function () {
      return true
    },
    fail: function () {
      return false
    }
  })
}

//微信登录，获取登录code
function wxLogin(callback){
  wx.login({
    success: function (res) {
      if (res.code) {
        platformLogin(res.code,callback)
      }
    },
    fail: function (res) {
      console.error("wxLogin is Error:", res);
      return "";
    }
  })
}

//获取平台会话ID
function getPlatformSession(loginCode) {
  return new Promise(function (resolve, reject) {
    //发起网络请求
    wx.request({
      url: app.getServerAppUrl() + '/user/login',
      data: {
        code: loginCode
      },
      success: function (res) {
        console.info("获取平台sessionId：",res);
        if (res.data.retCode === 'success') {
          resolve(res.data.sessionId)
        } else {
          resolve()
        }
      },
      fail: function (res) {
        console.error("getPlatformSession is error:", res)
        resolve()
      }
    })
  })
}

function platformLogin(wxLoginCode,callback){
  getPlatformSession(wxLoginCode).then((res) => {
    if (!commonUtil.isBlank(res)) {
      //获取到用户凭证 存儲 3rd_session 
      wx.setStorageSync("third_Session",res)
      console.info("登录存入sessionid到本地", res)
      //查询用户信息
      queryUserInfo(callback)
    }
  })
}

function queryUserInfo(callback){
  userRequest.queryUserInfo().then((res) => {
      if (res.data.retCode !== "success" || res.data.data === null || res.data.data === "" || res.data.data === undefined) {
      console.info("当前登录用户信息为空，跳转到授权页面")
      wx.redirectTo({
        url: '/pages/login/login'
      })

    } else if (!res.data.data.bindMobile) {
      console.info("用户手机信息为空，跳转至绑定手机页面！")
      wx.redirectTo({
        url: '/pages/verification/verification'
      })
    } else {
      callback(res.data.data)
    }
  })
}

module.exports = {
  checkLogin: checkLogin,
  queryUserInfo: queryUserInfo,
}
