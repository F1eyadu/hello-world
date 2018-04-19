const app = getApp()
var url = app.globalData.url;
var userInfo = app.globalData;
Page({
  data: {
    hiddenshow: "none",
    star1: "star.png",
    star2: "star.png",
    star3: "star.png",
    star4: "star.png",
    star5: "star.png",
    starNumber: 0,
    pjImg1: "bad-ping.svg",
    pjImg2: "bad-ping.svg",
    pjImg3: "bad-ping.svg",
    pjImg4: "bad-ping.svg",
    p1: "客户很友善！",
    p2: "客户很好相处!",
    p3: "客户有魅力！",
    p4: "客户不守时！",
    pingStr: null,
    doctorComment:null
  },
  onLoad: function (options) {
    var that = this;
    var orderId = options.orderId;
    if (orderId == undefined) {
      that.setData({
        hiddenshow: "block",
        show: '您没有需要评价的订单！'
      })
      setTimeout(function() {
        wx.reLaunch({
          url: '../index/index',
        })
      },2000)
    }
    this.setData({
      orderId: orderId
    })
  },
  starBtn1: function () {
    if (this.data.star1 == "staring.png" && this.data.star2 == "staring.png") {
      this.setData({
        star1: "staring.png",
        star2: "star.png",
        star3: "star.png",
        star4: "star.png",
        star5: "star.png",
        starNumber: 1.0
      })
    }
    else if (this.data.star1 == "staring.png" && this.data.star2 == "star.png") {
      this.setData({
        star1: "star.png",
        starNumber: 0
      })
    } else {
      this.setData({
        star1: "staring.png",
        starNumber: 1.0
      })
    }
  },
  starBtn2: function () {
    this.setData({
      star1: "staring.png",
      star2: "staring.png",
      star3: "star.png",
      star4: "star.png",
      star5: "star.png",
      starNumber: 2.0
    })
  },
  starBtn3: function () {
    this.setData({
      star1: "staring.png",
      star2: "staring.png",
      star3: "staring.png",
      star4: "star.png",
      star5: "star.png",
      starNumber: 3.0
    })
  },
  starBtn4: function () {
    this.setData({
      star1: "staring.png",
      star2: "staring.png",
      star3: "staring.png",
      star4: "staring.png",
      star5: "star.png",
      starNumber: 4.0
    })
  },
  starBtn5: function () {
    this.setData({
      star1: "staring.png",
      star2: "staring.png",
      star3: "staring.png",
      star4: "staring.png",
      star5: "staring.png",
      starNumber: 5.0
    })
  },
  pingImg: function (e) {
    var that= this;
    var str = e.target.dataset.imgsrc
    var arr = str.split(".")
    var num = arr[1].split("g")//num[1]为后缀数字;
    if (arr[0] == "bad-ping") {
      if (num[1] == 1) {
        that.setData({
          pjImg1: "good-ping.svg",
          pjImg2: "bad-ping.svg",
          pjImg3: "bad-ping.svg",
          pjImg4: "bad-ping.svg",
          pingStr:that.data.p1
        })
      }
      if (num[1] == 2) {
        that.setData({
          pjImg1: "bad-ping.svg",
          pjImg2: "good-ping.svg",
          pjImg3: "bad-ping.svg",
          pjImg4: "bad-ping.svg",
          pingStr: that.data.p2
        })
        // if (that.data.pingStr[1].pjstr == "") {
        //   that.data.pingStr[1].pjstr = that.data.p2;
        // }
      }
      if (num[1] == 3) {
        that.setData({
          pjImg1: "bad-ping.svg",
          pjImg2: "bad-ping.svg",
          pjImg3: "good-ping.svg",
          pjImg4: "bad-ping.svg",
          pingStr: that.data.p3
        })
        // if (that.data.pingStr[2].pjstr == "") {
        //   that.data.pingStr[2].pjstr = that.data.p3;
        // }
      }
      if (num[1] == 4) {
        that.setData({
          pjImg1: "bad-ping.svg",
          pjImg2: "bad-ping.svg",
          pjImg3: "bad-ping.svg",
          pjImg4: "good-ping.svg",
          pingStr: that.data.p4
        })
        // if (that.data.pingStr[3].pjstr == "") {
        //   that.data.pingStr[3].pjstr = that.data.p4;
        // }
      }
    } else {
      if (num[1] == 1) {
        that.setData({
          pjImg1: "bad-ping.svg",
          pjImg2: "bad-ping.svg",
          pjImg3: "bad-ping.svg",
          pjImg4: "bad-ping.svg",
          pingStr: ""
        })
        // that.setpjstr(0);
      }
      if (num[1] == 2) {
        that.setData({
          pjImg1: "bad-ping.svg",
          pjImg2: "bad-ping.svg",
          pjImg3: "bad-ping.svg",
          pjImg4: "bad-ping.svg",
          pingStr: ""
        })
        // that.setpjstr(1);
      }
      if (num[1] == 3) {
        that.setData({
          pjImg1: "bad-ping.svg",
          pjImg2: "bad-ping.svg",
          pjImg3: "bad-ping.svg",
          pjImg4: "bad-ping.svg",
          pingStr: ""
        })
        // that.setpjstr(2);
      }
      if (num[1] == 4) {
        that.setData({
          pjImg1: "bad-ping.svg",
          pjImg2: "bad-ping.svg",
          pjImg3: "bad-ping.svg",
          pjImg4: "bad-ping.svg",
          pingStr: ""
        })
        // that.setpjstr(3);
      }
    }
  },
  setpjstr:function(num){
    var that = this;
    if (that.data.pingStr[num].pjstr != "") {
      that.data.pingStr[num].pjstr = "";
    }
  },
  inputComment:function(e){
    this.setData({
      doctorComment: e.detail.value
    })
  },
  Confirmation: function (e) {//提交事件
    var that = this;
    var formId = e.detail.formId;
    var orderId = this.data.orderId;
    var starNumber = this.data.starNumber//评价的星级数;
    var userId = userInfo.userInfo.id;
    if (starNumber == 0){
      starNumber = 5
    }
    var selfWords = that.data.doctorComment//自己填写的文字
    var commentInfo =[];
    if (!selfWords && !that.data.pingStr){
      that.data.pingStr = '用户默认好评';
    }
    commentInfo.push(that.data.pingStr);
    wx.request({//请求评论
      url: url + '/rest/orders/doctor/doctorComment/' + orderId,
      data: {
        stars: starNumber,
        commentInfo: commentInfo,
        remark: selfWords
      },
      method: "PUT",
      header: { "Content-Type": "application/json" },
      success: function (res) {
        wx.request({
          url: url + '/rest/formId',
          method: 'POST',
          data: {
            doctorId: userId,
            formId: formId
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            that.setData({
              hiddenshow: "block",
              show: '佣金正在路上，请耐心等待！'
            })
            setTimeout(function () {
              wx.reLaunch({
                url: '../index/index',
              })
            }, 3000)
          }
        })
      }
    })
  }
})