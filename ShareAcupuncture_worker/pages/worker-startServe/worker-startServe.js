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
var timeDsq = ''
Page({
    data: {
        hiddenshow: "none",
        phoneNum: '',
        seconds: 0,
        time: '00:00:00',
    },
    onLoad: function (options) {
      var that = this;
      var orderId = options.orderId;
      var statusInfo = that.getorderInfo(orderId);
      timeDsq = setInterval(function(){
        var statusInfo = that.getorderInfo1(orderId);
        if (statusInfo == 8) {
          clearInterval(timeDsq);
          wx.redirectTo({
            url: '../worker-serving/worker-serving?orderId=' + orderId,
          })
        }
        if (statusInfo == 5 || statusInfo == 0) {
          that.setData({
            hiddenshow: "block"
          })
          clearInterval(timeDsq);
          setTimeout(function(){
            wx.reLaunch({
              url: '../index/index',
            })
          },2000)
        }
      },1000)
      if (statusInfo == 1) {
        ththatis.setData({
          hiddenshow: "block",
          hiddenWords: '您的订单已失效!'
        })
        clearInterval(timeDsq);
        setTimeout(function () {
          wx.reLaunch({
            url: '../index/index',
          })
        }, 2000)
      }
    },
    onUnload:function() {
      clearInterval(timeDsq);
    },
    getorderInfo: function (orderId) {
      var that = this;
      var nowTime = new Date().getTime();
      wx.request({
        url: url + '/api/order/' + orderId,
        method: "GET",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          var statusInfo = res.data.statusInfo;
          var payTime = res.data.paymentTime;
          var TimeDiffer = app.globalData.timeDiffer(payTime);
          that.setData({
            seconds: TimeDiffer
          })
          timing(that);
          var orderArr = [];
          var selfArr = [];
          var tuijianArr = [];
          orderArr.push(res.data);
          var serviceArr = orderArr[0].serviceInfo;
          for (var i = 0; i < serviceArr.length; i++) {
            if (serviceArr[i].service.subServices == null) {
              selfArr.push(serviceArr[i])
            } else {
              tuijianArr.push(serviceArr[i])
            }
          }
          if (selfArr == [] || selfArr.length == 0) {
            that.setData({
              selfShow: "none"
            })
          }
          if (tuijianArr == [] || tuijianArr.length == 0) {
            that.setData({
              tjShow: "none"
            })
          }
          that.setData({
            orderArr: orderArr,
            selfArr: selfArr,
            tuijianArr: tuijianArr,
            phone: res.data.contactPhone,
            statusInfo: statusInfo
          })
        }
      })
      return that.data.statusInfo
    },

    getorderInfo1: function (orderId) {
      var that = this;
      var nowTime = new Date().getTime();
      wx.request({
        url: url + '/api/order/' + orderId,
        method: "GET",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          var statusInfo = res.data.statusInfo;
          that.setData({
            statusInfo: statusInfo
          })
        }
      })
      return that.data.statusInfo;
    },
    phoneCall: function(){
      var that = this;
      wx.makePhoneCall({
        phoneNumber: that.data.phone,
      })
    }
})