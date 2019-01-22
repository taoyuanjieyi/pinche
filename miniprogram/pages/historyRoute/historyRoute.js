var login = require('../../http/login.js');
var driverRequest = require('../../http/driverRouteRequest.js');
Page({
  data: {
    array: ['七天内历史行程', '一个月历史行程', '三个月历史行程', '六个月历史行程'],
    index: 0,
    historyRouteList: [],
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function () {
  },
  onShow: function () {
    this.queryRouteListCall()
  },
  clearPageData: function () {
    this.setData({
      historyRouteList: [],
      pageNumber: 1,
      pageSize: 10,
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    //清空页面已加载的数据
    this.clearPageData()
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.queryRouteListCall();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  viewOwnerRoute: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '../historyDetails/historyDetails?routeId=' + this.data.historyRouteList[index].routeId
    })
  },
  queryRouteListCall: function () {
    this.queryOwnerRouteList({
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize,
    });
  },
  queryOwnerRouteList: function (searchData) {
    var that = this;
    driverRequest.history(searchData).then((res) => {
      console.info("查询历史行程列表结果：", res)
      if (res.data.retCode === "need_login") {
        login.checkLogin(function () {
          that.queryOwnerRouteList();
        }, true)
      }
      var routeList = this.data.historyRouteList
      var totalPages = 0;
      if (res.data.retCode === "success") {
        if (res.data.page.list != null && res.data.page.list !== undefined && res.data.page.list.length > 0) {
          totalPages = res.data.page.pages
          for (var i = 0; i < res.data.page.list.length; i++) {
            routeList.push(res.data.page.list[i]);
          }
        }
      }
      this.setData({
        historyRouteList: routeList,
        totalPages: totalPages,
      })
      // 隐藏加载框  
      wx.hideLoading();
    })
  },
  // 上拉加载更多
  onReachBottom: function () {
    var that = this;
    // 页数+1 
    var nextPageNumber = this.data.pageNumber + 1;
    if (nextPageNumber <= this.data.totalPages) {
      // 显示加载图标  
      wx.showLoading({
        title: '玩命加载中',
      })
      this.setData({
        pageNumber: nextPageNumber
      })
      this.queryRouteListCall();
    } else {
      // 提示已经到最后一页
      console.info("已经是最后一页了哦...")
    }
  },
  // 点击返回到顶部
  onTabItemTap(item) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      console.warn('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。')
    }
  } 
})