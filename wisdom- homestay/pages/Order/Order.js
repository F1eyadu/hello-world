const app = getApp()
var url;
var id;
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

var searchOrder= function(_this){
  wx.request({
    url: url + "rest/order/findOrdersByUserId/" + id,
    method: 'GET',
    success: function (res) {
      var datas = res.data.msg;
      for (let i in datas) {
        if (datas[i].state == 2 || datas[i].state == 3 || datas[i].state == 4 || datas[i].state == 5 || datas[i].state == 6) {
          _this.data.lists.push(datas[i]);
        }
        else if (datas[i].state == 0 || datas[i].state == 1 || datas[i].refundState == 'success') {
          _this.data.list.push(datas[i]);
        }
      }
      _this.setData({
        lists: _this.data.lists,
        list: _this.data.list
      })
      _this.data.lists.map(function (x) {
        var shijian = {};
        var startTime = formatDateTime(x.startTime).split(" ")[0]
        shijian.startTime = startTime.split("-")[1] + "/" + startTime.split("-")[2];
        var endTime = formatDateTime(x.endTime).split(" ")[0]
        shijian.endTime = endTime.split("-")[1] + "/" + endTime.split("-")[2];
        _this.data.Imging.push(x.house.housePhoto.split(",")[0]);
        _this.data.time.push(shijian);
      })
      _this.data.list.map(function (x) {
        var shijian = {};
        var startTime = formatDateTime(x.startTime).split(" ")[0]
        shijian.startTime = startTime.split("-")[1] + "/" + startTime.split("-")[2];
        var endTime = formatDateTime(x.endTime).split(" ")[0]
        shijian.endTime = endTime.split("-")[1] + "/" + endTime.split("-")[2];
        _this.data.Imged.push(x.house.housePhoto.split(",")[0]);
        _this.data.times.push(shijian);
      })
      _this.setData({
        time: _this.data.time,
        times: _this.data.times,
        Imging: _this.data.Imging,
        Imged: _this.data.Imged
      })
    }
  })
}

Page({
  data: {
    _num:1,
    nums:1,
    lists: [ ],
    list:[ ],
    Imging:[],
    Imged:[],
    time:[],
    times:[],
    Url:"",
    stutas: 3
  },
  onLoad:function(){
    var _this = this;
    url = app.globalData.url;
    _this.data.Url = app.globalData.url;
    id = app.globalData.id;
    _this.setData({
      Url: _this.data.Url
    })
  },
  onShow:function(){
     var _this = this;
    _this.data.lists=[];
    _this.data.list=[];
    _this.data.time=[];
    _this.data.times=[];
    _this.data.Imging=[];
    _this.data.Imged=[];
    searchOrder(_this)
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  tiaozhuan:function(e){
    var _this = this;
    var orderId = e.currentTarget.dataset.id;
    var stuta = "";
    _this.data.lists.map(function (x) {
      if (x.id == orderId) {
        stuta = x.state;
      }
    })
    if (stuta == 2){
      wx.navigateTo({
        url: "../Reserve/Reserve?orderId=" + orderId,
        success: function(res) {}
      })
    }
    if(stuta ==4 || stuta ==3){
      wx.navigateTo({
      url: '../../pages/Ordering/Ordering?orderId=' + orderId,
      success: function (res) {
        console.log("success")
      },
      fail: function (res) {
        console.log("fail")
      }
    })
    }
    if (stuta == 5){
      _this.setData({
        stutas:2
      }),
      setTimeout(function () {
        _this.setData({
          stutas: 3
        })
      }, 4000)
  }
    if (stuta == 6) {
      _this.setData({
        stutas: 1
      }),
        setTimeout(function () {
        _this.setData({
            stutas: 3
          })
        }, 5000)
    }
  },
  finish:function(e){
    var stuta= "";
    var content="";
    var orderId = e.currentTarget.dataset.id;
    this.data.list.map(function(x){
      if (x.id == orderId){
        stuta = x.state;
        content = x.ordercomment;
      }
    })
    if (stuta == 0 && content == null){
      wx.navigateTo({
        url: '../../pages/complete/complete?orderId=' + orderId,
        success: function (res) {
          console.log("success")
        },
        fail: function (res) {
          console.log("fail")
        }
      })
    }
  },
  menuClick:function(e){
    this.setData({
      _num: e.target.dataset.num,
      nums: e.target.dataset.num,
    })
  },
  onPullDownRefresh:function(){
    var _this = this;
    _this.data.lists= [];
    _this.data.list=[];
    _this.data.Imging=[];
    _this.data.Imged=[];
    _this.data.time=[];
    _this.data.times=[];
    searchOrder(_this);
    setTimeout(function () {
      wx.hideNavigationBarLoading() 
      wx.stopPullDownRefresh()
    }, 1500);
  }
})