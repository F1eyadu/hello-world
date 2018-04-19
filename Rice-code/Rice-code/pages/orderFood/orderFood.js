const app=getApp()
var times;
// var huoqu = function(_this){
//   wx.request({
//     url: app.globalData.url + 'api/order/' + _this.data.orderId,
//     method: 'GET',
//     success:res=>{
//       console.log(res);
//       if(res.data.state==3){
//         wx.redirectTo({
//           url: '../../pages/details/details?orderId=' + _this.data.orderId
//         })
//       }
//     }
//   })
// }
Page({
  data: {
    stuta:false,
    stutas:false,
    inputCode:null,
    sellerId:null,
    orderId:"",
    tableNum:"",
    info:null,
    orderId:null,
    url:null,
    sellerName: "",
    tableType:""
  },
  onLoad:function(e){
    console.log(e)
    this.setData({
      url: app.globalData.url,
      sellerId: e.sellerId,
      tableNum: e.tableNum,
      orderId: e.orderId,
      tableType:e.tableType
    })
    wx.request({
      url: this.data.url + 'api/seller/' + this.data.sellerId,
      method: "GET",
      success: res => {
        this.setData({
          sellerName: res.data.name
        })
      }
    })
  },
  onShow:function(){
    // var _this = this;
    // times = setInterval(function(){
    //   huoqu(_this);
    // },2000)
  },
  // onUnload:function(){
  //   clearInterval(times);
  // },
  // onHide:function(){
  //   clearInterval(times);
  // },
  inputCode:function(e){
    this.setData({
      inputCode: e.detail.value
    })
  },
  orderFood:function(){
    var _this = this;
    if (_this.data.inputCode==null){
      _this.setData({
        stutas:true,
        info:"你还没有输入验证码"
      }), 
      setTimeout(function(){
        stutas: false
      },2000)
    }else{
      wx.request({
        url: _this.data.url+'rest/orders/order/findOrderByCode/userId-' + app.globalData.id+'/sellerId-' + _this.data.sellerId + '/tableNum-' + _this.data.tableNum + '/code-' + _this.data.inputCode,
        method: 'POST',
        data: {
          tableType: _this.data.tableType,
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success:res=>{
          if(res.data.code ==500){
            _this.setData({
              stutas: true,
              info: "验证码错误,请重新输入"
            }), 
              setTimeout(function () {
                _this.setData({
                  stutas: false,
                  info: null
                })
              }, 2000)
          }
          if (res.data.code == 200){
            wx.request({
              url: _this.data.url + 'api/order/' + res.data.msg.id,
              method:'GET',
              success:res=>{
                if(res.data.type ==1){
                  if (res.data.ordersList == null) {
                    if (res.data.state == 0) {
                      wx.redirectTo({
                        url: '../../pages/order/order?sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&stutas=1' + '&orderId=' + res.data.id + '&tableType=' + _this.data.tableType
                      })
                    }
                    else if (res.data.state == 2 || res.data.state == 7) {
                      wx.redirectTo({
                        url: '../../pages/Ordering/Ordering?orderId=' + res.data.id + '&tableType=' + _this.data.tableType + '&tableNum=' + _this.data.tableNum + '&sellerId=' + _this.data.sellerId
                      })
                    }
                  } else if (res.data.ordersList.length > 0) {
                    wx.redirectTo({
                      url: '../../pages/Pending/index?orderId=' + res.data.id + '&tableType=' + _this.data.tableType + '&tableNum=' + _this.data.tableNum + '&sellerId=' + _this.data.sellerId + '&stutas=1'
                    })
                  }
                }
                else if(res.data.type ==0){
                  if (res.data.ordersList == null) {
                    if (res.data.state == 0) {
                      wx.redirectTo({
                        url: '../../pages/order/order?sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&stutas=1' + '&orderId=' + res.data.id + '&tableType=' + _this.data.tableType
                      })
                    }
                  } else if (res.data.ordersList.length > 0) {
                    wx.redirectTo({
                      url: '../../pages/Pending/index?orderId=' + res.data.id + '&tableType=' + _this.data.tableType + '&tableNum=' + _this.data.tableNum + '&sellerId=' + _this.data.sellerId + '&stutas=1'
                    })
                  }
                }
              }
            })
          }
        }
      })
    }
  }
})