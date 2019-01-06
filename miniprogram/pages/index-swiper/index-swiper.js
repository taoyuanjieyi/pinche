var dateUtil = require('../../utils/dateUtil.js');
var app = getApp()
Page({
  data: {
    imgUrls: [{
      lunbo: '', link: ""}
    ],
    startUpImageUrl: app.getServerHost()+"/static/"+ app.getEnv()+"/startup/",
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
      url: that.data.startUpImageUrl + dateStr + ".jpg",
      data: {},
      success: function (res) {
        if(res.statusCode!==200){
          that.data.imgUrls[0].lunbo = that.data.startUpImageUrl + "default.jpg";
          that.setData({
            imgUrls: that.data.imgUrls
          })
        }else{
          that.data.imgUrls[0].lunbo = that.data.startUpImageUrl + dateStr + ".jpg";
          that.setData({
            imgUrls: that.data.imgUrls
          })
        }
      },
      fail: function (res) {
        that.data.imgUrls[0].lunbo = that.data.startUpImageUrl + dateStr + ".jpg";
        that.setData({
          imgUrls: that.data.imgUrls
        })
      }
    })
  }
})