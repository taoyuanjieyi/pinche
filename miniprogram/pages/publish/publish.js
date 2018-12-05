// pages/publish/publish.js

var driverRequest = require('../../http/driverRouteRequest.js');

const app = getApp()

const date = new Date()
const nowYear = date.getFullYear()
const nowMonth = date.getMonth() + 1
const nowDay = date.getDate()
const nowHour = date.getHours()
const nowMinute = date.getMinutes()
const nowSecond = date.getSeconds()
const nowDate = nowYear +"-"+ (nowMonth<10?"0":"") +nowMonth +"-"+ (nowDay<10?"0":"")+nowDay;
const nowTime = (nowHour < 10 ? "0" : "") + nowHour + ":" + (nowMinute < 10 ? "0" : "") + nowMinute;
Page({
  data: {
    vacancy:0,
    years: [],
    months: [],
    days: [],
    year: nowYear,
    month: nowMonth,
    day: nowDay,
    hour: nowHour,
    minute: nowMinute,
    second: nowSecond,
    minDate:nowDay,
    value: [9999, 1, 1],
    array: ['1', '2', '3', '4', '5', '6'],
    body:"",
    /*textarea */
    min: 5,//最少字数
    max: 200, //最多字数 
  },
  onLoad:function(e){
    console.info("当前系统日期：", nowDate, nowTime);
    this.setData({
      minDate: nowDate,
      minTime: nowTime,
      time:nowTime,
      date:nowDate,
      submitBtnClass: "publish-btn"
    })
  },
  bindDateChange: function(e) {
    if (e.detail.value === nowDate){
      this.setData({
        minTime: nowTime,
        date: e.detail.value
      })
    }else{
      this.setData({
        minTime: "00:01",
        date: e.detail.value
      })
    }
    this.changeSubmitStyle()
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
    this.changeSubmitStyle()
  },
  bindVacancyChange: function(e) {
    this.setData({
      vacancy: e.detail.value
    })
    this.changeSubmitStyle()
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
      body: e.detail.value
    })
    this.changeSubmitStyle()
  },
  changeSubmitStyle:function(){
    let changeSubmitBtnEnable = true;
    if (this.data.date === null || this.data.date === '' || this.data.date === undefined) {
      changeSubmitBtnEnable = false;
    }
    if (this.data.time === null || this.data.time === '' || this.data.time === undefined) {
      changeSubmitBtnEnable = false;
    }
    if (this.data.body === null || this.data.body === '' ||
      this.data.body === undefined) {
      changeSubmitBtnEnable = false;
    }
    if (this.data.vacancy === null || this.data.vacancy === '' ||
      this.data.vacancy === undefined) {
      changeSubmitBtnEnable = false;
    }
    if (changeSubmitBtnEnable){
      this.setData({
        submitBtnClass:"publish-btn publish-btn-active"
      })
    }else{
      this.setData({
        submitBtnClass: "publish-btn"
      })
    }
  },

  formBindsubmit: function (e) {
    console.info("表单数据：", e.detail.value);
    if (this.data.date === null || this.data.date === '' || this.data.date === undefined) {
      wx.showToast({
        icon: 'none',
        title: '出发日期不能为空！'
      })
      return;
    }
    if (this.data.time === null || this.data.time === '' || this.data.time === undefined) {
      wx.showToast({
        icon: 'none',
        title: '出发时间不能为空！'
      })
      return;
    }
    if (e.detail.value.body === null || e.detail.value.body === '' ||
      e.detail.value.body === undefined) {
      wx.showToast({
        icon: 'none',
        title: '行程内容不能为空！'
      })
      return;
    }
    if (this.data.vacancy === null || this.data.vacancy === '' || 
      this.data.vacancy === undefined) {
      wx.showToast({
        icon: 'none',
        title: '空余座位数量不能为空！'
      })
      return;
    }

      var timestamp = Date.parse(new Date());
    driverRequest.publish({
      passPoint: e.detail.value.body,
      startTime: this.data.date + " " + this.data.time+":00",
      vacancy: this.data.array[this.data.vacancy],
    }).then((res) => {
      if (res.retCode === 'success' ) {
        wx.showToast({
          icon: 'none',
          title: '发布成功',
        })
        wx.switchTab({
          url: '/pages/index/index'
        })
      }else{
        wx.showToast({
          icon: 'none',
          title: res.retMsg
        })
      }
    })
  }
})