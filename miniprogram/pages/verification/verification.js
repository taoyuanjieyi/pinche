// miniprogram/pages/verification/ verification.js
var commonUtil = require('../../common/common.js');
var userRequest = require('../../http/userRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '获取验证码', //按钮文字
    currentTime: 60, //倒计时
    bindGetSmsEvent: "getSmsCode",
    smsCode: '',
    mobile: '', //获取到的手机栏中的值
    getUserInfoBtnDisable: true,
    getSmsBtnText:'获取验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //获取手机栏input中的值
  mobileInput: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  //获取手机栏input中的值
  smsCodeInput: function (e) {
    this.setData({
      smsCode: e.detail.value
    })
  },

  //获取手机栏input中的值
  formBindsubmit: function (e) {
    var that = this;
    console.info(that)
    if (that.data.mobile === null || that.data.mobile === '' || that.data.mobile === undefined) {
      wx.showToast({
        icon: 'none',
        title: '手机号不能为空！'
      })
      return;
    }
    if (that.data.smsCode === null || that.data.smsCode === '' || that.data.smsCode === undefined) {
      wx.showToast({
        icon: 'none',
        title: '验证码不能为空！'
      })
      return;
    }
    userRequest.bindMobile(that.data.mobile, that.data.smsCode).then((res) => {
      if (res.data.retCode === "need_login") {
        login.checkLogin(function () {
          that.formBindsubmit(e);
        }, true)
      }else if (res.statusCode !== 200 || res.data.retCode !== "success") {
        wx.showToast({
          icon: 'none',
          title: commonUtil.isBlank(res.data.retMsg) ? '绑定失败！' : res.data.retMsg
        })
      }else{
        userRequest.queryUserInfo().then((res) => {
          if (res.data.retCode === "need_login") {
            login.checkLogin(function () {
              that.formBindsubmit(e);
            }, true)
          }
        })
        var shareMessage = commonUtil.getStorage("shareMessage");
        console.info("注册已完成，分享信息:",shareMessage);
        if (!commonUtil.isBlank(shareMessage)){
          console.info("跳转至分享行程页:", shareMessage);
          wx.redirectTo({
            url: '/pages/seat/seat?routeId=' + shareMessage.routeId + "&shareUserId=" + shareMessage.shareUserId,
          })
        }else{
          console.info("跳转至首页:", shareMessage);
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
    

  },

  getSmsCode: function(e) {
    var that = this;

    that.setData({
      bindGetSmsEvent: "", 
    })
    console.info(e);
    var mobile = that.data.mobile;
    var currentTime = that.data.currentTime //把手机号跟倒计时值变例成js值
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    if (mobile == '') {
      warn = "手机号不能为空";
    } else if (mobile.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(mobile)) {
      warn = "手机号格式不正确";
    } else {
      userRequest.getSmsCode(mobile).then((res) => {
        if(res.statusCode === 200 && res.data.retCode === "success"){
          //当手机号正确的时候提示用户短信验证码已经发送
          wx.showToast({
            icon: 'none',
            title: '短信发送成功，请注意查收！',
            duration: 2000
          })
          //设置一分钟的倒计时
          var interval = setInterval(function() {
            currentTime--; //每执行一次让倒计时秒数减一
            that.setData({
              getSmsBtnText: currentTime + 's', //按钮文字变成倒计时对应秒数
            })
            //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
            if (currentTime <= 0) { 
              clearInterval(interval)
              that.setData({
                getSmsBtnText: '重新发送',
                currentTime: 60,
                bindGetSmsEvent: "getSmsCode",
              })
            }
          }, 1000);
        }else{
          wx.showToast({
            icon: 'none',
            title: commonUtil.isBlank(res.data.retMsg) ? '短信发送失败，请稍后重试！' : res.data.retMsg,
            duration: 2000
          })
        }
      })
    };

    //判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
    if (warn != null) {
      wx.showToast({
        icon: 'none',
        title: warn,
      })

      that.setData({
        bindGetSmsEvent: "getSmsCode",
      })
      return;

    };
  },
  checkboxChange: function (e) {
    var check = true
    if (e.detail.value == '') {
      check = true
    }
    else {
      check = false
    }
    this.setData({
      getUserInfoBtnDisable: check
    })

  },

})