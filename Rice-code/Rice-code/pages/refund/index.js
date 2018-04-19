const app = getApp()
Page({
  data: {
    orderId: '',
    userId:'',
    dishes: [],
    code: "",
    total: "",
    userNum: "",
    free: "",
    stuta:true,
    reason:"",
    show:false,
    hidden:true,
    payment:""
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      orderId: e.orderId,
      userId: e.userId
    })
    wx.request({
      url: app.globalData.url + 'api/order/' + this.data.orderId,
      method: 'GET',
      success: res => {
        console.log(res);
        var list = res.data.ordersList;
        list.map(function (x) {
          x.dishes.map(function (dish) {
            _this.data.dishes.push(dish)
          })
        })
        
        if (res.data.payUser!=null){
          if (res.data.state == 3) {
            if (_this.data.userId == res.data.payUser.id) {
              _this.setData({
                show: false
              })
            } else {
              _this.setData({
                show: true
              })
            }
          }else{
            _this.setData({
              show: true
            })
          }
        }else{
          _this.setData({
            show: true
          })
        }
        _this.setData({
          dishes: _this.data.dishes,
          code: res.data.verifyCode,
          userNum: res.data.numberOfMeals,
          total: res.data.total,
          free: res.data.seatingFeeTotal,
          code: res.data.verifyCode,
          payment: res.data.payment,
        })
      }
    })
  },
  reason:function(e){
    this.setData({
      reason: e.detail.value
    })
  },
  returnIndex: function () {
    this.setData({
      stuta:false
    })
  },
  cancel:function(){
    this.setData({
      stuta: true
    })
  },
  confrimRe:function(){
    var _this = this;
    wx.request({
      // url: app.globalData.url + 'rest/orders/order/pay/applicationRefund/orderId-' + _this.data.orderId + '/userId-' + _this.data.userId + '/desc-' + _this.data.reason,
      url: app.globalData.url + 'rest/orders/order/pay/applicationRefund/orderId-' + _this.data.orderId,
      method:'PUT',
      data:{
      'userId': _this.data.userId,
      'desc': _this.data.reason
      },
      header: {'content-type': 'application/x-www-form-urlencoded'},
      success:res=>{
        console.log(res);
        if(res.data.code ==200){
          _this.setData({
            stuta: true,
            show:true,
            hidden:false
          })
          setTimeout(function(){
            _this.setData({
              hidden: true
            })
            wx.redirectTo({
              url: '../../pages/orders/index'
            })
          }, 2000)
        }
      }
    })
  }
})