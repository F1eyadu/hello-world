const app = getApp()
var times;
var huoqu = function(_this){
    _this.data.dishes=[];
    _this.data.otherDishes=[];
  wx.request({
    url: app.globalData.url + 'api/order/' + _this.data.orderId,
    method: 'GET',
    success: res => {
      console.log(res);
      if (res.data.ordersList.length>0){
        var diancai = res.data.ordersList[0].dishes;
        diancai.map(function (x) {
          _this.data.dishes.push(x)
        })
        var others = res.data.ordersList.slice(1, 9999)
        others.map(function (x) {
          if (x.user != null || x.submitTime != null) {
            x.dishes.map(function (dish) {
              _this.data.otherDishes.push(dish);
            })
          }
        })
        var total = res.data.total.toFixed(2);
        if (res.data.discount){
          _this.data.discount = res.data.discount.toFixed(2);
        }
        _this.setData({
          code: res.data.verifyCode,
          dishes: _this.data.dishes,
          sellerId: res.data.sellerId,
          otherDishes: _this.data.otherDishes,
          total: total,
          free: res.data.seatingFeeTotal,
          totalNum: res.data.numberOfMeals,
          discount: _this.data.discount,
          state:res.data.state
        })
        if (res.data.state ==3){
          wx.redirectTo({
            url: '../../pages/details/details?orderId=' + _this.data.orderId
          })
        }
      }else{
        _this.setData({
          dishes:_this.data.dishes,
          otherDishes:_this.data.otherDishes,
          total:""
        })
      }
    }
  })
}

Page({
  data: {
    code:"",
    url:"",
    userId: null,
    dishes: [],
    otherDishes: [],
    sellerId:null,
    orderId:null,
    total: "",
    free: "",
    totalNum: "",
    tableNum:"",
    discount:null,
    xiaoxi:"",
    state:"",
    hidden:true,
    tableType:"",
    stuta: true,
    alipay:true,
    wechat: false,
    payfor: false,
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      orderId: e.orderId,
      url: app.globalData.url,
      userId: app.globalData.id,
      sellerId: e.sellerId,
      tableNum: e.tableNum,
      tableType: e.tableType
    })
  },
  onShow:function(){
    var _this = this;
    huoqu(_this)
    times = setInterval(function () {
      huoqu(_this)
    }, 3000)
  },
  onHide: function () {
    clearInterval(times);
  },
  onUnload: function () {
    clearInterval(times);
  },
  jiacai:function(){
    var _this = this;
    if(_this.data.state==7){
      _this.setData({
        hidden:false,
        xiaoxi:"该订单已经处于付款中，不能在继续点菜了"
      })
      setTimeout(function(){
        _this.setData({
          hidden: true,
          xiaoxi: ""
        })
      },2000)
    }else{
      wx.removeStorage({
        key: _this.data.orderId,
        success: function (res) {
        }
      })
      wx.redirectTo({
        url: '../../pages/order/order?sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&code=' + _this.data.code + '&stutas=2' + '&orderId=' + _this.data.orderId + '&tableType=' + _this.data.tableType
      })
    }
  },
  payfor:function(){
    var _this = this;
    _this.setData({
      stuta:false
    })
  },
  wechat:function(){
    var _this = this;
    _this.setData({
      stuta: true,
      wechat: false
    })
    wx.request({
      url: app.globalData.url + 'rest/orders/order/pay/orderId-' + _this.data.orderId + '/userId-' + _this.data.userId,
      method: 'PUT',
      success: res => {
        var code = res.data.code;
        if (code == 500) {
          _this.setData({
            hidden: false,
            xiaoxi: res.data.msg
          })
          setTimeout(function () {
            _this.setData({
              hidden: true,
              xiaoxi: ""
            })
          }, 2000)
          return;
        }
        var data = JSON.parse(res.data.dataSource);
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': 'MD5',
          'paySign': data.paySign,
          success: function (res) {
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
              }
            })
          }
        })
      }
    })
  },
  alipay: function () {
    var _this = this;
    _this.setData({
      stuta: true,
      payfor: false,
      alipay: false
    })
  },
  closeMode: function () {
    var _this = this;
    _this.setData({
      stuta: true,
    })
  },
  checkPay: function () {
    var _this = this;
    wx.downloadFile({
      url: app.globalData.url + 'rest/orders/order/paymentTwoDimensionalCode/orderId-' + _this.data.orderId + '/userId-' + _this.data.userId,
      method: 'GET',
      success: function (res) {
        var path = res.tempFilePath
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: path,
            success(result) {
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
  },
  // confrimRe:function(){
  //   var _this = this;
  //   wx.request({
  //     url: app.globalData.url + 'rest/orders/order/pay/orderId-' + _this.data.orderId+'/userId-'+_this.data.userId,
  //     method:'PUT',
  //     success:res=>{
  //       var code = res.data.code;
  //       if(code==500){
  //         _this.setData({
  //           hidden: false,
  //           xiaoxi: res.data.msg
  //         })
  //         setTimeout(function () {
  //           _this.setData({
  //             hidden: true,
  //             xiaoxi: ""
  //           })
  //         }, 2000)
  //         return;
  //       }
  //       var data = JSON.parse(res.data.dataSource);
  //       wx.requestPayment({
  //         'timeStamp': data.timeStamp,
  //         'nonceStr': data.nonceStr,
  //         'package': data.package,
  //         'signType': 'MD5',
  //         'paySign': data.paySign,
  //         success: function (res) {
  //           wx.redirectTo({
  //             url: '../../pages/details/details?orderId=' + _this.data.orderId
  //           })
  //         },
  //         fail:function(res){
  //           wx.request({
  //             url: app.globalData.url + 'rest/orders/order/orderStateRollback/orderId-' + _this.data.orderId,
  //             method:"POST",
  //             header: { 'content-type': 'application/json'},
  //             success:function(res){
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // },
  // cancel:function(){
  //   this.setData({
  //     stuta: true
  //   })
  // }
})