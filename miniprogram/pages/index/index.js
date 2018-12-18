//index.js
var dateUtil = require('../../utils/dateUtil.js');
var userRequest = require('../../http/userRequest.js'); 
var login = require('../../http/login.js'); 
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
    var that  = this;
    // 检查是否登录,登录成功执行queryRouteList()方法
    login.checkLogin(function(){
      that.queryRouteList()
    });
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
   var that = this;
   driverRequest.search(searchData).then((res) => {
     console.info("查询行程列表结果：", res)
     if (res.data.retCode === "need_login") {
       login.checkLogin(function(){
         that.queryDriverRouteList();
       })
     }
     this.setData({
       driverRouteList: res.data.page.list,
       ownerRouteList: res.data.ownerRouteList,
       joinRouteList: res.data.joinRouteList
     })
   })
  }
})
