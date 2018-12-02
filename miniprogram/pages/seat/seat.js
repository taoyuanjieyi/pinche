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
      routeId: this.data.routeId,
    }).then((res) => {
      if (res.retCode === "need_login") {
        userRequest.onLogin();
        return;
      }
      console.log('[数据库] [查询记录] 成功: ', res)
      
    })
  },
})