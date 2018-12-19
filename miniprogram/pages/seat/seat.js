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
    isShowMobile:false,
  },
  onLoad: function (options){
    this.setData({
      routeId: options.routeId,
      waitingHidden: false,
      isShowMobile: (options.isShowMobile === "true" || options.isShowMobile === true)?true:false
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
          okHidden: true
        })
        this.reloadPage();
      }else{
        wx.showToast({
          icon: 'none',
          title: res.retMsg
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
        if (res.driverRoute!==null){
          var userInfo = commonUtil.getStorage("userInfo");
          if (res.driverRoute.vacancy < 1 || res.driverRoute.userId === userInfo.userId){
            this.setData({
              waitingHidden: true
            })
          }
          for (let i = 0; i < res.driverRoute.vacancy;i++){
            seats[i] = i+1;
          }

          var payQrcode = JSON.parse(res.driverRoute.payQrcode)
          var qrcodeUrl = "";
          if (payQrcode !== null && payQrcode !== "" && payQrcode !== undefined) {
            qrcodeUrl = payQrcode.qrcodeUrl;
          }
          if (this.data.isShowMobile){
            this.setData({
              driverMobile: res.driverRoute.mobile,
              carInfo: res.driverRoute.carInfo,
            })
          }

          that.setData({
            driverNickName: res.driverRoute.nickName,
            driverAvatarUrl: res.driverRoute.avatarUrl,
            driverVacancy: res.driverRoute.vacancy,
            driverPassPoint: res.driverRoute.passPoint,
            joinRouteUserList: res.joinRouteUserList,
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
  }
})