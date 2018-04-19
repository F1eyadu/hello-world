const app = getApp();
var url = app.globalData.url;
var timeDsq ='';
Page({
    data: {
      goingStatus: 'block',
      didStatus: 'none',
      going: 'going',
      did: '',
      orderArr:[],
      nohaveShowdid:'none',
      nohaveShow:'none'
    },
    onLoad:function(options) {
      var that = this;
      var id = app.globalData.userInfo.id;
      console.log(id)
      that.getorderList(id);
      
    },
    didShow: function () {
      this.setData({
        goingStatus: 'none',
        didStatus: 'block',
        going: '',
        did: 'did'
      })
    },
    goingShow: function () {
      this.setData({
        goingStatus: 'block',
        didStatus: 'none',
        going: 'going',
        did: ''
      })
    },
    serGoing:function(e) {
      var orderId = e.currentTarget.dataset.orderid;
      wx.navigateTo({
        url: '../going-Service/going-Service?orderId=' + orderId,
      })
    },
    waitSer: function (e) {
      var orderId = e.currentTarget.dataset.orderid;
      wx.navigateTo({
        url: '../waitService/waitService?orderId=' + orderId,
      })
    },
    waitAccept:function(e) {
      var orderId = e.currentTarget.dataset.orderid;
      wx.navigateTo({
        url: '../waitAccept/waitAccept?orderId=' + orderId,
      })
    },
    noPay:function(e) {
      var orderId = e.currentTarget.dataset.orderid;
      wx.navigateTo({
        url: '../payDeposit/payDeposit?orderId=' + orderId,
      })
    },
    getorderList:function(id) {
      var that = this;
      wx.request({
        url: url + '/rest/user/orders/unComplete/list/' + id,
        data: {
          size: 100
        },
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          var unComArr = res.data.content;
          if (unComArr == undefined || unComArr.length == 0) {
            that.setData({
              nohaveShow: "block",
              goingShow: 'none'
            })
          } else {
            for (var i = 0; i < unComArr.length; i++) {
              unComArr[i].tuiDisplay = 'none';
              unComArr[i].selfDisplay = 'none';
              if (unComArr[i].statusInfo == 8) {
                unComArr[i].class = 'serving';
                unComArr[i].words = '正在服务';
                unComArr[i].bindtap = 'serGoing';
              }
              if (unComArr[i].statusInfo == 6) {
                unComArr[i].class = 'waitservice';
                unComArr[i].words = '等待服务';
                unComArr[i].bindtap = 'waitSer';
              }
              if (unComArr[i].statusInfo == 2) {
                unComArr[i].class = 'waitaccept';
                unComArr[i].words = '等待接受';
                unComArr[i].bindtap = 'waitAccept';
              }
              if (unComArr[i].statusInfo == 3) {
                unComArr[i].class = 'waitpay';
                unComArr[i].words = '待付款';
                unComArr[i].bindtap = 'noPay';
              }
              var tui = [];
              var self = [];
              for (var j = 0; j < unComArr[i].serviceInfo.length; j++) {
                if (unComArr[i].serviceInfo[j].service.subServices == null) {
                  self.push(unComArr[i].serviceInfo[j].service.title);
                  unComArr[i].self = self
                } else {
                  tui.push(unComArr[i].serviceInfo[j].service.title);
                  unComArr[i].tui = tui
                }
                if (unComArr[i].tui != undefined) {
                  unComArr[i].tuiDisplay ='block'
                }
                if (unComArr[i].self != undefined) {
                  unComArr[i].selfDisplay = 'block'
                }
              }
            }
            that.setData({
              unComArr: unComArr
            })
          }
        }
      })
      wx.request({
        url: url + '/rest/user/orders/complete/list/' + id,
        data: {
          page: 1,
          size: 1000
        },
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          var comArr = res.data.content;
          if (comArr == undefined || comArr.length == 0) {
            that.setData({
              nohaveShowdid: "block",
              nohaveOrderdid: '您目前还未拥有已完成的订单！',
              didShow: "none"
            })
          } else {
            for (var i = 0; i < comArr.length; i++) {
              
              var tui = [];
              var self = [];
              if (comArr[i].doctor.phone == null) {
                comArr[i].doctor.phone = ''
              }
              if (comArr[i].statusInfo == 5 && comArr[i].userLiquidatedDamages !=null) {
                comArr[i].createTime = that.getTime(comArr[i].createTime)
                comArr[i].cancelTime = that.getTime(comArr[i].cancelTime)
                comArr[i].actualPrice = comArr[i].servicePrice
                comArr[i].status = '服务违约';
                comArr[i].show = 'weiyue';
                comArr[i].creshow = 'block'
              } else if (comArr[i].statusInfo == 0) {
                comArr[i].startServiceTime = that.getTime(comArr[i].startServiceTime);
                comArr[i].completeServiceTime = that.getTime(comArr[i].completeServiceTime)
                comArr[i].status = '服务完成';
                comArr[i].class = 'over';
                comArr[i].show = 'block';
                comArr[i].creshow = 'none';
              } else if (comArr[i].statusInfo == 1) {
                comArr[i].actualPrice = comArr[i].servicePrice
                comArr[i].status = '已失效';
                comArr[i].show = 'none';
                comArr[i].creshow = 'none';
              }else {
                comArr[i].actualPrice = comArr[i].servicePrice
                comArr[i].status = '取消服务';
                comArr[i].class = 'quxiao';
                comArr[i].show = 'none';
                comArr[i].creshow = 'none';
              }

              if (comArr[i].doctor.phone == null) {
                comArr[i].doctor.phone = ''
              }
              for (var j = 0; j < comArr[i].serviceInfo.length; j++) {
                comArr[i].tuiDisplay = 'none';
                comArr[i].selfDisplay = 'none';
                if (comArr[i].serviceInfo[j].service.subServices == null) {
                  self.push(comArr[i].serviceInfo[j].service.title);
                  comArr[i].self = self;
                } else {
                  tui.push(comArr[i].serviceInfo[j].service.title);
                  comArr[i].tui = tui;
                }
                if (comArr[i].tui != undefined) {
                  comArr[i].tuiDisplay = 'block'
                }
                if (comArr[i].self != undefined) {
                  comArr[i].selfDisplay = 'block'
                }
              }
            }
            that.setData({
              comArr: comArr
            })
            console.log(that.data.comArr)
          }
        }
      })
    },
    getTime: function (time) {
      var ob = new Date(time);
      var year = ob.getFullYear();
      var month = twoNum(ob.getMonth() + 1);
      var day = twoNum(ob.getDate());
      var hours = twoNum(ob.getHours());
      var min = twoNum(ob.getMinutes());
      var allTime = year + '/' + month + '/' + day + ' ' + hours + ':' + min;
      return allTime;
      function twoNum(num) {
        if (num < 10) {
          num = '0' + num;
        } else {
          num = num;
        }
        return num;
      }
    },
    callphone:function(e) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel
      })
    }
})