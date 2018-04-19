const app = getApp()
var url;
var orderId;
var code;
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
    showModal: false,
    stuta:"",
    houseInfo: '',
    shuliang: "",
    price: "",
    user: "",
    startTime: "",
    endTime: "",
    houseImg: "",
    hidden:false,
    message:"",
    Url:"",
    hiddens: true,
    latitude: null,
    longitude: null
  },
  onLoad:function(e){
    var _this = this;
    orderId = e.orderId;
    url = app.globalData.url;
    _this.data.Url = app.globalData.url;
    _this.setData({
      Url: _this.data.Url
    })
  },
  onShow:function(){
    var _this = this;
    wx.request({
      url: url + "rest/orders/order/" + orderId,
      method: 'GET',
      success: function (res) {
        code = res.data.housecode.code;
        var imgs = res.data.house.housePhoto.split(",")[0];
        _this.setData({
          houseInfo: res.data.house,
          shuliang: res.data.tenant,
          price: res.data.balance,
          user: res.data.cardauthentications,
          startTime: formatDateTime(res.data.startTime).split(" ")[0],
          endTime: formatDateTime(res.data.endTime).split(" ")[0],
          houseImg: imgs,
          hiddens: true
        })
      }
    })
  },
  cancelOrder:function(e){
    this.setData({
      showModal: true
    })
  },
  /**
     * 弹出框蒙层截断touchmove事件
     */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function (e){
    var _this = this;
    var formId= e.detail.formId;
    wx.request({
      url: url + "rest/orders/order/cancel/" + orderId,
      method:'PUT',
      success:function(res){
        console.log(res)
        if (res.data.code == "fail" || res.data.status == 500 || res.data.code == 500) {
          _this.setData({
            showModal: false,
            stuta: 2,
            hidden: false,
            message:'请联系商家进行退款'
          })
          setTimeout(function () {
            _this.setData({
              stuta: 3
            })
          }, 5000)
        }
        if (res.data.code == "success") {
          // wx.request({
          //   url: url + "/rest/orders/OrderPushInformation/orderId-" + orderId + '/formId-' + formId + '/state-1',
          //   method: 'GET',
          //   success: function (res) {
          //     console.log(res);
          //   }, fail: function (res) {
          //     console.log(res);
          //   }
          // })
          _this.setData({
            showModal: false,
            stuta: 1,
            hidden: true
          })
          setTimeout(function () {
            _this.setData({
              stuta: 3
            })
          }, 3000)
        }
      }
    })
  },
  checkKey:function(){
    wx.navigateTo({
      url: '../erweima/erweima?url=' + code,
    })
  },
  map: function () {
    this.setData({
      hiddens: false,
      latitude: this.data.houseInfo.location[1],
      longitude: this.data.houseInfo.location[0],
    })
    wx.openLocation({
      latitude: this.data.houseInfo.location[1],
      longitude: this.data.houseInfo.location[0],
      name: this.data.houseInfo.houseName,
      address: this.data.houseInfo.houseAddress,
      scale: 28
    })
  }
})