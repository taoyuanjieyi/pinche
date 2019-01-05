var driverRequest = require('../../http/driverRouteRequest.js');
var passengerRequest = require('../../http/passengerRouteRequest.js');
var commonUtil = require('../../common/common.js');
var login = require('../../http/login.js');
var dateUtil = require('../../utils/dateUtil.js');


Page({
  data: {
    routeId: "",
    seatArray: [],
    seatArrayIndex: 0,
    okHidden: true,
    waitingHidden: false,
    payQrcodeUrl: "",
    isDriver: false,
    isPassenger: false,
    driverMobileHide: true,
    loginUserId: "",
    routeIsStart: false,
    isShare: false,
  },
  onLoad: function (options) {
    wx.showShareMenu()
    var that = this
    var userInfo = commonUtil.getStorage("userInfo");
    if (!commonUtil.isBlank(userInfo)) {
      this.setData({
        loginUserId: userInfo.userId
      })
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
  reloadPage: function () {
    this.queryRouteDetail();
  },
  queryRouteDetail: function () {
    let that = this;
    driverRequest.queryRouteDetail({
      driverRouteId: this.data.routeId,
    }).then((res) => {
      if (res.data.retCode === "need_login") {
        login.checkLogin(function () {
          that.queryRouteDetail();
        }, true)
      } else if (res.data.retCode === 'success') {
        let seats = [];
        if (res.data.driverRoute !== null) {
          var userInfo = commonUtil.getStorage("userInfo");
          var routeCanceled = res.data.driverRoute.status === "9"

          if (routeCanceled || res.data.driverRoute.vacancy < 1 || res.data.driverRoute.userId === userInfo.userId) {
            this.setData({
              waitingHidden: true
            })
          }
          for (let i = 0; i < res.data.driverRoute.vacancy; i++) {
            seats[i] = i + 1;
          }

          var payQrcode = JSON.parse(res.data.driverRoute.payQrcode)
          var qrcodeUrl = "";
          if (payQrcode !== null && payQrcode !== "" && payQrcode !== undefined) {
            qrcodeUrl = payQrcode.qrcodeUrl;
          }
          if (this.data.loginUserId === res.data.driverRoute.userId) {
            this.setData({
              isPassenger: false,
              isDriver: true,
            })
          } else {
            this.setData({
              isPassenger: true,
              isDriver: false,
            })
          }
          if (this.data.isPassenger || this.data.isDriver) {
            this.setData({
              driverMobile: res.data.driverRoute.mobile,
              driverMobileHide: false,
              carInfo: res.data.driverRoute.carInfo,
            })
          }

          var currDate = dateUtil.getCurrDateToMinute() + ":00";
          if (currDate > res.data.driverRoute.startTime) {
            this.setData({
              routeIsStart: true
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
            payQrcodeUrl: "https://www.i5365.cn" + qrcodeUrl
          })
          var loginUserJoinRouteCount = 0
          if (!commonUtil.isBlank(res.data.joinRouteUserList)) {
            for (var i = 0; i < res.data.joinRouteUserList.length; i++) {
              var joinRoute = res.data.joinRouteUserList[i]
              if (joinRoute.userId === that.data.loginUserId) {
                loginUserJoinRouteCount++;
              }
            }
          }

          if (loginUserJoinRouteCount > 0 && routeCanceled) {
            that.cancelPassengerRoute(this.data.routeId)
          }
        }

      }

    })
  },
  onShareAppMessage: function () {
    var that = this;
    that.setData({
      isShare: true,
    })
    var shareUserId = that.data.loginUserId;
    return { title: '行程分享', path: "/pages/seat/seat?routeId=" + this.data.routeId + "&shareUserId=" + shareUserId }
  }
})