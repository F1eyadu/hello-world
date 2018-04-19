const app = getApp();
var url = app.globalData.url;
function timing(that) {
    var seconds = that.data.seconds;
    if (seconds ==180) {
      var timeover = 1
    }
    setTimeout(function () {
        that.setData({
            seconds: seconds + 1
        });
        timing(that);
    }, 1000)
    formatSeconds(that)
}
function countDown(time) {
    if(time<10) {
      var yy = setTimeout(function() {
       var t1 =  time+1
       countDown(t1)
      },1000)
    }else{
    clearTimeout(yy);
  }
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
var timejsq= ''
Page({
    data: {
        timeBoxHeight: 146,
        displayStatus: "none",
        acceptDisplay:true,//工作者接受
        acceptStatus:0,
        hiddenshow: true,
        seconds: 0,
        time: '00:00:00',
        cost: 0,
        tuijianDisplay:"none",
        selfDisplay:"none",
        quxiaoDisplay:true,
        waitTime:0,
    },
    onLoad: function (options) {
      var orderId = options.orderId;
      var that = this;
      that.getOrderInfo(orderId);
      this.setData({
        orderId: orderId
      })
      wx.request({
        url: url + '/api/order/' + orderId,
        method: "GET",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          var status = res.data.statusInfo;
          if (status == 1) {
            that.setData({
              quxiaoDisplay: false
            })
            setTimeout(function () {
              that.setData({
                quxiaoDisplay: true,
              })
              wx.reLaunch({
                url: '../index/index',
              })
            }, 2000)
          }
          var createTime = res.data.createTime;
          var TimeDiffer = app.globalData.timeDiffer(createTime);
          that.setData({
            seconds: TimeDiffer
          })
          timing(that);
        }
      })
      var waitTime = that.data.seconds;
      var that = this;
      var orderId = that.data.orderId;
      timejsq = setInterval(function () {
        wx.request({
          url: url + '/api/order/' + orderId,
          method: "GET",
          header: { "Content-Type": "application/json" },
          success: function (res) {
            var createTime = res.data.createTime;
            var waitTime = app.globalData.timeDiffer(createTime);
            if (waitTime < 180) {
              if (res.statusCode == 200) {
                var orderStatus = res.data.statusInfo;
                var rej = res.data.rejectInfo;
                if (orderStatus == 3) {
                  clearInterval(timejsq);
                  that.setData({
                    acceptDisplay: false
                  })
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../payDeposit/payDeposit?orderId=' + orderId,
                    })
                  }, 2000)
                }
                else if (orderStatus == 4) {
                  clearInterval(timejsq);
                  that.setData({
                    reject: rej,
                    hiddenshow: false
                  })
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../index/index',
                    })
                  }, 2000)
                }
              }
            } else {
              clearInterval(timejsq);
              that.invalid(orderId);
            }
            if (that.data.overtime == 1) {
              clearInterval(timejsq);
            }
          }
        })
      }, 1000)
    },
    onUnload:function() {
      clearInterval(timejsq)
    },
    countDown: function (time) {
      var orderId = this.data.orderID;
      var status = this.data.acceptStatus;
    },
    invalid: function (orderId) {
      var that = this;
      wx.request({
        url: url + '/rest/orders/invalid/' + orderId,
        method: "PUT",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          if (res.statusCode == 200) {
            setTimeout(function () {
              wx.reLaunch({
                url: '../index/index',
              })
            }, 2000)
          }
        }
      })
    },
    getOrderInfo: function (orderId) {
      var that = this;
      wx.request({
        url: url + '/api/order/' + orderId,
        method: "GET",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          var orderInfo = res.data;
          that.setData({
            orderInfo: orderInfo,
            phone: orderInfo.doctor.phone
          })
          var os = orderInfo.serviceInfo;
          var selfArr = [];
          var tuijianArr = [];
          for (var i = 0; i < os.length; i++) {
            if (os[i].service.subServices == null || os[i].service.subServices==[]) {
              selfArr.push(os[i])
            } else {
              tuijianArr.push(os[i])
            }
          }
          if (orderInfo.doctor.phone == null) {
            orderInfo.doctor.phone = ''
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
          if (orderInfo.doctor.phone == null) {
            orderInfo.doctor.phone =''
          }
          that.setData({
            selfArr: selfArr,
            tuijianArr: tuijianArr,
            orderInfo: orderInfo
          })
        }
      })
    },
    cancelOrder:function() {
      var that = this;
        wx.showModal({
          title: '提示',
          content: '您确定撤销吗？',
          success:function(res) {
           if (res.confirm) {
             var orderId = that.data.orderId;
              wx.request({//请求撤销订单的接口，传订单id
                url: url + '/rest/orders/cancel/' + orderId,
                data: {
                },
                method: "PUT",
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function (res) {
                  that.setData({
                    overtime:1
                  })
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }
              })
            }
          }
        })
    },
    warning: function () {
        this.setData({
            timeBoxHeight: 296,
            displayStatus: "block"
        })
    },
    warningUp: function () {
        this.setData({
            timeBoxHeight: 146,
            displayStatus: "none"
        })
    },
    phoneCall:function(e) {
      var that = this;
      var phone = that.data.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }
})