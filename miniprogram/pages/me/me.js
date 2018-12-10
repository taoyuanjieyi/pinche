var userRequest = require('../../http/userRequest.js');
var commonUtil = require('../../common/common.js');
var app = getApp()
Page({
  data: {
    payQrcodeUrl: "",
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
    console.info("当前登录用户信息：", userInfo,);
    var payQrcode = JSON.parse(userInfo.payQrcode)
    var qrcodeUrl = "";
    if (payQrcode !== null && payQrcode !== "" && payQrcode !== undefined){
      qrcodeUrl = payQrcode.qrcodeUrl;
    }
    this.setData({
      nickName: userInfo.nickName,
      avatarUrl:userInfo.avatarUrl,
      mobile:userInfo.mobile,
      payQrcodeUrl: "https://www.i5365.cn" + qrcodeUrl,
    })
  },
  chooseImage: function() {
    var _this = this;
    var session_id = commonUtil.getStorage("third_Session");
    console.info("joinRoute 当前会话ID:", session_id)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://www.i5365.cn/pinche/user/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'sessionid': session_id
          },
          success: function (res) {
            console.info("上传结果：", res)
            // 查询用户信息
            userRequest.queryUserInfo().then((res) => {
              if (res === null || res === undefined || res === "") {
                onLogin();
              }
              var payQrcode = JSON.parse(res.payQrcode)
              var qrcodeUrl = "";
              if (payQrcode !== null && payQrcode !== "" && payQrcode !== undefined) {
                qrcodeUrl = payQrcode.qrcodeUrl;
              }
              _this.setData({
                payQrcodeUrl: "https://www.i5365.cn" + qrcodeUrl,
              })
            })
            var data = res.data
          }
        })
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: this.data.payQrcodeUrl, // 当前显示图片的http链接
      urls: [this.data.payQrcodeUrl] // 需要预览的图片http链接列表
    })
  }
})