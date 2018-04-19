Page({
  data: {
    tuijianDisplay:"none",
    selfDisplay:"none"
  },
  onLoad: function (options) {
    var tuij = options.tuijian;
    var userInfo = options.userInfo;
    var self = options.self;
    var price = options.price;
    var serArr = JSON.parse(options.serArr);
    var selfArr = [];
    var tuijianArr = [];
    for(var i=0;i<serArr.length;i++) {
      if (serArr[i].subServices == null || serArr[i].subServices.length == 0){
        selfArr.push(serArr[i]) 
        }else{
        tuijianArr.push(serArr[i])
        }
    } 
    if (tuijianArr.length != 0) {
      this.setData({
        tuijianDisplay: 'block',
      })
    }else{
      this.setData({
        tuijianDisplay: 'none',
      })
    }
    if (selfArr.length != 0) {
      this.setData({
        selfDisplay: 'block',
      })
    }
    this.setData({
        tuij: tuij,
        tuijianArr: tuijianArr,
        userInfo: userInfo,
        selfArr: selfArr,
        price: price,
        self: self,
        serArr: serArr
    })
  },
  goSelect : function() {
    wx.navigateTo({
        url: '../select-technician/select-technician?tuijian=' + JSON.stringify(this.data.tuij) + '&userInfo=' + JSON.stringify(this.data.userInfo) + '&self=' + JSON.stringify(this.data.self) + '&price=' + this.data.price + '&serArr=' + JSON.stringify(this.data.serArr)
    })
  }
})