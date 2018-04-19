const app = getApp()
var orderId;
var url;
var prepay_id;
Page({
  data:{
    house:"",
    erweima:"",
    guideMap:"",
    stuta:true,
    Url:"",
    hidden:false
  },
  onLoad:function(e){
    console.log(e)
    var _this = this;
    _this.data.Url = app.globalData.url;
    _this.setData({
      Url: _this.data.Url
    })
    orderId = e.orderId;
    prepay_id = e.prepay_id;
    url = app.globalData.url;
   var int =  setInterval(function(){
      wx.request({
        url: url + "rest/orders/order/" + orderId,
        method: 'GET',
        success: function (res) {
          console.log(res)
          var data = res.data.house;
          if (res.data.state == 3) {
            // wx.request({
            //   url: url + "/rest/orders/OrderPushInformation/orderId-" + orderId + '/formId-' + prepay_id + '/state-0',
            //   method: 'GET',
            //   success: function (res) {
            //     console.log(res);
            //   }, fail: function (res) {
            //     console.log(res);
            //   }
            // })
            var img = res.data.house.bootstrapDiagram;
            if (img == null) {
              _this.data.stuta = false;
            }
            _this.setData({
              stuta: _this.data.stuta,
              erweima: res.data.housecode.code,
              guideMap: img,
              house: data,
              hidden: true
            })
            clearInterval(int);  
          }
        }
      })
    },5000)
  },
  indexGuide:function(){
    wx.reLaunch({
      url: '../index/index',
    })
  },
  checkErweima:function(){
    console.log(this.data.erweima)
    wx.navigateTo({
      url: '../erweima/erweima?url=' + this.data.erweima,
    })
  }
})