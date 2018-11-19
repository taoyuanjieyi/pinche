var Promise = require('./es6-promise.auto.min.js')

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
/**
 * 微信请求get方法
 * obj 请求数据主体
 */
function request(obj) {
  var getRequest = wxPromisify(wx.request)
  return getRequest(obj)
}

module.exports = {
  request: request,
  wxPromisify: wxPromisify
}