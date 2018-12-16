//index.js
var dateUtil = require('../../utils/dateUtil.js');
var userRequest = require('../../http/userRequest.js'); 
var commonUtil = require('../../common/common.js');
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
    userRequest.userLogin().then((res) => {
      console.info("检查登录结果：",res)
      if (res) {
        this.queryRouteList()
      }
    })
  },
  queryRouteList: function () {
    this.queryDriverRouteList({
      pageNumber : 1,
      pageSize : 999,
    });
  },
  viewDriverRoute : function(e){
    var index = parseInt(e.currentTarget.dataset.index); 
    wx.navigateTo({
      url: '../seat/seat?isShowMobile=false&routeId=' + this.data.driverRouteList[index].routeId
    })
  },
  viewOwnerRoute: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '../seat/seat?isShowMobile=true&routeId=' + this.data.ownerRouteList[index].routeId
    })
  },
  viewJoinRoute: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '../seat/seat?isShowMobile=true&routeId=' + this.data.joinRouteList[index].routeId
    })
  },
  bindSearchChange:function(e){
    var value = e.detail.value;
    var len = parseInt(value.length);
    this.queryDriverRouteList({
      pageNumber: 1,
      pageSize: 999,
      keyword:value
    });
  },
 queryDriverRouteList:function(searchData){
   driverRequest.search(searchData).then((res) => {
     console.info("查询行程列表结果：", res)
     if (res.retCode === "need_login") {
       userRequest.onLogin().then((res) => {
         this.queryRouteList();
        return;
       })
     }
     this.setData({
       driverRouteList: res.page.list,
       ownerRouteList: res.ownerRouteList,
       joinRouteList: res.joinRouteList
     })
   })
  }
})
