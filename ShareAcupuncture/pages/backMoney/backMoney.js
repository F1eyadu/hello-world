const app = getApp()
var url = app.globalData.url
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
        pjImg5: "bad-ping.svg",
        pjImg6: "bad-ping.svg",
        p1:"速度惊人，有原则!",
        p2:"树懒般等待，体验不好!",
        p3:"幽默风趣太帅了！",
        p4:"有爱逗逗哒！",
        p5: "服务粗暴，并不愉快！",
        p6: "贴心好相处！",
        status:1,
        pingStr:null,
        userComment:null
    },
    onLoad: function (options) {
      var that = this;
      var orderId = options.orderId;
      wx.request({
        url: url + '/api/order/' + orderId,
        header: { "Content-Type": "application/json" },
        success:function(res) {
          var returnDeposit = res.data.deposit - res.data.actualPrice;
          returnDeposit = parseFloat(returnDeposit).toFixed(2);
          that.setData({
            deposit: res.data.deposit,
            actualPrice: res.data.actualPrice,
            returnDeposit: returnDeposit
          })
        }
      })
      this.setData({
        orderId: orderId
      })
    },
    starBtn1: function() {
        if (this.data.star1 == "staring.png" && this.data.star2 == "staring.png"){
            this.setData({
                star1: "staring.png",
                star2: "star.png",
                star3: "star.png",
                star4: "star.png",
                star5: "star.png",
                starNumber: 1.0
            })
        } 
        else if(this.data.star1 == "staring.png" && this.data.star2 == "star.png"){
            this.setData({
                star1: "star.png",
                starNumber: 0
            })
        }else{
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
    pingImg:function(e) {
      var that = this;
      var str = e.target.dataset.imgsrc
      var arr = str.split(".")
      var num = arr[1].split("g")//num[1]为后缀数字
      if (arr[0] == "bad-ping") {
        if (num[1] == 1){
          that.setData({
            pjImg1: "good-ping.svg",
            pjImg2: "bad-ping.svg",
            pjImg3: "bad-ping.svg",
            pjImg4: "bad-ping.svg",
            pjImg5: "bad-ping.svg",
            pjImg6: "bad-ping.svg",
            pingStr: that.data.p1
          })
        } 
        if (num[1] == 2) {
          that.setData({
            pjImg1: "bad-ping.svg",
            pjImg2: "good-ping.svg",
            pjImg3: "bad-ping.svg",
            pjImg4: "bad-ping.svg",
            pjImg5: "bad-ping.svg",
            pjImg6: "bad-ping.svg",
            pingStr: that.data.p2
            })
        }
        if (num[1] == 3) {
          that.setData({
            pjImg1: "bad-ping.svg",
            pjImg2: "bad-ping.svg",
            pjImg3: "good-ping.svg",
            pjImg4: "bad-ping.svg",
            pjImg5: "bad-ping.svg",
            pjImg6: "bad-ping.svg",
            pingStr: that.data.p3
            })
        }
        if (num[1] == 4) {
          that.setData({
            pjImg1: "bad-ping.svg",
            pjImg2: "bad-ping.svg",
            pjImg3: "bad-ping.svg",
            pjImg4: "good-ping.svg",
            pjImg5: "bad-ping.svg",
            pjImg6: "bad-ping.svg",
            pingStr: that.data.p4
            })
        }
        if (num[1] == 5) {
          that.setData({
            pjImg1: "bad-ping.svg",
            pjImg2: "bad-ping.svg",
            pjImg3: "bad-ping.svg",
            pjImg4: "bad-ping.svg",
            pjImg5: "good-ping.svg",
            pjImg6: "bad-ping.svg",
            pingStr: that.data.p5
          })
        }
        if (num[1] == 6) {
          that.setData({
            pjImg1: "bad-ping.svg",
            pjImg2: "bad-ping.svg",
            pjImg3: "bad-ping.svg",
            pjImg4: "bad-ping.svg",
            pjImg5: "bad-ping.svg",
            pjImg6: "good-ping.svg",
            pingStr:that.data.p6
          })
        }
    }else{
        if (num[1] == 1) {
          that.setData({
            pjImg1: "bad-ping.svg",
            pjImg2: "bad-ping.svg",
            pjImg3: "bad-ping.svg",
            pjImg4: "bad-ping.svg",
            pjImg5: "bad-ping.svg",
            pjImg6: "bad-ping.svg",
            pingStr:""
            })
          // that.setpjstr(0)
        }
        if (num[1] == 2) {
          that.setData({
            pjImg1: "bad-ping.svg",
            pjImg2: "bad-ping.svg",
            pjImg3: "bad-ping.svg",
            pjImg4: "bad-ping.svg",
            pjImg5: "bad-ping.svg",
            pjImg6: "bad-ping.svg",
            pingStr: ""
          })
          // that.setpjstr(1)
            }
        if (num[1] == 3) {
          that.setData({
            pjImg1: "bad-ping.svg",
            pjImg2: "bad-ping.svg",
            pjImg3: "bad-ping.svg",
            pjImg4: "bad-ping.svg",
            pjImg5: "bad-ping.svg",
            pjImg6: "bad-ping.svg",
            pingStr: ""
            })
          // that.setpjstr(2)
        }
        if (num[1] == 4) {
          that.setData({
            pjImg1: "bad-ping.svg",
            pjImg2: "bad-ping.svg",
            pjImg3: "bad-ping.svg",
            pjImg4: "bad-ping.svg",
            pjImg5: "bad-ping.svg",
            pjImg6: "bad-ping.svg",
            pingStr: ""
            })
          // that.setpjstr(3)
        }
        if (num[1] == 5) {
          that.setData({
            pjImg1: "bad-ping.svg",
            pjImg2: "bad-ping.svg",
            pjImg3: "bad-ping.svg",
            pjImg4: "bad-ping.svg",
            pjImg5: "bad-ping.svg",
            pjImg6: "bad-ping.svg",
            pingStr: ""
          })
          // that.setpjstr(4)
        }
        if (num[1] == 6) {
          that.setData({
            pjImg1: "bad-ping.svg",
            pjImg2: "bad-ping.svg",
            pjImg3: "bad-ping.svg",
            pjImg4: "bad-ping.svg",
            pjImg5: "bad-ping.svg",
            pjImg6: "bad-ping.svg",
            pingStr: ""
          })
          // that.setpjstr(5)
        }
      } 
    },
    setpjstr:function(num) {
      var that = this;
      if (that.data.pingStr[num].pjstr != "") {
        that.data.pingStr[num].pjstr = "";
      }
    },
    inputComment:function(e){
      this.setData({
        userComment: e.detail.value
      })
    },
    bindFormSubmit: function (e) {//提交事件
      var that = this;
      var status = that.data.status;
      var that = this;
      var orderId = that.data.orderId;
      var starNumber = that.data.starNumber;//评价的星级数
      if (starNumber == 0) {
        starNumber = 5
      }

      var selfWords = that.data.userComment//自己填写的文字
      var commentInfo = [];
      if (!selfWords && !that.data.pingStr) {
        that.data.pingStr = '用户默认好评';
      }
      commentInfo.push(that.data.pingStr);
      wx.request({//请求评论
        url: url + '/rest/orders/user/userComment/' + orderId,
          data:{
            stars: starNumber,
            commentInfo: commentInfo,
            remark: selfWords
          },
          method: "PUT",
          header: {"Content-Type": "application/json"},
          success:function(res) {
            if (status == 1) {
              that.backMoney(orderId);
            }
          }  
      })
    },
    backMoney: function (orderId) {
      var that =this;
      wx.request({
        url: url + '/rest/orders/order/refund/' + orderId,
        method: "PUT",
        header: { "Content-Type": "application/json" },
        success: function (res) {
          console.log(res)
          that.setData({
            hiddenshow: "block",
            status:2
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../index/index',
            })
          }, 3000)
        }
      })
    },

})