const app = getApp();
var url = app.globalData.url;
function timing(that) {
    var seconds = that.data.seconds;
    setTimeout(function () {
        that.setData({
            seconds: seconds + 1
        });
        timing(that);
    }
    , 1000)
    formatSeconds(that)
}
function formatSeconds(that) {
    var mins = 0, hours = 0, seconds = that.data.seconds, time = ''
    if (seconds < 60) {

    } else if (seconds < 3600) {
        mins = parseInt(seconds / 60)
        seconds = seconds % 60
    } else {
        mins = parseInt(seconds / 60)
        seconds = seconds % 60
        hours = parseInt(mins / 60)
        mins = mins % 60
    }
    that.setData({
        time: formatTime(hours) + ':' + formatTime(mins) + ':' + formatTime(seconds)
    });
}
function formatTime(num) {
    if (num < 10)
      return '0' + num
    else
      return num + ''
}
Page({
    data: {
        timeBoxHeight: 146,
        displayStatus: "none",
        hidden: true,
        seconds: 0,
        time: '00:00:00',
        orderArr:[],
        tuijianDisplay:'none',
        selfDisplay:'none'
    },
    onLoad: function (options) {
      var nowTime = new Date().getTime();
      var that = this;
      var orderId = options.orderId;
      var payTime = this.getOrderInfo(orderId);
       this.setData({
         orderId: orderId,
       })
       wx.request({
         url: url + '/api/order/' + orderId,
         data: {},
         method: "GET",
         header: { "Content-Type": "application/json" },
         success: function (res) {
           var payTime = res.data.paymentTime;
           var TimeDiffer = app.globalData.timeDiffer(payTime);
           that.setData({
             seconds: TimeDiffer
           })
           timing(that);
         }
       })
    },
    warning: function() {
      this.setData({
        timeBoxHeight: 336,
        displayStatus: "block"
      })
    },
    beginDO: function() {//请求将status从等待服务修改成正在服务，需要传一个订单的id
      var orderId = this.data.orderId;
      wx.request({
        url: url + '/api/order/' + orderId,
        data: {},
        method: "GET",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          if (res.data.statusInfo ==6) {
            wx.request({
              url: url + '/rest/orders/user/service/start/' + orderId,
              data: {
              },
              method: "PUT",
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              success: function (res) {
                wx.redirectTo({
                  url: '../going-Service/going-Service?orderId=' + orderId,
                })
              }
            })
          }
        }
      })
    },
    cancelOrder:function() {
      this.setData({
          hidden: false
      })
    },
    cancel:function() {
      this.setData({
          hidden: true
      });
    },
    confirm: function () {
      var orderId = this.data.orderId;
      wx.request({
        url: url + '/api/order/' + orderId,
        data: {},
        method: "GET",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          if (res.data.statusInfo == 6) {
            wx.request({
              url: url + '/rest/orders/cancel/' + orderId,
              data: {
              },
              method: "PUT",
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              success: function (res) {
                wx.reLaunch({
                  url: '../index/index',
                })
                }
              })
            }
          }
      }) 
    },
    telCall: function (e) {//打电话
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel 
      })
    },
    warningUp: function () {
      this.setData({
          timeBoxHeight: 146,
          displayStatus: "none"
      })
    },
    getOrderInfo:function(orderId) {
      var that = this;
      wx.request({
        url: url + '/api/order/' + orderId,
        data: {},
        method: "GET",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          var orderInfo = res.data;
          that.setData({
            orderInfo: orderInfo
          })
          var os = orderInfo.serviceInfo;
          var selfArr = [];
          var tuijianArr = [];
          for (var i = 0; i < os.length; i++) {
            if (os[i].service.subServices == null) {
              selfArr.push(os[i])
            } else {
              tuijianArr.push(os[i])
            }
          }
          if (orderInfo.doctor.phone == null) {
            orderInfo.doctor.phone =''
          }
          if (selfArr.length != 0) {
            that.setData({
              selfDisplay: "block"
            })
          }
          if (tuijianArr.length != 0) {
            that.setData({
              tuijianDisplay: "block"
            })
          }
          that.setData({
            selfArr: selfArr,
            tuijianArr: tuijianArr,
            payTime: res.data.paymentTime
          })
        }
      })
    }
})