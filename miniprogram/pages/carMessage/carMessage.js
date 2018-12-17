var userRequest = require('../../http/userRequest.js');
var commonUtil = require('../../common/common.js');
// miniprogram/pages/carMessage/carMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    noDataHide:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // 获取所有车辆信息
    var userInfo = commonUtil.getStorage("userInfo");
    if (userInfo === null || userInfo === "" || userInfo === undefined) {
      return;
    } else if (userInfo.carList !== null && userInfo.carList !== "" && userInfo.carList !== undefined) {
      this.setData({
        items:JSON.parse(userInfo.carList),
        noDataHide:true,
      })
    }else{
      this.setData({
        noDataHide: false,
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
  }
})