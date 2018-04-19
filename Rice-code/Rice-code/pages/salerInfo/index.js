const app = getApp()
var times;
var getTime = function(_this){
  var date = new Date();
  var hours = date.getHours();
  if (hours<10){
    hours = '0' + hours;
  }
  var Minutes = date.getMinutes();
  if (Minutes<10){
    Minutes = '0' + Minutes;
  }
  times = hours + ":" + Minutes;
}
Page({
  data: {
    url:"",
    userId:"",
    sellerId:"",
    sellerInfo:"",
    hidden:true,
    latitude:"",
    longitude:"",
    orderStartTime:"",
    orderEndTime:"",
    sendOutStartTime:"",
    sendOutEndTime:"",
    orderState:false,
    sendState:false,
    hiddens:true
  },
  onLoad:function(e){
    var _this = this;
    _this.setData({
      url: app.globalData.url,
      userId: app.globalData.id,
      sellerId: e.sellerId
    })
    if (!app.globalData.id){
      app.huoqu();
    }
    getTime(_this);
    wx.request({
      url: _this.data.url + 'api/seller/' + _this.data.sellerId,
      method: 'GET',
      success: res => {
        console.log(res);
        _this.data.orderStartTime = res.data.orderStartTime.slice(0,5);
        _this.data.orderEndTime = res.data.orderEndTime.slice(0,5);
        _this.data.sendOutStartTime = res.data.sendOutStartTime.slice(0, 5);
        _this.data.sendOutEndTime = res.data.sendOutEndTime.slice(0, 5);

        var startTime = _this.data.orderStartTime.split(":")[0] + _this.data.orderStartTime.split(":")[1];
        var endTime = _this.data.orderEndTime.split(":")[0] + _this.data.orderEndTime.split(":")[1];
        var startTimes = _this.data.sendOutStartTime.split(":")[0] + _this.data.sendOutStartTime.split(":")[1];
        var endTimes = _this.data.sendOutEndTime.split(":")[0] + _this.data.sendOutEndTime.split(":")[1];
        var compTime = times.split(":")[0] + times.split(":")[1];
        if (startTime < compTime && compTime < endTime) {
          _this.data.orderState = true;
        }
        if (startTimes < compTime && compTime < endTimes) {
          _this.data.sendState = true;
        }
        _this.setData({
          orderState: _this.data.orderState,
          sendState: _this.data.sendState,
          orderStartTime: _this.data.orderStartTime,
          orderEndTime: _this.data.orderEndTime,
          sendOutStartTime: _this.data.sendOutStartTime,
          sendOutEndTime: _this.data.sendOutEndTime,
          sellerInfo: res.data,
        })
        if ((_this.data.sellerInfo.canOrder == false && _this.data.sellerInfo.canSendOut == false) || (_this.data.orderState == false && _this.data.sendState == false)){
          _this.setData({
            hiddens:false
          }),
          setTimeout(function(){
            _this.setData({
              hiddens: true
            })
          },3000)
        }
      }
    })
  },
  onShow:function(){
   this.setData({
     hidden:true
   }) 
  },
  callSaller:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.sellerInfo.tel,
    })
  },
  clickImage: function (e) {
    var that = this;
    var imgs = [];
    var current = e.target.dataset.src;
    var src = that.data.url + 'file/noThumbnail/seller-' + that.data.sellerId + '-' + current;
    console.log(that.data.sellerInfo)
    if (that.data.sellerInfo.images){
      that.data.sellerInfo.images.map(function(x){
        var srcs = that.data.url + 'file/noThumbnail/seller-' + that.data.sellerId + '-' + x;
        imgs.push(srcs);
      })
    }
    wx.previewImage({
      current: src,
      urls: imgs,
    })
  },
  position: function () {
    var _this = this;
    _this.setData({
      hidden: false,
      latitude: _this.data.sellerInfo.position[1],
      longitude: _this.data.sellerInfo.position[0],
    })
    wx.openLocation({
      latitude: _this.data.sellerInfo.position[1],
      longitude: _this.data.sellerInfo.position[0],
      name: _this.data.sellerInfo.name,
      address: _this.data.sellerInfo.address,
      scale: 28
    })
  },
  sellerOrder:function(){
    wx.navigateTo({
      url: '../../pages/orderInfo/index?sellerId=' + this.data.sellerId
    })
  },
  sellerSend:function(){
    wx.navigateTo({
      url: '../../pages/chooseFood/index?sellerId=' + this.data.sellerId
    })
  }
})