Page({
  data: {
    items: [
      { name: '行程一', value: '中关村—顺义石门中关村—顺义石门中关村—顺义石门中关村—顺义石门中关村—顺义石门中关村—顺义石门中关村—顺义石门中关村—顺义石门中关村—顺义石门中关村—顺义石门中关村—顺义石门中关村—顺义石门中关村—顺义石门' },
      { name: '行程二', value: '河北香河—北京', checked: 'true' },
      { name: '行程三', value: '通州—石家庄' }
    ]
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  goBack: function (e) {
    wx.navigateBack()
  }
})