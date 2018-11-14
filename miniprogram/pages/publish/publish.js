// pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  formBindsubmit: function (e) {
    if (e.detail.value.nickname === null || e.detail.value.nickname === ''){
      wx.showToast({
        icon: 'none',
        title: '昵称不能为空！'
      })
    } else if (e.detail.value.start === null || e.detail.value.start === ''){
      wx.showToast({
        icon: 'none',
        title: '起点不能为空！'
      })
    } else if (e.detail.value.end === null || e.detail.value.end === '') {
      wx.showToast({
        icon: 'none',
        title: '终点不能为空！'
      })
    } else if (e.detail.value.body === null || e.detail.value.body === '') {
      wx.showToast({
        icon: 'none',
        title: '途经站点不能为空！'
      })
    } else if (e.detail.value.vacancy === null || e.detail.value.vacancy === '') {
      wx.showToast({
        icon: 'none',
        title: '空余座位数量不能为空！'
      })
    } else if (e.detail.value.departureTime === null || e.detail.value.departureTime === '') {
      wx.showToast({
        icon: 'none',
        title: '出发时间不能为空！'
      })
    } else if (e.detail.value.carinfo === null || e.detail.value.carinfo === '') {
      wx.showToast({
        icon: 'none',
        title: '汽车信息不能为空！'
      })
    }else{
      // console.log(e.detail.value.nickname);
      // console.log(e.detail.value.start);
      // console.log(e.detail.value.end);
      // console.log(e.detail.value.body);
      // console.log(e.detail.value.vacancy);
      // console.log(e.detail.value.departureTime);
      // console.log(e.detail.value.carinfo);
      // console.log(e.detail.value.remark);
      var allbody = e.detail.value.start + "-" + e.detail.value.body + "-" + e.detail.value.end;
      var timestamp = Date.parse(new Date());
      const db = wx.cloud.database()
      db.collection('travel_lines').add({
        data: {
          nickname: e.detail.value.nickname,
          body: allbody,
          departureTime: e.detail.value.departureTime,
          vacancy: e.detail.value.vacancy,
          remark: e.detail.value.remark,
          id: timestamp
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            counterId: res._id,
            count: 1
          })
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
    }
  }
})