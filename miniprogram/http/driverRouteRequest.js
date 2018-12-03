var commonUtil = require('../common/common.js');

//发布行程信息接口
function publish(driverData) {
  console.info("发布行程数据：", driverData)
  var session_id = commonUtil.getStorage("third_Session");
  console.info("publish 当前会话ID:", session_id)
  return new Promise(function (resolve, reject) {
    wx.request({
      url: "http://39.106.5.219/pinche/driver/publish",
      data: driverData,
      method: "POST",
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        console.info("driver publish result :", res.data)
        resolve(res.data);
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
      url: "http://39.106.5.219/pinche/driver/search",
      data: searchData,
      method: "POST",
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        resolve(res.data);
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
  console.info("publish 当前会话ID:", session_id)
  return new Promise(function (resolve, reject) {
    wx.request({
      url: "http://39.106.5.219/pinche/driver/queryDriverRoute",
      data: routeData,
      method: "GET",
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        resolve(res.data);
      },
      fail: function (res) {
        console.log("driver search fail : ", res);
      }
    });
  });
}



module.exports = {
  search: search,
  publish: publish,
  queryRouteDetail: queryRouteDetail
}