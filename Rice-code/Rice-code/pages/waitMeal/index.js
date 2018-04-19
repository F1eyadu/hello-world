const app=getApp()
var times;
var getRead = function(_this){
  wx.request({
    url: _this.data.url + 'rest/orders/order/orderUserRead/orderId-' + _this.data.orderId,
    method:'GET',
    success:res=>{
      console.log(res);
    }
  })
}
var getInfo = function(_this){
  wx.request({
    url: _this.data.url + 'api/order/' + _this.data.orderId,
    method: 'GET',
    success:res=>{
       console.log(res);
      _this.setData({
        infos: res.data,
        dishes: res.data.ordersList,
        sendAddress: res.data.sendAddress
      })
      if (res.data.state == 9 && res.data.isRead==false){
          // clearInterval(times);
          _this.setData({
            read: true,
            message: "商家接受了你的订单",
            show: false
          }),
          setTimeout(function(){
            _this.setData({
              message: "",
              show: true
            })
          },2000)
          getRead(_this);
      } else if (res.data.state == 8 && res.data.isRead == false){
        // clearInterval(times);
        _this.setData({
          hidden:true,
          message: "商家拒绝了你的订单",
          show: false
        })
        setTimeout(function () {
          _this.setData({
            message: "",
            show: true
          })
        }, 2000)
        getRead(_this);
      } else if (res.data.state == 9 && res.data.read == true){
        _this.setData({
          read: true
        })
        // clearInterval(times)
      } else if (res.data.state == 10){
         clearInterval(times)
        _this.setData({
          hidden: true,
          message: "商家已确认送达",
          show: false
        })
        setTimeout(function () {
          _this.setData({
            message: "",
            show: true
          })
        }, 2000)
      }
    }
  })
}
Page({
  data: {
    stuta:true,
    url:"",
    orderId:"",
    infos:"",
    dishes:"",
    sendAddress:"",
    hidden:false,
    read:false,
    reason:"",
    message:"",
    show:true,
    salerTel:"",
    sellerId:""
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      url: app.globalData.url,
      orderId: e.orderId,
      sellerId: e.sellerId
    })
    wx.removeStorage({
      key: _this.data.sellerId,
      success: function (res) {
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
  onShow:function(){
    var _this = this;
    getInfo(_this)
    times = setInterval(function(){
      getInfo(_this)
    },3000)
  },
  onHide:function(){
    clearInterval(times)
  },
  onUnload:function(){
    clearInterval(times)
  },
  callSales: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.salerTel
    })
  },
  confrim:function(){
    var _this = this;
    wx.request({
      url: _this.data.url + 'rest/orders/order/confirmDelivery/orderId-' + _this.data.orderId,
      method:'POST',
      success:res=>{
        console.log(res);
        if(res.data.code == 200){
          _this.setData({
            hidden:true,
            message: res.data.msg,
            show: false
          })
          setTimeout(function () {
            _this.setData({
              message: "",
              show: true
            })
          }, 2000)
        } else if (res.data.code == 500){
          _this.setData({
            message: res.data.msg,
            show: false
          })
          setTimeout(function () {
            _this.setData({
              message: "",
              show: true
            })
          }, 2000)
        }
      }
    })
  },
  refund:function(){
    this.setData({
      stuta: false
    })
  },
  cancel:function(){
    this.setData({
      stuta: true
    })
  },
  reason:function(e){
    this.setData({
      reason: e.detail.value
    })
  },
  confrimRe:function(){
    var _this = this;
    wx.request({
      url: _this.data.url + 'rest/orders/order/pay/applicationRefund/orderId-' + _this.data.orderId,
      method: 'PUT',
      data:{
        userId: app.globalData.id,
        desc: _this.data.reason
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        console.log(res);
        if(res.data.code==200){
          if(res.data.msg=='success'){
            _this.setData({
              stuta: true,
              hidden: true,
              message:'退款成功',
              show: false
            })
            setTimeout(function () {
              _this.setData({
                message: "",
                show: true
              })
            }, 2000)
          } else if (res.data.msg == 'fail' ){
            _this.setData({
              // stuta: true,
              // hidden: true,
              message: '退款失败，网络错误',
              show: false
            })
            setTimeout(function () {
              _this.setData({
                message: "",
                show: true
              })
            }, 2000)
          }else{
            _this.setData({
              stuta: true,
              hidden: true,
              message: res.data.msg,
              show: false
            })
            setTimeout(function () {
              _this.setData({
                message: "",
                show: true
              })
            }, 2000)
          }
        } else if (res.data.code == 500){
          _this.setData({
            message: res.data.msg ,
            show: false
          })
          setTimeout(function () {
            _this.setData({
              message: "",
              show: true
            })
          }, 2000)
        }
      }
    })
  },
  returnIndex:function(){
    wx.reLaunch({
      url: '../../pages/index/index'
    })
  }
})