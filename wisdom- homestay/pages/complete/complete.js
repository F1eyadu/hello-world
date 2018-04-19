const app=getApp();
var url;
var orderId;
function formatDateTime(inputTime) {//时间戳转换成时间
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
};
Page({
  data: {
    houseInfo: '',
    shuliang: "",
    price: "",
    user: "",
    startTime: "",
    endTime: "",
    houseImg: "",
    Url:""
  },
  onLoad: function (e) {
    var _this = this;
    orderId = e.orderId;
    url = app.globalData.url;
    _this.data.Url = app.globalData.url;
    _this.setData({
      Url: _this.data.Url
    })
    wx.request({
      url: url + "rest/orders/order/" + orderId,
      method: 'GET',
      success: function (res) {
        var imgs = res.data.house.housePhoto.split(",")[0];
        _this.setData({
          houseInfo: res.data.house,
          shuliang: res.data.tenant,
          price: res.data.balance,
          user: res.data.cardauthentications,
          startTime: formatDateTime(res.data.startTime).split(" ")[0],
          endTime: formatDateTime(res.data.endTime).split(" ")[0],
          houseImg: imgs
        })
      }
    })
  },
  Evaorder:function(){
    wx.navigateTo({
      url: '../evaluate/evaluate?orderId=' + orderId,
      success: function(res) {

      }
    })
  }
})