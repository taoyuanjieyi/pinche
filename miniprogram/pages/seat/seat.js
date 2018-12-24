var driverRequest = require('../../http/driverRouteRequest.js');
var passengerRequest = require('../../http/passengerRouteRequest.js');
var commonUtil = require('../../common/common.js');
var login = require('../../http/login.js'); 


Page({
  data: {
    routeId:"",
    seatArray: [],
    seatArrayIndex: 0,
    okHidden:true,
    waitingHidden:false,
    payQrcodeUrl:"",
    isDriver:false,
    isPassenger:false,
    driverMobileHide:true,
    loginUserId:""
  },
  onLoad: function (options){
    var userInfo = commonUtil.getStorage("userInfo");
    if (!commonUtil.isBlank(userInfo)){
      this.setData({
        loginUserId:userInfo.userId
      })
    }
    this.setData({
      routeId: options.routeId,
      waitingHidden: false,
      isDriver: (options.isDriver === "true" || options.isDriver === true)?true:false,
      isPassenger: (options.isPassenger === "true" || options.isPassenger === true) ? true : false,
    })
    this.queryRouteDetail()
  },
  cancelButton: function (e) {
    this.setData({
      okHidden: true
    })
  },
  okButton: function (e) {
    var that = this;
    passengerRequest.joinRoute({
      routeId: this.data.routeId,
      seats: this.data.seatArray[this.data.seatArrayIndex]
    }).then((res) => {
      if (res.data.retCode === "need_login") {
        login.checkLogin(function () {
          that.okButton(e);
        },true)
      } else if (res.data.retCode === 'success') {
        wx.showToast({
          icon: 'none',
          title: '预定成功，请主动联系车主确认上车地点！'
        })
        this.setData({
          okHidden: true,
          isPassenger: true 
        })
        this.reloadPage();
      }else{
        wx.showToast({
          icon: 'none',
          title: res.data.retMsg
        })
        this.setData({
          okHidden: true
        })
      }
    })
  },
  reloadPage: function(){
    this.queryRouteDetail();
  },
  bindPickerChange: function (e) {
    this.setData({
      selectedSeats: this.data.seatArray[e.detail.value],
      seatArrayIndex: e.detail.value,
      okHidden: false
    })
  },
  queryRouteDetail: function () {
    let that = this;
    driverRequest.queryRouteDetail({
      driverRouteId: this.data.routeId,
    }).then((res) => {
      if (res.data.retCode === "need_login") {
        login.checkLogin(function () {
          that.queryRouteDetail();
        },true)
      } else if(res.data.retCode==='success'){
        let seats = [];
        if (res.data.driverRoute!==null){
          var userInfo = commonUtil.getStorage("userInfo");
          if (res.data.driverRoute.vacancy < 1 || res.data.driverRoute.userId === userInfo.userId){
            this.setData({
              waitingHidden: true
            })
          }
          for (let i = 0; i < res.data.driverRoute.vacancy;i++){
            seats[i] = i+1;
          }

          var payQrcode = JSON.parse(res.data.driverRoute.payQrcode)
          var qrcodeUrl = "";
          if (payQrcode !== null && payQrcode !== "" && payQrcode !== undefined) {
            qrcodeUrl = payQrcode.qrcodeUrl;
          }
          if (this.data.isPassenger||this.data.isDriver){
            this.setData({
              driverMobile: res.data.driverRoute.mobile,
              driverMobileHide:false,
              carInfo: res.data.driverRoute.carInfo,
            })
          }

          that.setData({
            driverNickName: res.data.driverRoute.nickName,
            driverAvatarUrl: res.data.driverRoute.avatarUrl,
            driverVacancy: res.data.driverRoute.vacancy,
            driverPassPoint: res.data.driverRoute.passPoint,
            joinRouteUserList: res.data.joinRouteUserList,
            seatArray: seats,
            payQrcodeUrl: "https://www.i5365.cn" + qrcodeUrl
          })
        }

      }
      
    })
  },
  previewImage: function(e){
    wx.previewImage({
      current: this.data.payQrcodeUrl, // 当前显示图片的http链接
      urls: [this.data.payQrcodeUrl] // 需要预览的图片http链接列表
    })
  },
  callTelephone:function(e){
    var mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile,
    })
  },
  tel:function(){
    wx.makePhoneCall({
      phoneNumber: '138108572570',
    })
  }
})