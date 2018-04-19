const app = getApp();
var url = app.globalData.url;
var appid = app.globalData.appid;
var secret = app.globalData.secret;
var userappid = app.globalData.userappid;
var TimeDiffer = app.globalData.TimeDiffer;
var timeDsq ='';
var timeRun = '';

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
  return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second;
};

var getOrders = function (userId, that){
  wx.request({
    url: url + '/rest/doctor/orders/' + userId,
    data: {
      size: 100
    },
    method: "GET",
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    success: function (res) {
      var nowTime = new Date().getTime();
      var orderArr = res.data.content;
      if (orderArr.length == 0) {
        that.setData({
          orderArr: []
        })
      } else {
        for (let i = 0; i < orderArr.length; i++) {
          var nowTime = new Date().getTime();
          var createTime = orderArr[i].createTime;
          var timeDiffer = nowTime - createTime;
          timeDiffer = parseInt(timeDiffer / 1000);
          orderArr[i].createTime = formatDateTime(createTime + 180000).split(" ")[1].split(":")[0] + ":" + formatDateTime(createTime + 180000).split(" ")[1].split(":")[1];
          orderArr[i].completeTime = (parseInt(orderArr[i].completeServiceTime - orderArr[i].startServiceTime) / 1000 / 60).toFixed(1);
          orderArr[i].completeServiceTime = formatDateTime(orderArr[i].completeServiceTime);
          orderArr[i].startServiceTime = formatDateTime(orderArr[i].startServiceTime);
          if (orderArr[i].user.id){
            wx.request({
              url: url + '/rest/user/orders/comment/' + orderArr[i].user.id,
              method: 'GET',
              success: function (res) {
                orderArr[i].comments = res.data
                that.setData({
                  orderArr: orderArr
                })
                // console.log(that.data.orderArr);
              }
            })
          }else{
            orderArr[i].comments = [];
            that.setData({
              orderArr: orderArr
            })
            // console.log(that.data.orderArr);
          }
          
          if (timeDiffer >= 180) {
            wx.request({
              url: url + '/rest/orders/invalid/' + orderArr[i].id,
              method: "PUT",
              header: { "Content-Type": "application/json" },
              success: function (res) {
              }
            })
          }
        }
      }
    }
  })
}

Page({
    data: {
        workState:true,
        hidden: true,
        payStatus: 1,
        hiddenshow: true,
        hiddenRej:'none',
        noworkhidden:true,
        displayStatus: "block",
        tuijianDis:'none',
        selfDis:'none',
        checkComment:true,
        comments:[],
        stars: [0, 1, 2, 3, 4],
        normalSrc: '../../img/normal.png',
        selectedSrc: '../../img/selected.png',
        longitude:0,
        latitude:0,
        hiddenMap:true,
        income: 0,
        singularNumber: 0,
        sumIncome: 0
    },
    onLoad: function (options) {
      var that = this;
      wx.login({
        success: function (res) {
          var appid = appid;
          var secret = secret;
          var code = res.code
          wx.request({
            url: url + '/rest/weixin/identityWorker/code-' +code,
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var openid = res.data.openid;
              var userId ='';
              that.setData({
                openid: openid
              })
              wx.getUserInfo({
                success: function (res) {
                  var userInfo = res.userInfo;
                  var nickName = userInfo.nickName;
                  var avatarUrl = userInfo.avatarUrl;
                  var gender = userInfo.gender;
                  that.setData({
                    nickName: nickName,
                    avatarUrl: avatarUrl,
                  })
                  wx.request({
                    url: url + '/rest/user/save',
                    data: {
                      openId: openid,
                      nickName: nickName,
                      photo: avatarUrl,
                      mark: 'workEnd'
                    },
                    method: "POST",
                    header: { "Content-Type": "application/x-www-form-urlencoded"},
                    success: function (res) {
                      if (res.statusCode == 502) {
                        wx.showModal({
                          title: '提示',
                          content: '服务器出错',
                        })
                      }else{
                        var doctorarr = [];
                        doctorarr = res.data.doctor;
                        if (res.data.doctor && res.data.doctor != null) {
                          if (res.data.doctor.status != 1) {
                            wx.showModal({
                              title: '提示',
                              content: '您不是被认证的工作者',
                            })  
                          }else{
                            if (res.data.doctor.serviceStatus == true) {
                              that.setData({
                                workState: true,
                              })
                            } else {
                              that.setData({
                                workState: false,
                              })
                            }
                            app.globalData.userInfo = res.data;
                            userId = res.data.id;
                            that.setData({
                              userInfo: res.data,
                              userId: userId,
                              doctorarr: doctorarr
                            })
                            that.getMoney(userId);
                            getOrders(userId, that)
                            that.getloction(userId);
                            timeRun = setInterval(function () {
                              that.getloction(that.data.userId)
                            }, 30000);
                            timeDsq = setInterval(function () {
                              that.getMoney(that.data.userId);
                              getOrders(that.data.userId, that)
                            }, 1000)
                          }
                        } else {
                          that.setData({
                            noworkhidden: false
                          })
                        }
                      }
                      
                    }
                  })
                },
                fail:function(err) {
                  wx.showModal({
                    title: '用户未授权',
                    content: '如需正常使用小程序功能，请按确定并且在【我的】页面中点击授权按钮，勾选用户信息并点击确定。',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success: function (res) {
                            if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                              wx.getUserInfo({
                                success: function (res) {
                                  wx.redirectTo({
                                    url: '../index/index',
                                  })
                                },
                                fail:function() {
                                  wx.redirectTo({
                                    url: '../index/index',
                                  })
                                }
                              })
                            }
                          }
                        })
                      }
                    }
                  })
                }
              })
            },
            fail: function (e) {
              console.log(e)
            }
          })
        }
      });
    },
    onShow:function(){
      var that = this;
      that.setData({
        hiddenMap:true
      })
    },
    onUnload: function () {
      clearInterval(timeDsq);
      clearInterval(timeRun);
    },
    gotoOrder: function (e) {
      var that = this;
      var userId = that.data.userId;
      var formId = e.detail.formId;
      wx.request({
        url: url + '/rest/formId',
        method: 'POST',
        data: {
          doctorId: userId,
          formId: formId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          wx.navigateTo({
            url: '../worker-order/worker-order',
          })
        }
      })
    },
    gotoBill: function () {
      wx.navigateTo({
        url: '../worker-bill/worker-bill'
      })
    },
    workerStatusChange: function (e) { //切换工作者状态
      var that = this;
      var userId = that.data.userId;
      var formId = e.detail.formId
      var content = e.currentTarget.dataset.state;
      if (content === 'true'){
        wx.request({
          url: url + '/rest/doctor/serviceStatus/open/' + userId,
          method: "PUT",
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            if (res.data.code == 200) {
              that.setData({
                workState: true,
              })
              wx.request({
                url: url + '/rest/formId',
                method:'POST',
                data:{
                  doctorId: userId,
                  formId: formId
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success:res=>{
                  console.log(res);
                }
              })
            }
          }
        })
      }else{
        wx.request({
          url: url + '/rest/doctor/serviceStatus/close/' + userId,
          method: "PUT",
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            if (res.data.code == 200) {
              that.setData({
                workState: false,
              })
              wx.request({
                url: url + '/rest/formId',
                method: 'POST',
                data: {
                  doctorId: userId,
                  formId: formId
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: res => {
                  console.log(res);
                }
              })
            }
          }
        })
      }
    },
    acceptService: function (e) {
      var that = this;
      var orderId = e.currentTarget.dataset.id;
      var formId = e.detail.formId;
      var userId = that.data.userId;
      wx.request({
        url: url + '/rest/orders/doctor/receive/'+orderId,//工作者接受
        method:'PUT',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success:function(res) {
          if (res.data.code ==200) {
            wx.request({
              url: url + '/rest/orders/orderPushInformation/orderId-' + orderId + '/formId-' + formId,
              method: 'GET',
              success: res => {
                that.setData({
                  hidden:false
                })
                setTimeout(function(){
                  that.setData({
                    hidden: true
                  })
                },2000)
              }
            })
          }
        }
      })
      wx.request({
        url: url + '/rest/formId',
        method: 'POST',
        data: {
          doctorId: userId,
          formId: formId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          console.log(res);
        }
      })
    },
    workpx:function() {
      this.setData({
        noworkhidden:true
      })
      wx.navigateBackMiniProgram({
        extraData: {
          foo: 'bar'
        },
        success(res) {

        }
      })
    },
    showRejbox: function (e) {
      var that = this;
      var height = e.detail.y;
      console.log(e)
      var userId = that.data.userId;
      var formId = e.detail.formId;
      that.setData({
        rejorderId: e.currentTarget.dataset.id,
        topheight: height-200,
        hiddenRej:'block'
      })
      wx.request({
        url: url + '/rest/formId',
        method: 'POST',
        data: {
          doctorId: userId,
          formId: formId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          console.log(res);
        }
      })
    },
    quxiao: function (e) {
      var that = this;
      var userId = that.data.userId;
      var formId = e.detail.formId;
      that.setData({
        hiddenRej: 'none'
      })
      wx.request({
        url: url + '/rest/formId',
        method: 'POST',
        data: {
          doctorId: userId,
          formId: formId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          console.log(res);
        }
      })
    },
    rejectService: function (e) {
      var that = this;
      var refuseMsg = that.data.refuseMsg;
      var orderId = e.currentTarget.dataset.id;
      var userId = that.data.userId;
      var formId = e.detail.formId;
      if (refuseMsg == undefined) {
        that.setData({
          errword:"请选择理由"
        })
      }else{
        wx.request({
          url: url + '/rest/orders/doctor/refuse/' + orderId,
          method: 'PUT',
          data: {
            refuseMsg: refuseMsg,
          },
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: function (res) {
            that.setData({
              hiddenRej: 'none'
            })
            wx.request({
              url: url + '/rest/formId',
              method: 'POST',
              data: {
                doctorId: userId,
                formId: formId
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: res => {
                console.log(res);
              }
            })
          }
        })
      }
    },
    open: function () {
        console.log("延时调用");
    },
    gotogetmoney:function(e) {
      var that = this;
      var userId = that.data.userId;
      var formId = e.detail.formId;
      wx.request({
        url: url + '/rest/formId',
        method: 'POST',
        data: {
          doctorId: userId,
          formId: formId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          wx.navigateTo({
            url: '../worker-getmoney/worker-getmoney?id=' + userId,
          })
        }
      })
    },
    radioChange:function(e) {
      var that = this;
      var refuseMsg = e.detail.value;
      that.setData({
        refuseMsg: refuseMsg
      })
    },
    getloction: function (userId) {
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          wx.request({
            url: 'https://api.map.baidu.com/geocoder/v2/?ak=bebunprU2HWbDTN8TGPpXqtiTaGU9fU3&location=' + res.latitude + ',' + res.longitude + '&output=json&coordtype=wgs84ll',
            header: { 'Content-Type': 'application/xml' },
            dataType: 'json',
            success: function (ops) {
              wx.request({
                url: url + '/rest/doctor/location/change/' + userId,
                data: {
                  latitude: ops.data.result.location.lat,
                  longitude: ops.data.result.location.lng,
                  address: ops.data.result.formatted_address
                },
                method: "PUT",
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function (res) {
                }
              })
            }
          })
        },
        fail: (error) => {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常使用小程序功能，请按确定并且在【我的】页面中点击授权按钮，勾选地理位置并点击确定。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function (res) {
                    if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                      wx.getLocation({
                        type: 'wgs84',
                        success: (res) => {
                          var latitude = res.latitude;
                          var longitude = res.longitude;
                          wx.request({
                            url: url + '/rest/doctor/location/change/' + userId,
                            data: {
                              latitude: latitude,
                              longitude: longitude
                            },
                            method: "PUT",
                            header: { "Content-Type": "application/x-www-form-urlencoded" },
                            success: function (res) {
                            }
                          })
                        },
                        fail: function () {
                        }
                      })
                    }
                  },
                })
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      });    
    },
    getMoney: function (userId) {
      var that = this;
      wx.request({
        url: url + '/rest/doctor/current/day/details/' + userId,
        method: "GET",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          var arr = res.data;
          that.setData({
            income: arr.income,
            singularNumber: arr.singularNumber,
            sumIncome: arr.sumIncome
          })
        }
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

    onShareAppMessage:function(){//分享小程序
      return {
        title: '共享针灸',
        desc: '共享针灸',
        path: '/pages/index/index'
      }
    },
    checkOrder:function(e){//评价该订单
      if (e.currentTarget.dataset.state == 0){
        wx.navigateTo({
          url: '../worker-deposit/worker-deposit?orderId=' + e.currentTarget.dataset.id,
        })
      }
    },
    viewComments:function(e){//查看用户评论
      var _this  = this;
      var comments = e.currentTarget.dataset.comments;
      comments.map(function(x){
        x.comment[0].commentTime = formatDateTime(x.comment[0].commentTime).split(" ")[0]
      })
      _this.setData({
        checkComment:false,
        comments: comments
      });
    },
    hideModel:function(){
      this.setData({
        checkComment: true
      })
    },
    callUser:function(e){//呼叫用户
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone,
      })
    },
    mapGuide:function(e){//查看用户地图
      var _this = this;
      _this.setData({
        hiddenMap:false,
        longitude: e.currentTarget.dataset.add[0],
        latitude: e.currentTarget.dataset.add[1],
      })
      wx.openLocation({
        latitude: Number(e.currentTarget.dataset.add[1]),
        longitude: Number(e.currentTarget.dataset.add[0]),
        address: e.currentTarget.dataset.address,
        scale: 28
      })
    }
})