const app = getApp();
var url = app.globalData.url;
Page({
    data:{
      nohaveShow: 'none'
    },
    onLoad: function (options) {
      var that = this;
      var id = app.globalData.userInfo.id;
      that.getDeposit(id);
    },
    getDeposit: function (id) {
      var that = this;
      wx.request({
        url: url + '/rest/user/orders/complete/list/' + id,
        data: {
          page: 1,
          size: 100,
        },
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          var depositArr = res.data.content;
          console.log(depositArr)
          var depositarr =[];
          if (depositArr == undefined || depositArr.length == 0) {
            that.setData({
              boxShow: 'none',
              nohaveShow: 'block'
            })
          } else {
            var depositarr =[];
            for (var i = 0; i < depositArr.length; i++) {
              if (depositArr[i].statusInfo == 5 && depositArr[i].paymentTime == null) {

              }
              else if (depositArr[i].statusInfo == 1 && depositArr[i].paymentTime == null) {
                
              }else {
                depositarr.push(depositArr[i])
              }
            }
            for (var i = 0; i < depositarr.length; i++) {
              depositarr[i].paymentTime = that.getTime(depositarr[i].paymentTime);
              depositarr[i].returnDepositTime = that.getTime(depositarr[i].returnDepositTime);
              if (depositarr[i].returnDepositStatus == 'success') {
                depositarr[i].eds = '退款成功';
                depositarr[i].color = 'successback';
                depositarr[i].go= '';
                depositarr[i].show = 'none'
              } else if (depositarr[i].returnDepositTime == null) {
                depositarr[i].eds = '申请退款';
                depositarr[i].color = 'noback';
                depositarr[i].go = 'go';
                depositarr[i].show = 'none'
              }else{
                if (depositarr[i].userLiquidatedDamages == null) {
                  depositarr[i].returnDeposit = depositarr[i].deposit;
                }
                depositarr[i].eds = '退款失败';
                depositarr[i].color = 'successback';
                depositarr[i].class = 'notime';
                depositarr[i].go = '';
                depositarr[i].show = 'inline-block'
              }
            }
          }
          if (depositarr == undefined || depositarr.length == 0) {
            that.setData({
              boxShow: 'none',
              nohaveShow: 'block'
            })
          }
          that.setData({
            depositArr: depositarr
          })
        }
      })
    },
    gotopj:function(e) {
      var go = e.currentTarget.dataset.bind;
      var id = e.currentTarget.dataset.id;
      if(go == 'go') {
        wx.navigateTo({
          url: '../backMoney/backMoney?orderId='+id,
        })
      }
      
    },
    getTime:function(time) {
      var ob = new Date(time);
      var year = ob.getFullYear();
      var month = twoNum(ob.getMonth()+1);
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
})