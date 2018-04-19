const app = getApp();
var url = app.globalData.url;
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
Page({
  data: {
    hiddenShow:'none',
    hiddAddr:'none',
    img1:'nocheck',
    img2: 'nocheck',
    bigaddr:'获取当前地址',
    olda:'选择原来的地址',
    telText : '',
    yzmText:'',
    second: '验证码',
    docarr:[],
    addrText:'',
    oldvalue:'',
    // bigaddr:'',
    teldis1:'none',
    addrlist:'none',
    teldis2:'none',
    numStatus:1,
    location:[],
    chooseAddress:null,
    tele:false
  },
  onLoad: function (options) {
    var that = this;
    var info = options;
    var orderInfo = info.orderInfo;
    orderInfo = JSON.parse(orderInfo);
    var id = info.id;
    var docArr = JSON.parse(options.docuser);
    for (var i = 0; i < docArr.length;i++) {
      if (id == docArr[i].data.id) {
        that.setData({
          docarr: docArr[i],
        })
      }
    }
    var userInfo = JSON.parse(orderInfo.userInfo);
    userInfo = JSON.parse(userInfo);
    var id = userInfo.id;
    that.setData({
      id:id,
      price: orderInfo.price,
      serArr: orderInfo.serArr,
      userInfo: userInfo,
      maxTime: info.maxtime
    })
    that.getOldAddr(id);
    that.getOrder(id);
  },

  getOldAddr:function(id) {
    var that = this;
    wx.request({
      url: url +'/rest/user/address/'+id,
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: res => {
        var addarr = res.data;
        if (addarr.length != 0 || addarr !=[]){
          that.setData({
            noaddr:'none',
            addrlist:'block',
            addarr: addarr,
          })
        }else{
          that.setData({
            olda: "您还没有历史地址",
            addrlist:'none',
          })
        }
      }
    })
  },
  telBlur: function (mobile) {//用户没有电话号码时执行
    var that = this;
    if (mobile.detail.value == '') {
    } else if (mobile.detail.value.length != 11) {
      
    } else if (!myreg.test(mobile.detail.value)) {
      return false;
    } else {
      that.setData({
        errwords: "",
        errMsg:'',
        telText: mobile.detail.value,
        oldtel: mobile.detail.value
      })
    }
  },
  telBlur2: function (mobile) {
    var that = this;
    if (mobile.detail.value == '') {
    } else if (mobile.detail.value.length != 11) {
    } else if (!myreg.test(mobile.detail.value)) {
      return false;
    } else {
      that.setData({
        errwords: "",
        errMsg: '',
        telText: mobile.detail.value,
      })
    }
  },
  yzmBlur: function (e) {
    var that = this;
    that.setData({
      hiddAddr: 'none'
    })
    if (e.detail.value == '') {
      this.setData({
        errwords: "验证码不能为空！"
      })
    } else {
      this.setData({
        yzmText: e.detail.value,
        tele:true
      })
    }
  },
  getYZMbtn: function () {//获取验证码
    var that = this;
    that.setData({
      hiddAddr: 'none'
    })
    var telText = that.data.telText;
    var second = that.data.second;
    if (second == '重新获取' || second == '验证码' ) {
      if (!!telText && myreg.test(telText) == true) {
        that.setData({
          second: 60 + "s"
        })
        countdown(that);
        wx.request({
          url: url + '/rest/verify/getSmsCode/' + telText,
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log(res)
          },
          fail: function (err) {
            console.log(err)
          }
        })
      } else {
        that.setData({
          errwords: "手机号码错误！",
          errMsg: '手机号码错误！'
        })
      }
    }
  },
  getYZMbtnt: function () {//获取验证码
    var that = this;
    that.setData({
      hiddAddr:'none'
    })
    var oldtel = that.data.telText;
    var second = that.data.second;
    if (second == '重新获取' || second == '验证码') {
      if (!!oldtel && myreg.test(oldtel) == true) {
        that.setData({
          second: 60 + "s"
        })
        countdown(that);
        wx.request({
          url: url + '/rest/verify/getSmsCode/' + oldtel,
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log(res)
          },
          fail: function (err) {
            console.log(err)
          }
        })
      } else {
        this.setData({
          errwords: "手机号码错误！",
        })
      }
    }
  },
  getOrder: function(id) {
    var that = this;
    wx.request({
      url: url + '/api/user/' + id,
      header: { 'Content-Type': 'application/json' },
      success: res => {
        var phone = res.data.phone;
        if(phone != null){
          that.setData({
            oldtel: res.data.phone,
            teldis1: 'block',
            teldis2: 'none',
            telstatus:1,
            tele:true
          })
        }else{
          that.setData({
            teldis1: 'none',
            teldis2: 'block',
            telstatus: 2
          })
        }
      }
    })
  },
  xiugaitel:function() {
    var that = this;
    this.setData({
      hiddenShow:'block',
      hiddAddr:'none'
    })
  },
  suretel:function() {//确认修改手机号码
    var that = this;
    var id = that.data.id;
    var telText = that.data.telText;
    var yzmText = that.data.yzmText;
    if (telText == '') {
      that.setData({
        errwords:'手机号码不能为空'
      })
    }
    else if (yzmText == '') {
      that.setData({
        errwords: '验证码不能为空'
      })
    }else{
      that.getyzmcode(id,telText,yzmText);
    }
  },

  getyzmcode: function (id, telText, yzmText){//验证手机号码
    var that = this;
    wx.request({
      url: url + '/rest/verify/verification/' + id + '/' + telText + '/' + yzmText,
      header: { "Content-Type": "application/json" },
      method:'PUT',
      success: function (res) {
        var yzmStatus = res.data.code;
        if (yzmStatus == 200) {
          that.setData({
            oldtel: telText,
            hiddenShow: 'none'
          })
        }else {
          that.setData({
            errwords: res.data.msg,
          })
          return false;
        }
        that.setData({
          yzmStatus: yzmStatus,
          errwords: "",
        })
      }
    })
  },
  quxiao:function() {
    this.setData({
      hiddenShow: 'none',
      errwords:'',

    })
  },
  radioChange:function(e) {
    var _this = this;
    var oldvalue = e.detail.value;
    _this.data.userInfo.addresses.map(function(x){
      if (x.address == oldvalue){
          _this.setData({
            oldvalue: oldvalue,
            hiddAddr: 'none',
            location: x.location,
            chooseAddress:0
          })
          console.log(_this.data.location)
      }
    })
  },
  getDoctor:function(id) {
    var that = this;
    wx.request({
      url: url+'/api/user/'+id,
      method: "GET",
      header: { "Content-Type": "application/json" },
      success:function(res) {
        console.log(res)
      }
    })
  },
  chanceAdd: function() {//用户点击选择原来的地址
    var that = this;
    if (that.data.hiddAddr == 'block') {
      that.setData({
        hiddAddr: 'none',
        img1: 'checked',
        img2: 'nocheck'
      })
    }else{
      that.setData({
        img1: 'checked',
        hiddAddr: 'block',
        img2: 'nocheck'
      })
    }
  },
  changeImg1:function() {//第一个按钮
    var that = this;
    that.setData({
      img1:'checked',
      img2: 'nocheck',
      hiddAddr: 'none'
    })
  },
  changeImg2: function () {//第二个按钮
    var that = this;
    that.setData({
      img1: 'nocheck',
      img2: 'checked',
      hiddAddr: 'none'
    })
  },
  getLOC:function() {
    var that = this;
    wx.chooseLocation({
      type: 'gcj02', 
      success: function(res) {
        var locations = [res.latitude, res.longitude];
       that.setData({
         bigaddr: res.address,
         latitude: res.latitude,
         longitude: res.longitude,
         hiddAddr: 'none',
         location: locations,
         chooseAddress: 1
       })
      //  console.log(that.data.location);
      },
    })
  },
  noshowoldAddr: function () {
    var that = this;
    that.setData({
      hiddAddr: 'none', 
      img1: 'nocheck',
      img2: 'checked',
    })
  },
  telgive:function() {
    var that = this;
    that.setData({
      hiddAddr: 'none', 
    })
  },
  addrBlur:function(e) {
    var that = this;
    that.setData({
      hiddAddr: 'none'
    })
    if (e.detail.value == '') {
      this.setData({
        errwords: "地址不能为空！"
      })
    } else {
      this.setData({
        addrText: e.detail.value
      })
    }
  },
  makeOrder:function(e) {
    var formId = e.detail.formId;
    var that = this;
    var numStatus = that.data.numStatus;
    that.setData({
      hiddAddr: 'none'
    })
    var numStatus = that.data.numStatus;
    if (numStatus == 1) {
      var telText = that.data.telText;
      var timeTemp = new Date().getTime();
      var addr = that.data.addrText;//地址
      var tel = that.data.oldtel;//电话
      var expectTime = that.data.docarr.ETA;
      var doctor = that.data.docarr.data;//当前的工作者
      var userInfo = that.data.userInfo;//当前的用户
      var openid = app.globalData.openid;
      var serArr = that.data.serArr;
      var totalPrice = that.data.price;
      var currentLocation = that.data.location;
      if (totalPrice < 100) {
        var price = 100;
      } else {
        var price = parseFloat(totalPrice * 1.5).toFixed(2);
      }
      serArr = JSON.parse(serArr);
      var img1 = that.data.img1;
      var img2 = that.data.img2;
      var maxTime = that.data.maxTime;
      var num = 0;
      var yzmStatus = 99;
      var id = that.data.id;
      var yzmText = that.data.yzmText;
      var telstatus = that.data.telstatus;
      if (img1 == "checked" && that.data.noaddr == 'block') {
        that.setData({
          errMsg: "没有可用的历史地址！"
        })
      } else {
        addr = that.data.oldvalue;
        num = 1;
      }
      if (img2 == "checked" && that.data.addrText != '') {
        addr = that.data.bigaddr + that.data.addrText;
        num = 2;
      }
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
      if (img1 == "nocheck" && img2 == "nocheck") {
        that.setData({
          errMsg: "请选择使用的地址！"
        })
        return false;
      } else {
        var addrText = that.data.addrText;
        var bigaddr = that.data.bigaddr;
        if (img1 == "checked" && that.data.oldvalue == '') {
          that.setData({
            errMsg: "请选择地址！"
          })
        } else if (img2 == "checked" && addrText == '' && bigaddr == '') {
          that.setData({
            errMsg: "请输入地址！"
          })
        } else if (img2 == "checked" && addrText != '' && bigaddr == '') {
          that.setData({
            errMsg: "请输入地址！"
          })
        } else if (img2 == "checked" && addrText == '' && bigaddr != '') {
          that.setData({
            errMsg: "请输入地址！"
          })
        } else if (tel == '' || tel == undefined) {
          that.setData({
            errMsg: "手机号码不正确！"
          })
        } else if (telstatus == 2) {
          if (yzmText == '') {
            that.setData({
              errMsg: "请输入验证码!"
            })
          } else {
            wx.request({
              url: url + '/rest/verify/verification/' + id + '/' + telText + '/' + yzmText,
              header: { "Content-Type": "application/json" },
              method: 'PUT',
              success: function (res) {
                var yzmStatus = res.data.code;
                if (yzmStatus == 200) {
                  that.setData({
                    oldtel: tel,
                  })
                  that.setOrder(addr, num, doctor, tel, serviceArr, timeTemp, price, maxTime, userInfo, expectTime, totalPrice, currentLocation, formId);
                  that.setData({
                    numStatus: 2
                  })
                } else {
                  that.setData({
                    errMsg: res.data.msg,
                    tele:false
                  })
                  return false;
                }
              }
            })
          }
        } else {
          that.setOrder(addr, num, doctor, tel, serviceArr, timeTemp, price, maxTime, userInfo, expectTime, totalPrice, currentLocation, formId);
          that.setData({
            numStatus:2
          })
        }
      }
    }
  },
  setOrder: function (addr, num, doctor, tel, serviceArr, timeTemp, price, maxTime, userInfo, expectTime, totalPrice, currentLocation, formId) {
    var that = this;
    // console.log(addr);
    // console.log(doctor);
    // console.log(userInfo);
    // console.log(serviceArr);
    var str = '';
    serviceArr.map(function(x){
      str = str + ' ' + x.service.title
    })
    // console.log(str)
    wx.request({
      url: url + '/api/order',
      data: {
        serviceAddress: addr,
        doctor: doctor,
        contactPhone: tel,
        serviceInfo: serviceArr,
        statusInfo: 2,
        createTime: timeTemp,
        deposit: price,
        duration: maxTime,
        user: userInfo,
        expectTime: expectTime,
        servicePrice: totalPrice,
        currentLocation: currentLocation
      },
      method: "POST",
      header: { "Content-Type": "application/json" },
      success: function (res) {
        if (num == 2) {
          var latitude = that.data.latitude;
          var longitude = that.data.longitude;
          var nowAddr = addr;
          var id = that.data.id;
          wx.request({
            url: url + '/rest/user/addresses/address/' + id,
            data: {
              latitude: latitude,
              longitude: longitude,
              address: nowAddr
            },
            method: "PUT",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
              console.log(res)
            }
          })
        }
        if (res.data =='') {
          var nowurl = res.header.Location;
          nowurl = nowurl.replace("http", "https");
          wx.request({
            url: nowurl,
            header: { "Content-Type": "application/json" },
            success: function (newres) {
              var id = newres.data.id;
              wx.request({
                url: url + '/rest/orders/orderPushInformation/orderId-' + id + '/formId-' + formId,
                method: 'GET',
                success: res => {
                  wx.request({
                    url: url + '/rest/templateMessage',
                    method:'POST',
                    data:{
                      doctorId: doctor.id,
                      openId: doctor.openId,
                      customer: userInfo.userInfo.nickName,
                      serverAddress: addr,
                      serverInfo: str
                    },
                    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    success:res=>{
                      wx.redirectTo({
                        url: '../waitAccept/waitAccept?orderId=' + id,
                      })
                    }
                  })
                },
                // fail:r=>{
                //   wx.redirectTo({
                //     url: '../waitAccept/waitAccept?orderId=' + id,
                //   })
                // }
              })
            },fail:response =>{
            }
          })
        } else {
          var id = res.data.id;
          wx.request({
            url: url + '/rest/orders/orderPushInformation/orderId-' + id + '/formId-' + formId,
            method:'GET',
            success:res=>{
              wx.request({
                url: url + '/rest/templateMessage',
                method: 'POST',
                data: {
                  doctorId: doctor.id,
                  openId: doctor.openId,
                  customer: userInfo.userInfo.nickName,
                  serverAddress: addr,
                  serverInfo: str
                },
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                success: res => {
                  wx.redirectTo({
                    url: '../waitAccept/waitAccept?orderId=' + id,
                  })
                }
              })
            },
            // fail:r=>{
            //   wx.redirectTo({
            //     url: '../waitAccept/waitAccept?orderId=' + id,
            //   })
            // }
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})