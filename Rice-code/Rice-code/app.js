//app 
App({
  globalData: {
    // table:"",
    addressId: "",
    // url: "https://www.cqchuangfu.com/api/",
    url:"http://10.10.10.100:8080/"
  },
  onLaunch: function () {
    // 展示本地存储能力
     var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  // 登录
  huoqu: function () {
    wx.login({
      success: function (res) {
        var code = res.code; //返回code
        const app = getApp();
        const url = app.globalData.url;
        wx.request({
          url:url+'rest/weixin/identity/code-' + code,
          method: 'GET',
          //header: { 'Content-Type': 'application/json' },
          success: function (res) {
            var openid = res.data.openid //返回openid
            app.globalData.openId = openid;
            wx.getSetting({
              success: res => {
                wx.getUserInfo({
                  success: function (res) {
                    const openId = app.globalData.openId;
                    wx.request({
                      url: url +'rest/user/save',
                      method: 'POST',
                      header: { 'Content-Type': 'application/json' },
                      data: { 'openId': openId, 'name': res.userInfo.nickName, 'headImgUrl': res.userInfo.avatarUrl },
                      success: function (res) {
                        app.globalData.id = res.data.user.id; 
                        app.globalData.index = res.data.firstLogin;
                        app.globalData.weChatInfo = res.data.user.weChatInfo;
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})