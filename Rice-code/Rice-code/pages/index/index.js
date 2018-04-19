const app = getApp()
var page = 0;
var page_size = 5;
var times;
var location;
var urls = "";
var AllSales = function (_this){
  _this.setData({
    hidden:false     
  })
  wx.request({
    url:urls,
    method: 'GET',
    success:res=>{
    //  console.log(res);
      var data = res.data.msg;
      if(data){
        data.map(function(x){
          if (x.seller.orderStartTime){
            x.seller.orderStartTime = x.seller.orderStartTime.split(":")[0] + x.seller.orderStartTime.split(":")[1]
          }
          if (x.seller.orderEndTime){
            x.seller.orderEndTime = x.seller.orderEndTime.split(":")[0] + x.seller.orderEndTime.split(":")[1]
          }
          if (x.seller.sendOutStartTime) {
            x.seller.sendOutStartTime = x.seller.sendOutStartTime.split(":")[0] + x.seller.sendOutStartTime.split(":")[1]
          }
          if (x.seller.sendOutEndTime) {
            x.seller.sendOutEndTime = x.seller.sendOutEndTime.split(":")[0] + x.seller.sendOutEndTime.split(":")[1]
          }
          x.distance = (x.distance / 1000).toFixed(1)
          _this.data.salers.push(x)
          if (x.seller.dishes){
            var discount=[];
            x.seller.dishes.map(function(dishes){
              if (dishes.ratio!=null){
                discount.push(dishes.ratio);
              }else{
                discount.push(10);
              }
            })
            x.discount = Math.min.apply(null, discount)
          }else{
            x.discount = 10
          }
        })
        _this.setData({
          salers: _this.data.salers,
          hidden: true
        })
        page = page + 1
        //console.log(_this.data.salers)
      }
    }
  })
}
var CreatTime = function(_this){
  var d = new Date();
  var my_hours = d.getHours();
  if (my_hours < 10) {
    my_hours = "0" + my_hours
  }
  var my_minutes = d.getMinutes();
  if (my_minutes < 10) {
    my_minutes = "0" + my_minutes
  }
  var my_seconds = d.getSeconds();
  var times = my_hours.toString() + my_minutes.toString();
  _this.setData({
    time: times
  })
}
Page({
  data: {
    district:"",
    street:"",
    address:"",
    url:"",
    salers:[],
    discount:[],
    time:"",
    hidden:false
  },
  onLoad:function(){
    var _this = this;
    _this.setData({
      url: app.globalData.url,
    })
    page = 0;
    wx.getLocation({
      success: function (res) {
        location = res.longitude + "," + res.latitude;
        _this.data.location = res.longitude + "," + res.latitude;
        _this.setData({
          location: _this.data.location
        })
        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=1Rbtm1PmlDGzUW93EqWRTL3MDwnsBv9y&location=' + res.latitude + ',' + res.longitude + '&output=json&coordtype=wgs84ll',
          header: { 'Content-Type': 'application/xml' },
          dataType: 'json',
          success: function (ops) {
            _this.setData({
              district: ops.data.result.addressComponent.district,
              street: ops.data.result.addressComponent.street,
            })
            app.huoqu();
            times = setInterval(function () {
              if (app.globalData.id) {
                console.log(app.globalData.id)
                urls = _this.data.url + "rest/seller/listSellerAll?page=" + page + "&size=" + page_size + "&location=" + location + '&sellerName=' + _this.data.address,
                  AllSales(_this)
                CreatTime(_this);
                clearInterval(times)
              }
            }, 1000)
          }
        })
      },
      fail: function () {
        console.log("fail");
      }
    })
  },
  onShow:function(){
    
  },
  onHide: function () {
    clearInterval(times)
  },
  inputAdress:function(e){
    var _this = this;
    _this.setData({
      address: e.detail.value
    })
  },
  searchSales:function(){
    var _this = this;
    page = 0;
    // console.log(_this.data.address)
    _this.setData({
      salers : [],
      discount : []
    })
    urls = _this.data.url + "rest/seller/listSellerAll?page=" + page + "&size=" + page_size + "&location=" + location + '&sellerName=' + _this.data.address,
      AllSales(_this)
  },
onPullDownRefresh:function(){
  var _this = this;
  CreatTime(_this);
  page = 0;
  _this.setData({
    salers: [],
    discount: [],
    address:""
  })
  urls = _this.data.url + "rest/seller/listSellerAll?page=" + page + "&size=" + page_size + "&location=" + location + '&sellerName=' + _this.data.address,
    AllSales(_this)
  setTimeout(function () {
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  }, 1500);
},
onReachBottom:function(){
  var _this =this;
  urls = _this.data.url + "rest/seller/listSellerAll?page=" + page + "&size=" + page_size + "&location=" + location + '&sellerName=' + _this.data.address,
  AllSales(_this)
},
getLocation:function(){
  var _this = this;
  wx.chooseLocation({
    type: 'gcj02',
    success: function (res) {
      _this.data.location = [];
      _this.data.location.push(res.longitude, res.latitude);
      _this.setData({
        location: _this.data.location,
        district: res.address,
        street: "",
        salers: [],
        discount: []
      })
      page = 0;
      location = _this.data.location[0] + ',' + _this.data.location[1] 
      urls = _this.data.url + "rest/seller/listSellerAll?page=" + page + "&size=" + page_size + "&location=" + location + '&sellerName=' + _this.data.address,
        AllSales(_this)
    },
  })
},
salerDetail:function(e){
    wx.navigateTo({
      url: '../../pages/salerInfo/index?sellerId=' + e.currentTarget.dataset.id
    })
  },
salerOrder:function(e){
  wx.navigateTo({
    url: '../../pages/orderInfo/index?sellerId=' + e.currentTarget.dataset.id
  })
},
  salerSend:function(e){
    wx.navigateTo({
      url: '../../pages/chooseFood/index?sellerId=' + e.currentTarget.dataset.id
    })
  }
})
