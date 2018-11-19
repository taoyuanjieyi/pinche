var commonUtil = require('../common/common.js');
var syncRequest = require('../plugins/syncRequest.js');
var wxPromise = require('../plugins/wxPromise.js');
const wxRequest = wxPromise.wxPromisify(wx.request)

//用户登陆
function userLogin() {
  wx.checkSession({
    success: function () {
      console.info('存在登陆态');
      var session_id = commonUtil.getStorage("third_Session");
      var userInfo = commonUtil.getStorage("userInfo");

      if (session_id === null || session_id === "" || session_id === undefined){
        onLogin()
      } else if (userInfo === null || userInfo === "" || userInfo === undefined){
        console.info("用户信息为空，重新查询用户信息！")
        queryUserInfo().then((res) => {
          console.info("当前登录用户信息：", userInfo);
        })
      } else if (!userInfo.bindMobile){
        console.info("用户手机信息为空，跳转至绑定手机页面！")
        wx.redirectTo({
          url: '/pages/verification/verification'
        })
      }
      //存在登陆态
      //queryUserInfo()
    },
    fail: function () {
      console.info('不存在登陆态');
      //不存在登陆态
      onLogin()
    }
  })
}

function onLogin() {
  wx.login({
    success: function(res) {
      if (res.code) {
        login(res.code);
      }
    },
    fail: function(res) {

    }
  })

}

function login(loginCode) {
  //发起网络请求
  wx.request({
    url: 'https://39.106.5.219/pinche/user/login',
    data: {
      code: loginCode
    },
    success: function(res) {
      const self = this
      if (res.data.retCode === 'success') {
        //获取到用户凭证 存儲 3rd_session 
        wx.setStorage({
          key: "third_Session",
          data: res.data.sessionId
        })
        console.info("登录存入sessionid到本地", res.data.sessionId)
        // 判断用户信息是否保存，未保存则进入用户信息授权页
        //////////////////////////////////
        queryUserInfo().then((res) => {
          //////////////////////////////////
          var userInfo = commonUtil.getStorage("userInfo");
          // console.info("当前登录用户信息", userInfo)
          if (userInfo === null || userInfo === "" || userInfo === undefined) {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          }
        })
      } else {

      }
    },
    fail: function(res) {

    }
  })
}

function saveUser(userInfo) {
  var session_id = commonUtil.getStorage("third_Session");
  wx.request({
    url: "https://39.106.5.219/pinche/user/save",
    method: "POST",
    data: {
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      province: userInfo.province,
      city: userInfo.city
    },
    header: {
      'content-type': 'application/json',
      'sessionid': session_id
    },
    success: function(res) {
      //从数据库获取用户信息
      queryUserInfo();
      console.log("插入小程序登录用户信息成功！");
    }
  });
}

//获取用户信息接口
function queryUserInfo() {
    var session_id = commonUtil.getStorage("third_Session");
    console.info("queryUserInfo 当前会话ID:", session_id)
  return new Promise(function (resolve, reject) {
    wx.request({
      url: "https://39.106.5.219/pinche/user/get",
      data: {},
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function(res) {
        wx.setStorage({
          key: "userInfo",
          data: res.data.data
        })
        // console.info("queryUserInfo 当前登录用户信息:", res.data.data)
        resolve();  
      },
      fail: function(res){
        console.log("queryUserInfo : ",res);
      }
    });
  });
}

//获取用户信息接口
function getSmsCode(mobile) {
  var session_id = commonUtil.getStorage("third_Session");
  return new Promise(function (resolve, reject) {
    wx.request({
      url: "http://39.106.5.219/pinche/user/getSmsCode",
      data: { "mobile": mobile},
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        if(res.data.retCode){
          wx.showToast({
            icon: 'none',
            title: '短信发送成功，请注意查收！'
          })
        }
        resolve();  
      },
      fail: function (res) {
        console.log("getSmsCode fail : ", res);
      }
    });
  });
}

//获取用户信息接口
function bindMobile(mobile,smsCode) {
  console.info("手机号{0},验证码：{1}",mobile,smsCode)
  var session_id = commonUtil.getStorage("third_Session");
  return new Promise(function (resolve, reject) {
    wx.request({
      url: "http://39.106.5.219/pinche/user/bindMobile",
      data: { "mobile": mobile,"smsCode":smsCode},
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        console.info(res);
        if (res.data.retCode !== "success") {
          // wx.showToast({
          //   icon: 'none',
          //   title: '绑定成功！'
          // })
        }
        resolve(true);  
      },
      fail: function (res) {
        console.log("getSmsCode fail : ", res);
      }
    });
  });
}

module.exports = {
  onLogin: onLogin,
  queryUserInfo: queryUserInfo,
  saveUser: saveUser,
  getSmsCode: getSmsCode,
  bindMobile: bindMobile,
  userLogin: userLogin
}