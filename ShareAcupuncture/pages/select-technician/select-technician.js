var app = getApp();
var url = app.globalData.url;
var serviceMeg = app.globalData.serviceMeg;
var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
function countdown(that) {
  var second = that.data.second
  if (parseInt(second) == 0) {
    that.setData({
      second: "重新获取"
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: parseInt(second) - 1 + "s"
    });
    countdown(that);
  }, 1000)
}
var doctorArr = [];
var wxMarkerData = [];
var workdsq ='';
Page({
  data: {
    hiddenmodalput: true,
    timehidden: true,
    errText: "",//错误提示
    addrText: "",//填写的地址
    telText: "",//填写的电话号码
    yzmText: "",//填写的验证码
    getyzm: "",//获取的验证码
    second: '获取验证码',
    project: [],
    doctorArr: [],
    docuser: [],
    listData: [],
    Height: '0',
    doctorShow1:'block',
    doctorShow2: 'none',
    controls: [{
      id: 1,
      iconPath: '/img/user.png',
      position: {
        left: 10,
        top: 10,
        width: 30,
        height: 30
      },
      clickable: true
    }],
    latitude: '',
    longitude: '',
    markers: [],
    sidArr: [],
    docNum: 0,
    commentDisplay: "none",
    message: "",
    mesDisplay: "none",
    page: 1,
    noDoDisplay: "none",
    mLongitude: '',
    mLatitude: '',
    starimg1: 'star',
    starimg2: 'star',
    starimg3: 'star',
    starimg4: 'star',
    starimg5: 'star',
    nocomment: 'none',
    // mapDisplay: 'block',
    showTechInfo:false,
    currenntIndex:0,//当前医生的index,
    currentDocter:{}//当前医生
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('myMap')
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      orderInfo : options
    })
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        that.setData({
          mylongitude: res.longitude,
          mylatitude: res.latitude
        })
        that.getWorker(res.longitude, res.latitude, that.data.page);
        workdsq = setInterval(function(){
          that.getWorker(res.longitude, res.latitude, that.data.page)
        }, 30000)
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
                      success: function (res) {
                        that.setData({
                          circles: [{
                            latitude: res.longitude,
                            longitude: res.latitude,
                            color: '#FF0000DD',
                            fillColor: '#7cb5ec88',
                            radius: 400,
                            strokeWidth: 2
                          }],
                        })
                        that.getWorker(res.longitude, res.latitude, that.data.page);
                        workdsq = setInterval(function () {
                          that.getWorker(res.longitude, res.latitude, that.data.page)
                        }, 30000)
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
    var price = 0;
    var priceArr = [];
    var tuijianArr = options.tuijian;
    var userInfo = options.userInfo;
    var self = options.self;
    var serArr = options.serArr;
    var totalPrice = options.price;
    if (options.price < 100) {
      price = 100
    } else {
      price = options.price * 1.5
    }
    var jsonObj1 = JSON.parse(serArr)
    var jsonStr1 = JSON.stringify(jsonObj1)
    var serArr = [];
    for (var i = 0; i < jsonObj1.length; i++) {
      serArr[i] = jsonObj1[i];
    }
    var maxTime = 0
    var serviceArr = [];
    var services = {};
    var serviceMeg = app.globalData.serviceMeg;
    for (var i = 0; i < serArr.length; i++) {
      for (var j = 0; j < serviceMeg.length; j++) {
        delete serviceMeg[i].bigHight;
        delete serviceMeg[i].profileShow;
        delete serviceMeg[i].upShow;
        delete serviceMeg[i].downShow;
        if (serArr[i].id == serviceMeg[j].id) {
          services = {
            service: serviceMeg[j],
            amountEquipment: serArr[i].equipmentUnit,
            amountTime: serArr[i].timeUnit,
            amountMoney: serArr[i].priceTotal
          }
          serviceArr.push(services);
        }
      }
    }
    if (serArr.length == 1) {
      maxTime = serArr[0].timeUnit;
    } else {
      for (var i = 0; i < serArr.length - 1; i++) {

        if (serArr[i].timeUnit > serArr[i + 1].timeUnit) {
          maxTime = serArr[i].timeUnit
        } else {
          maxTime = serArr[i + 1].timeUnit
        }
      }
    }
    that.setData({
      serviceArr: serviceArr,
      tuijianArr: options.tuijianArr,
      userInfo: options.userInfo,
      self: options.self,
      price: price,
      serArr: serArr,
      totalPrice: totalPrice,
      maxTime: maxTime
    })
    var data = JSON.stringify({
      page: 1,
      pageSize: 10,
      request: {
        placeLongitude: app.globalData.longitude,
        placeLatitude: app.globalData.latitude,
        userId: app.globalData.userId
      }
    })
  },
  onUnload: function () {
    clearInterval(workdsq);
  },
  onHide:function(){
    clearInterval(workdsq);
  },
  onShow:function(){

  },
  getWorker: function (longitude, latitude, page) {//获得工作者
  var that = this;
    wx.request({
      url: url + '/rest/doctor/nearby/list',
      data: {
        longitude: longitude,
        latitude: latitude,
        page: page,
        size: 1000
      },
      method: "GET",
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: res => {
        if (res.data.status == 500) {
          wx.showModal({
            title: '提示',
            content: '服务器错误！',
            confirmText: "确定",
            cancelText: "取消",
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../index/index',
                })
                clearInterval(workdsq)
              } else if (res.cancel) {
                wx.reLaunch({
                  url: '../index/index',
                })
                clearInterval(workdsq);
              }
            }
          })
        }else{
          var rdc = res.data.content;
          if (rdc == [] || rdc.length == 0 || rdc == undefined) {
            return;
            wx.showModal({
              title: '提示',
              content: '工作者都离您太远啦！',
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                  clearInterval(workdsq)
                } else if (res.cancel) {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                  clearInterval(workdsq);
                }
              }
            })
          } else {
            var mylongitude = that.data.mylongitude;
            var mylatitude = that.data.mylatitude;
            var totalNum = res.data.count;
            var doctorarr = res.data.content;
            var docuser = [];
            var listdata = [];
            for (var i = 0; i < doctorarr.length; i++) {
              listdata[i] = {
                id: doctorarr[i].data.id,
                name: doctorarr[i].data.doctor.name,
                starCount: doctorarr[i].data.doctor.starCount,
                photo: doctorarr[i].data.userInfo.photo,
                placeLongitude: doctorarr[i].data.doctor.location[0],
                placeLatitude: doctorarr[i].data.doctor.location[1]
              }
            }
            that.setData({
              docuser: doctorarr,
              currentDocter: doctorarr[that.data.currenntIndex],
              listData: listdata,
              totalNum: totalNum,
              // longitude: doctorarr[0].data.doctor.location[0],
              // latitude: doctorarr[0].data.doctor.location[1],
              Clongitude: doctorarr[that.data.currenntIndex].data.doctor.location[0],
              Clatitude: doctorarr[that.data.currenntIndex].data.doctor.location[1],
            });
            that.setData({
              markers: that.getSchoolMarkers(listdata),
            })
            // console.log(that.data.markers);
            // console.log(that.data.docuser);
            // console.log(that.data.currentDocter);
            // console.log(that.data.currenntIndex)
          }
        }
      }
    });
  },
  controltap(e) {
    this.setData({
      Clongitude: this.data.mylongitude,
      Clatitude: this.data.mylatitude,
    })
  },
  getSchoolMarkers(data) {//显示地图的标记
    var market = [];
    for (let item of data) {
      let marker1 = this.createMarker(item);
      market.push(marker1);
    }
    market[this.data.currenntIndex].callout.display = 'ALWAYS';
    return market;
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation();
  },
  strSub: function (a) {
    var str = a.split(".")[1];
    str = str.substring(0, str.length - 1)
    return a.split(".")[0] + '.' + str;
  },
  createMarker(point) {//创建地图的标记
    let latitude = point.placeLatitude;
    let longitude = point.placeLongitude;
    let docname = point.name; 
    let photo = point.photo;
    let starCount = point.starCount;
    var doc = this.data.doctorArr;
    for (var i = 0; i < doc.length; i++) {
      if (point.id == doc[i].id) {
        var name = doc[i].name
      }
    }
    let marker = {
      id: point.id || 0,
      iconPath: "/img/position.png",
      latitude: latitude,
      longitude: longitude,
      width: 40,
      height: 40,
      callout: {
        content: docname + '   ' + '评分' + starCount + '.0',
        color: "#f96058",
        fontSize: 15,
        borderWidth:'2',
        bgColor: "",
        padding: 5,
        borderColor:'#f96058',
        borderRadius: 12,
        display: 'BYCLICK',
      }
    };
    return marker;
  },
  modalinput: function (e) {//跳转到确认订单的页面
    var that =this;
    var docuser = that.data.docuser;
    var idx = e.currentTarget.dataset.docid;
    wx.navigateTo({
      url: '../sureOrder/sureOrder?orderInfo=' + JSON.stringify(that.data.orderInfo) + '&docuser=' + JSON.stringify(docuser) + '&id=' + idx + '&maxtime=' + that.data.maxTime,
    })
  },
  CXbtn: function () {
    this.setData({
      timehidden: true
    })
  },
  showErr: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        mesDisplay: "block"
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        mesDisplay: "none"
      })
    }, 1000)
  },
  leftbtn: function () {//向左切换
    var that = this;
    that.setData({
      commentDisplay: "none",
      doctorShow2: 'none',
      doctorShow1: 'block',
    })
    if (that.data.currenntIndex == 0) {
      that.setData({
        currenntIndex: that.data.currenntIndex
      })
    } else {
      var currenntIndex = that.data.currenntIndex - 1;
      that.setData({
        currentDocter: that.data.docuser[currenntIndex],
        currenntIndex: currenntIndex
      })
      that.data.markers.map(function (x) {
        if (x.id == that.data.currentDocter.data.id) {
          x.callout.display = 'ALWAYS';
        } else {
          x.callout.display = 'BYCLICK';
        }
      })
      that.setData({
        markers: that.data.markers,
        Clongitude: that.data.currentDocter.data.doctor.location[0],
        Clatitude: that.data.currentDocter.data.doctor.location[1]
      })
    }
  },
  rightbtn: function () {//向右切换
    var that = this;
    that.setData({
      commentDisplay: "none",
      doctorShow2: 'none',
      doctorShow1: 'block',
    })
    if (that.data.currenntIndex == (that.data.totalNum - 1)) {
      that.setData({
        currenntIndex: that.data.currenntIndex
      })
    } else {
      if (that.data.currenntIndex < that.data.totalNum) {
        var currenntIndex = that.data.currenntIndex + 1;
        that.setData({
          currentDocter: that.data.docuser[currenntIndex],
          currenntIndex: currenntIndex
        })
        that.data.markers.map(function(x){
          if (x.id == that.data.currentDocter.data.id){
            x.callout.display = 'ALWAYS';
          }else{
            x.callout.display = 'BYCLICK';
          }
        })
        that.setData({
          markers: that.data.markers,
          Clongitude: that.data.currentDocter.data.doctor.location[0],
          Clatitude: that.data.currentDocter.data.doctor.location[1]
        })
      }
    }
  },
  // getDoctor: function (longitude, latitude, page) {
  //   console.log(page)
  //   var that = this;
  //   wx.request({
  //     url: url + '/rest/doctor/nearby/list',
  //     data: {
  //       longitude: longitude,
  //       latitude: latitude,
  //       page: page,
  //       size: 1
  //     },
  //     method: "GET",
  //     header: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     success: res => {
  //       console.log(res);
  //       that.data.markers.map(function(x){
  //         if (x.id == res.data.content[0].data.id){
  //           x.callout.display = 'ALWAYS';
  //         }else{
  //           x.callout.display = 'BYCLICK';
  //         }
  //       })
  //       var mylongitude = that.data.mylongitude;
  //       var mylatitude = that.data.mylatitude;
  //       var docuser = res.data.content;
  //       that.setData({
  //         docuser: docuser,
  //         page: page,
  //         Clongitude: docuser[0].data.doctor.location[0],
  //         Clatitude: docuser[0].data.doctor.location[1],
  //         markers: that.data.markers,
  //         page:that.data.page
  //       })
  //     }
  //   })
  // },
  markertap: function (e) {//点击地图上的标志，显示出该医生相应的评价,传一个医生的id
    var dId = e.markerId;
    var that = this;
    if (that.data.doctorShow1 == 'block') {
      that.setData({
        doctorShow1: 'none',
        doctorShow2: 'block',
      })
    } else {
      that.setData({
        doctorShow2: 'block',
        nocomment: 'none',
        doctorShow1: 'none',
      })
    }
    that.data.markers.map(function (x) {
      if (x.id == dId) {
        x.callout.display = 'ALWAYS';
      } else {
        x.callout.display = 'BYCLICK';
      }
    })
    that.setData({
      markers: that.data.markers,
    })
    that.getComment(dId);
  },
  noshowPJ: function () {
    this.setData({
      commentDisplay: "none"
    })
  },
  getTime: function (time) {
    var ob = new Date(time);
    var year = ob.getFullYear();
    var month = twoNum(ob.getMonth()+1);
    var day = twoNum(ob.getDate());
    var hours = twoNum(ob.getHours());
    var min = twoNum(ob.getMinutes());
    var allTime = year + '/' + month + '/' + day + ' ' + hours + ':' + min;
    return allTime;
    function twoNum(num) {
      if (num < 10) {
        num = '0' + num;
      } else {
        num = num;
      }
      return num;
    }
  },
  // djMap: function () {
  //   var that = this;
  //   that.setData({
  //     commentDisplay: "none"
  //   })
  // },
  getComment:function(id) {//获取评论
    var that = this;
    wx.request({
      url: url + '/rest/doctor/orders/comment/' + id,
      data: {},
      method: "GET",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        var commentArr = res.data;
        if (commentArr.length != 0) {
          for (var i = 0; i < commentArr.length; i++) {
            if (commentArr[i].comment[0].commentInfo.length == 0 && commentArr[i].comment[0].remark =='') {
              commentArr[i].comment[0].remark ='该用户默认好评！'   
            }
            commentArr[i].comment[0].commentTime = that.getTime(commentArr[i].comment[0].commentTime);
            var star = commentArr[i].comment[0].stars;
            commentArr[i].starimg1 = 'star';
            commentArr[i].starimg2 = 'star';
            commentArr[i].starimg3 = 'star';
            commentArr[i].starimg4 = 'star';
            commentArr[i].starimg5 = 'star';
            if (star == 0) { }
            if (star == 1) {
              commentArr[i].starimg1 = 'staring';
            }
            if (star == 2) {
              commentArr[i].starimg1 = 'staring';
              commentArr[i].starimg2 = 'staring';
            }
            if (star == 3) {
              commentArr[i].starimg1 = 'staring';
              commentArr[i].starimg2 = 'staring';
              commentArr[i].starimg3 = 'staring';
            }
            if (star == 4) {
              commentArr[i].starimg1 = 'staring';
              commentArr[i].starimg2 = 'staring';
              commentArr[i].starimg3 = 'staring';
              commentArr[i].starimg4 = 'staring';
            }
            if (star == 5) {
              commentArr[i].starimg1 = 'staring';
              commentArr[i].starimg2 = 'staring';
              commentArr[i].starimg3 = 'staring';
              commentArr[i].starimg4 = 'staring';
              commentArr[i].starimg5 = 'staring';
            }
          }
        }
        else {
          that.setData({
            nocomment: 'block'
          })
        }
        that.setData({
          commentArr: commentArr,
          oldid:id,
          showTechInfo:true
        })
      }
    })  
  },
  nolookComment: function () {
    var that = this;
    that.setData({
      doctorShow2: 'none',
      nocomment: 'none',
      doctorShow1: 'block',
      showTechInfo: false
    })
  },
})