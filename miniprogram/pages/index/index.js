//index.js
var dateUtil = require('../../utils/dateUtil.js');
var userRequest = require('../../http/userRequest.js');
var driverRequest = require('../../http/driverRouteRequest.js');
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
    this.queryRouteList();
  },
  queryRouteList: function () {

    driverRequest.search({
      pageNumber : 1,
      pageSize : 999,
    }).then((res) => {
      let driverRouteList = {}
      let ownerRouteList = {}
      let joinRouteList = {}
      console.log('[数据库] [查询记录] 成功1: ', res)
      this.setData({
        driverRouteList: res.page.list,
        ownerRouteList: res.ownerRouteList,
        joinRouteList: res.joinRouteList
      })
    })
  },

})
