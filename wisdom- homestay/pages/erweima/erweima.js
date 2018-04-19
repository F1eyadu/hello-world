const app = getApp()
Page({
  data: {
    erweima:""
  },
  onLoad:function(e){
    var _this = this;
    _this.setData({
      erweima:e.url
    })
  }
})