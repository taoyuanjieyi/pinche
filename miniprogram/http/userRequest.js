var commonUtil = require('../common/common.js');
var syncRequest = require('../plugins/syncRequest.js');
var wxPromise = require('../plugins/wxPromise.js');
const wxRequest = wxPromise.wxPromisify(wx.request)
var app = getApp()
function saveUser(userInfo) {
  console.info("保存用户信息：",userInfo)
  var session_id = commonUtil.getStorage("third_Session");
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.getServerAppUrl() + "/user/save",
      method: "POST",
      data: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        province: userInfo.province,
        city: userInfo.city,
        country: userInfo.country,
        language: userInfo.language,
        gender:userInfo.gender
      },
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function(res) {
        //从数据库获取用户信息
        console.log("插入小程序登录用户信息成功！", res);
        resolve(res);  
      }
    });
  });
}

//获取用户信息接口
function queryUserInfo() {
    var session_id = commonUtil.getStorage("third_Session");
    console.info("queryUserInfo 当前会话ID:", session_id)
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.getServerAppUrl() + "/user/get",
      data: {},
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function(res) {
        if (res.data.retCode === 'success'){
          wx.setStorageSync("userInfo",res.data.data)
          // console.info("queryUserInfo 当前登录用户信息:", res.data.data)
          resolve(res);  
        }else{
          console.error("查询用户失败：" , res.data);
          resolve(res)
        }
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
      url: app.getServerAppUrl() + "/user/getSmsCode",
      data: { "mobile": mobile},
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        console.info("获取验证码结果：", res);
        resolve(res);  
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
      url: app.getServerAppUrl() + "/user/bindMobile",
      data: { "mobile": mobile,"smsCode":smsCode},
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        console.info("绑定手机号结果：",res);
        resolve(res);  
      },
      fail: function (res) {
        console.log("getSmsCode fail : ", res);
      }
    });
  });
}

//更新用户常用行程
function updateQuickRoute(quickRouteData) {
  console.info("更新我的行程信息{0}", quickRouteData)
  var session_id = commonUtil.getStorage("third_Session");
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.getServerAppUrl() + "/user/updateQuickRoute",
      method: "POST",
      data: quickRouteData,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionid': session_id
      },
      success: function (res) {
        console.info("更新常用行程信息结果：",res);
        resolve(res);
      },
      fail: function (res) {
        console.log("updateQuickRoute fail : ", res);
      }
    });
  });
}

//更新用户车辆信息
function updateCarInfo(carInfoData) {
  console.info("更新我的车辆信息{0}", carInfoData)
  var session_id = commonUtil.getStorage("third_Session");
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.getServerAppUrl() + "/user/updateCarInfo",
      method: "POST",
      data: carInfoData,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionid': session_id
      },
      success: function (res) {
        console.info(res);
        resolve(res);
      },
      fail: function (res) {
        console.log("getSmsCode fail : ", res);
      }
    });
  });
}

module.exports = {
  queryUserInfo: queryUserInfo,
  saveUser: saveUser,
  getSmsCode: getSmsCode,
  bindMobile: bindMobile,
  updateCarInfo: updateCarInfo,
  updateQuickRoute: updateQuickRoute
}