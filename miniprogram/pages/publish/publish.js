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
    value: [9999, 1, 1],
    array: ['1', '2', '3', '4', '5', '6'],
    objectArray: [{
        id: 1,
        name: '1'
      },
      {
        id: 2,
        name: '2'
      },
      {
        id: 3,
        name: '3'
      },
      {
        id: 4,
        name: '4'
      },
      {
        id: 5,
        name: '5'
      },
      {
        id: 6,
        name: '6'
      }
    ]
  },
  onLoad:function(e){
    //setDate(this.data.year, this.data.month, this.data.day, this)
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let val = e.detail.value
  //  setDate(this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]], this)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindVacancyChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      vacancy: e.detail.value
    })
  },

  formBindsubmit: function (e) {
    console.info("表单数据：", e.detail.value);
    console.info("数据：", this.data)
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

      // console.log(e.detail.value.nickname);
      // console.log(e.detail.value.start);
      // console.log(e.detail.value.end);
      // console.log(e.detail.value.body);
      // console.log(e.detail.value.vacancy);
      // console.log(e.detail.value.departureTime);
      // console.log(e.detail.value.carinfo);
      // console.log(e.detail.value.remark);
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