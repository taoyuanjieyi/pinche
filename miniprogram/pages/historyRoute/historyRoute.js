Page({
  data: {
    array: ['七天内历史行程', '一个月历史行程', '三个月历史行程', '六个月历史行程'],
    index: 0,
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  viewOwnerRoute: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '../seat/seat?isDriver=' + this.data.ownerRouteList[index].driver + '&routeId=' + this.data.ownerRouteList[index].routeId
    })
  }
})