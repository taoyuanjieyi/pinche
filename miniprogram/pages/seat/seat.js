var driverRequest = require('../../http/driverRouteRequest.js');
var passengerRequest = require('../../http/passengerRouteRequest.js');
var commonUtil = require('../../common/common.js');
var login = require('../../http/login.js'); 
var dateUtil = require('../../utils/dateUtil.js');


Page({
  data: {
    routeId:"",
    seatArray: [],
    seatArrayIndex: 0,
    okHidden:true,
    waitingHidden:false,
    isDriver:false,
    isPassenger:false,
    driverMobileHide:true,
    loginUserId:"",
    routeIsStart:false,
    isShare:false,
  },
  onLoad: function (options){
    var that  = this
    var userInfo = commonUtil.getStorage("userInfo");
    if (!commonUtil.isBlank(userInfo)){
      this.setData({
        loginUserId:userInfo.userId
      })
    }
    console.info("进入行程页面，页面参数为：",options)
    if (!commonUtil.isBlank(options.shareUserId)){
      var shareMessage = { "shareUserId": options.shareUserId, "routeId": options.routeId}
      console.info("分享参数存入缓存：", shareMessage)
      wx.setStorageSync("shareMessage", shareMessage);
    }
    this.setData({
      routeId: options.routeId,
      waitingHidden: false,
    })
    login.checkLogin(function () {
      that.queryRouteDetail()
    }, true);
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
        })
        this.reloadPage();
        wx.setStorageSync("index_reload", true)
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
        wx.setStorageSync("index_reload", true)
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
        wx.setStorageSync("index_reload", true)
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
          }else{
            this.setData({
              waitingHidden: false
            })
          }
          for (let i = 0; i < res.data.driverRoute.vacancy;i++){
            seats[i] = i+1;
          }
          if (this.data.loginUserId === res.data.driverRoute.userId){
            this.setData({
              isPassenger:false,
              isDriver:true,
            })
          }else{
            this.setData({
              isPassenger: true,
              driverMobileHide: false,
              isDriver: false,
            })
          }
          if (this.data.isPassenger||this.data.isDriver){
            this.setData({
              driverMobile: res.data.driverRoute.mobile,
              carInfo: res.data.driverRoute.carInfo,
            })
          }

          var currDate = dateUtil.getCurrDateToMinute()+":00";
          if (currDate > res.data.driverRoute.startTime){
            this.setData({
              routeIsStart:true
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
            price: res.data.driverRoute.price,
            routeCanceled: routeCanceled,
            routeIsStart: this.data.routeIsStart,
          })
          var loginUserJoinRouteCount = 0
          if (!commonUtil.isBlank(res.data.joinRouteUserList)){
            for (var i = 0; i < res.data.joinRouteUserList.length;i++){
              var joinRoute = res.data.joinRouteUserList[i]
              if (joinRoute.userId === that.data.loginUserId){
                loginUserJoinRouteCount ++;
              }
            }
          }

          if (loginUserJoinRouteCount>0&&routeCanceled){
            that.cancelPassengerRoute(this.data.routeId)
          }
        }

      }
      
    })
  },
  callTelephone:function(e){
    var mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile,
    })
  },
  onShareAppMessage: function () {
    var that = this;
    that.setData({
      isShare: true,
    })
    var shareUserId = that.data.loginUserId;
    return { title: '行程分享', path: "/pages/seat/seat?routeId=" + this.data.routeId + "&shareUserId=" + shareUserId }
  },
  jumpPage: function () {
    wx.switchTab({
      url: '../index/index',
    })
  }
})