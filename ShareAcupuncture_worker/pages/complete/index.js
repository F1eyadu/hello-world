const app = getApp();
function formatDateTime(inputTime) {
  if (inputTime){
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }
};


Page({

  data: {
    orderId:0,
    url: app.globalData.url,
    orderInfo:{},
    hiddenMap:true,
    longitude:0,
    latitude:0
  },
  onLoad: function (e) {//点击进入加载数据
    var _this = this;
    _this.setData({
      orderId: e.orderId
    })
    wx.request({
      url: _this.data.url + '/rest/doctor/orders/complete/list/' + app.globalData.userInfo.id,
      method:'GET',
      success:res=>{
        var data = res.data.content;
        data.map(function(x){
          if (x.id == _this.data.orderId){
            x.completeTime = (parseInt(x.completeServiceTime - x.startServiceTime) / 1000 / 60).toFixed(1);
            x.startServiceTime = formatDateTime(x.startServiceTime);
            x.completeServiceTime = formatDateTime(x.completeServiceTime);
            x.cancelTime = formatDateTime(x.cancelTime);
            x.createTime = formatDateTime(x.createTime + 180000);
            wx.request({
              url: _this.data.url + '/rest/user/orders/comment/' + x.user.id,
              method: 'GET',
              success: res => {
                x.comment = res.data;
                _this.setData({
                  orderInfo: x
                })
                console.log(_this.data.orderInfo)
              }
            })
          }
        })
      }
    })
  },
  onShow:function(){
    var _this = this;
    _this.setData({
      hiddenMap: true
    })
  },
  contactUser:function(){//联系用户
    var tel = this.data.orderInfo.contactPhone;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  checkAdd:function(){
    var _this = this;
    _this.setData({
      hiddenMap: false,
      latitude: _this.data.orderInfo.currentLocation[1],
      longitude: _this.data.orderInfo.currentLocation[0],
    })
    wx.openLocation({
      latitude: Number(_this.data.orderInfo.currentLocation[1]),
      longitude: Number(_this.data.orderInfo.currentLocation[0]),
      address: _this.data.orderInfo.serviceAddress,
      scale: 28
    })
  }
})