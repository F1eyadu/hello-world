const app = getApp()
var countdown = 60;
var chooseTime;
var houseId;
var fileNamess;
var url;
var settime = function (that) {//获取验证码
  if (countdown == 0) {
    that.setData({
      is_show: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })

    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
}

function MathRand() {
  var Num = "";
  for (let i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  fileNamess = Num;
}

function GetDateDiff(startDate, endDate) {
  var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
  var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
  var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
  return dates;
}  

function convertDateFromString(dateString) {
  if (dateString) {
    var arr1 = dateString.split(" ");
    var sdate = arr1[0].split('-');
    var sdate1 = arr1[1].split(':');
    var date = new Date(sdate[0], sdate[1] - 1, sdate[2], sdate1[0], sdate1[1], sdate1[2]);
    return date;
  }
}
Page({
  data: {
    last_time: '',
    is_show: true,
    info:"",
    stuta:true,
     others:[],
     userNum:2,
     srcf:"",
     srcb:"",
     userName: '',
     userTel: "",
     CardPhotoFront:"",
     CardPhotoReverse:"",
     fasong:"",
     yzm:"",
      photo:{
        userNums:"",
        userName:"",
        srcF:"",
        srcB:"",
        CardPhotoFront: "",
        CardPhotoReverse: "",
      },
    price:"",
    userId:"",
    hidden:true,
    xiaoxi:""
  },
  onLoad:function(e){
    var _this = this;
    url = app.globalData.url;
    chooseTime = JSON.parse(e.time);
    houseId = e.houseId;
    var aaa = app.globalData.id;
    _this.setData({
      userId:aaa
    })
    //console.log(_this.data.userId);
    wx.request({
      url: url+'api/house/' + e.houseId,
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      success:function(res){
        _this.setData({
          price: res.data.houseBalance
        })
      }
    })
    MathRand()
    wx.request({//查询用户信息
      url: url + 'api/user/' + _this.data.userId,
      method: 'GET',
      success:function(res){
        var data = res.data.cardauthentications;
        if(data!=null){
          fileNamess = data[0].fileName;
          var other = data.slice(1, 9999);
          var otherss=[];
          other.map(function(x,y){
            var ss={}
            ss.userNums = y+1;
            ss.userName = x.realName;
            ss.CardPhotoFront = x.idCardPhotoFront;
            ss.CardPhotoReverse = x.idCardPhotoReverse;
            ss.srcF = url + 'rest/Photo/download/photoType-cardAuthentication/fileName-' + x.fileName + '/file-' + x.idCardPhotoFront;
            ss.srcB = url + 'rest/Photo/download/photoType-cardAuthentication/fileName-' + x.fileName + '/file-' + x.idCardPhotoReverse;
            otherss.push(ss);
          })
          _this.setData({
            userNum: other.length+1,
            userName: data[0].realName,
            userTel: res.data.phone,
            srcf: url + 'rest/Photo/download/photoType-cardAuthentication/fileName-' + data[0].fileName + '/file-' + data[0].idCardPhotoFront,
            srcb: url + 'rest/Photo/download/photoType-cardAuthentication/fileName-' + data[0].fileName + '/file-' + data[0].idCardPhotoReverse,
            CardPhotoFront: data[0].idCardPhotoFront,
            CardPhotoReverse: data[0].idCardPhotoReverse,
            others: otherss
          })
        }
      }
    })
  },
  onShow:function(){
    // if (countdown<60){
    //   this.setData({
    //     is_show: false,
    //     last_time: countdown
    //   })
    // }
  },
  addUser:function(e){//添加新的入住人
    var numBer = this.data.userNum;
    this.data.photo.userNums = numBer;
    this.data.others.push(this.data.photo);
    this.setData({
      others: this.data.others,
      userNum: numBer + 1
    })
    console.log(this.data.others)
  },
  DeleteInfo:function(e){//删除新的入住人
    var _this = this;
    var userNums = e.currentTarget.dataset.index;
    console.log(userNums);
     var Others = _this.data.others;
     var NewOthers=[];
     for (var i in Others) {
       var item = Others[i];
       if (item.userNums != userNums) {
         NewOthers.push(item);
       }
     } 
     console.log(NewOthers)
    _this.setData({
      others: NewOthers
    })
  },
  addPhotof:function(e){//添加入住人1正面照片
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], 
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var fileName;
        var Num = "";
        for (let i = 0; i < 6; i++) {
          Num += Math.floor(Math.random() * 10);
        }
        fileName = Num;
        var imgArr = tempFilePaths[0].split(".");
        fileName = fileName +"."+ imgArr[imgArr.length-1];
        wx.uploadFile({
          url: url + 'rest/orders/order/cardPhotoUpload/type-cardAuthentication/path-' + fileNamess + '/name-' + fileName +'?state=0',
          filePath: tempFilePaths[0],
          name: 'file',
          success:function(res){
            if (res.statusCode ==406){
              _this.setData({
                srcf: tempFilePaths,
                CardPhotoFront: fileName,
                hidden: false,
                xiaoxi: "上传成功"
              }),
                setTimeout(function () {
                  _this.setData({
                    hidden: true,
                    xiaoxi: ""
                  })
                }, 2000)
            };
          if(res.statusCode ==500){
              _this.setData({
                srcf: "",
                CardPhotoFront: "",
                hidden: false,
                xiaoxi: "身份证错误，请重新上传"
              }),
                setTimeout(function () {
                  _this.setData({
                    hidden: true,
                    xiaoxi: ""
                  })
                }, 2000)
            }
          }
        })
        // _this.setData({
        //   srcf: tempFilePaths,
        //   CardPhotoFront: fileName
        // })
      }
    })
    
  },
  addPhotob: function (e) {//添加入住人1背面照片
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var fileName;
        var Num = "";
        for (let i = 0; i < 6; i++) {
          Num += Math.floor(Math.random() * 10);
        }
        fileName = Num;
        var imgArr = tempFilePaths[0].split(".");
        fileName = fileName + "." + imgArr[imgArr.length - 1];
        wx.uploadFile({
          url: url + 'rest/orders/order/cardPhotoUpload/type-cardAuthentication/path-' + fileNamess + '/name-' + fileName + '?state=1',
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            if (res.statusCode == 406) {
              _this.setData({
                srcb: tempFilePaths,
                CardPhotoReverse: fileName,
                hidden: false,
                xiaoxi: "上传成功"
              }),
                setTimeout(function () {
                  _this.setData({
                    hidden: true,
                    xiaoxi: ""
                  })
                }, 2000)
            };
            if (res.statusCode == 500) {
              _this.setData({
                srcb: "",
                CardPhotoReverse: "",
                hidden: false,
                xiaoxi: "身份证错误，请重新上传"
              }),
                setTimeout(function () {
                  _this.setData({
                    hidden: true,
                    xiaoxi: ""
                  })
                }, 2000)
            }
          }
        })
      }
    })
  },
  addPhotoF:function(e){//新增入住人正面
    var _this = this;
    var index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        _this.data.others[index].srcF = tempFilePaths[0];
        _this.setData({
          others: _this.data.others,
        })
        var fileName;
        var Num = "";
        for (let i = 0; i < 6; i++) {
          Num += Math.floor(Math.random() * 10);
        }
        fileName = Num;
        var imgArr = tempFilePaths[0].split(".");
        fileName = fileName + "." + imgArr[imgArr.length - 1];
        _this.data.others[index].CardPhotoFront = fileName
        wx.uploadFile({
          url: url + 'rest/orders/order/cardPhotoUpload/type-cardAuthentication/path-' + fileNamess + '/name-' + fileName + '?state=0',
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            if (res.statusCode == 406) {
              _this.setData({
                others: _this.data.others,
                hidden: false,
                xiaoxi: "上传成功"
              }),
                setTimeout(function () {
                  _this.setData({
                    hidden: true,
                    xiaoxi: ""
                  })
                }, 2000)
            };
            if (res.statusCode == 500) {
              _this.setData({
                srcb: "",
                CardPhotoReverse: "",
                hidden: false,
                xiaoxi: "身份证错误，请重新上传"
              }),
                setTimeout(function () {
                  _this.setData({
                    hidden: true,
                    xiaoxi: ""
                  })
                }, 2000)
            }
          }
        })
      }
    })
  },
  addPhotoB: function (e) {//新增入住人背面
    var _this = this;
    var index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        _this.data.others[index].srcB = tempFilePaths[0];
        _this.setData({
          others: _this.data.others,
        })
        var fileName;
        var Num = "";
        for (let i = 0; i < 6; i++) {
          Num += Math.floor(Math.random() * 10);
        }
        fileName = Num;
        var imgArr = tempFilePaths[0].split(".");
        fileName = fileName + "." + imgArr[imgArr.length - 1];
        _this.data.others[index].CardPhotoReverse = fileName
        wx.uploadFile({
          url: url + 'rest/orders/order/cardPhotoUpload/type-cardAuthentication/path-' + fileNamess + '/name-' + fileName + '?state=1',
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            if (res.statusCode == 406) {
              _this.setData({
                others: _this.data.others,
                hidden: false,
                xiaoxi: "上传成功"
              }),
                setTimeout(function () {
                  _this.setData({
                    hidden: true,
                    xiaoxi: ""
                  })
                }, 2000)
            };
            if (res.statusCode == 500) {
              _this.setData({
                srcb: "",
                CardPhotoReverse: "",
                hidden: false,
                xiaoxi: "身份证错误，请重新上传"
              }),
                setTimeout(function () {
                  _this.setData({
                    hidden: true,
                    xiaoxi: ""
                  })
                }, 2000)
            }
          }
        })
      }
    })
  },
  userNameInput:function(e){//入住人1的姓名
    this.setData({
      userName: e.detail.value
    })
  },
  telInput: function (e) {//入住人1手机号
    this.setData({
      userTel: e.detail.value
    })
  },
  yzmInput: function (e) {//验证码
    this.setData({
      yzm: e.detail.value
    })
  },
  OtherName:function(e){//其他用户的姓名
    var _this = this;
    var index = e.currentTarget.dataset.index;
    _this.data.others[index].userName = e.detail.value;
    _this.setData({
      others: _this.data.others,
    })
  },
  Active:function(e){//获取验证码
    var that = this;
    var re = /^1\d{10}$/;
    if (countdown<60){
      console.log("111")
      that.setData({
        hidden: false,
        xiaoxi:'验证码已经发送到您手机，请注意查收'
      }),
      setTimeout(function () {
          that.setData({
            hidden: true,
            xiaoxi: ""
          })
        }, 2000)
    }else{
      if (re.test(that.data.userTel)) {
      that.setData({
        is_show: (!that.data.is_show)  //false
      })
      settime(that);
      wx.request({
        url: url+'rest/verify/getcode/phone-' + that.data.userTel,
        method: 'GET',
        success: function (res) {
          that.setData({
            fasong:res.data.code
          })
          console.log(that.data.fasong)
        }
      })
    }else{
      that.setData({
        stuta: !that.data.stuta,
        info:"手机号码输入错误"
      })
    }
    }
  },
  cancel:function(){
    this.setData({
      stuta: !this.data.stuta,
    })
  },
  fasong:function(){//验证验证码
  if(this.data.yzm == this.data.fasong){
    wx.request({
      url: url+"rest/verify/verification/phone-" + this.data.userTel + "/code-" + this.data.yzm + "",
      method: 'GET',
      success: function (res) {
        //console.log(res)
      }
    })
  }else{
    this.setData({
      stuta: !this.data.stuta,
      info: "验证码输入错误"
    })
  }  
},
  orderHouse:function(){//点击下一步
    var time1 = chooseTime.startTime+' 13:00:00';
    var time2 = chooseTime.endTime + ' 15:00:00';
    var startTime = convertDateFromString(time1);
    var endTime = convertDateFromString(time2);
  var _this = this
  var numbers = _this.data.others.length + 1;
    var day = GetDateDiff(chooseTime.startTime, chooseTime.endTime)
    var money = day * _this.data.price;
    var Infos=[];
    var info={};
    info.realName = _this.data.userName;
    info.idCardPhotoFront = _this.data.CardPhotoFront;
    info.idCardPhotoReverse = _this.data.CardPhotoReverse;
    info.fileName = fileNamess;
    Infos.push(info);
    _this.data.others.map(function(x){
      var infoss ={};
      infoss.realName = x.userName;
      infoss.idCardPhotoFront = x.CardPhotoFront;
      infoss.idCardPhotoReverse = x.CardPhotoReverse;
      infoss.fileName = fileNamess;
      Infos.push(infoss);
    })
    if (_this.data.userName != "" && _this.data.srcf != "" && _this.data.srcb != ""){
      wx.request({
        url: url + "rest/verify/verification/phone-" + _this.data.userTel + "/code-" + _this.data.yzm,
        method: 'GET',
        success: function (res) {
          if (res.data == 0) {
            // console.log(Infos)
            // console.log(_this.data.userId)
            // console.log(_this.data.userTel)
            // console.log(houseId)
            // console.log(_this.data.CardPhotoFront)
            // console.log(_this.data.CardPhotoReverse)
            wx.request({
              url: url + "rest/orders/order/addOrder",
              header: { 'Content-Type': 'application/json' },
              method: 'POST',
              data: {
                'user': {
                  'id': _this.data.userId,
                  'phone': _this.data.userTel
                },
                'house': { 'id': houseId },
                'tenant': numbers,
                'startTime':startTime,
                'endTime': endTime,
                'balance': money,
                'cardauthentications': Infos
              },
              success: function (res) {
                console.log(res);
                if (res.data.code == 200) {
                  var orderId = res.data.msg;
                  wx.navigateTo({
                    url: "../Reserve/Reserve?orderId=" + orderId,
                    success: function (res) {
                      // console.log("success");
                    }
                  })
                }
                if (res.data.code == 500){
                  _this.setData({
                    hidden: false,
                    xiaoxi: res.data.msg
                  }),
                    setTimeout(function () {
                      _this.setData({
                        hidden: true,
                        xiaoxi: ""
                      })
                    }, 2000)
                }
              },
              fail: function (res) {
                console.log(res);
              }
            })
          } else {
            _this.setData({
              hidden: false,
              xiaoxi: "手机号码和验证码不匹配"
            }),
              setTimeout(function () {
                _this.setData({
                  hidden: true,
                  xiaoxi: ""
                })
              }, 2000)
          }
        }
      })
    }else{
      _this.setData({
        hidden: false,
        xiaoxi: "信息填写不完整"
      }),
      setTimeout(function(){
        _this.setData({
          hidden: true,
          xiaoxi: ""
        })
      },2000)
    }
  }
})