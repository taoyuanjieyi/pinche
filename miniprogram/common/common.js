function getStorage(storageKey){
  try {
    var value = wx.getStorageSync(storageKey)
    return value;
  } catch (e) {
    console.error(e);
  }
}


module.exports = {
  getStorage: getStorage
}