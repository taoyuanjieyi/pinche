var userRequest = require('../../http/userRequest.js');
var login = require('../../http/login.js');
var commonUtil = require('../../common/common.js');

var bindInputList = [
  { name: "bindInput1", id: "0" },
  { name: "bindInput2", id: "1" },
  { name: "bindInput3", id: "2" },
  { name: "bindInput4", id: "3" },
  { name: "bindInput5", id: "4" }]

var pageObject = {
  data: {
    bindInputList: bindInputList,
    items: [],
    min: 5, //最少字数
    max: 200, //最多字数 
    body: "",
    isEdit: false,
    editIndex: null,
    submitBtnDisbled: true,
    addBtnShow: true,
    noDataHide: true,
    startX: 0, //开始坐标
    startY: 0,
  },
  radioChange(e) {
    this.setData({
      body: this.data.items[e.detail.value].body,
    })
    this.selectBack()
  }, 
  selectBack: function (e) {
    wx.setStorageSync("selectedRouteBody", this.data.body)
    wx.navigateBack();
  },
  onLoad: function (options) {
    for (var i = 0; i < this.data.items.length; i++) {
      this.data.items.push({
        //content: i + " 向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦",
        isTouchMove: false //默认全隐藏删除
      })
    }
    this.setData({
      items: this.data.items
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadPage();
  },
  loadPage: function () {
    var userInfo = commonUtil.getStorage("userInfo");
    if (userInfo === null || userInfo === "" || userInfo === undefined) {

    } else if (userInfo.quickRoute !== null && userInfo.quickRoute !== "" && userInfo.quickRoute !== undefined) {
      var quickRouteJson = JSON.parse(userInfo.quickRoute);
      var isHideAddBtn = false;
      if (quickRouteJson.length < 1) {
        isHideAddBtn = true
        this.setData({
          noDataHide: false,
          isEdit: false,
          editIndex: null
        })
      } else {
        isHideAddBtn = false
        this.setData({
          items: quickRouteJson,
          noDataHide: true,
          isEdit: false,
          editIndex: null
        })
      }
      if (this.data.items.length > 4) {
        isHideAddBtn = true;
      }
      this.setData({
        addBtnShow: isHideAddBtn,
      })
    } else {
      this.setData({
        noDataHide: false,
        addBtnShow: true,
      })
    }
  },
  openAddWindow: function () {
    //像数组中添加一个空对象
    var route = {};
    var length = this.data.items.length;
    route.name = '行程' + length;
    route.body = "";
    route.orderBy = length;
    route.isDefault = false;
    if (length < 1) {
      route.isDefault = true;
    }
    route.isDisplay = true;
    this.addRoute(route);
    this.setData({
      items: this.data.items,
      editIndex: length,
      isEdit: true,
      noDataHide: true,
      addBtnShow: true,
      currentWordNumber: 0,
      body: "",
    })
  },
  saveQuickRoute: function () {
    if (this.data.body === null || this.data.body === '' ||
      this.data.body === undefined) {
      wx.showToast({
        icon: 'none',
        title: '行程内容不能为空！'
      })
      return;
    }
    if (this.data.isEdit) {
      this.data.items[this.data.editIndex].body = this.data.body;
      console.info(this.data);
      this.submitQuickRoute();
    } else {
      var route = {};
      var length = this.data.items.length;
      route.name = '行程' + length;
      route.body = this.data.body;
      route.orderBy = length;
      route.isDefault = false;
      if (length < 1) {
        route.isDefault = true;
      }
      route.isDisplay = true;

      this.addRoute(route);
      this.submitQuickRoute();
    }

  },
  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  addRoute: function (route) {
    this.data.items.push(route);
    console.info("行程列表数据：", this.data.items);
  },
  submitQuickRoute: function () {
    var that = this;
    //删除空行
    if (!commonUtil.isBlank(this.data.items) && this.data.items.length > 0) {
      for (var i = 0; i < this.data.items.length; i++) {
        if (commonUtil.isBlank(this.data.items[i].body)) {
          this.data.items.splice(i, 1);
        }
      }
    }
    this.data.items.sort(this.compare("orderBy"));
    userRequest.updateQuickRoute({
      quickRouteJson: JSON.stringify(this.data.items)
    }).then((res) => {
      console.info("保存常用行程到服务器结果：", res)
      if (res.data.retCode === "need_login") {
        login.checkLogin(function () {
          that.submitQuickRoute();
        }, true)
      } else if (res.data.retCode === "success") {
        userRequest.queryUserInfo().then((res) => {
          this.loadPage();
        })
      } else {
        console.info("行程列表数据：", this.data.items);
      }
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  removeQuickRoute: function (e) {
    var that = this;
    wx.showModal({
      title: "删除常用行程提示",
      content: "确认删除该常用行程吗？",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          that.data.items.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            items: that.data.items
          })
          that.submitQuickRoute();
        }
      },
      fail: function (res) {
        console.info("打开删除确认提示框报错", res)
      }
    })
  }
}

for (var i = 0; i < bindInputList.length; i++) {
  (function (item) {
    pageObject['bind' + item.id] = function (e) {
      console.info("bind")
      // 获取输入框的内容
      var value = e.detail.value;
      // 获取输入框内容的长度
      var len = parseInt(value.length);

      //最多字数限制
      if (len > this.data.max) return;
      // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
      this.setData({
        currentWordNumber: len, //当前字数  
        body: value,
      });
    },
      pageObject['editClick' + item.id] = function (e) {
      console.info("editClick")
        var idx = e.currentTarget.dataset.index
        this.setData({
          body: this.data.items[idx].body,
          currentWordNumber: this.data.items[idx].body.length,
          isEdit: true,
          editIndex: idx,
          addBtnShow: false,
      })
      //删除空行
      if (!commonUtil.isBlank(this.data.items) && this.data.items.length > 0) {
        for (var i = 0; i < this.data.items.length; i++) {
          if (commonUtil.isBlank(this.data.items[i].body)) {
            this.data.items.splice(i, 1);
            this.setData({
              items: this.data.items
            })
          }
        }
      }
      },
      pageObject['saveClick' + item.id] = function (e) {
        this.saveQuickRoute()
      }
  })(bindInputList[i])
}
Page(pageObject)