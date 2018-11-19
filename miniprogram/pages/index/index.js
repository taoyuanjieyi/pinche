//index.js
var dateUtil = require('../../utils/dateUtil.js');
var userRequest = require('../../http/userRequest.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // 检查是否登录
    userRequest.userLogin();
    this.onShow();
  },
  onAdd: function () {
    const db = wx.cloud.database()
    var timestamp = Date.parse(new Date());
    var time = dateUtil.formatTime(new Date())
    db.collection('travel_lines').add({
      data: {
        count: 1,
        body:"三元桥-国贸-大望路-通州-香河",
        departureTime: time,
        nickname:"MikeG",
        vacancy:3,
        id:timestamp
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.onQuery()
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  onShow: function () {
    wx.cloud.init();
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('travel_lines').orderBy('id', 'desc').get({
      success: res => {
        let queryResult = {}
        console.log('[数据库] [查询记录] 成功1: ', res.data)
        this.setData({
          queryResult: res.data
        })
        console.log('[数据库] [查询记录] 成功2: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

})
