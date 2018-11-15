//用户登陆
function userLogin() {
  wx.checkSession({
    success: function () {
      console.info('存在登陆态');
      //存在登陆态
      getUserInfo()
    },
    fail: function () {
      console.info('不存在登陆态');
      //不存在登陆态
      onLogin()
    }
  })
}

function onLogin() {
  var that = this;
  wx.login({
    success: function (res) {
      if (res.code) {
        //发起网络请求
        wx.request({
          url: 'https://39.106.5.219/pinche/user/login',
          data: {
            code: res.code
          },
          success: function (res) {
            console.info("获取3rd_session:",res);
            const self = this
            console.info("获取3rd_session:" + res.data.retCode)

            if (res.data.retCode === 'success') {
              //获取到用户凭证 存儲 3rd_session 
              //var json = JSON.parse(res.data)
              console.info("sessionId====", res.data.sessionId)
              wx.setStorage({
                key: "third_Session",
                data: res.data.sessionId
              })
              var sessionId = that.getStorage("third_Session");
              console.info("sessionId====", sessionId)
              wx.redirectTo({url: '/pages/login/login'})
            }
            else {

            }
          },
          fail: function (res) {

          }
        })
      }
    },
    fail: function (res) {

    }
  })

}

function getUserInfo() {
  wx.getUserInfo({
    success: function (res) {
      var userInfo = res.userInfo
      console.info(userInfo);
      //userInfoSetInSQL(userInfo)
    },
    fail: function () {
      //userAccess()
    }
  })
}

function userInfoSetInSQL(userInfo) {
  wx.getStorage({
    key: 'third_Session',
    success: function (res) {
      console.info("微信用户信息："+res);
      // wx.request({
      //   url: 'Our Server ApiUrl',
      //   data: {
      //     third_Session: res.data,
      //     nickName: userInfo.nickName,
      //     avatarUrl: userInfo.avatarUrl,
      //     gender: userInfo.gender,
      //     province: userInfo.province,
      //     city: userInfo.city,
      //     country: userInfo.country
      //   },
      //   success: function (res) {
      //     if (逻辑成功) {
      //       //SQL更新用户数据成功
      //     }
      //     else {
      //       //SQL更新用户数据失败
      //     }
      //   }
      // })

    }
  })
}

function bindGetUserInfo (e) {
  console.log(e.detail.userInfo)
  if (e.detail.userInfo) {
    //用户按了允许授权按钮
  } else {
    //用户按了拒绝按钮
  }
}

function getStorage(storageKey){
  try {
    var value = wx.getStorageSync(storageKey)
    return value;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  userLogin: userLogin,
  onLogin: onLogin,
  bindGetUserInfo: bindGetUserInfo,
  getStorage: getStorage
}