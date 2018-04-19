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
  formatSeconds(that);
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
var timeDsq ='';
Page({
    data: {
        hiddenshow: 'true',
        tjShow:'block',
        selfShow:'block'
    },
    onLoad: function (options) {
      var that = this;
      var orderId = options.orderId;
      var status = this.getorderInfo(orderId);
      timeDsq = setInterval(function () {
        wx.request({
          url: url + '/api/order/' + orderId,
          method: "GET",
          header: { "Content-Type": "application/json" },
          success: function (res) {
            var statusInfo = res.data.statusInfo;
            var orderArr = res.data;
            var order = orderArr;
            if (statusInfo == 0) {
              clearInterval(timeDsq);
              wx.redirectTo({
                url: '../worker-serviceBill/worker-serviceBill?orderId=' + orderId,
              })
            } 
          }
        })
      }, 1000)
      if (status == 0) {
        that.setData({
          showWords: "您的服务已结束！",
          hiddenshow: false
        })
        setTimeout(function () {
          wx.reLaunch({
            url: '../index/index',
          })
        }, 1000)
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
          var startServiceTime = res.data.startServiceTime;
          var TimeDiffer = app.globalData.timeDiffer(startServiceTime);
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
              selfArr.push(serviceArr[i]);
            } else {
              tuijianArr.push(serviceArr[i]);
            }
          }
          if (selfArr == [] || selfArr.length == 0) {
            that.setData({
              selfShow: "none"
            })
          }
          if (tuijianArr == [] || tuijianArr.length == 0) {
            that.setData({
              tuijianArr: "none"
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
      return that.data.statusInfo;
    },
    continueService: function () {
      clearInterval(timeDsq);
        wx.reLaunch({
            url: '../index/index',
        })
    },
    timeDiffer: function (time) {
      var nowTime = new Date().getTime();
      var arr = [];
      time = time.replace('-', '/');
      time = time.replace('-', '/');
      arr = time.split('.');
      time = arr[0];
      time = time.replace('T', ' ')
      time = new Date(time).getTime();
      var TimeDiffer = nowTime - time;
      TimeDiffer = parseInt(TimeDiffer / 1000) - 28800;
      return TimeDiffer;
    },
})