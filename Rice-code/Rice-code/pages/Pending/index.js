const app = getApp();
Page({
  data: {
    url: null,
    sellerId: null,
    tableNum: null,
    code: "",
    userId: null,
    orderId: null,
    dishes:[],
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      url: app.globalData.url,
      sellerId: e.sellerId,
      tableNum: e.tableNum,
      orderId: e.orderId,
      tableType: e.tableType,
    })
    wx.request({
      url: app.globalData.url + 'api/order/' + _this.data.orderId,
      method: 'GET',
      success:res=>{
        var diancai = res.data.ordersList[0].dishes;
        diancai.map(function (x) {
          _this.data.dishes.push(x)
        })
        _this.setData({
          code: res.data.verifyCode,
          dishes: _this.data.dishes
        })
      }
    })
  },
  payfor:function(){
    var _this = this;
    wx.redirectTo({
      url: '../../pages/order/order?sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&stutas=1' + '&orderId=' + _this.data.orderId + '&tableType=' + _this.data.tableType
    })
  }          
})