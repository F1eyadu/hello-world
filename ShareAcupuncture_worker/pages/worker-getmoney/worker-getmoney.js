const app = getApp();
var url = app.globalData.url;
var timeDsq=''
Page({
  data: {
    money: 0,
    hidden:true
  },
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    that.setData({
      id: id
    })
    wx.request({
      url: url + '/rest/doctor/current/day/details/' + id,
      method: "GET",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        var present = res.data.present;
        console.log(present)
        that.setData({
          money: present,
        })
      }
    })
  },
  allTx:function() {
    var that = this;
    var money = that.data.money;
    that.setData({
      txMoney: money,
    })
  },
  getMoney:function(e) {
    var that = this;
    var reg = /^\d*\.{0,1}\d{0,2}$/;
    var money = e.detail.value;
    if (reg.test(money)){
      that.setData({
        txMoney: e.detail.value,
      })
    }else{
      that.setData({
        txMoney:""
      })
    }
  },
  sureTx: function () {
    var that = this;
    var id = that.data.id;
    var sureMoney = that.data.txMoney;
    var money = that.data.money;
    if (sureMoney ==undefined) {
      that.setData({
        errWords: '提现金额不能为空！',
      })
    }else{
      if (sureMoney == 0) {
        that.setData({
          errWords: '金额必须大于0！',
        })
      }else if(isNaN(sureMoney)) {
        that.setData({
          errWords: '金额必须是纯数字！',
        })
      } else if (sureMoney > money) {
        that.setData({
          errWords: '不能大于提现金额！',
        })
      }else{
        that.setData({
          hidden: false
        })
        wx.request({
          url: url+'/rest/doctor/withdrawals/'+id,
          data:{
            id:id,
            money: sureMoney
          },
          method:'PUT',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success:function(res) {
            console.log(res)
            if (res.data.code == 500) {
              
            }
            if (res.data.code == 200) {
              that.setData({
                hidden: true
              })
              wx.showToast({
                title: '提现成功',
              })
              setTimeout(function(){
                wx.redirectTo({
                  url: '../worker-getmoney/worker-getmoney?id=' + id,
                })
              },2000)
            }
          }
        })
      }
    }
  }
})