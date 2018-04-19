const app = getApp()
Page({
  data: {
    orderId:'',
    dishes:[],
    code:"",
    total:"",
    userNum:"",
    free:""
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      orderId: e.orderId
    })
    wx.removeStorage({
      key: _this.data.orderId,
      success: function (res) {
      }
    })
    wx.request({
      url: app.globalData.url + 'api/order/' + _this.data.orderId,
      method: 'GET',
      success:res=>{
        console.log(res);
        var list = res.data.ordersList;
        list.map(function(x){
          x.dishes.map(function(dish){
            _this.data.dishes.push(dish)
          })
        })
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
  returnIndex:function(){
    wx.reLaunch({
      url: '../../pages/index/index',
    })
  }
})