var userRequest = require('../../http/userRequest.js');
var login = require('../../http/login.js');
var commonUtil = require('../../common/common.js');

Page({
  data: {
    /*车辆颜色*/
    carColor: ['黑色', '白色', '红色', '金色', '灰色', '银色', '黄色', '蓝色', '棕色'],
    /*车辆品牌*/
    carBrand: ['奥迪', '奔驰', '本田', '别克', '比亚迪', '标志', '长安', '长城', '银色', '传祺', '大众', '丰田', '福特', '菲亚特', '哈佛', '红旗', '海马', '吉利', 'JEEP', '凯迪拉克', '克莱斯勒', '雷克萨斯', '路虎', '林肯', '雷诺', '陆风', '马自达', '名爵', '尼桑', '欧宝', '奇瑞', '起亚', '荣威', '绅宝', '三菱', '斯柯达', '斯巴鲁', '沃尔沃', '现代', '雪佛兰', '雪铁龙', '英菲尼迪', '众泰', '中华', '其他'],
    /*车牌号*/
    editIndex: 0,
    isEdit:false,
    multiArray: [
      ['京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑', '湘', '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '粤', '琼', '川', '青', '藏', '宁'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    ],
    multiIndex: [0, 0],
    selectColorIndex: null,
    selectBrandIndex: null,
    carNumber: null,
    submitBtnClass: "publish-btn",
    submitBtnDisbled: true,
    carList:[],
    submitBtnText:"添加车辆信息",
  },
  onLoad:function(options){
    var carList;
    // 获取所有车辆信息
    var userInfo = commonUtil.getStorage("userInfo");
    if (userInfo === null || userInfo === "" || userInfo === undefined) {
      return;
    } else if (userInfo.carList === null || userInfo.carList === "" || userInfo.carList === undefined) {
      carList = []
    } else {
      carList = JSON.parse(userInfo.carList);
    }
    if (!commonUtil.isBlank(options.idx)){
      this.initEditData(carList,options.idx);
    }
    this.setData({
      carList: carList,
    })
  },

  initEditData:function(carList,idx){
    var areaIndex = 0;
    var areaLetterIndex = 0;
    var brandIndex = null ;
    var colorIndex = null;
    for (var index in this.data.multiArray[0]) {
      if (this.data.multiArray[0][index] === carList[idx].area){
        areaIndex = index;
      }
    }
    for (var index in this.data.multiArray[1]) {
      if (this.data.multiArray[1][index] === carList[idx].areaLetter) {
        areaLetterIndex = index;
      }
    }
    for (var index in this.data.carBrand) {
      if (this.data.carBrand[index] === carList[idx].brand) {
        brandIndex = index;
      }
    }
    for (var index in this.data.carColor) {
      if (this.data.carColor[index] === carList[idx].color) {
        colorIndex = index;
      }
    }
    this.setData({
      editIndex: idx,
      isEdit: true,
      multiIndex: [areaIndex, areaLetterIndex],
      selectBrandIndex: brandIndex,
      selectColorIndex: colorIndex,
      carNumber: carList[idx].carNumber,
      submitBtnText:"保存车辆信息"
    })
    this.changeSubmitStyle()
  },

  /*车牌号下拉 */
  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  /*车牌颜色*/
  bindColorChange: function(e) {
    console.info("selectColor:", e.detail.value);
    this.setData({
      color: e.detail.value,
      selectColorIndex: e.detail.value,
    })
    this.changeSubmitStyle()
  },
  /*车辆品牌*/
  bindBrandChange: function(e) {
    console.info("selectBrand:", e.detail.value);
    this.setData({
      brand: e.detail.value,
      selectBrandIndex: e.detail.value,
    })
    this.changeSubmitStyle()
  },
  /*车牌号*/
  bindCarNumberInput: function(e) {
    // 获取输入框的内容
    var value = e.detail.value.replace(/\s+/g, '');
    this.setData({
      carNumber: value
    })
    this.changeSubmitStyle()
  },
  changeSubmitStyle: function() {
    let changeSubmitBtnEnable = true;
    if (this.data.selectBrandIndex === null || this.data.selectBrandIndex === '' || this.data.selectBrandIndex === undefined) {
      changeSubmitBtnEnable = false;
    }
    if (this.data.selectColorIndex === null || this.data.selectColorIndex === '' || this.data.selectColorIndex === undefined) {
      changeSubmitBtnEnable = false;
    }
    if (this.data.carNumber === null || this.data.carNumber === '' ||
      this.data.carNumber === undefined) {
      changeSubmitBtnEnable = false;
    }
    if (changeSubmitBtnEnable) {
      this.setData({
        submitBtnClass: "publish-btn publish-btn-active",
        submitBtnDisbled: false
      })
    } else {
      this.setData({
        submitBtnClass: "publish-btn",
        submitBtnDisbled: true
      })
    }
  },
  saveCarInfo: function(e) {
    var that = this;
    if (this.data.carNumber.length < 5 || this.data.carNumber.length >6 ) {
      wx.showToast({
        icon: 'none',
        title: '车牌号只能为5或6位，例如：12345或123456'
      })
      return;
    }
    if(this.data.isEdit){
      this.data.carList[this.data.editIndex].brand = this.data.carBrand[this.data.selectBrandIndex];
      this.data.carList[this.data.editIndex].color = this.data.carColor[this.data.selectColorIndex];
      this.data.carList[this.data.editIndex].area = this.data.multiArray[0][this.data.multiIndex[0]]
      this.data.carList[this.data.editIndex].areaLetter = this.data.multiArray[1][this.data.multiIndex[1]]
      this.data.carList[this.data.editIndex].carNumber = this.data.carNumber;

    }else{
      var carInfo = {};
      var length = this.data.carList.length;
      carInfo.brand = this.data.carBrand[this.data.selectBrandIndex];
      carInfo.color = this.data.carColor[this.data.selectColorIndex];
      carInfo.area = this.data.multiArray[0][this.data.multiIndex[0]]
      carInfo.areaLetter = this.data.multiArray[1][this.data.multiIndex[1]]
      carInfo.carNumber = this.data.carNumber;
      carInfo.isDefault = false;
      carInfo.orderBy = length;
      carInfo.isDefault = false;
      if (length < 1) {
        carInfo.isDefault = true;
      }
      carInfo.isDisplay = true;
      this.data.carList.push(carInfo);
      this.data.carList.sort(this.compare("orderBy"));
    }
    userRequest.updateCarInfo({
      carInfoJson: JSON.stringify(this.data.carList)
    }).then((res) => {
      console.info("保存常用行程到服务器结果：", res)
      if (res.data.retCode === "need_login") {
        login.checkLogin(function() {
          that.saveCarInfo(e);
        }, true)
      } else if (res.data.retCode === "success") {
        userRequest.queryUserInfo().then((res) => {
          wx.navigateBack();
        })
      } else {
        console.info("行程列表数据：", this.data.items);
      }
    })
  },
  compare: function(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  }
})