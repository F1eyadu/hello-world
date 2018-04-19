const app=getApp()
var getAddress=function(_this){
  wx.request({
    url: _this.data.url + 'api/user/' + _this.data.userId,
    method: 'GET',
    success: res => {
      _this.data.userInfo = res.data.addressList
      _this.setData({
        userInfo: _this.data.userInfo
      })
    }
  })
}
Page({
  data: {
    url:"",
    stuta:"",
    userId: "",
    userInfo:[],
    sellerId:"",
    orderId:"",
    deletes:true,
    deleteId:""
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      url: app.globalData.url,
      stuta: e.stuta,
      userId: e.userId,
    })
  },
  onShow:function(){
    var _this = this;
    getAddress(_this);
  },
  deleteAdd:function(e){
    var _this = this;
    _this.setData({
      deletes:false,
      deleteId: e.currentTarget.dataset.id
    })
  },
  hideModal:function(){
    this.setData({
      deletes: true,
      deleteId: ""
    })
  },
  modifyTels:function(){
    var _this = this;
    _this.data.userInfo = [];
    wx.request({
      url: _this.data.url + '/rest/user/drepUserAddress/userId-' + _this.data.userId + '/addRessId-' + _this.data.deleteId,
      method: 'DELETE',
      success: res => {
        _this.setData({
          deletes: true,
          deleteId: ""
        })
        getAddress(_this);
      }
    })
  },
  // deleteAdd:function(e){
  //   var _this = this;
  //   _this.data.userInfo=[];
  //   wx.request({
  //     url: _this.data.url + '/rest/user/drepUserAddress/userId-' + _this.data.userId + '/addRessId-' + e.currentTarget.dataset.id,
  //     method:'DELETE',
  //     success:res=>{
  //       getAddress(_this);
  //     }
  //   })
  // },
  modifyAddress:function(e){
    wx.navigateTo({
      url: '../../pages/modifyAdd/modifyAdd?userId=' + this.data.userId + '&addRessId=' + e.currentTarget.dataset.id,
    })
  },
  Addposition:function(){
    wx.navigateTo({
      url: '../../pages/Newadd/Newadd?userId=' + this.data.userId
    })
  },
  setDefault:function(e){
    var _this = this;
    wx.request({
      url: _this.data.url + 'rest/user/defaultUserAddress/userId-' + _this.data.userId + '/addRessId-' + e.currentTarget.dataset.id ,
      method:'PUT',
      success:res=>{
        getAddress(_this);
      }
    })
  },
  chooseAddress:function(e){
    var _this = this;
    if (_this.data.stuta==1){
      _this.data.userInfo.map(function (x) {
        if (x.id == e.currentTarget.dataset.id) {
          app.globalData.addressId = x.id;
        }
      })
      wx.navigateBack()
    } else if (_this.data.stuta == 2){
      app.globalData.addressId ="";
    }
  }
})