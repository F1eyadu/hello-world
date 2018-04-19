const app=getApp();
Page({
  data: {
  url:"",
  userId:"",
  orderId:""
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      url: app.globalData.url,
      userId: app.globalData.id,
      orderId:e.orderId
    })
    console.log(_this.data.userId);
    console.log(_this.data.orderId)
  },
  getUrl:function(){
    var _this = this;
    wx.setClipboardData({
      data: _this.data.url + 'rest/orders/order/wapPay/orderId-' + _this.data.orderId + '/userId-' + this.data.userId,
      success:function(res){
        wx.showModal({
          title: '提示',
          content: '复制成功',
          showCancel:false
        });
      }
    })
   
  }
})