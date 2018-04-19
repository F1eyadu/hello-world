const app = getApp()
var time;
var panduan=function(_this){
  wx.request({
    url: _this.data.url + 'rest/orders/order/getOrderState/sellerId-' + _this.data.sellerId + '/tableNum-' + _this.data.tableNum,
    method: 'POST',
    data:{
      tableType: _this.data.tableType,
    },
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: res => {
      if (res.data.code != 200) {
        wx.request({
          url: _this.data.url + 'rest/orders/order/findOrderByUserId/userId-' + _this.data.userId + '/sellerId-' + _this.data.sellerId + '/tableNum-' + _this.data.tableNum,
          method: 'POST',
          data: {
            tableType: _this.data.tableType,
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: res => {
            console.log(res);
            var types = res.data.msg.type;
            if (res.data.code == 200) {
              if (types==1){
                if (res.data.msg.state == 2 || res.data.msg.state == 7) {
                  wx.redirectTo({
                    url: '../../pages/Ordering/Ordering?orderId=' + res.data.msg.id + '&sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&tableType=' + _this.data.tableType,
                  })
                }
                else if (res.data.msg.state == 0) {
                  if (res.data.msg.ordersList == null){
                    wx.redirectTo({
                      url: '../../pages/order/order?sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&stutas=1' + '&orderId=' + res.data.msg.id + '&tableType=' + _this.data.tableType,
                    })
                  }else{
                    wx.redirectTo({
                      url: '../../pages/Pending/index?orderId=' + res.data.msg.id + '&tableType=' + _this.data.tableType + '&tableNum=' + _this.data.tableNum + '&sellerId=' + _this.data.sellerId + '&stutas=1'
                    })
                  }  
                }
                else {
                  wx.redirectTo({
                    url: '../../pages/orderFood/orderFood?sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&orderId=' + res.data.msg.id + '&tableType=' + _this.data.tableType,
                  })
                }
              } else if (types == 0){
                if (res.data.msg.state == 7) {
                  wx.redirectTo({
                    url: '../../pages/Order-confirm/Order-confirm?orderId=' + res.data.msg.id + '&sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&tableType=' + _this.data.tableType,
                  })
                }
                else if (res.data.msg.state == 0) {
                  if (res.data.msg.ordersList == null) {
                    wx.redirectTo({
                      url: '../../pages/order/order?sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&stutas=1' + '&orderId=' + res.data.msg.id + '&tableType=' + _this.data.tableType,
                    })
                  } else {
                    wx.redirectTo({
                      url: '../../pages/Pending/index?orderId=' + res.data.msg.id + '&tableType=' + _this.data.tableType + '&tableNum=' + _this.data.tableNum + '&sellerId=' + _this.data.sellerId + '&stutas=1'
                    })
                  }
                }
                else {
                  wx.redirectTo({
                    url: '../../pages/orderFood/orderFood?sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&orderId=' + res.data.msg.id + '&tableType=' + _this.data.tableType,
                  })
                }
              }
            }
            if (res.data.code == 500) {
              wx.redirectTo({
                url: '../../pages/orderFood/orderFood?sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&orderId=' + res.data.msg.id + '&tableType=' + _this.data.tableType,
              })
            }
          }
        })
      }
    }
  })
}

Page({
  data: {
    stuta:false,
    stutas: false,
    stutass:false,
    code:null,
    userId:null,
    sellerId:null,
    tableNum:"",
    hidden:false,
    orderId:null,
    url:null,
    xiaoxi:"",
    sellerName:"",
    tableType:"" 
  },
  onLoad:function(option){
    var _this = this;
    // console.log(option.q)
    if(JSON.stringify(option) != "{}"){
      var canshu = option.q;
      var seller = canshu.split("%3D")[1];
      var sellerId = seller.split("%26")[0];
      var tableNums = canshu.split("%3D")[2];
      var tableNum = tableNums.split("%26")[0]
      var tableType = canshu.split("%3D")[3];
      tableType = decodeURI(decodeURI(tableType));
      console.log(tableType);
      _this.setData({
        url: app.globalData.url,
        sellerId: sellerId,
        tableNum: tableNum,
        tableType: tableType
      })
      wx.request({
        url: _this.data.url + 'api/seller/' + _this.data.sellerId,
        method: "GET",
        success: res => {
          _this.setData({
            sellerName: res.data.name
          })
          app.huoqu();
        }
      })
    }else{
      _this.setData({
        hidden:true,
        stutas: true,
        xiaoxi: "没有获取到正确的参数，请重新扫码"
      })
      setTimeout(function () {
        _this.setData({
          stutas: false,
          xiaoxi: ""
        })
      }, 2000)
    }
    // this.setData({
    //   url: app.globalData.url,
    //   sellerId: '5a59d54f976956608a0abd42',
    //   tableNum: '3',
    //   tableType:"水云间",
    // })
    // wx.request({
    //   url: _this.data.url + 'api/seller/' + _this.data.sellerId,
    //   method:"GET",
    //   success:res=>{
    //     _this.setData({
    //       sellerName: res.data.name
    //     })
    //   }
    // })
    // app.huoqu();
  },
  onShow:function(){
    var _this = this;
      if (_this.data.sellerId){
        var times = 0;
        time = setInterval(function () {
          if (app.globalData.id) {
            console.log(app.globalData.id)
            clearInterval(time)
            _this.setData({
              hidden: true,
              userId: app.globalData.id,
            })
            panduan(_this)
          } else {
            times = times + 1;
            console.log(times);
            if (times == 60) {
              clearInterval(time)
              _this.setData({
                hidden: true,
                stutass: true
              })
              setTimeout(function () {
                _this.setData({
                  stutass: false
                })
              }, 2000)
            }
          }
        }, 1000)
      }
  },
  onHide:function(){
    clearInterval(time)
      this.setData({
        hidden:false
      })
  },
  orderFood:function(){
    wx.request({
      url: this.data.url + 'rest/orders/order/addOrder/openId-' + app.globalData.openId + '/sellerId-' + this.data.sellerId + '/tableNum-' + this.data.tableNum,
      method: 'POST',
      data: {
        tableType: this.data.tableType,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success : res=>{
        var code = res.data;
        if(res.data.code ==200){
          this.setData({
            code: res.data.msg.verifyCode,
            orderId: res.data.msg.id,
            stuta: true
          })
        } else if (res.data.code == 500){
          wx.redirectTo({
            url: '../../pages/orderFood/orderFood?sellerId=' + this.data.sellerId + '&tableNum=' + this.data.tableNum + '&tableType=' + this.data.tableType,
          })
        }
      }
    })
  },
  Start:function(){
    var _this = this;
    if (_this.data.code==null){
      _this.setData({
        stutas:true,
        xiaoxi:"你还没获取餐桌验证码，不能点菜哟"
      })
      setTimeout(function(){
        _this.setData({
          stutas: false,
          xiaoxi:""
        })
      },2000)
    }
    else{
      wx.redirectTo({
        url: '../../pages/order/order?sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum  + '&stutas=1' + '&orderId=' + _this.data.orderId + '&tableType=' + _this.data.tableType,
      })
    }
  }
})