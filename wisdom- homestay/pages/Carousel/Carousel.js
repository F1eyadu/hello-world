const app=getApp();
Page({
  data: {
    url:"",
    Advs:[],
    imgArr:[ ],
  },
  onLoad:function(e){
    var _this = this;
    var AdvId = e.Advid;
    _this.data.url = app.globalData.url;
    wx.request({
      url: _this.data.url+'api/advertisement',
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        var data = res.data._embedded.advertisements;
        // console.log(data);
        for(let i in data){
          if (data[i].id == AdvId){
            var imgs = data[i].advertisementPhoto.split(",");
            var imgArr=[];
            for(let n in imgs){
              imgArr.push(imgs[n]);
            }
            _this.data.imgArr.push(imgArr)
            _this.setData({
              Advs: data[i],
              imgArr: _this.data.imgArr,
              url: _this.data.url
            })
          }
        }
      }
    })
  },
  // onShareAppMessage:function(res){
  //   var _this = this;
  //   return {
  //     title: '分享此页面获得代金券奖励',
  //     success: function (res) {
  //       wx.request({
  //         url: _this.data.url + 'rest/users/coupon/openid-' + app.globalData.openId + '/state-1',
  //         method: 'GET',
  //         success: function (res) {
  //           console.log(res)
  //           // console.log(app.globalData.openId);
  //           // console.log(app.globalData.index);
  //         }
  //       })
  //     },
  //     fail: function (res) {
  //       console.log("2")
  //     }
  //   }
  // }
})