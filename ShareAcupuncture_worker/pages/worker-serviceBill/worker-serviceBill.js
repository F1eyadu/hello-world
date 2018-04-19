const app = getApp();
var url = app.globalData.url;
Page({
    data: {

    },
    onLoad: function (options) {
      var that = this;
      var orderId = options.orderId;
      that.setData({
        orderId: orderId
      })
      that.getorderInfo(orderId);
    },
    getorderInfo: function (orderId) {
      var that = this;
      var nowTime = new Date().getTime();
      wx.request({
        url: url + '/api/order/' + orderId,
        method: "GET",
        header: { "Content-Type": "application/json" },
        success: function (res) {
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
          })
        }
      })
    },
    gotoPingjia: function() {
      var that = this;
      var orderId = that.data.orderId
        wx.redirectTo({
          url: '../worker-deposit/worker-deposit?orderId=' + orderId,
        })
    },
    callphone:function(e) {
      var tel = e.currentTarget.dataset.tel;
        wx.makePhoneCall({
          phoneNumber: tel,
        })
    }, 
    callUser:function(e) {
      var phone = e.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }
})