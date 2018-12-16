var userRequest = require('../../http/userRequest.js');
var commonUtil = require('../../common/common.js');

Page({
  data: {
    items: [],
    min: 5, //最少字数
    max: 200, //最多字数 
    body:"",
    hideAddContent:true,
    isEdit : false,
    editIndex:null,
    mode:null,
    okBtn:"",
  },
  radioChange(e) {
    this.showAddContent()
    this.setData({
      bodyValue: this.data.items[e.detail.value].body,
      isEdit:true,
      body: this.data.items[e.detail.value].body,
      editIndex: e.detail.value,
    })
  },
  radioClick(e) {
    if (this.data.isEdit === false){
      this.setData({
        bodyValue: this.data.items[this.data.editIndex].body,
        body: this.data.items[e.detail.value].body,
        isEdit: true,
        editIndex: this.data.editIndex,
      })
    }
  },
  onLoad:function(options){
    if (options.mode === "select"){
      this.setData({
        okBtn: "确定"
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadPage();
  },
  loadPage:function(){
    var userInfo = commonUtil.getStorage("userInfo");
    if (userInfo === null || userInfo === "" || userInfo === undefined) {

    } else if (userInfo.quickRoute !== null && userInfo.quickRoute !== "" && userInfo.quickRoute !== undefined){
      this.setData({
        items: JSON.parse(userInfo.quickRoute),
        isEdit: false,
      })
      var isHideAddBtn = false;
      if(this.data.items.length>4){
        isHideAddBtn = true;
      }
      this.setData({
        addBtnShow: isHideAddBtn
      })
      this.hideAddContent()
    }
  },
  openAddWindow:function(){
    this.setData({
      bodyValue: "",
      body:"",
      currentWordNumber:0,
      isEdit:false,
    })
    this.showAddContent();
  },
  showAddContent:function(){
    this.setData({
      hideAddContent:false
    })
  },
  hideAddContent:function(){
    this.setData({
      hideAddContent: true
    })
  },
  bindBodyChange: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
    this.setData({
      body: e.detail.value
    })
    this.changeSubmitStyle()
  },
  changeSubmitStyle: function () {
    let changeSubmitBtnEnable = true;
    
    if (this.data.body === null || this.data.body === '' ||
      this.data.body === undefined) {
      changeSubmitBtnEnable = false;
    }

    if (changeSubmitBtnEnable) {
      this.setData({
        submitBtnClass: "publish-btn publish-btn-active"
      })
    } else {
      this.setData({
        submitBtnClass: "publish-btn"
      })
    }
  },
  goBack: function (e) {
    wx.setStorageSync("selectedRouteBody",this.data.body)
    wx.navigateBack();
  },
  saveQuickRoute: function (e) {
    if (this.data.body === null || this.data.body === '' ||
      this.data.body === undefined) {
      wx.showToast({
        icon: 'none',
        title: '行程内容不能为空！'
      })
      return;
    }
    if (this.data.isEdit){
      this.data.items[this.data.editIndex].body = this.data.body;
      console.info(this.data);
      this.submitQuickRoute();
    }else{
      var route = {};
      var length = this.data.items.length;
      route.name = '行程' + length;
      route.body = this.data.body;
      route.orderBy = length;
      route.isDefault = false;
      if (length < 1) {
        route.isDefault = true;
      }
      route.isDisplay = true;
      
      this.addRoute(route);
      this.submitQuickRoute();
    }
    
  },
  compare:function(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  addRoute:function(route){
    this.data.items.push(route);
    this.data.items.sort(this.compare("orderBy"));
    console.info("行程列表数据：", this.data.items);
  },
  submitQuickRoute:function (){
    var that = this;
    userRequest.updateQuickRoute({
      quickRouteJson: JSON.stringify(this.data.items)
    }).then((res) => {
      console.info("保存常用行程到服务器结果：", res)
      if (res.data.retCode === "success") {
        userRequest.queryUserInfo().then((res) => {
          this.loadPage();
        })
      }else{
        console.info("行程列表数据：", this.data.items);
      }
    })
  }
})