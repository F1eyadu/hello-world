//details.js
//获取应用实例
const app = getApp()
var houseId = "";
var url;
var page=0;
var size=3;
var urls="";
var SearchHouse = function(_this){
  wx.request({
    url: url + 'api/house/' + houseId,
    method: 'GET',
    header: { 'Content-Type': 'application/json' },
    success: function (res) {
      var data = res.data;
      var imgs = res.data.housePhoto;
      if (imgs != null) {
        imgs = imgs.split(",");
        var length = imgs.length;
        for (let i in imgs) {
          _this.data.imgList.push(imgs[i])
        }
      } else {
        _this.data.imgList.push('暂无图片')
      }
      if (data.houseDetails == null) {
        data.houseDetails = "暂无描述"
      }
      if (data.checkRules == null) {
        data.checkRules = "暂无详情"
      }
      if (data.checkOutRules == null) {
        data.checkOutRules = "暂无详情"
      }
      _this.setData({
        houseInfo: data,
        Number: length,
        imgList: _this.data.imgList,
        text: res.data.houseDetails
      })
       //console.log(_this.data.houseInfo);
      if (_this.data.text.length > 110) {
        _this.setData({
          dataSet: 1,
        })
      } else {
        _this.setData({
          dataSet: 2
        })
      }
    }
  })
}

var SearchEva = function (_this){
  wx.request({
    url: urls,
    method: 'GET',
    header: { 'Content-Type': 'application/json' },
    success: function (res) {
      var data = res.data.msg
      var Evaimgs = [];
      var Evaimg = [];
      for (let i in data) {
        _this.data.evaluates.push(data[i])
        var imgs = [];
        if (data[i].ordercomment.commentPhoto != null){
          imgs.push(data[i].ordercomment.commentPhoto.split(","))
        }else{
          imgs.push(" ");
        }
        _this.data.Evaimgs.push(imgs)
      }
      _this.setData({
        evaluates: _this.data.evaluates,
        Evaimgs: _this.data.Evaimgs
      })
    }
  })
}

Page({
  data: {
    isFold: true,
    text:"",
   imgList:[ ],
   houseInfo:[],
   evaluates:[],
   Evaimgs:[],
   indicatorDots: false,
   autoplay: true,
   interval: 5000,
   duration: 1000,
   Number:"",
   _num:1,
   numD:1,
   isFold:true,
   dataSet: "",
   Url:"",
   hidden:true,
   latitude: null,
   longitude: null
  },
  //页面加载
  onLoad: function (e) {
    var _this = this;
    url = app.globalData.url;
    var Id = e.houseId;
    houseId = e.houseId;
    _this.data.Url = app.globalData.url;
    _this.setData({
      Url: _this.data.Url
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow:function(){
    page = 0;
    var _this = this;
    _this.data.imgList=[];
    _this.data.evaluates = [];
    _this.data.Evaimgs=[];
    _this.data.houseInfo= [],
    SearchHouse(_this);
    urls = url + 'rest/house/listHouseByHouseId/' + houseId + '?page=' + page + '&size=' + size;
    SearchEva(_this);
    page = page+1;
    urls = url + 'rest/house/listHouseByHouseId/' + houseId + '?page=' + page + '&size=' + size;
    this.setData({
      hidden: true
    })
  },
  //Tab切换
  menuClick:function(e){
    var num = e.target.dataset.num;
    if (num==1){
      this.setData({
        isFold: true,
        text: this.data.houseInfo.houseDetails
      })
      if (this.data.text.length > 110) {
        this.setData({
          dataSet: 1,
        })
      } else {
        this.setData({
          dataSet: 2
        })
      }
    } else if (num==2){
      this.setData({
        isFold:true,
        text: this.data.houseInfo.checkRules
      })
      if (this.data.text.length > 110) {
        this.setData({
          dataSet: 1,
        })
      } else {
        this.setData({
          dataSet: 2
        })
      }
    }else{
      this.setData({
        isFold: true,
        text: this.data.houseInfo.checkOutRules
      })
      if (this.data.text.length > 110) {
        this.setData({
          dataSet: 1,
        })
      } else {
        this.setData({
          dataSet: 2
        })
      }
    }
    this.setData({
      _num: e.target.dataset.num,
      numD: e.target.dataset.num
    })
  },
  //图片预览
  imgYu: function (e){
    var that = this;
    var Imgs = [];
    var src, url
    var current = e.target.dataset.src; 
    var index = e.target.dataset.index; 
    src = that.data.Url +'rest/Photo/loadServicePhoto/photoType-house/fileName-' +that.data.houseInfo.fileName + '/file-' + current;
    var xxx=that.data.imgList;
    xxx.map(function(x){
    url = that.data.Url + 'rest/Photo/loadServicePhoto/photoType-house/fileName-' + that.data.houseInfo.fileName + '/file-' + x;
    Imgs.push(url)
      // var url = that.data.Url + 'rest/Photo/download/photoType-house/fileName-' + that.data.houseInfo.fileName + '/file-' + x;
    })
    wx.previewImage({
      current: src,
      urls: Imgs,
      success:function(res){
        console.log(res);
      },fail:function(res){
        console.log(res);
      }
    })
  },
  //预定
  orderHouse:function(e){
    wx.navigateTo({
      url: '../calendar/index?houseId=' + houseId,
      success: function(res) {
        console.log("选择日期")
      }
    })
  },
  //显示更多
  change: function () {
    this.setData({
      isFold: !this.data.isFold
    });
  },
  onReachBottom:function(){
    var _this = this;
    urls = url + 'rest/house/listHouseByHouseId/' + houseId + '?page=' + page + '&size=' + size;
    SearchEva(_this);
    page = page + 1;
    urls = url + 'rest/house/listHouseByHouseId/' + houseId + '?page=' + page + '&size=' + size;
  },
  map:function(){
    this.setData({
      hidden:false,
      latitude: this.data.houseInfo.location[1],
      longitude: this.data.houseInfo.location[0],
    })
    wx.openLocation({
      latitude: this.data.houseInfo.location[1],
      longitude: this.data.houseInfo.location[0],
      name: this.data.houseInfo.houseName,
      address: this.data.houseInfo.houseAddress,
      scale: 28
    })
  }
})