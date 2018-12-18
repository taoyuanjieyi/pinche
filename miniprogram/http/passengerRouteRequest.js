var commonUtil = require('../common/common.js');

//加入行程信息接口
function joinRoute(joinData) {
  console.info("加入行程数据：", joinData)
  var session_id = commonUtil.getStorage("third_Session");
  console.info("joinRoute 当前会话ID:", session_id)
  return new Promise(function (resolve, reject) {
    wx.request({
      url: "https://www.i5365.cn/pinche/passenger/join",
      data: joinData,
      method: "POST",
      header: {
        'content-type': 'application/json',
        'sessionid': session_id
      },
      success: function (res) {
        console.info("passenger join result :", res)
        resolve(res);
      },
      fail: function (res) {
        console.log("passenger join fail : ", res);
      }
    });
  });
}


module.exports = {
  joinRoute: joinRoute
}