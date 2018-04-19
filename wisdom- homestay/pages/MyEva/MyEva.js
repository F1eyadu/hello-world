const app=getApp();
var url="";
var userId;
var urls;
var page=0;
var size=5;
var checkMyEva = function(that){
  wx.request({
    url: url,
    method: 'GET',
    success: function (res) {
      var data = res.data.content;
      if(data.length>0){
        data.map(function (x) {
          that.data.house.push(x.house);
          that.data.houseImg.push(x.house.housePhoto.split(",")[0])
          that.data.EvaTime.push(formatDateTime(x.ordercomment.createTime).split(" ")[0])
          var imgs = [];
          if (x.ordercomment.commentPhoto != null) {
            imgs.push(x.ordercomment.commentPhoto.split(","))
          } else {
            imgs.push(" ");
          }
          that.data.myEvaImg.push(imgs);
          that.data.Evas.push(x)
        })
        that.setData({
          Evas: that.data.Evas,
          house: that.data.house,
          houseImg: that.data.houseImg,
          myEvaImg: that.data.myEvaImg,
          user: data[0].user,
          EvaTime: that.data.EvaTime
        })
        // console.log(that.data.house)
        // console.log(that.data.houseImg)
        // console.log(that.data.myEvaImg)
        // console.log(that.data.user)
        // console.log(that.data.Evas)
        // console.log(that.data.EvaTime)
      }
    }
  })
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

Page({
  data: {
    user:[],
    house:[],
    Evas:[],
    houseImg:[],
    myEvaImg:[],
    EvaTime:[],
    Url:""
  },
  onLoad: function (e) {
    var that = this;
    userId = e.userId;
    urls = app.globalData.url;
    that.data.Url = app.globalData.url;
    that.setData({
      Url: that.data.Url
    })
  },
  onShow:function(e){
    var that = this;
    that.data.house = [];
    that.data.houseImg = [];
    that.data.myEvaImg = [];
    that.data.user = [];
    that.data.Evas = [];
    that.data.EvaTime = [];
    page = 0;
    url = urls + "rest/users/orderComment/" + userId + "?size=" + size + "&page=" + page + ""
    checkMyEva(that)
    page = page + 1;
    url = urls + "rest/users/orderComment/" + userId + "?size=" + size + "&page=" + page + ""
  },
  tiaozhuan:function(e){
    console.log("e")
    // var houseId = e.target.dataset.id;
    // wx.navigateTo({
    //   url: '../../pages/details/details?houseId=' + houseId,
    // })
  },
  onReachBottom:function(res){
    var that = this;
    url = urls + "rest/users/orderComment/" + userId + "?size=" + size + "&page=" + page + ""
    console.log(url)
    checkMyEva(that)
    page = page + 1;
    url = urls + "rest/users/orderComment/" + userId + "?size=" + size + "&page=" + page + ""
    console.log(url)
  },
  onPullDownRefresh:function(){
    var that = this;
    page=0;
    that.data.house=[];
    that.data.houseImg=[];
    that.data.myEvaImg=[];
    that.data.user=[];
    that.data.Evas=[];
    that.data.EvaTime=[];
    url = urls + "rest/users/orderComment/" + userId + "?size=" + size + "&page=" + page + ""
    checkMyEva(that)
    page = page + 1;
    url = urls + "rest/users/orderComment/" + userId + "?size=" + size + "&page=" + page + ""
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1500);
  }
})