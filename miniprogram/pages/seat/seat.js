var driverRequest = require('../../http/driverRouteRequest.js');
var passengerRequest = require('../../http/passengerRouteRequest.js');

Page({
  data: {
    routeId:"",
    seatArray: [],
    seatArrayIndex: 0,
    okHidden:true,
    waitingHidden:false
  },
  onLoad: function (options){
    this.setData({
      routeId: options.routeId,
      waitingHidden: false
    })
    this.queryRouteDetail()
  },
  cancelButton: function (e) {
    this.setData({
      okHidden: true
    })
  },
  okButton: function (e) {
    passengerRequest.joinRoute({
      routeId: this.data.routeId,
      seats: this.data.seatArray[this.data.seatArrayIndex]
    }).then((res) => {
      console.log('[数据库] [查询记录] 成功: ', res)
      if (res.retCode === "need_login") {
        userRequest.onLogin();
        return;
      }
      if (res.retCode === 'success') {
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
          title: '预定失败，请重新试试，或去提个建议反馈一下！'
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
      console.log('[数据库] [查询记录] 成功: ', res)
      if (res.retCode === "need_login") {
        userRequest.onLogin();
        return;
      }
      if(res.retCode==='success'){
        let seats = [];
        if (res.driverRoute!==null){
          
          if(res.driverRoute.vacancy<1){
            this.setData({
              waitingHidden: true
            })
          }
          for (let i = 0; i < res.driverRoute.vacancy;i++){
            seats[i] = i+1;
          }

          that.setData({
            driverNickName: res.driverRoute.nickName,
            driverAvatarUrl: res.driverRoute.avatarUrl,
            driverMobile: res.driverRoute.mobile,
            driverVacancy: res.driverRoute.vacancy,
            driverPassPoint: res.driverRoute.passPoint,
            joinRouteUserList: res.joinRouteUserList,
            seatArray: seats
          })
        }

      }
      
    })
  },
})