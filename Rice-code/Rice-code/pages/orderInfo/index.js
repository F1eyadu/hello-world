const app = getApp();
var countdown = 60;
var settime = function (_this) {//获取验证码
  if (countdown == 0) {
    _this.setData({
      hadGet: true
    })
    countdown = 60;
    return;
  } else {
    _this.setData({
      hadGet: false,
      last_time: countdown
    })

    countdown--;
  }
  setTimeout(function () {
    settime(_this)
  }, 1000)
}
var formatTimeStamp =  function (date) {
  return Date.parse(new Date(`${date}`)) || Date.parse(new Date(`${date.replace(/-/g, '/')}`))
}
Page({
  data: {
    last_time: '',
    name:"",
    sex:"男",
    orderTel:"",
    orderCode:"",
    orderNum:"",
    orderDesc:"",
    userSex:[
      { name: 'sex', value: "男", checked:'true'},
      { name: 'sex', value: "女"}
    ],
    url:"",
    sellerId:"",
    time:"",
    times: "",
    date:"",
    dates:"",
    hidden:true,
    tableType:"",
    tableNum:"",
    hadGet:true,
    src:'../../images/reserveSuccess.svg',
    message:'预定成功',
    states:true,
    xiaoxi:"",
    stuta:true,
    modifyTel:"",
    code:""
  },
  onLoad: function (e) {
  var data = new Date();
  var month = data.getMonth() + 1;
  if (month<10){
    month = '0' + month
  }
  var day = data.getDate();
  if (day < 10) {
    day = '0' + day
  }
  this.data.date = data.getFullYear() + "-" + month + "-" + day;
  this.data.dates = data.getFullYear() + "-" + month + "-" + day;
  var hour = data.getHours();
  if (hour<10){
    hour = '0' + hour
  }
  var Minutes = data.getMinutes();
  if (Minutes<10){
    Minutes = '0' + Minutes
  }
  this.data.time = hour + ":" + Minutes;
  this.data.times = hour + ":" + Minutes;
  this.setData({
    url: app.globalData.url,
    sellerId: e.sellerId,
    date:this.data.date,
    dates: this.data.dates,
    time: this.data.time,
    times: this.data.times
  })
  },
  onShow:function(){
    var _this = this;
    if (app.globalData.table){
      wx.request({
        url: _this.data.url + 'rest/seller/table/' + _this.data.sellerId,
        method:'GET',
        success:res=>{
          if(res.data){
            res.data.map(function(x){
              if (x.id == app.globalData.table){
                _this.setData({
                  tableType:x.type,
                  tableNum: x.tableNum
                })
              }
            })
          }
        }
      })
    }
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
    if (this.data.date < this.data.dates){
      this.setData({
        time: this.data.times
      })
    }
  },
  bindDateChange: function (e) {
    var _this = this;
    var data = new Date();
    var hour = data.getHours();
    if (hour < 10) {
      hour = '0' + hour
    }
    var Minutes = data.getMinutes();
    if (Minutes < 10) {
      Minutes = '0' + Minutes
    }
    var time = hour + ":" + Minutes;
    _this.setData({
      date: e.detail.value,
    })
    if (_this.data.date > _this.data.dates){
      _this.setData({
        times: '00:00'
      })
    }else{
      _this.setData({
        times: time,
        time: time
      })
    }
  },
  orderName:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  radioChange:function(e){
    this.setData({
      sex: e.detail.value
    })
  },
  orderTel:function(){
    this.setData({
      stuta: false
    })
  },
  modifyTele: function (e) {
    this.setData({
      modifyTel: e.detail.value
    })
  },
  inputCode: function (e) {//输入验证码
    this.setData({
      code: e.detail.value
    })
  },
  hideModal: function () {
    this.setData({
      stuta: true
    })
  },
  getyzm:function(){
    var _this = this;
    var re = /^[1][3,4,5,7,8,9][0-9]{9}$/
    if (countdown < 60) {
      _this.setData({
        states: false,
        xiaoxi: '验证码已经发送到您手机'
      }),
        setTimeout(function () {
        _this.setData({
            states: true,
            xiaoxi: ""
          })
        }, 2000)
    } else {
      if (re.test(_this.data.modifyTel)) {
        _this.setData({
          hadGet: false 
        })
        settime(_this);
        wx.request({
          url: _this.data.url + 'rest/verify/getcode/phone-' + _this.data.modifyTel,
          method: 'GET',
          success: function (res) {
            _this.setData({
              orderCode: res.data.code
            })
            console.log(_this.data.orderCode)
          }
        })
      } else {
        _this.setData({
          states: false,
          xiaoxi: "手机号码输入错误"
        }),
        setTimeout(function(){
          _this.setData({
            states: true,
            xiaoxi: ""
          })
        },2000)
      }
    }
  },
  modifyTels: function () {//验证验证码
    var _this = this;
    wx.request({
      url: _this.data.url + 'rest/verify/verification/phone-' + _this.data.modifyTel + '/code-' + _this.data.code,
      method: 'GET',
      success: res => {
        if (res.data == 0) {
          _this.setData({
            orderTel: _this.data.modifyTel,
            stuta: true,
            code: "",
            success: true
          })
        } else if (res.data == 1) {
          _this.setData({
            states: false,
            xiaoxi: "验证码错误",
            success: false
          }),
            setTimeout(function () {
              _this.setData({
                states: true,
                xiaoxi: ""
              })
            }, 3000)
          return;
        } else {
          _this.setData({
            states: false,
            xiaoxi: "验证码过期",
            success: false
          }),
            setTimeout(function () {
              _this.setData({
                states: true,
                xiaoxi: ""
              })
            }, 3000)
          return;
        }
      }
    })
  },
  orderCode:function(e){
    this.setData({
      orderCode: e.detail.value
    })
  },
  orderNum:function(e){
    this.setData({
      orderNum: e.detail.value
    })
  },
  orderDesc:function(e){
    this.setData({
      orderDesc: e.detail.value
    })
  },
  // chooseDesk:function(){
  //   var _this = this;
  //   wx.navigateTo({
  //     url: '../../pages/chooseDesk/index?sellerId=' + _this.data.sellerId
  //   })
  // },
  sellerOrder:function(e){
    // var formId = e.detail.formId;
    // console.log(formId);
    var _this = this;
    var reg = /(^[1-9]\d*$)/;
    if (!_this.data.name){
      _this.setData({
        states: false,
        xiaoxi: "您还有没输入姓名呢"
      }),
        setTimeout(function () {
          _this.setData({
            states: true,
            xiaoxi: ""
          })
        }, 2000)
        return;
    } else if (!_this.data.orderTel){
      _this.setData({
        states: false,
        xiaoxi: "您还有没输入电话呢"
      }),
        setTimeout(function () {
          _this.setData({
            states: true,
            xiaoxi: ""
          })
        }, 2000)
      return;
    } else if (!_this.data.orderCode) {
      _this.setData({
        states: false,
        xiaoxi: "您还有没输入验证码呢"
      }),
        setTimeout(function () {
          _this.setData({
            states: true,
            xiaoxi: ""
          })
        }, 2000)
      return;
    } else if (!_this.data.orderNum || !reg.test(_this.data.orderNum)) {
      _this.setData({
        states: false,
        xiaoxi: "您输入的人数不正确"
      }),
        setTimeout(function () {
          _this.setData({
            states: true,
            xiaoxi: ""
          })
        }, 2000)
      return;
    } 
    // else if (!_this.data.tableNum){
    //   _this.setData({
    //     states: false,
    //     xiaoxi: "您还有没选择餐桌呢"
    //   }),
    //     setTimeout(function () {
    //       _this.setData({
    //         states: true,
    //         xiaoxi: ""
    //       })
    //     }, 2000)
    //   return;
    // }
    else{
       var strdate = _this.data.date + " " + _this.data.time + ":00"
       var date = formatTimeStamp(strdate);
      wx.request({
        url: _this.data.url + 'rest/order/reserve',
        method: 'POST',
        data: {
          userId: app.globalData.id,
          userName: _this.data.name,
          gender: _this.data.sex,
          contactPhone: _this.data.orderTel,
          numberOfMeals: _this.data.orderNum,
          sellerId: _this.data.sellerId,
          tableType: _this.data.tableType,
          // tableNum: _this.data.tableNum,
          reserveTime: date,
          remark: _this.data.orderDesc
        },
        header: { 'content-type': 'application/json' },
        success: res => {
          var orderId = res.data.id
          if (res.statusCode == 200) {
            wx.request({
              url: _this.data.url + 'rest/order/reserve/orderPushInformation/orderId-' + orderId + '/formId-' + e.detail.formId,
              method:'GET',
              success:res=>{
                _this.setData({
                  hidden: false
                })
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../../pages/index/index'
                  })
                }, 2000)
              }
            })
          }
        }
      })
    }
  }
})