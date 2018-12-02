var driverRequest = require('../../http/driverRouteRequest.js');

Page({
  data: {
    routeId:"",
    seatArray: ['1', '2'],
    objectseatArray: [
      {
        id: 0,
        name: '1'
      },
      {
        id: 1,
        name: '2'
      }
    ],
    seatArrayIndex: 0
  },
  onLoad: function (options){
    this.setData({
      routeId: options.routeId
    })
    this.queryRouteDetail()
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      seatArrayIndex: e.detail.value
    })
  },
  queryRouteDetail: function () {

    driverRequest.queryRouteDetail({
      driverRouteId: this.data.routeId,
    }).then((res) => {
      console.log('[数据库] [查询记录] 成功: ', res)
      if (res.retCode === "need_login") {
        userRequest.onLogin();
        return;
      }
      if(res.retCode==='success'){
        this.setData({
          driverNickName: res.driverRoute.nickName,
          driverAvatarUrl: res.driverRoute.avatarUrl,
          driverMobile: res.driverRoute.mobile,
          driverVacancy: res.driverRoute.vacancy,
          driverPassPoint: res.driverRoute.passPoint,
          joinRouteUserList: res.joinRouteUserList
        })
      }
      
    })
  },
})