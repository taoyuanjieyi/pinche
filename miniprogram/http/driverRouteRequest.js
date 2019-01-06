var commonUtil = require('../common/common.js');
const app = getApp()
//发布行程信息接口
function publish(driverData) {
  console.info("发布行程数据：", driverData)
  var session_id = commonUtil.getStorage("third_Session");
  console.info("publish 当前会话ID:", session_id)
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.getServerAppUrl() + "/driver/publish",
      data: driverData,
      method: "POST",
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        console.info("driver publish result :", res)
        resolve(res);
      },
      fail: function (res) {
        console.log("driver publish fail : ", res);
      }
    });
  });
}


function search(searchData){
  console.info("查询行程数据：", searchData)
  var session_id = commonUtil.getStorage("third_Session");
  console.info("search 当前会话ID:", session_id)
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.getServerAppUrl() + "/driver/search",
      data: searchData,
      method: "POST",
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        console.info("行程数据查询结果：", searchData)
        resolve(res);
      },
      fail: function (res) {
        console.log("driver search fail : ", res);
      }
    });
  });
}

function queryRouteDetail(routeData) {
  console.info("查询行程详情数据：", routeData)
  var session_id = commonUtil.getStorage("third_Session");
  console.info("queryRouteDetail 当前会话ID:", session_id)
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.getServerAppUrl() + "/driver/queryDriverRoute",
      data: routeData,
      method: "GET",
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        console.info("queryRouteDetail 查询结果:", res)
        resolve(res);
      },
      fail: function (res) {
        console.log("queryRouteDetail fail : ", res);
      }
    });
  });
}

//取消行程信息接口
function cancel(driverData) {
  console.info("取消行程数据：", driverData)
  var session_id = commonUtil.getStorage("third_Session");
  console.info("cancel 当前会话ID:", session_id)
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.getServerAppUrl() + "/driver/cancel",
      data: driverData,
      method: "POST",
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        console.info("driver cancel result :", res)
        resolve(res);
      },
      fail: function (res) {
        console.log("driver cancel fail : ", res);
      }
    });
  });
}



module.exports = {
  search: search,
  publish: publish,
  queryRouteDetail: queryRouteDetail,
  cancel:cancel
}