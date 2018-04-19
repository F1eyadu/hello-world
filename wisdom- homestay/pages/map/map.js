// pages/map/map.js
const app = getApp()
var url;
Page({
  data: {
    houseId:null,
    latitude:null,
    longitude:null
  },
  onLoad: function (options) {
    url = app.globalData.url;
    this.setData({
      houseId: options.houseId
    })
  },
  onShow:function(){
    wx.request({
      url: url + 'api/house/' + this.data.houseId,
      method: 'GET',
      success: res => {
        console.log(res);
        this.data.longitude = res.data.location[0];
        this.data.latitude = res.data.location[1];
        wx.openLocation({
          latitude: this.data.latitude,
          longitude: this.data.longitude,
          name: res.data.houseName,
          address: res.data.houseAddress,
          scale: 28
        })
        this.setData({
          longitude: this.data.longitude,
          latitude: this.data.latitude,
        })
      }
    })
  },
  // onHide:function(){
  //   wx.navigateBack({
  //   delta: 1,
  // })
  // }
})