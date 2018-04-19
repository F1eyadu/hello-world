const app=getApp()
var times;
var huoqu = function(_this){
  _this.data.dishes = [];
  _this.data.otherDishes = [];
  wx.request({
    url: app.globalData.url + 'api/order/' + _this.data.orderId,
    method:'GET',
    success:res=>{
      console.log(res);
      if(res.data.state==11){
        wx.redirectTo({
          url: '../../pages/details/details?orderId=' + _this.data.orderId
        })
        return;
      };
      var dish = res.data.ordersList;
      dish.map(function(x){
        x.dishes.map(function(dish){
          if (dish.user.id == _this.data.userId){
            _this.data.dishes.push(dish);
          }else{
            _this.data.otherDishes.push(dish);
          }
        })
        if (res.data.total==null){
          _this.data.total = x.orderTotal;
        }else{
          _this.data.total = res.data.total;
        }
      })
      _this.setData({
        dishes: _this.data.dishes,
        otherDishes: _this.data.otherDishes,
        code: res.data.verifyCode,
        total: _this.data.total,
        discount: res.data.discount
      })
    }
  })
}
Page({
  data: {
    url:"",
    userId: null,
    code:"",
    dishes: [],
    otherDishes: [],
    total: "",
    orderId: null,
    userNum: "",
    sellerId:"",
    tableNum:"",
    stuta: true,
    free:"",
    wait:true,
    hiddens:true,
    NewMess:"",
    setFree:"",
    discount:null,
    tableType:"",
    stutas: true,
    wechat: false,
    payfor: false,
    alipay: true
  },
  onLoad:function(e){
    var _this = this;
    _this.setData({
      orderId: e.orderId,
      sellerId: e.sellerId,
      url: app.globalData.url,
      userId: app.globalData.id,
      tableNum: e.tableNum,
      tableType: e.tableType
    })
    wx.request({
      url: app.globalData.url + 'rest/seller/findByTableNumber/sellerId-' + _this.data.sellerId + '/tableNum-' + _this.data.tableNum,
      method: 'POST',
      data: {
        tableType: _this.data.tableType,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        _this.setData({
          setFree: res.data.seatingFee
        })
      }
    })
  },
  onShow:function(){
    var _this = this;
    huoqu(_this)
    times = setInterval(function () {
      huoqu(_this)
    }, 3000)
  },
  onHide:function(){
    clearInterval(times);
  },
  onUnload:function () {
    clearInterval(times);
  },
  inputNum: function (e) {
    var _this = this;
    var reg = /^[1-9]\d*$/;
    if (reg.test(e.detail.value) && e.detail.value > 0) {
      _this.setData({
        userNum: e.detail.value
      })
    } else {
      _this.setData({
        userNum: "",
        hiddens: false,
        NewMess: "请重新输入正确的人数"
      });
      setTimeout(function () {
        _this.setData({
          hiddens: true,
          NewMess: ""
        });
      }, 3000)
    }
  },
  payfor:function(){
    this.setData({
      stuta: false
    })
  },
  close: function () {
    this.setData({
      stuta: true
    })
  },
  closeMode: function () {
    var _this = this;
    _this.setData({
      stutas: true,
    })
  },
  wechat:function(){
    var _this = this;
    _this.setData({
      stutas: true,
      wechat: false
    })
    wx.request({
      url: app.globalData.url + 'rest/orders/order/OrderStartFood/userId-' + app.globalData.id + '/orderId-' + _this.data.orderId + '/numberOfMeals-' + _this.data.userNum,
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.request({
            url: app.globalData.url + 'rest/orders/order/pay/orderId-' + _this.data.orderId + '/userId-' + _this.data.userId,
            method: 'PUT',
            success: res => {
              var data = JSON.parse(res.data.dataSource);
              wx.requestPayment({
                'timeStamp': data.timeStamp,
                'nonceStr': data.nonceStr,
                'package': data.package,
                'signType': 'MD5',
                'paySign': data.paySign,
                success: function (res) {
                  wx.removeStorage({
                    key: _this.data.orderId,
                    success: function (res) {
                    }
                  })
                  wx.redirectTo({
                    url: '../../pages/details/details?orderId=' + _this.data.orderId
                  })
                },
                fail: function (res) {
                  wx.request({
                    url: app.globalData.url + 'rest/orders/order/orderStateRollback/orderId-' + _this.data.orderId,
                    method: "POST",
                    header: { 'content-type': 'application/json' },
                    success: function (res) {
                      _this.setData({
                        wait: true
                      })
                    }
                  })
                }
              })
            },
            fail: function (res) {
              wx.request({
                url: app.globalData.url + 'rest/orders/order/orderStateRollback/orderId-' + _this.data.orderId,
                method: "POST",
                header: { 'content-type': 'application/json' },
                success: function (res) {
                  _this.setData({
                    wait: true
                  })
                }
              })
            }
          })
        } else if (res.data.status == 500) {
          wx.request({
            url: app.globalData.url + 'rest/orders/order/orderStateRollback/orderId-' + _this.data.orderId,
            method: "POST",
            header: { 'content-type': 'application/json' },
            success: function (res) {
              _this.setData({
                wait: true
              })
            }
          })
        }
      }
    })
  },
  alipay:function(){
    var _this = this;
    _this.setData({
      stuta: true,
      payfor: false,
      alipay: false
    })
  },
  checkPay: function () {
    var _this = this;
    wx.request({
      url: app.globalData.url + 'rest/orders/order/OrderStartFood/userId-' + app.globalData.id + '/orderId-' + _this.data.orderId + '/numberOfMeals-' + _this.data.userNum,
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: res => {
        wx.downloadFile({
          url: app.globalData.url + 'rest/orders/order/paymentTwoDimensionalCode/orderId-' + _this.data.orderId + '/userId-' + _this.data.userId,
          method: 'GET',
          success: function (res) {
            var path = res.tempFilePath
            if (res.statusCode === 200) {
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success(result) {
                  wx.removeStorage({
                    key: _this.data.orderId,
                    success: function (res) {
                    }
                  })
                  wx.showModal({
                    title: '提示',
                    content: '保存成功,请打开支付宝支付',
                    showCancel: false,
                  });
                  _this.setData({
                    alipay: true,
                  })
                },
                fail: function (res) {
                  console.log(res);
                  wx.showModal({
                    title: '提示',
                    content: '保存失败',
                    showCancel: false,
                  });
                  _this.setData({
                    alipay: true,
                  })
                }
              })
            }
          },
          fail: function (res) {
            wx.showModal({
              title: '提示',
              content: '获取失败',
              showCancel: false,
            });
            _this.setData({
              alipay: true,
            })
          }
        })
      }
    })
  },
  confrim:function(){
    var _this = this;
    if (_this.data.userNum != ""){
      this.setData({
        wait: false,
        // stutas: false,
        stuta: true
      })
      wx.request({
        url: app.globalData.url + 'rest/orders/order/OrderStartFood/userId-' + app.globalData.id + '/orderId-' + _this.data.orderId + '/numberOfMeals-' + _this.data.userNum,
        method: 'POST',
        header: { 'content-type': 'application/json' },
        success: res => {
          console.log(res);
          if (res.data.code == 200) {
            wx.request({
              url: app.globalData.url + 'rest/orders/order/pay/orderId-' + _this.data.orderId + '/userId-' + _this.data.userId,
              method: 'PUT',
              success: res => {
                var data = JSON.parse(res.data.dataSource);
                wx.requestPayment({
                  'timeStamp': data.timeStamp,
                  'nonceStr': data.nonceStr,
                  'package': data.package,
                  'signType': 'MD5',
                  'paySign': data.paySign,
                  success: function (res) {
                    wx.removeStorage({
                      key: _this.data.orderId,
                      success: function (res) {
                      }
                    })
                    wx.redirectTo({
                      url: '../../pages/details/details?orderId=' + _this.data.orderId
                    })
                  },
                  fail: function (res) {
                    wx.request({
                      url: app.globalData.url + 'rest/orders/order/orderStateRollback/orderId-' + _this.data.orderId,
                      method: "POST",
                      header: { 'content-type': 'application/json' },
                      success: function (res) {
                        _this.setData({
                          wait: true
                        })
                      }
                    })
                  }
                })
              },
              fail: function (res) {
                wx.request({
                  url: app.globalData.url + 'rest/orders/order/orderStateRollback/orderId-' + _this.data.orderId,
                  method: "POST",
                  header: { 'content-type': 'application/json' },
                  success: function (res) {
                    _this.setData({
                      wait: true
                    })
                  }
                })
              }
            })
          } else if (res.data.status == 500) {
            wx.request({
              url: app.globalData.url + 'rest/orders/order/orderStateRollback/orderId-' + _this.data.orderId,
              method: "POST",
              header: { 'content-type': 'application/json' },
              success: function (res) {
                _this.setData({
                  wait: true
                })
              }
            })
          }
        }
      })
    }else{
      _this.setData({
        userNum: "",
        hiddens: false,
        wait: true,
        NewMess: "请重新输入正确的人数"
      });
      setTimeout(function () {
        _this.setData({
          hiddens: true,
          NewMess: ""
        });
      }, 3000)
    }
  }
})