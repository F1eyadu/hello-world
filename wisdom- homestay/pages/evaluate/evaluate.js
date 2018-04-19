const app=getApp()
var url;
var orderId;
var fileNamess;
function MathRand() {
  var Num = "";
  for (let i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  fileNamess = Num;
}

Page({
  data: {
    stuta:3,
    imgArrs:[],
    imgIndex:1,
    houseImg:"",
    houseInfo: "",
    img:{
      imgName:"",
      imgUrl:"",
    },
    EvaText:"",
    Url:""
  },
  onLoad:function(e){
    var _this = this;
    orderId = e.orderId;
    url = app.globalData.url;
    _this.data.Url = app.globalData.url;
    _this.setData({
      Url: _this.data.Url
    })
    wx.request({
      url: url + "rest/orders/order/" + orderId,
      method: 'GET',
      success: function (res) {
        console.log(res)
        var imgs = res.data.house.housePhoto.split(",")[0];
        _this.setData({
          houseInfo: res.data.house,
          houseImg: imgs
        })
      }
    })
    MathRand()
  },
  addImg:function(e){
    var that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;

        var fileName;
        var Num = "";
        for (let i = 0; i < 6; i++) {
          Num += Math.floor(Math.random() * 10);
        }
        fileName = Num;
        var imgArr = tempFilePaths[0].split(".");
        fileName = fileName + "." + imgArr[imgArr.length - 1];

        that.data.img.imgUrl = tempFilePaths[0];
        that.data.img.imgName = fileName;
        that.data.imgArrs.push(that.data.img);
  
        wx.uploadFile({
          url: url + 'rest/orders/order/cardPhotoUpload/type-comment/path-' + fileNamess + '/name-' + fileName,
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            // console.log(res)
          }
        })

        that.setData({
          imgIndex: that.data.imgIndex + 1,
          imgArrs: that.data.imgArrs
        })
      }
    })
  },
  inputEva:function(e){
    this.setData({
      EvaText: e.detail.value
    })
  },
  cancelOrder:function(){
    var _this = this;
    var imgs="";
    if (_this.data.imgArrs.length == 0) {
      imgs = null;
    }
    (function pingjie(){
      _this.data.imgArrs.map(function (x) {
        imgs += x.imgName + ",";
        }
      )
      if(imgs !=null){
        imgs = imgs.substr(0, imgs.length - 1)
      }
    })();

    if (_this.data.EvaText ==""){
       this.data.EvaText = null;
     }
    if (_this.data.EvaText != null || imgs !=null){
      wx.request({
        url: url + "rest/orders/user/userComment/" + orderId,
        header: { 'Content-Type': 'application/json' },
        method: 'PUT',
        data: {
          content: this.data.EvaText,
          commentPhoto: imgs,
          commentState: '0',
          fileName: fileNamess
        },
        success: function (res) {
          _this.setData({
            stuta: 2
          }),
            setTimeout(function () {
              wx.reLaunch({
                url: '../Order/Order'
              })
            }, 2000)
        }
      })
    }else{
      _this.setData({
        stuta:0
      })
      setTimeout(function(){
        _this.setData({
          stuta:4
        })
      },3000)
    }
    
  }
})