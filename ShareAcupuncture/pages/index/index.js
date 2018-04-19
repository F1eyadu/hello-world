const app = getApp();
var url = app.globalData.url;
var appid = app.globalData.appid;
var secret = app.globalData.secret;
var workappid = app.globalData.workappid;
var userarr = [];
Page({
  data: {
    proNum: 10,
    maxproNum: 20,
    hasUserInfo: false,
    height: 200,
    zhezhaoDisplay: "none",
    buyboxDisplay: "none",
    imgShow1: "block",
    imgShow2: "none",
    downicon: "downicon.png",
    imgboxColor: "#999",
    carTuijian: "none",
    carSelf: "none",
    userMeg: [],
    serviceMeg: [],
    minboxHeight: [],
    profileShow: [],
    downDisplay: [],
    upDisplay: [],
    checkStatus: "",
    buyCar: [],
    tjBuyCar: [],
    tuijianArr: [],
    selfArr: [],
    tuijArr:[],
    selfarr:[],
    promoney: 0,
    openid: '',
    hasUserInfo: false,
    userXYmsg: "none",
    timehidden: 'none',
    stuta:false
  },
  onLoad: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var appid = appid;
        var secret = secret;
        var code = res.code;
        wx.request({
          url: url +'/rest/weixin/identity/code-' +code,
          header: {'content-type': 'application/json'},
          success: function (res) {
            var openid = res.data.openid;
            app.globalData.openid = res.data.openid;
            that.setData({
              openid: openid
            })
            wx.getUserInfo({
              success: function (res) {
                var userInfo = res.userInfo;
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;
                that.setData({
                  nickName: nickName,
                  avatarUrl: avatarUrl,
                  userInfo: userInfo
                })
                wx.request({
                  url: url + '/rest/user/save',
                  data: {
                    openId: app.globalData.openid,
                    nickName: that.data.nickName,
                    photo: that.data.avatarUrl,
                    mark: 'userSide'
                  },
                  method: "POST",
                  header: { "Content-Type": "application/x-www-form-urlencoded" },
                  success: function (res) {
                    var firstLogin = res.data.firstLogin;
                    that.setData({
                      userInfo: res.data
                    })
                    app.globalData.userInfo = res.data;
                    if (firstLogin == 1) {
                     that.setData({
                       userXYmsg:"block"
                     }) 
                    }
                  }
                })
              },
              fail: function (e) {
                wx.showModal({
                  title: '用户未授权',
                  content: '如需正常使用小程序功能，请按确定并且在【我的】页面中点击授权按钮，勾选用户信息并点击确定。',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success: function (res) {
                          if (!res.authSetting["scope.userInfo"] ) {
                            wx.getUserInfo({
                              success: function (res) {
                                var userInfo = res.userInfo;
                                var nickName = userInfo.nickName;
                                var avatarUrl = userInfo.avatarUrl;
                                that.setData({
                                  nickName: nickName,
                                  avatarUrl: avatarUrl,
                                })
                                wx.request({
                                  url: url + '/rest/user/save',
                                  data: {
                                    openId: app.globalData.openid,
                                    nickName: that.data.nickName,
                                    photo: that.data.avatarUrl,
                                    mark: 'userSide'
                                  },
                                  method: "POST",
                                  header: { "Content-Type": "application/x-www-form-urlencoded" },
                                  success: function (res) {
                                    var firstLogin = res.data.firstLogin;
                                    that.setData({
                                      userInfo: res.data
                                    })
                                    app.globalData.userInfo = res.data
                                    if (firstLogin == 1) {
                                      that.setData({
                                        userXYmsg: "block"
                                      })
                                    }
                                  }
                                })
                               },
                               fail:function(err) {//让用户退出小程序
                                  console.log(err);
                               }
                            })
                          }
                        },
                      })
                    }
                  }
                })    
              }
            })
          },
          fail: function (e) {
            console.log(e);
          }
        })
      }
    });
    that.getService();
    app.globalData.userInfo = that.data.userInfo;
  },
  getService:function() {
    var that = this;
    that.setData({
      stuta:false
    })
    var imgurl = 'https://jiuyijiuwangluokeji.com/api/servicePhoto/downloadThumbnailPathFile/file-'
    wx.request({//获取服务
      url: url + '/api/service/',
      data: {
        size: 100,
      },
      header: { 'Content-Type': 'application/json' },
      success: res => {
        if (res.statusCode == 404) {
          wx.showModal({
            title: '提示',
            content: '服务器出错了！',
          })
          return;
        }
        if (res.statusCode == 200) {
          that.setData({
            serviceMeg: res.data._embedded.services,
          })
          app.globalData.serviceMeg = that.data.serviceMeg;
          var sub = [];
          var res = that.data.serviceMeg;
          var selfArr = that.data.selfArr;
          var selfa = that.data.selfArr;
          var tjArr = that.data.tuijianArr;
          for (var i = 0; i < res.length; i++) {
            var item = res[i];
            var title = "";
            var amountTime = 0;
            var money = 0;
            if (res[i].subServices == null || res[i].subServices.length == 0) {
              selfArr.push(item);
            } else {
              tjArr.push(item);
            }
          }
          for (var i = 0; i < tjArr.length; i++) {
            tjArr[i]["bigHight"] = 500;
            tjArr[i]["downShow"] = "block";
            tjArr[i]["upShow"] = "none";
            tjArr[i]["profileShow"] = "none";
            tjArr[i]['img'] = imgurl + tjArr[i].id+'.png'
          }
          for (var i = 0; i < selfArr.length; i++) {
            selfArr[i]["bigHight"] = 500;
            selfArr[i]["downShow"] = "block";
            selfArr[i]["upShow"] = "none";
            selfArr[i]["profileShow"] = "none";
            selfArr[i]['img'] = imgurl + selfArr[i].id + '.png'
            if (selfArr[i].timeCanChange == false) {
              selfArr[i]["notime"] = "none";
            } else {
              selfArr[i]["notime"] = "inline-block";
            }
            if (selfArr[i].equipmentCanChange == false) {
              selfArr[i]["nonum"] = "none";
            } else {
              selfArr[i]["nonum"] = "inline-block";
            }
          }
          that.setData({
            selfArr: selfArr,
            zixuanArr: selfArr,
            tuijianArr: tjArr,
            selfa: selfa,
          })
        }
        that.setData({
          stuta: true
        })
      }
    })
  },
  toUser: function () {
    var that = this;
    var userInfo = that.data.userInfo;
    wx.navigateTo({
      url: '../userMain/userMain?userInfo=' + JSON.stringify(userInfo),
    })
    that.setData({
      buyboxDisplay: "none",
      zhezhaoDisplay: "none",
      imgShow1: "block",
      imgShow2: "none"
    })
  },
  toWork: function () {
    wx.navigateToMiniProgram({
      appId: workappid,
      path: 'pages/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        console.log(res)
      },
      fail:function(err) {
        console.log(err)
      }
    })
  },
  workCancel:function() {
    this.setData({
      timehidden: true
    })
  },
  downUp: function (e) {
    var that = this;
    var tjArr = that.data.tuijianArr;
    var selfArr = that.data.selfArr;
    var num = parseInt(e.currentTarget.dataset.item);
    var show = e.currentTarget.dataset.show;
    for (var i = 0; i < tjArr.length; i++) {
      tjArr[i].bigHeight = 500;
      tjArr[i].downShow = "block";
      tjArr[i].upShow = "none";
      tjArr[i].profileShow = "none";
    }
    for (var i = 0; i < selfArr.length; i++) {
      selfArr[i].bigHeight = 500;
      selfArr[i].downShow = "block";
      selfArr[i].upShow = "none";
      selfArr[i].profileShow = "none";
    }
    if (show == "t") {
      tjArr[num].bigHeight = 630;
      tjArr[num].downShow = "none";
      tjArr[num].upShow = "block";
      tjArr[num].profileShow = "block";
    } else {
      selfArr[num].bigHeight = 630;
      selfArr[num].downShow = "none";
      selfArr[num].upShow = "block";
      selfArr[num].profileShow = "block";
    }
    this.setData({
      tuijianArr: tjArr,
      selfArr: selfArr
    })
  },
  Updown: function (e) {
    var that = this;
    var tjArr = that.data.tuijianArr;
    var selfArr = that.data.selfArr;
    var num = parseInt(e.currentTarget.dataset.item);
    var show = e.currentTarget.dataset.show;
    for (var i = 0; i < tjArr.length; i++) {
      tjArr[i].bigHeight = 500
      tjArr[i].downShow = "block"
      tjArr[i].upShow = "none"
      tjArr[i].profileShow = "none"
    }
    for (var i = 0; i < selfArr.length; i++) {
      selfArr[i].bigHeight = 500
      selfArr[i].downShow = "block"
      selfArr[i].upShow = "none"
      selfArr[i].profileShow = "none"
    }
    that.setData({
      selfArr: selfArr,
      tuijianArr: tjArr
    })
  },
  selectStatus: function (e) {
    if (that.data.imgboxColor == "#f96086") {
      that.setData({
        imgboxColor: "#999"
      })
    } else {
      that.setData({
        imgboxColor: "#f96086"
      })
    }
  },
  zhezhaoHidden: function () {
    var that = this;
    that.setData({
      zhezhaoDisplay: "none",
      imgShow1: "block",
      buyboxDisplay: "none"
    })
  },
  //减少按钮
  reduceNum: function (e) {
    var that = this;
    var num = e.currentTarget.dataset.num;
    var selfArr = that.data.selfArr;
    var selfarr = that.data.selfarr;
    var selfa = that.data.selfa;
    console.log(selfa)
    if (selfArr[num].equipmentUnit >= 2*selfa[num].equipmentUnit) {
      selfArr[num].equipmentUnit = selfArr[num].equipmentUnit - selfa[num].equipmentUnit;
    } else {
      selfArr[num].equipmentUnit = selfArr[num].equipmentUnit
    }
    if (selfarr != undefined) {
      for (var i = 0; i < selfarr.length; i++) {
        if(selfarr[i].id == selfArr[num].id){
          selfarr[i].equipmentUnit = selfArr[num].equipmentUnit;
        }
      }
    }
    that.setData({
      selfArr: selfArr,
      selfarr: selfarr
    })
  },
  addNum: function (e) {
    var that = this;
    var num = e.currentTarget.dataset.num;
    var selfArr = that.data.selfArr;
    var selfarr = that.data.selfarr;
    var selfa = that.data.selfa;
    selfArr[num].equipmentUnit = selfArr[num].equipmentUnit + selfa[num].equipmentUnit
    if (selfarr != undefined) {
      for (var i = 0; i < selfarr.length; i++) {
        if (selfarr[i].id == selfArr[num].id) {
          selfarr[i].equipmentUnit = selfArr[num].equipmentUnit;
        }
      }
    }
    that.setData({
      selfArr: selfArr,
      selfarr: selfarr
    })
  },
  reduceTime: function (e) {
    var that = this;
    var num = e.currentTarget.dataset.num;
    var selfArr = that.data.selfArr;
    var selfarr = that.data.selfarr;
    var selfa = that.data.selfa;
    if (selfArr[num].timeUnit >= 2*selfa[num].timeUnit) {
      selfArr[num].timeUnit = selfArr[num].timeUnit - selfa[num].timeUnit;
    } else {
      selfArr[num].timeUnit = selfArr[num].timeUnit;
    }
    if (selfarr != undefined) {
      for (var i = 0; i < selfarr.length; i++) {
        if (selfarr[i].id == selfArr[num].id) {
          selfarr[i].timeUnit = selfArr[num].timeUnit;
        }
      }
    }
    that.setData({
      selfArr: selfArr,
      selfarr: selfarr
    })
  },
  addTime: function (e) {
    var that = this;
    var num = e.currentTarget.dataset.num;
    var selfArr = that.data.selfArr;
    var selfarr = that.data.selfarr;
    var selfa = that.data.selfa;
    selfArr[num].timeUnit = selfArr[num].timeUnit + selfa[num].timeUnit;
    if (selfarr != undefined) {
      for (var i = 0; i < selfarr.length; i++) {
        if (selfarr[i].id == selfArr[num].id) {
          selfarr[i].timeUnit = selfArr[num].timeUnit;
        }
      }
    }
    that.setData({
      selfArr: selfArr,
      selfarr: selfarr
    })
  },//判断选中的checkbox
  checkboxChange: function (e) {
    var that = this;
    var tuijArr = [];
    var tjArr = e.detail.value;
    for (var i = 0; i < tjArr.length; i++) {
      tuijArr.push(that.data.tuijianArr[tjArr[i]]);
    }
    that.setData({
      tuijArr: tuijArr
    })
    if (that.data.tuijArr.length == 0) {
      that.setData({
        carTuijian: "none"
      })
    } else {
      that.setData({
        carTuijian: "block"
      })
    }
  },
  selfcheckboxChange: function (e) {
    var that = this;
    var selfarr = []
    var self = e.detail.value;
    for (var i = 0; i < self.length; i++) {
      selfarr.push(that.data.selfArr[self[i]]);
      selfarr[i].priceTotal = that.data.selfArr[self[i]].price;
    }
    that.setData({
      selfarr: selfarr
    })
    if (that.data.selfarr == 0) {
      that.setData({
        carSelf: "none"
      })
    } else {
      that.setData({
        carSelf: "block"
      })
    }
  },
  buyCarBtn1: function () {
    var that = this;
    var price = 0;
    var selfa = that.data.selfarr;
    var tuij = that.data.tuijArr;
    var zixuanArr = that.data.zixuanArr;
    this.setData({
      selfarr: selfa
    })
    if (selfa != undefined) {
      for (var i = 0; i < selfa.length;i++) {
        for (var j = 0; j < zixuanArr.length; j++) {
          if (selfa[i].id == zixuanArr[j].id) {
            var priceTotal = zixuanArr[j].price * (this.data.selfarr[i].equipmentUnit / zixuanArr[j].equipmentUnit * this.data.selfarr[i].timeUnit / zixuanArr[j].timeUnit);
            priceTotal = priceTotal*100;
            priceTotal = Math.round(priceTotal);
            selfa[i].priceTotal = priceTotal/100;
          }
        }
        that.setData({
          selfarr: selfa
        })
      }
    }
    if (tuij.length != 0) {
      for (var i = 0; i < tuij.length; i++) {
        price = price + tuij[i].price * 100;
      }
    }
    if (selfa.length != 0) {
      for (var i = 0; i < selfa.length; i++) {
        price = price + selfa[i].priceTotal * 100
      }
    }
    price = parseFloat(price / 100).toFixed(2);
    that.setData({
      buyboxDisplay: "block",
      zhezhaoDisplay: "block",
      imgShow1: "none",
      imgShow2: "block",
      price: price
    })
  },
  buyCarBtn2: function () {
    var that = this;
    that.setData({
      buyboxDisplay: "none",
      zhezhaoDisplay: "none",
      imgShow1: "block",
      imgShow2: "none"
    })
  },
  gotoSelect: function () {
    var that = this; 
    var userInfo = that.data.userInfo;
    if (userInfo == undefined) {
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
                          openId: app.globalData.openid,
                          nickName: that.data.nickName,
                          photo: that.data.avatarUrl,
                          mark: 'userSide'
                        },
                        method: "POST",
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        success: function (res) {
                          that.setData({
                            userInfo: res.data
                          })
                          app.globalData.userInfo = res.data
                          if (status == 1) {
                            that.setData({
                              userXYmsg: "block"
                            })
                          }
                          var selfa = that.data.selfarr;
                          var tuij = that.data.tuijArr;
                          var self = that.data.selfarr;
                          var price = 0;
                          var zixuanArr = that.data.zixuanArr;
                          if (selfa.length != 0) {
                            for (var i = 0; i < selfa.length; i++) {
                              for (var j = 0; j < zixuanArr.length; j++) {
                                if (selfa[i].id == zixuanArr[j].id) {
                                  var priceTotal = zixuanArr[j].price * (that.data.selfarr[i].equipmentUnit / zixuanArr[j].equipmentUnit * that.data.selfarr[i].timeUnit / zixuanArr[j].timeUnit)                         
                                  priceTotal = priceTotal * 100;
                                  priceTotal = Math.round(priceTotal);
                                  selfa[i].priceTotal = priceTotal / 100;
                                }
                              }
                              that.setData({
                                selfarr: selfa
                              })
                            }
                          }
                          
                          if (tuij.length != 0) {
                            for (var i = 0; i < tuij.length; i++) {
                              price = price + tuij[i].price;
                            }
                          }
                          if (selfa.length !=0) {
                            for (var i = 0; i < selfa.length; i++) {
                              price = price + selfa[i].priceTotal
                            }
                          }
                          that.setData({
                            price: price
                          })
                          if (selfa.length == 0 && tuij.length == 0) {
                            wx.showToast({
                              icon: 'loading',
                              title: '请选择服务',
                            })
                          }else {
                            var serArr = [];
                            if (tuij.length != 0) {
                              for (var i = 0; i < tuij.length; i++) {
                                serArr.push(tuij[i]);
                              }
                            }
                            if (self.length != 0) {
                              for (var i = 0; i < self.length; i++) {
                                serArr.push(self[i]);
                              }
                            }
                            that.gotoCase(tuij, userInfo, self, that.data.price, serArr);
                          }
                        }
                      })
                    },
                    fail: function (err) {}
                  })
                }
              }
            })
          }
        }
      }) 
    }else {
      var selfa = that.data.selfarr;
      var tuij = that.data.tuijArr;
      var self = that.data.selfarr;
      var price = 0;
      var zixuanArr = that.data.zixuanArr;
      if (selfa.length != 0) {
        for (var i = 0; i < selfa.length; i++) {
          for (var j = 0; j < zixuanArr.length; j++) {
            if (selfa[i].id == zixuanArr[j].id) {
              var priceTotal = zixuanArr[j].price * (that.data.selfarr[i].equipmentUnit / zixuanArr[j].equipmentUnit * that.data.selfarr[i].timeUnit / zixuanArr[j].timeUnit)
              
              priceTotal = priceTotal * 100;
              priceTotal = Math.round(priceTotal);
              selfa[i].priceTotal = priceTotal / 100;
            }
          }
          that.setData({
            selfarr: selfa
          })
        }
      }
      if (tuij.length != 0) {
        for (var i = 0; i < tuij.length; i++) {
          price = price + tuij[i].price*100;
        }
      }
      if (selfa.length != 0) {
        for (var i = 0; i < selfa.length; i++) {
          price = price + selfa[i].priceTotal*100
        }
      }
      price = parseFloat(price/100).toFixed(2);
      that.setData({
        price: price
      })
      if (selfa.length == 0 && tuij.length == 0) {
        wx.showToast({
          icon:'loading',
          title: '请选择服务',
        })
      }else {
        var serArr = [];
        if (tuij.length != 0) {
          for (var i = 0; i < tuij.length; i++) {
            serArr.push(tuij[i]);
          }
        }
        if (self.length != 0) {
          for (var i = 0; i < self.length; i++) {
            serArr.push(self[i]);
          }
        }
        that.gotoCase(tuij, userInfo, self, that.data.price, serArr);
      }
    }
  },
  xBtn: function() {
    this.setData({
      userXYmsg:"none",
    })
  },
  previewImage:function(e) {
    var imgsrc = e.currentTarget.dataset.imgsrc;
    var urls = [];
    urls.push(imgsrc);
    wx.previewImage({
      current: imgsrc,
      urls:urls,
      success:function(res) {
      },
    })
  },
  gotoCase: function (tuij, userInfo, self, price, serArr) {
    wx.navigateTo({
      url: '../orderCase/orderCase?tuijian=' + JSON.stringify(tuij) + '&userInfo=' + JSON.stringify(userInfo) + '&self=' + JSON.stringify(self) + '&price=' + price + '&serArr=' + JSON.stringify(serArr)
    })
  },
  onShareAppMessage: function () {//分享小程序
    return {
      title: '共享针灸',
      desc: '共享针灸',
      path: '/pages/index/index'
    }
  },
})
