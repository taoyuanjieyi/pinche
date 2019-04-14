var commonUtil = require('../../common/common.js');
var userRequest = require('../../http/userRequest.js');

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function() {
   
  },
  bindGetUserInfo: function(e) {
    console.info("微信授权用户信息：",e.detail.userInfo);
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      //插入登录的用户的相关信息到数据库
      userRequest.saveUser(e.detail.userInfo).then((res) => {
        if (res.data.retCode === 'success'){
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }else{
          console.info("保存用户信息失败！")
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  

})