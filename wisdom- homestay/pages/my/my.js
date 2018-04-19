const app = getApp()
var url;
var userId;
Page({
  data: {
    nickName:"",
    avatarUrl:"",
    tele:'暂无号码',
  },
  onLoad:function(){
    url = app.globalData.url;
    userId = app.globalData.id;
  },
  onShow:function(){
    var _this = this;
    wx.request({
      url: url + 'api/user/' + userId,
      method: 'GET',
      success: function (res) {
        if (res.data.phone == null){
          _this.data.tele="暂无号码"
        }else{
          _this.data.tele = res.data.phone;
        }
        _this.setData({
          nickName: res.data.name,
          avatarUrl: res.data.headImgUrl,
          tele: _this.data.tele
        })
      }
    })
  },
  callingService: function () {
    wx.makePhoneCall({
      phoneNumber: '81803771',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  Join: function () {
    wx.makePhoneCall({
      phoneNumber: '15922994447',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  myEva:function(){
    wx.navigateTo({
      url: '../MyEva/MyEva?userId=' + userId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})