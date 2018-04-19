const app = getApp();
var url = app.globalData.url;
function timing(that) {
    var seconds = that.data.seconds
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
function orderTime(orderTime) {
    var orderTime = orderTime*60;
    if (orderTime > 180) {
        setTimeout(function () {
            that.setData({
                orderTime: orderTime - 1
            });
            orderTime(that);
        }
            , 1000)
        formatSeconds(that)
    }else{
        this.setData({
            acceptDisplay: "block"
        })
        var that = this;
        if (this.data.acceptDisplay == "block") {
          setTimeout(function () {
              that.setData({
                  acceptDisplay: "none"
              })
          }, 3000)
        }
    }
}
var timeDsq ='';
Page({
    data: {
        seconds: 0,
        time: '00:00:00',
        serviceTime: 5,
        acceptDisplay: "none",
        tuijianDisplay: "none",
        selfDisplay: "none",
        overDisplay: 'none',
    },
    onLoad: function (options) {//这里可以获取订单预定的时长orderTime
      var that = this;
      var nowTime = new Date().getTime();
      var orderId = options.orderId;
      that.getOrderInfo(orderId);
      var time = 0;
      wx.request({
        url: url + '/api/order/' + orderId,
        data: {},
        method: "GET",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          var startTime = res.data.startServiceTime;

          var duration = res.data.duration;
          var TimeDiffer = app.globalData.timeDiffer(startTime);
          that.setData({
            seconds: TimeDiffer
          }) 
          timing(that); 
          that.setData({
            duration: duration
          })
        }
      })
      var timeArrtime = '';
      
      this.setData({
          orderId: orderId,
      })
      var that = this;
      timeDsq = setInterval(function () {
        var timeArr = that.data.timeArr;
        var seconds = that.data.seconds;
        var selfArr = that.data.selfArr;
        var orderId = that.data.orderId;
        var duration = that.data.duration;
        var cha = (duration - 54)*60;
        if (seconds == cha) {
          wx.showModal({
            title: '提示',
            content: '全部服务将于10分钟后结束',
            confirmText: "继续",
            showCancel: false,
            success: function (res) {

            }
          })
        }
      }, 1000)
    },
    onUnload:function() {
      clearInterval(timeDsq)
    },
    telCall: function (e) {//打电话
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel
      })
    },
    endService : function() {
      var orderId = this.data.orderId;
      var that= this;
        wx.showModal({
          title: '提示',
          content: '确定结束服务？',
          cancelText: '取消',
          confirmText: '确定',
          success: function (res) {
            if (res.confirm) {
              wx.request({
                url: url + '/rest/orders/order/over/' + orderId,
                method: "PUT",
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                success:function(res) {
                  if(res.data.code == 200) {
                    clearInterval(timeDsq)
                    wx.reLaunch({
                      url: '../orderBill/orderBill?orderId=' + orderId,
                    })
                  }else{
                    that.setData({
                      overDisplay:'block'
                    })
                    setTimeout(function() {
                      that.setData({
                        overDisplay: 'none',
                      })
                    },2000)
                  }
                }
              })
            }
          }
        })
    },
    getOrderInfo: function (orderId) {
      var that = this;
      wx.request({
        url: url + '/api/order/' + orderId,
        data: {},
        method: "GET",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          var orderInfo = res.data;
          console.log(res)
          var timearr = {};
          var timeArr = [];
          var time = 0;
          that.setData({
            orderInfo: orderInfo
          })
          var os = orderInfo.serviceInfo;
          var selfArr = [];
          var tuijianArr = [];
          var time = 0;
          for (var i = 0; i < os.length; i++) {
            var timearr ={}
            if (os[i].service.subServices == null) {
              if (os[i].completeTime != null) {
                os[i].service.overClass = 'over';
                os[i].typen = 1
              }else{
                os[i].service.overClass = '';
                os[i].typen = 0
              }
              selfArr.push(os[i]);
              timearr.time = os[i].amountTime * 60;
              timearr.id = os[i].service.id;
              timeArr.push(timearr);
            } else {
              tuijianArr.push(os[i]);
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
            timeArr: timeArr
          });
        }
      })
    },
    overOneSer: function(e) {
      var that = this;
      var orderId = that.data.orderId;
      var selfArr = that.data.selfArr;
      var sid = e.currentTarget.dataset.sid;
      var typen = e.currentTarget.dataset.typen;
      var stype = e.currentTarget.dataset.type;
      var over ='';
      var timeArr=[];
      if (typen == 0) {
        for (var j = 0; j < selfArr.length; j++) {
          if (selfArr[j].service.id == sid) {
            if (selfArr[j].compeleteTime == null) {
              over = 1;
              break;
            }
          }
        }
        if (over == 1) {
          wx.request({
            url: url + '/rest/orders/order/service/over/' + orderId,
            data: {
              serverId: sid
            },
            method: "PUT",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
              if (res.statusCode == 200) {
                var newTimeArr = [];
                for (var i = 0; i < selfArr.length; i++) {
                  if (sid == selfArr[i].service.id) {
                    selfArr[i].service.overClass = 'over';
                  }
                  that.setData({
                    selfArr: selfArr
                  })
                }
                wx.request({
                  url: url + '/api/order/' + orderId,
                  data: {},
                  method: "GET",
                  header: { "Content-Type": "application/json" },
                  success: function (res) {
                    var orderInfo = res.data;
                    var timeArr = [];
                    var os = orderInfo.serviceInfo;
                    for (var i = 0; i < os.length; i++) {
                      var timearr = {}
                      if (os[i].service.subServices == null) {
                        if (os[i].completeTime != null) {
                          os[i].service.overClass = 'over';
                          os[i].typen = 1;
                          timearr.time = os[i].amountTime * 60;
                          timearr.id = os[i].service.id;
                          timeArr.push(timearr);
                        } else {
                          os[i].service.overClass = '';
                          os[i].typen = 0
                        }
                      }
                    }
                    that.setData({
                      timeArr: timeArr
                    })
                  }
                })
              }
            }
          })
        }
      }
      
    }
})