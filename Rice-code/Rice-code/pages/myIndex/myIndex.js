const app = getApp()
Page({
  data: {
    nickName:"",
    avatarUrl:""
  },
  onLoad:function(){
    var _this = this;
    wx.getUserInfo({
      success:function(res){
        _this.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
      }
    })
  },
  checkAddress:function(){
    wx.navigateTo({
      url: '../../pages/address/address?&userId=' + app.globalData.id + '&stuta=2'
    })
  },
  ontactCustomer:function(){
    wx.makePhoneCall({
      phoneNumber: '02363701181',
    })
  },
  joinUs:function(){
    wx.navigateTo({
      url: '../../pages/cooperation/cooperation'
    })
  }
})