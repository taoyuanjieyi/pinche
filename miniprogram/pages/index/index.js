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
    driverRouteList : [],
    ownerRouteList : [] ,
    joinRouteList : [],
    pageNumber: 1,
    pageSize: 5,
    keyword: "",
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
    that.setData({
      pageNumber: 1,
      pageSize: 5,
    })
    // 检查是否登录,登录成功执行queryRouteList()方法
    login.checkLogin(function(){
      that.queryRouteList()
    },true);
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    that.queryRouteList();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  queryRouteList: function () {
    this.queryDriverRouteList({
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize,
      keyword: this.data.keyword,
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
      url: '../seat/seat?isDriver=true&routeId=' + this.data.ownerRouteList[index].routeId
    })
  },
  viewJoinRoute: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '../seat/seat?isPassenger=true&routeId=' + this.data.joinRouteList[index].routeId
    })
  },
  bindSearchChange:function(e){
    var value = e.detail.value;
    this.setData({
      keyword:value,
      pageNumber:1,
      pageSize:5,
    })
    var len = parseInt(value.length);
    this.queryDriverRouteList({
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize,
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
        },true)
      }
      var driverList = this.data.driverRouteList
      var ownerList = this.data.ownerRouteList
      var joinList = this.data.joinRouteList
      if (res.data.retCode === "success") {
        if (res.data.page.list != null && res.data.page.list !== undefined && res.data.page.list.length>0){
          for (var i=0;i<res.data.page.list.length;i++){
            driverList.push(res.data.page.list[i]);
          }
        }
      }
      this.setData({
        driverRouteList: driverList,
        ownerRouteList: res.data.ownerRouteList,
        joinRouteList: res.data.joinRouteList,
      })
      // 隐藏加载框  
      wx.hideLoading();
    })
  },

  // 上拉加载更多
  onReachBottom: function () {
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1 
    this.setData({
      pageNumber: this.data.pageNumber + 1
    })
    this.queryRouteList();
  },
  // 点击返回到顶部
  onTabItemTap(item) {
    console.info(item)
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      console.warn('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。')
    }
  }  
})
