const app = getApp();
var url = app.globalData.url;
Page({
    data: {
      tuijianDisplay: "none",
      selfDisplay: "none",
    },
    onLoad: function (options) {
      var orderId = options.orderId;
      this.setData({
        orderId: orderId
      })
      var that =this
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
          var comTime = that.timeShow(orderInfo.completeServiceTime);
          var startTime = that.timeShow(orderInfo.startServiceTime);
          var totalTime = orderInfo.duration;
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
            totalTime: totalTime
          })
        }
      })
    }, 
    sureBill: function() {
      var orderId = this.data.orderId
        wx.redirectTo({
            url: '../backMoney/backMoney?orderId='+orderId,
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
      return TimeDiffer
    },
    timeShow:function(time) {
      var arr =[];
      time = time.replace('-', '/');
      time = time.replace('-', '/');
      arr = time.split('.');
      time = arr[0];
      time = time.replace('T', ' ');
      time = new Date(time).getTime();
      return time;
    },
    phone:function(e) {
      var tel = e.currentTarget.dataset.tel;
      wx.makePhoneCall({
        phoneNumber: tel
      })
    }
})