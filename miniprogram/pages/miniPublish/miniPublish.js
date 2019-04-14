// pages/publish/publish.js

var driverRequest = require('../../http/driverRouteRequest.js');
var login = require('../../http/login.js');
var commonUtil = require('../../common/common.js');

const app = getApp()

Page({
  data: {
    body: "",
    price: 0,
    submitBtnDisbled: true,
    /*textarea */
    min: 5, //最少字数
    max: 200, //最多字数 
  },
  onLoad: function (options) {
    this.setData({
      submitBtnClass: "publish-btn",
      currentWordNumber: 0 //当前字数  
    })
  },
  onShow: function (e) {
    var selectedRouteBody = commonUtil.getStorage("selectedRouteBody");
    if (selectedRouteBody !== undefined && selectedRouteBody !== "" && selectedRouteBody !== null) {
      this.setData({
        body: selectedRouteBody,
        currentWordNumber: parseInt(selectedRouteBody.length) //当前字数  
      })
      wx.setStorageSync("selectedRouteBody", "")
      this.changeSubmitStyle();
    }
  },
  bindBodyChange: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
    this.setData({
      body: value
    })
    this.changeSubmitStyle()
  },
  changeSubmitStyle: function () {
    let changeSubmitBtnEnable = true;
    
    if (this.data.body === null || this.data.body === '' ||
      this.data.body === undefined) {
      changeSubmitBtnEnable = false;
    }
    if (changeSubmitBtnEnable) {
      this.setData({
        submitBtnClass: "publish-btn publish-btn-active",
        submitBtnDisbled: false
      })
    } else {
      this.setData({
        submitBtnClass: "publish-btn",
        submitBtnDisbled: true
      })
    }
  },

  formBindsubmit: function (e) {
    console.info("表单数据：", e.detail.value);
    
    if (e.detail.value.body === null || e.detail.value.body === '' ||
      e.detail.value.body === undefined) {
      wx.showToast({
        icon: 'none',
        title: '行程内容不能为空！'
      })
      return;
    }
    var timestamp = Date.parse(new Date());
    var that = this
    driverRequest.miniPublish({
      passPoint: e.detail.value.body,
    }).then((res) => {
      if (res.data.retCode === "need_login") {
        login.checkLogin(function () {
          that.formBindsubmit(e);
        }, true)
      } else if (res.data.retCode === 'success') {
        wx.showToast({
          icon: 'none',
          title: '发布成功',
        })
        wx.setStorageSync("index_reload", true)
        wx.switchTab({
          url: '/pages/index/index'
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.retMsg
        })
      }
    })
  },
  openSelectRoutePage: function () {
    wx.navigateTo({
      url: '../commonStrokeSelect/commonStrokeSelect'
    })
  }
})