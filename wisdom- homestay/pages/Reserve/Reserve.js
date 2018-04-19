const app = getApp()
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
    houseInfo:'',
    shuliang:"",
    price:"",
    user:"",
    startTime:"",
    endTime:"",
    houseImg:"",
    Url:""
  },
  onLoad:function(e){
    var _this  =this;
    url = app.globalData.url;
    orderId = e.orderId;
    _this.data.Url = app.globalData.url;
    _this.setData({
      Url: _this.data.Url
    })
    wx.request({
      url: url + "rest/orders/order/" + orderId,
      method:'GET',
      success:function(res){
        console.log(res)
        var imgs = res.data.house.housePhoto.split(",")[0];
        _this.setData({
          houseInfo : res.data.house,
          shuliang : res.data.tenant,
          price : res.data.balance,
          user : res.data.cardauthentications,
          startTime : formatDateTime(res.data.startTime).split(" ")[0],
          endTime : formatDateTime(res.data.endTime).split(" ")[0],
          houseImg: imgs
        })
      }
    })
  },
  addOrder:function(){
    console.log(orderId)
    wx.request({
      url: url + "rest/orders/order/pay/" + orderId,
      // url: "http://10.10.10.110:8080/rest/pay_chatTest/orderid-5a430e6bbf7ecf142c2eac55/openid-oB5D40EVIDYxTS2xPvEd04xh4pl0/feel-400",
      method: 'PUT',
      success:function(res){
        console.log(res);
        if(res.statusCode == 200){
          var data = JSON.parse(res.data.dataSource);
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': 'MD5',
            'paySign': data.paySign,
            success: function (res) {
              var prepay_id = data.package.split("=")[1];
              wx.navigateTo({
                url: '../payment/payment?orderId=' + orderId + '&prepay_id=' + prepay_id,
                success: function (res) {
                  console.log("111");
                }
              })
            },fail:function(res){
              console.log(res);
            }
            // fail:function(fail){
            //   wx.request({
            //     url: url + "rest/orders/fialPay/" + orderId, 
            //     method:'PUT',
            //     success:function(res){
            //       wx.navigateTo({
            //         url: '../payment/payment?orderId=' + orderId,
            //         success:function(res){
            //           console.log("111");
            //         }
            //       })
            //     }
            //   })
            // }
          })
        }
      }
    })
  }
})