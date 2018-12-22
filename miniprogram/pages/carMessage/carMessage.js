var userRequest = require('../../http/userRequest.js');
var login = require('../../http/login.js'); 
var commonUtil = require('../../common/common.js');
// miniprogram/pages/carMessage/carMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    noDataHide:true,
    addBtnHide:false,
    startX: 0, //开始坐标
    startY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    for (var i = 0; i < this.data.items.length; i++) {
      this.data.items.push({
        //content: i + " 向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦",
        isTouchMove: false //默认全隐藏删除
      })
    }
    this.setData({
      items: this.data.items
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadPage();
  },

  loadPage:function(){
    // 获取所有车辆信息
    var userInfo = commonUtil.getStorage("userInfo");
    if (userInfo === null || userInfo === "" || userInfo === undefined) {
      return;
    } else if (userInfo.carList !== null && userInfo.carList !== "" && userInfo.carList !== undefined) {
      var carListJson = JSON.parse(userInfo.carList);
      if (carListJson.length<1){
        this.setData({
          noDataHide: false,
          addBtnHide:true,
        })
      }else{
        this.setData({
          items: carListJson,
          noDataHide: true,
          addBtnHide:false,
        })
      }
    } else {
      this.setData({
        noDataHide: false,
        addBtnHide:true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  goBack: function(e){
    wx.navigateBack()
  },

  goAdd: function (e) {
    wx.navigateTo({
      url: '../addMessage/addMessage'
    })
  },

  goEdit: function (e) {
    console.info("编辑",e);
    wx.navigateTo({
      url: '../addMessage/addMessage?idx='+e.currentTarget.dataset.index
    })
  },


  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  removeCarInfo: function (e) {
    var that = this;
    that.data.items.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      items: that.data.items
    })
    userRequest.updateCarInfo({
      carInfoJson: JSON.stringify(that.data.items)
    }).then((res) => {
      console.info("删除常用行程结果：", res)
      if (res.data.retCode === "need_login") {
        login.checkLogin(function () {
          that.removeCarInfo(e);
        }, true)
      } else if (res.data.retCode === "success") {
        userRequest.queryUserInfo().then((res) => {
          that.loadPage();
        })
      } else {
        console.info("行程列表数据：", that.data.items);
      }
    })
  }
})