const app=getApp()
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
Page({
  data: {
    userId:"",
    userName: "",
    userSex: "先生",
    userTel: "",
    location: [],
    address:"",
    // district: "",
    // street: "",
    desclocation: "",
    show: true,
    message: "",
    url: "",
    wait:true,
    stuta:true,
    hadGet: true,
    modifyTel: "",
    code:""
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      url: app.globalData.url,
      userId: e.userId
    })
  },
  addUserName: function (e) {//輸入姓名
    this.setData({
      userName: e.detail.value
    })
  },
  chooseSex: function (e) {//选择性别
    this.setData({
      userSex: e.currentTarget.dataset.sex
    })
  },
  addUserTel: function () {//输入用户手机号码
    this.setData({
      stuta: false
    })
  },
  hideModal: function () {
    this.setData({
      stuta: true
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
  getyzm: function () {//获取验证码
    var _this = this;
    var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
    if (countdown < 60) {
      _this.setData({
        show: false,
        message: '验证码已经发送到您手机'
      }),
        setTimeout(function () {
          _this.setData({
            show: true,
            message: ""
          })
        }, 2000)
    } else {
      if (!reg.test(_this.data.modifyTel)) {
        _this.setData({
          show: false,
          message: "你输入的手机号不正确"
        }),
          setTimeout(function () {
            _this.setData({
              show: true,
              message: ""
            })
          }, 3000)
      } else {
        _this.setData({
          hadGet: false
        })
        settime(_this);
        wx.request({
          url: _this.data.url + 'rest/verify/getcode/phone-' + _this.data.modifyTel,
          method: 'GET',
          success: res => {
            console.log(res.data.code);
          }
        })
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
            userTel: _this.data.modifyTel,
            stuta: true,
            code: "",
            success: true
          })
        } else if (res.data == 1) {
          _this.setData({
            show: false,
            message: "验证码错误",
            success: false
          }),
            setTimeout(function () {
              _this.setData({
                show: true,
                message: ""
              })
            }, 3000)
          return;
        } else {
          _this.setData({
            show: false,
            message: "验证码过期",
            success: false
          }),
            setTimeout(function () {
              _this.setData({
                show: true,
                message: ""
              })
            }, 3000)
          return;
        }
      }
    })
  },

  getLocation: function () {//获取用户的地理位置
    var _this = this;
    wx.chooseLocation({
      type: 'gcj02',
      success: function (res) {
        _this.data.location = [];
        _this.data.location.push(res.longitude, res.latitude);
        _this.setData({
          location: _this.data.location,
          address: res.address
        })
      },
    })
    // return
    // _this.setData({
    //   wait:false
    // })
    // wx.getLocation({
    //   success: function (res) {
    //     location = res.longitude + "," + res.latitude;
    //     _this.data.location.push(res.longitude, res.latitude);
    //     _this.setData({
    //       location: _this.data.location
    //     })
    //     wx.request({
    //       url: 'https://api.map.baidu.com/geocoder/v2/?ak=1Rbtm1PmlDGzUW93EqWRTL3MDwnsBv9y&location=' + res.latitude + ',' + res.longitude + '&output=json&coordtype=wgs84ll',
    //       header: { 'Content-Type': 'application/xml' },
    //       dataType: 'json',
    //       success: function (ops) {
    //         _this.setData({
    //           wait: true,
    //           district: ops.data.result.addressComponent.district,
    //           street: ops.data.result.addressComponent.street,
    //         })
    //       }
    //     })
    //   },
    //   fail: function () {
    //     console.log("fail");
    //   }
    // })
  },
  // address:function(e){
  //   var _this = this;
  //   _this.setData({
  //     district: e.detail.value,
  //     street:""
  //   })
  // },
  desclocation: function (e) {//输入详细位置
    this.setData({
      desclocation: e.detail.value
    })
  },
  confrim: function () {//完成填写信息
    var _this = this;
    var reg = /^1\d{10}$/;
    if (_this.data.userName == "") {
      _this.setData({
        show: false,
        message: "你还没填写名字"
      }),
        setTimeout(function () {
          _this.setData({
            show: true,
            message: ""
          })
        }, 3000)
      return;
    } else if (_this.data.userSex == "") {
      _this.setData({
        show: false,
        message: "你还没选择性别"
      }),
        setTimeout(function () {
          _this.setData({
            show: true,
            message: ""
          })
        }, 3000)
      return;
    } else if (_this.data.userTel == "" || !reg.test(_this.data.userTel)) {
      _this.setData({
        show: false,
        message: "你输入手机号有误"
      }),
        setTimeout(function () {
          _this.setData({
            show: true,
            message: "",
            userTel: ""
          })
        }, 3000)
      return;
    } else if (_this.data.desclocation == "") {
      _this.setData({
        show: false,
        message: "你还未填写详细地址"
      }),
        setTimeout(function () {
          _this.setData({
            show: true,
            message: "",
          })
        }, 3000)
      return;
    } else if (_this.data.address == "") {
      _this.setData({
        show: false,
        message: "点击图标获取位置"
      }),
        setTimeout(function () {
          _this.setData({
            show: true,
            message: "",
          })
        }, 3000)
      return;
    } else {
      _this.setData({
        wait:false
      })
      var address = {
        name: _this.data.userName,
        sex: _this.data.userSex,
        phone: _this.data.userTel,
        position: _this.data.location,
        address: _this.data.address + _this.data.desclocation
      }
      wx.request({
        url: _this.data.url + 'rest/user/addUserAddress/userId-' + _this.data.userId,
        method: "POST",
        data: JSON.stringify(address),
        header: { 'Content-Type': 'application/json; charset=UTF-8' },
        success: res => {
          if (res.data.code == 200) {
            _this.setData({
              wait: true
            })
            _this.setData({
              show: false,
              message: "添加信息成功"
            }),
              setTimeout(function () {
                _this.setData({
                  show: true,
                  message: "",
                })
              }, 3000)
              wx.navigateBack({
                url: '../../pages/address/address?userId=' + _this.data.userId
              })
          }
        }
      })
    }
  }
})