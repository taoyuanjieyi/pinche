function getStorage(storageKey){
  try {
    var value = wx.getStorageSync(storageKey)
    return value;
  } catch (e) {
    console.error(e);
  }
}

function isBlank(obj) {
  if (obj === null || obj === undefined){
    return true;
  }
  if (typeof obj === "string" && obj.trim() === ""){
    return true;
  }
  return false;
}


module.exports = {
  getStorage: getStorage,
  isBlank: isBlank
}