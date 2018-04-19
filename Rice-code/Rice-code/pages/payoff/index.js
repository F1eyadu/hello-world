const app = getApp()
Page({
  data: {
  url:"",
  userId: "",
  sellerId: "",
  orderId: "",
  addressId:"",
  userInfo:"",
  // order:"",
  dishes:[],
  headImg:"",
  sallerName:"",
  salerTel:"",
  sendOutFee:"",
  desc:"",
  hidden:true,
  xiaoxi:"",
  total:"",
  stuta:true,
  wechat:false,
  payfor:false,
  alipay:true
  },
  onLoad:function(e){
    var _this = this;
    _this.setData({
      url: app.globalData.url,
      userId: e.userId,
      sellerId: e.sellerId,
      orderId: e.orderId,
      addressId: e.addressId
    })
  },
  onShow:function(){
    var _this = this;
    wx.request({
      url: _this.data.url + 'api/order/' + _this.data.orderId,
      method: 'GET',
      success: res => {
        console.log(res);
        if (res.data.state == 3 || res.data.state == 9){
          wx.redirectTo({
            url: '../../pages/waitMeal/index?orderId=' + _this.data.orderId + '&sellerId=' + _this.data.sellerId
          })
        }
        _this.data.order = res.data.ordersList[0];
        _this.setData({
          userInfo: res.data.sendAddress,
          sendOutFee: res.data.distributionFee,
          total: res.data.total,
          dishes: res.data.ordersList[0].dishes,
          headImg: res.data.headIcon,
          sallerName: res.data.sellerName,
          desc: res.data.desc
        })
      }
    })
    wx.request({
      url: _this.data.url + 'api/seller/' + _this.data.sellerId,
      method: 'GET',
      success: res => {
        _this.setData({
          salerTel: res.data.tel,
        })
      }
    })
  },
  callSales:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.salerTel
    })
  },
  wechat:function(){
    var _this = this;
    _this.setData({
      stuta: true,
      wechat:false
    })
    wx.request({
      url: app.globalData.url + 'rest/orders/order/pay/orderId-' + _this.data.orderId + '/userId-' + _this.data.userId,
      method: 'PUT',
      success: res => {
        console.log(res);
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
            var prepay_id = data.package.split("=")[1];
          wx.removeStorage({
            key: _this.data.sellerId,
            success: function (res) {
            }
          })
          wx.request({
            url: app.globalData.url + '/rest/wxAccessToken?userId=' + _this.data.userId + '&payId=' + prepay_id,
            method:'POST',
            // data:{
            //   userId: _this.data.userId,
            //   payId: prepay_id
            // },
            header: {
              'content-type': 'application/json'
            },
            success:ops=>{
              wx.redirectTo({
                url: '../../pages/waitMeal/index?orderId=' + _this.data.orderId + '&sellerId=' + _this.data.sellerId
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
          }
        })
      }
    })
  },
  alipay:function(){
    var _this = this;
    _this.setData({
      stuta: true,
      payfor: false,
      alipay:false
    })
  },
  closeMode:function(){
    var _this = this;
    _this.setData({
      stuta: true,
    })
  },
  checkPay:function(){
    var _this = this;
    wx.downloadFile({
      url: app.globalData.url + 'rest/orders/order/paymentTwoDimensionalCode/orderId-' + _this.data.orderId + '/userId-' + _this.data.userId,
      method:'GET',
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
              wx.removeStorage({
                key: _this.data.sellerId,
                success: function (res) {
                }
              })
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
      fail:function(res){
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
  // radioChange:function(e){
  //   // var _this = this;
  //   // _this.setData({
  //   //   stuta: true
  //   // })
  //   if(e.detail.value =='weixin'){
      
  //   } else if (e.detail.value == 'zhifubao'){

  //   }
  // },
  // zhifubao: function () {
  //   var _this = this;
  //   wx.redirectTo({
  //     url: '../../pages/test/index?orderId=' + _this.data.orderId
  //   })
  // },
  payFor:function(){
    this.setData({
      stuta: false
    })
  },
})