const app = getApp();
Page({
  onLoad: function (options) {
    var user = app.globalData.userInfo;
      this.setData({
        userInfo: user,
        photo: user.userInfo.photo,
        nickName: user.userInfo.nickName
      })
    },
    gotoOrder:function(e){
      var userInfo = this.data.userInfo;
        wx.navigateTo({
          url: '../order-going/order-going?userInfo=' + JSON.stringify(userInfo),
        })
    },
    gotoDeposit: function () {
      var userInfo = this.data.userInfo;
      wx.navigateTo({
        url: '../deposit/deposit?userInfo=' + JSON.stringify(userInfo),
      })
    },
    phone:function() {
      wx.makePhoneCall({
        phoneNumber: '13677678944'
      })
    }
})