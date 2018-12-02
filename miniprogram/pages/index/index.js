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
    driverRouteList : {},
    ownerRouteList : {} ,
    joinRouteList : {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

  },
  onShow: function () {
    // 检查是否登录
    userRequest.userLogin();
    
    this.queryRouteList();
  },
  queryRouteList: function () {

    driverRequest.search({
      pageNumber : 1,
      pageSize : 999,
    }).then((res) => {
      if(res.retCode === "need_login"){
        userRequest.onLogin();
        return;
      }
      console.log('[数据库] [查询记录] 成功1: ', res)
      this.setData({
        driverRouteList: res.page.list,
        ownerRouteList: res.ownerRouteList,
        joinRouteList: res.joinRouteList
      })
    })
  },
  viewDriverRoute : function(e){
    var index = parseInt(e.currentTarget.dataset.index); 
    wx.navigateTo({
      url: '../seat/seat?routeId=' + this.data.driverRouteList[index].routeId
    })
  }
})
