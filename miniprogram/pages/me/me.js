var userRequest = require('../../http/userRequest.js');
var commonUtil = require('../../common/common.js');
var app = getApp()
Page({
  data: {
    tempFilePaths: ''
  },
  onLoad: function() {
    var userInfo = commonUtil.getStorage("userInfo");
    if (userInfo === null || userInfo === "" || userInfo === undefined) {
      console.info("用户信息为空，重新查询用户信息！")
      userRequest.queryUserInfo().then((res) => {
        if (res === null || res === undefined || res === "") {
          onLogin();
        }
        userInfo = res;
      })
    }
    console.info("当前登录用户信息：", userInfo);
    this.setData({
      nickName: userInfo.nickName,
      avatarUrl:userInfo.avatarUrl,
      mobile:userInfo.mobile
    })
  },
  chooseimage: function() {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    })
  }
})