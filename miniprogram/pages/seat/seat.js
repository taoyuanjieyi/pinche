Page({
  data: {
    seatArray: ['1', '2'],
    objectseatArray: [
      {
        id: 0,
        name: '1'
      },
      {
        id: 1,
        name: '2'
      }
    ],
    seatArrayIndex: 0
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      seatArrayIndex: e.detail.value
    })
  }
})