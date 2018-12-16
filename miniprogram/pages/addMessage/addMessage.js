Page({
  data: {
    /*车辆颜色*/
    carColor: ['黑色', '白色', '红色', '金色', '灰色', '银色', '黄色', '蓝色', '棕色'],
    /*车辆品牌*/
    carBrand: ['奥迪', '奔驰', '本田', '别克', '比亚迪', '标志', '长安', '长城', '银色', '传祺', '大众', '丰田', '福特', '菲亚特', '哈佛', '红旗', '海马', '吉利', 'JEEP', '凯迪拉克', '克莱斯勒', '雷克萨斯', '路虎', '林肯', '雷诺', '陆风', '马自达', '名爵', '尼桑', '欧宝', '奇瑞', '起亚', '荣威', '绅宝', '三菱', '斯柯达', '斯巴鲁', '沃尔沃', '现代', '雪佛兰', '雪铁龙', '英菲尼迪', '众泰', '中华', '其他'],
  },

  /*车牌颜色*/
  bindColorChange: function (e) {
    this.setData({
      color: e.detail.value
    })
    this.changeSubmitStyle()
  },
  /*车辆品牌*/
  bindBrandChange: function (e) {
    this.setData({
      brand: e.detail.value
    })
    this.changeSubmitStyle()
  }
})