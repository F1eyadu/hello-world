//index.js
//获取应用实例
const app = getApp()
var bmap = require('../../libs/bmap-wx.min.js');
var page = 0;
var page_size =5;
var location = "";
var url = "";
var urls;
function position(that) {//获取地理位置
  wx.getLocation({
    success: function (res) {
      location = res.longitude + "," + res.latitude;
      that.data.location = res.longitude + "," + res.latitude;
      that.setData({
        location: that.data.location
      })
      wx.request({
        url: 'https://api.map.baidu.com/geocoder/v2/?ak=YCtkh3Tk8SnHDISQNnv43MSlnEZGUq64&location=' + res.latitude + ',' + res.longitude + '&output=json&coordtype=wgs84ll',
        data: {},
        header: { 'Content-Type': 'application/xml' },
        dataType: 'json',
        success: function (ops) {
          that.setData({
            district: ops.data.result.addressComponent.district,
            street: ops.data.result.addressComponent.street
          })
        }
      })
    },
    fail: function () {
      console.log("fail");
    }
  })
}

var GetHouse = function (that) {
  that.setData({
    hidden: false
  });  
  wx.request({
    url: url,
    method: 'GET',
    success: function (res) { 
      var data = res.data.msg;
     console.log(data);
      if(!data){
        // that.setData({
        //   noMore:true
        // })
      }else{
        for (let i in data) {
          var imgs = [];
          that.data.houses.push(data[i].house);
          that.data.orders.push(data[i].orders);
          var img = data[i].house.housePhoto.split(",");
          img.map(function(x){
            imgs.push(x);
          })
          // imgs.push(img)
          that.data.imgArrs.push(imgs);
          var dates = {};
          var times = [];
          var id
          dates.id = data[i].house.id,
            dates.times = [
              { time: GetDateStr(0), day: GetDateDay(0), stuta: false },
              { time: GetDateStr(1), day: GetDateDay(1), stuta: false },
              { time: GetDateStr(2), day: GetDateDay(2), stuta: false },
              { time: GetDateStr(3), day: GetDateDay(3), stuta: false },
              { time: GetDateStr(4), day: GetDateDay(4), stuta: false }
            ]
          that.data.datess.push(dates);
          if (data[i].orders.length != 0) {
            var orders = [];
            data[i].orders.map(function (value, index, array) {
              var order = {};
              order.id = value.house.id;
              order.startTime = formatDateTime(value.startTime).split(" ")[0];
              order.endTime = formatDateTime(value.endTime).split(" ")[0];
              orders.push(order)
            })
            that.data.houseOrder.push(orders);
          } else {
            var orders = [];
            data[i].orders.map(function (value, index, array) {
              var order = {};
              order.id = "";
              order.startTime = "";
              order.endTime = "";
              orders.push(order)
            })
            that.data.houseOrder.push(orders);
          }
        }
        that.setData({
          houses: that.data.houses,
          orders: that.data.orders,
          houseOrder: that.data.houseOrder,
          imgArrs: that.data.imgArrs,
          datess: that.data.datess
        })
        that.data.houseOrder.map(function (value, index, z) {
          value.map(function (x, y, z) {
            if (x.id == that.data.datess[index].id) {
              that.data.datess[index].times.map(function (times, cishu) {
                if ((new Date(times.time.replace(/-/g, "\/"))) >= (new Date(x.startTime.replace(/-/g, "\/"))) && (new Date(times.time.replace(/-/g, "\/"))) <= (new Date(x.endTime.replace(/-/g, "\/")))) {
                  times.stuta = true;
                }
              })
            }
          })
        })
        that.setData({
          hidden: true,
          datess: that.data.datess
        })
        page = page+1;
        console.log(page)
         console.log(url)
        // console.log(that.data.orders);
        // console.log(that.data.imgArrs);
        console.log(that.data.houses);
        // console.log(that.data.datess);
        // console.log(that.data.houseOrder)
      }
    }
  });
}


function formatDateTime(inputTime) {//时间戳转换成时间
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};


function GetDateStr(AddDayCount) {//获取5天的日期
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();
  return y + "-" + m + "-" + d;
} 
function GetDateDay(AddDayCount) {//获取5天的号码
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();
  return  d;
}

Page({
  //初始数据
  data: {
    youhui:true,
    hidden: true,
    animation: '',
    currentItem:'',
    houseType: [],
    houses:[],
    imgArrs:[],
    Advs:[],
    advImg:[],
    isHideLoadMore:"",
    statu:1,
    houseId:[],
    datess:[],
    orders:[],
    houseOrder:[],
    district: "",
    street: "",
    location:"",
    searchText:"",
    noMore:false,
    Url:"",
  }, //页面加载
  onLoad:function(e){
    var _this = this;
     urls = app.globalData.url;
     _this.data.Url = app.globalData.url;
    //  if (app.globalData.index ==1){
    //    _this.setData({
    //      youhui:false
    //    })
    //  }
     _this.setData({
       Url: _this.data.Url
     })
     page = 0;
  },
  onShow:function(){
    var _this = this;
    //console.log(page)
    //console.log(_this.data.currentItem)
    if (_this.data.currentItem != "" || _this.data.statu==2){
      _this.setData({
        statu: 2
      })
    }else{
      wx.getLocation({
        success: function (res) {
          location = res.longitude + "," + res.latitude;
          _this.data.location = res.longitude + "," + res.latitude;
          _this.setData({
            location: _this.data.location
          })
          wx.request({
            url: 'https://api.map.baidu.com/geocoder/v2/?ak=YCtkh3Tk8SnHDISQNnv43MSlnEZGUq64&location=' + res.latitude + ',' + res.longitude + '&output=json&coordtype=wgs84ll',
            data: {},
            header: { 'Content-Type': 'application/xml' },
            dataType: 'json',
            success: function (ops) {
              _this.setData({
                district: ops.data.result.addressComponent.district,
                street: ops.data.result.addressComponent.street,
                statu: 1
              })
              url = urls + "rest/house/listHouseAll?page=" + page + "&size=" + page_size + "&location=" + location + ""
              //console.log(url)
              GetHouse(_this)
              // page = page + 1;
              // url = urls + "rest/house/listHouseAll?page=" + page + "&size=" + page_size + "&location=" + location + ""
            }
          })
        },
        fail: function () {
          console.log("fail");
        }
      })
    }
    // page = 0;
    // _this.data.orders = [];
    // _this.data.imgArrs = [];
    // _this.data.houses = [];
    // _this.data.datess = [];
    // _this.data.houseOrder = [];
    // position(_this)
    //position(_this) {//获取地理位置
    //}
    //获取元素高度
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    //请求广告轮播
    wx.request({
      url: urls + 'api/advertisement',
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        var adV = res.data._embedded.advertisements;
        for (let n in adV) {
          if (adV[n].advertisementPhoto != null) {
            var imgs = [];
            var img = adV[n].advertisementPhoto.split(",")[0];
            imgs.push(img);
            _this.data.advImg.push(imgs);
          }
        }
        _this.setData({
          Advs: adV,
          advImg: _this.data.advImg
        })
      }
    })
    //请求个性推荐信息
    wx.request({
      url: urls + 'rest/house/listByType',
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        var datas = res.data;
        _this.setData({
          houseType: datas
        })
      }
    })
    // setTimeout(function () {
    //   url = urls + "rest/house/listHouseAll?page=" + page + "&size=" + page_size + "&location=" + location + ""
    //    //console.log(url)
    //   GetHouse(_this)
    //   page = page + 1;
    //   url = urls + "rest/house/listHouseAll?page=" + page + "&size=" + page_size + "&location=" + location + ""
    //    //console.log(url)
    // }, 2000)
  },
  //页面渲染
  onReady:function(e){
    this.animation = wx.createAnimation({
      duration: 350, 
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: "50% 50%",
      success: function (res) {
        //console.log(res)
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //点击刷新地理位置
  refresh:function(e){
    var _this = this;
    _this.animation.rotate(360).step();
    _this.setData({
      //输出动画
      animation: _this.animation.export()
    })
    setTimeout(function(){
      _this.animation.rotate(0).step({ duration: 0, transformOrigin: "50%,50%", timingFunction: 'linear' })
      _this.setData({
        animation: _this.animation.export()
      })
    },600)
    position(_this);
  },
  //查看相应类别的酒店
  Search:function(options){
    var that = this;
    page = 0;
    that.data.orders = [];
    that.data.imgArrs = [];
    that.data.houses = [];
    that.data.datess = [];
    that.data.houseOrder = [];
    var id = options.currentTarget.dataset.id;
    that.setData({
      orders: that.data.orders,
      imgArrs: that.data.imgArrs,
      houses: that.data.houses,
      datess: that.data.datess,
      houseOrder: that.data.houseOrder,
      currentItem: id,
      statu: 2
    })
    url = urls+'rest/house/listHouseAll?typeid=' + this.data.currentItem + '&page=' + page + '&size=' + page_size + '&houseName=' + this.data.searchText + '&location=' + location + '', 
    //console.log(url)
    GetHouse(that)
  },
  //进入酒店详情
  HouseDes:function(e){
    var HouseId =e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/details/details?houseId=' + HouseId,
      success: function(res) {
       // console.log("success")
      },
      fail: function(res) {
       // console.log("fail")
      }
    })
  },
  Details:function(e){//跳转广告页
    var AdvId = e.target.dataset.num;
    wx.navigateTo({
      url: '../../pages/Carousel/Carousel?Advid=' + AdvId,
      success: function(res) {
       // console.log("success")
      }
    })
  },
  inputHouse:function(e){//搜索框
    this.setData({
      searchText:e.detail.value
    })
  },
  searchHouse:function(){
    page = 0;
    this.data.orders = [];
    this.data.imgArrs = [];
    this.data.houses = [];
    this.data.datess = [];
    this.data.houseOrder = [];
    this.setData({
      orders: this.data.orders,
      imgArrs: this.data.imgArrs,
      houses: this.data.houses,
      datess: this.data.datess,
      houseOrder: this.data.houseOrder,
      statu: 2
    })
    url = urls+'rest/house/listHouseAll?typeid=' + this.data.currentItem + '&page=' + page + '&size=' + page_size + '&houseName=' + this.data.searchText + '&location=' + location + '',
    //console.log(page);
   // console.log(url)
    GetHouse(this)
    // page = page + 1;
    // url = urls+'rest/house/listHouseAll?typeid=' + this.data.currentItem + '&page=' + page + '&size=' + page_size + '&houseName=' + this.data.searchText + '&location=' + location + ''
  },
  onReachBottom: function () {
    var that = this;
    if(that.data.statu == 1){
      url = urls + "rest/house/listHouseAll?page=" + page + "&size=" + page_size + "&location=" + location + ""
     // console.log(url)
      GetHouse(that);
      // page = page + 1;
      // url = urls+"rest/house/listHouseAll?page=" + page + "&size=" + page_size + "&location=" + location + ""
     // console.log(url)
    } else if (that.data.statu == 2){
      that.setData({
        hidden: true
      });
      url = urls + 'rest/house/listHouseAll?typeid=' + this.data.currentItem + '&page=' + page + '&size=' + page_size + '&houseName=' + this.data.searchText + '&location=' + location + ''
      //console.log(url)
      GetHouse(that)
      // page = page + 1;
      
     // console.log(url)
    }
  },
  onPullDownRefresh: function () {
    page = 0;
    this.data.orders =[];
    this.data.imgArrs=[];
    this.data.houses=[];
    this.data.datess=[];
    this.data.houseOrder=[];
    url = urls + "rest/house/listHouseAll?page=" + page + "&size=" + page_size + "&location=" + location + "";
   // console.log(url)
    GetHouse(this);
    // page = page + 1;
    // url = urls + "rest/house/listHouseAll?page=" + page + "&size=" + page_size + "&location=" + location + "";
    this.setData({
      currentItem: '',
      searchText:""
    })
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1500);
  },
  onShareAppMessage:function(){
    return{
      title: '咪熊民宿',
      desc: '快来一起体验吧',
    }
  }
  // cancel:function(){
  //   this.setData({
  //     youhui:true
  //   })
  // },
  // confrim:function(){
  //   wx.request({
  //     url: urls + 'rest/users/coupon/openid-' + app.globalData.openId + '/state-0',
  //     method:'GET',
  //     success:function(res){
  //       console.log(res)
  //       // console.log(app.globalData.openId);
  //       // console.log(app.globalData.index);
  //     }
  //   })
  // }
})
