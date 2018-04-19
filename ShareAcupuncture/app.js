//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: [],
    openid:'',
    serviceMeg:'',
    appid:'wx2140ff36c0afc8f4',
    secret: '698dfc8bc7ca8eb5b64a1e220a3e6fdd',
    workappid:'wx2b0d029d59f5bb9d',
    // url: "http://10.10.10.100:8080/",
    url: "https://jiuyijiuwangluokeji.com",
    timeDiffer: function (time) {
      var nowTime = new Date().getTime();
      var arr = [];
      time = time.replace('-', '/');
      time = time.replace('-', '/');
      arr = time.split('.');
      time = arr[0];
      time = time.replace('T', ' ')
      time = new Date(time).getTime();
      var TimeDiffer = nowTime - time;
      TimeDiffer = parseInt(TimeDiffer / 1000) - 28800;
      return TimeDiffer
    },
  },
})