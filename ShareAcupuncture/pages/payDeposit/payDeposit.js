const app = getApp()
var url = app.globalData.url
function timing(timeshow) {//支付时间在3分钟内，超过三分钟将自动取消订单，回到首页
  var seconds = timeshow.data.seconds
  var errShow = timeshow.data.errShow
  var timess = setTimeout(function () {
    timeshow.setData({
        seconds: seconds + 1
    });
    timing(timeshow);
  }, 1000)
  if (seconds == 1800) {
    clearTimeout(timess)
    setTimeout(function() {
      timeshow.setData({
          errShow:"您的订单被自动取消！！"
      })
    },1000)
    setTimeout(function () {
      wx.redirectTo({
          url: '../index/index',
      })
    }, 1000)
  } 
}
var timedsq ='';
Page({
    data: {
      seconds: 0,
      errShow: "",
      dsqStatus:0,
      payDisplay:"none"
    },
    onLoad: function (options) {
        timing(this);
        var that = this;
        var time=0;
        var orderId = options.orderId;
        this.getMoney(orderId);
        this.setData({
          orderId: orderId
        })
        timedsq = setInterval(function(){
          var nowTime = new Date().getTime();
          var time = time+1;
          wx.request({
            url: url + '/api/order/' + orderId,
            header: { "Content-Type": "application/json" },
            success: function (res) {
              var acceptTime = res.data.acceptTime;
              var TimeDiffer = app.globalData.timeDiffer(acceptTime);
              if (TimeDiffer >=180) {
                if (res.data.statusInfo !=5) {
                  wx.request({
                    url: url + '/rest/orders/invalid/' + orderId,
                    data: {
                    },
                    method: "PUT",
                    header: {"Content-Type": "application/x-www-form-urlencoded" },
                    success:function(res) {
                      console.log(res)
                      clearInterval(timedsq);
                      if (res.data.code == "success") {
                        that.setData({
                          payDisplay: 'block'
                        })
                        setTimeout(function () {
                          that.setData({
                            payDisplay: 'none'
                          })
                          wx.redirectTo({
                            url: '../index/index',
                          })
                        }, 2000)
                      }
                    }
                  })
                }
              }
            }
          })
        },1000)
    },
    //-------------------点击支付时进行的操作(传一个订单id给下一个页面)
    payBtn: function() { 
      var orderId = this.data.orderId;
      wx.request({
        url: url + '/rest/orders/order/pay/' + orderId,
        method: "PUT",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          console.log(res)
          var data = JSON.parse(res.data.dataSource);
          wx.requestPayment({
            timeStamp: data.timeStamp,//当前的时间戳
            nonceStr: data.nonceStr,//随机字符串，长度为32个字符以下。
            'package': data.package,//统一下单接口返回的 prepay_id 参数值，
            signType: data.signType,//签名算法
            paySign: data.paySign,//签名
            success: function (sc) {
              console.log(res)
              wx.request({
                url: url + '/api/order/' + orderId,
                header: { "Content-Type": "application/json" },
                success: function (res) {
                  var status = res.data.statusInfo;
                  clearInterval(timedsq);
                  if (status == 6) {
                    wx.redirectTo({
                      url: '../waitService/waitService?orderId=' + orderId,
                    })
                  }
                }
              })  
            },
            fail: function (err) {
              console.log(err)
            }
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    },
    getMoney:function(orderId) {//获得需要支付的押金的金额
    var that =this
      wx.request({
        url: url + '/api/order/' + orderId,
        data:{},
        method: "GET",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          var tm = res.data.deposit;
          that.setData({
            totalMoney: tm
          })
        }
      })
    }
})