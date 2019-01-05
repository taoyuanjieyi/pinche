var dateUtil = require('../../utils/dateUtil.js');

Page({
  data: {
    imgUrls: [{
      lunbo: '', link: ""}
    ],
    startUpImageUrl:"https://www.i5365.cn/static/startup/",
    indicatorDots: false,
    autoplay: false,
    interval: 2000,
    duration: 1000,
    count:5,
  },
  onLoad:function(){
    // 设置图片
    this.setImage()

    var that = this
    var  time = 5
    var inter = setInterval(function () {
        that.setData({
         count: time,
        })
        time--
        if (time < 0) {
          clearInterval(inter)
          that.jumpto()
        }
     }, 1000)
  },
  
  jumpto:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  setImage : function(){
    var that  = this;
    var dateStr = dateUtil.getCurrDateToDate()
    wx.request({
      url: that.data.startUpImageUrl,
      data: {},
      success: function (res) {
        that.data.imgUrls[0].lunbo = that.data.startUpImageUrl + dateStr + ".jpg";
        that.setData({
          imgUrls: that.data.imgUrls
        })
      },
      fail: function (res) {
        that.setData({
          image: this.data.startUpImageUrl + "default.jpg",
        })
      }
    })
  }
})