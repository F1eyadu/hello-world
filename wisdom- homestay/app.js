//app.js
App({
  globalData: {
    url:"https://www.nearbysource.com/",
    // url: "http://10.10.10.120:8080/",
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 获取用户信息   
    function getUserInfo(){
      wx.getUserInfo({
        success: function (res) {
          const openId = getApp().globalData.openId;
          const url = getApp().globalData.url;
          wx.request({
            url: url+'rest/user/save',
            method: 'POST',
             header: { 'Content-Type': 'application/json' },
             data: { 'openId': openId, 'name': res.userInfo.nickName, 'headImgUrl': res.userInfo.avatarUrl},
            success:function(res){
              var id = res.data.user.id
              const app = getApp();
              app.globalData.id = id;
              app.globalData.index = res.data.firstLogin;
            }
          })
        },
      })
    } 
    // 登录
    wx.login({
      //获取code
      success: function (res) {
        var code = res.code; //返回code
        var appId = 'wx4b0f2138ab877828';
        var secret = '78875c43ab1ebd199113918f06a400c3';
        const url = getApp().globalData.url;
        wx.request({
          url: url + 'rest/weixin/identity/code-' + code,
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var openid = res.data.openid //返回openid
            const app = getApp();
            app.globalData.openId = openid;
            getUserInfo()
          }
        })
      }
    })
  }
})