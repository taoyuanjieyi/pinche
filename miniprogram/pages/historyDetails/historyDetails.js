var driverRequest = require('../../http/driverRouteRequest.js');
var commonUtil = require('../../common/common.js');
var login = require('../../http/login.js');
var dateUtil = require('../../utils/dateUtil.js');


Page({
  data: {
    routeId: "",
  },
  onLoad: function (options) {
    var that = this
    console.info("进入行程页面，页面参数为：", options)
    this.setData({
      routeId: options.routeId,
    })
    that.queryRouteDetail()
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
          that.setData({
            driverMobile: res.data.driverRoute.mobile,
            carInfo: res.data.driverRoute.carInfo,
            driverNickName: res.data.driverRoute.nickName,
            driverAvatarUrl: res.data.driverRoute.avatarUrl,
            driverVacancy: res.data.driverRoute.vacancy,
            driverPassPoint: res.data.driverRoute.passPoint,
            joinRouteUserList: res.data.joinRouteUserList,
            driverRouteId: res.data.driverRoute.routeId,
            price: res.data.driverRoute.price,
          })
        }

      }

    })
  },
  callTelephone: function (e) {
    var mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile,
    })
  },
})