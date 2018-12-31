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
      isPassenger: (options.isDriver === "false" || options.isDriver === false) ? true : false,
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
  cancelDriverRoute:function(routeId){
    let that = this;
    driverRequest.cancel({
      routeId: routeId
    }).then((res) => {
      if (res.data.retCode === "need_login") {
        login.checkLogin(function () {
          that.cancelDriverRoute(routeId);
        }, true)
      } else if (res.data.retCode === 'success') {
        wx.showToast({
          icon: 'none',
          title: '取消成功，请确认所有乘客已同意取消！'
        })
        this.reloadPage();
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.retMsg
        })
      }
    })
  },
  openDriverCancelConfirm(e){
    console.info("取消发布的行程：",e)
    var that = this;
    wx.showModal({
      title: "取消发布行程提示",
      content: "取消前需通知已预定的乘客，经过乘客确认后才能取消。确认取消该行程吗？",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          that.cancelDriverRoute(e.currentTarget.dataset.routeid)
        }
      },
      fail: function (res) {
        console.info("打开取消确认提示框报错", res)
      }
    })
  },
  openPassengerCancelConfirm(e) {
    console.info("取消预定行程：",e)
    var that = this;
    wx.showModal({
      title: "取消预定行程提示",
      content: "取消前需通知车主，经过车主确认后才能取消。确认取消该行程吗？",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          that.cancelPassengerRoute(e.currentTarget.dataset.routeid,that.data.routeId)
        }
      },
      fail: function (res) {
        console.info("打开取消确认提示框报错", res)
      }
    })
  },
  cancelPassengerRoute:function(routeId,driverRouteId){
    let that = this;
    passengerRequest.cancel({
      routeId: routeId,
      driverRouteId: driverRouteId,
    }).then((res) => {
      if(res.data.retCode === "need_login") {
          login.checkLogin(function () {
            that.cancelPassengerRoute(routeId);
          }, true)
      } else if(res.data.retCode === 'success') {
        wx.showToast({
          icon: 'none',
          title: '取消成功，请确认车主已同意取消！'
        })
        this.reloadPage();
      }else {
        wx.showToast({
          icon: 'none',
          title: res.data.retMsg
        })
      }
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
          var routeCanceled = res.data.driverRoute.status === "9"

          if (routeCanceled || res.data.driverRoute.vacancy < 1 || res.data.driverRoute.userId === userInfo.userId){
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
            driverRouteId: res.data.driverRoute.routeId,
            seatArray: seats,
            noCancel: !routeCanceled,
            payQrcodeUrl: "https://www.i5365.cn" + qrcodeUrl
          })
          var loginUserJoinRouteCount = 0
          for (var i = 0; i < res.data.joinRouteUserList.length;i++){
            var joinRoute = res.data.joinRouteUserList[i]
            if (joinRoute.userId === that.data.loginUserId){
              loginUserJoinRouteCount ++;
            }
          }

          if (loginUserJoinRouteCount>0&&routeCanceled){
            that.cancelPassengerRoute(this.data.routeId)
          }
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