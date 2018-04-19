const app = getApp();
Page({
  data: {
    userId: "",
    sellerId: "",
    orderId: "",
    userInfo:"",
    addRemarks:"",
    addressId:""
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      url: app.globalData.url,
      userId: e.userId,
      sellerId: e.sellerId,
      orderId: e.orderId
    })
  },
  onShow:function(){
    var _this = this;
    wx.request({
      url: _this.data.url + 'api/user/' + _this.data.userId,
      method: 'GET',
      success: res => {
        var address = res.data.addressList
        if (app.globalData.addressId){
          address.map(function (x) {
            if (x.id == app.globalData.addressId) {
              _this.data.userInfo = x;
            }
          })
          _this.setData({
            userInfo: _this.data.userInfo
          })
        }else{
          address.map(function (x) {
            if (x.isDefault == 1) {
              _this.data.userInfo = x;
            }
          })
          _this.setData({
            userInfo: _this.data.userInfo
          })
        }
      }
    })
  },
  checkAdd:function(){
    wx.navigateTo({
      url: '../../pages/address/address?userId=' + this.data.userId + '&stuta=1' 
    })
  },
  addRemarks: function (e) {//用户备注
    this.setData({
      addRemarks: e.detail.value
    })
  },
  confrim:function(){
    var _this = this;
    wx.request({
      url: _this.data.url + 'rest/orders/order/addUserNoOneAddRess/orderId-' + _this.data.orderId + '/userId-' + _this.data.userId + '?desc=' + _this.data.addRemarks + '&addressId=' + _this.data.userInfo.id,
      method: "POST",
      success:res=>{
        if(res.data.code==200){
          wx.navigateTo({
            url: '../../pages/payoff/index?sellerId=' + _this.data.sellerId + '&userId=' + _this.data.userId + '&orderId=' + _this.data.orderId + '&addressId=' + _this.data.userInfo.id
          })
        }
      }
    })
  }
})