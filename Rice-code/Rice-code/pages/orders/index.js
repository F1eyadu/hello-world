const app=getApp()
function formatDateTime(inputTime) {//时间戳转换成时间
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};
var huoqu = function(_this){
  _this.setData({
    hidden:false
  })
  wx.request({
    url: app.globalData.url + 'rest/orders/order/getOrderByUserId/userId-' + _this.data.userId,
    method: 'GET',
    success: res => {
      var data = res.data;
      data.map(function (x) {
        if (x.state == 0 || x.state == 2 || x.state == 7 || (x.state == 3 && x.orderType == 1) || x.state == 9 || x.state == 11) {
          _this.data.ordering.push(x)
          var time = formatDateTime(x.createTime);
          _this.data.timeing.push(time)
        }
        else if ((x.state == 3 && x.orderType == 0) || x.state == 4 || x.state == 5 || x.state == 6 || x.state == 8 || x.state == 10 ) {
          _this.data.ordered.push(x)
          var time = formatDateTime(x.createTime);
          _this.data.timed.push(time)
        }
      })
      _this.setData({
        hidden:true,
        orders: data,
        ordering: _this.data.ordering,
        ordered: _this.data.ordered,
        timed: _this.data.timed,
        timeing: _this.data.timeing
      })
      //  console.log(_this.data.ordering)
      //  console.log(_this.data.ordered)
    }
  })
}
Page({
  data: {
    stuta:1,
    userId:"",
    orders:[],
    ordering:[],
    ordered:[],
    timeing:[],
    timed:[],
    url:"",
    hidden:true,
    Reserve:[]
  },
  onLoad:function(){
    this.setData({
      userId: app.globalData.id,
      url: app.globalData.url,
    })
  },
  onShow:function(){
    var _this = this;
    _this.setData({
      orders:[],
      ordering:[],
      ordered :[],
      timeing: [],
      timed :[],
    })
    huoqu(_this);
  },
  details:function(e){
    var _this = this;
    var data = e.currentTarget.dataset;
    console.log(data);
    if (!data.addid){
      wx.navigateTo({
        url: '../../pages/refund/index?orderId=' + data.id + '&userId=' + this.data.userId,
      })
    } else if (data.addid){
      wx.navigateTo({
        url: '../../pages/refoundMoney/index?sellerId=' + data.sellerid + '&userId=' + _this.data.userId + '&orderId=' + data.id + '&addressId=' + data.addid
      })
    }
  },
  change:function(e){
    var _this = this;
    _this.setData({
      stuta:e.target.dataset.stuta
    })
    if (_this.data.stuta==3){
      wx.request({
        url: app.globalData.url + 'rest/order/reserve/' + _this.data.userId,
        method:'GET',
        success:res=>{
          console.log(res)
          if (res.data){
            _this.data.Reserve = res.data;
            for (var i = 0; i < _this.data.Reserve.length;i++){
              _this.data.Reserve[i].reserveInfo.reserveTime = formatDateTime(_this.data.Reserve[i].reserveInfo.reserveTime).substr(0,16);
              _this.data.Reserve[i].reserveInfo.createTime = formatDateTime(_this.data.Reserve[i].reserveInfo.createTime).substr(0, 16);
            }
            _this.setData({
              Reserve: _this.data.Reserve
            })
          }
        }
      })
    }
  },
  tiaozhuan:function(e){
    var _this = this;
    var data = e.currentTarget.dataset;
    if (_this.data.stuta==3){
      wx.navigateTo({
        url: '../../pages/goTo/index?orderId=' + data.id + '&sellerId=' + data.sellerid
      })
    }else{
      _this.data.orders.map(function (x) {
        if (x.id == data.id) {
          if (x.orderType == 1) {
            if (x.state == 3 || x.state == 9) {
              wx.navigateTo({
                url: '../../pages/waitMeal/index?sellerId=' + data.sellerid + '&userId=' + _this.data.userId + '&orderId=' + data.id + '&addressId=' + data.add
              })
            } else if (x.state == 0 || x.state == 7) {
              if (x.sendAddress==null){
                if (x.user.addressList.length==0){
                  wx.navigateTo({
                    url: '../../pages/firstOrder/index?sellerId=' + data.sellerid + '&userId=' + _this.data.userId + '&orderId=' + data.id
                  })
                }else{
                  wx.navigateTo({
                    url: '../../pages/NotFrist/index?sellerId=' + data.sellerid + '&userId=' + _this.data.userId + '&orderId=' + data.id + '&addressId=' + data.add
                  })
                }
              } else if (x.sendAddress != null){
                wx.navigateTo({
                  url: '../../pages/payoff/index?sellerId=' + data.sellerid + '&userId=' + _this.data.userId + '&orderId=' + data.id + '&addressId=' + data.add
                })
              }
              return;
            }
          } else if (x.orderType == 0) {
            if (x.type==1){
              if (x.state == 2 || x.state ==7){
                wx.navigateTo({
                  url: '../../pages/Ordering/Ordering?orderId=' + x.id + '&sellerId=' + x.sellerId + '&tableNum=' + x.tableNum + '&tableType=' + x.tableType,
                })
              } else if (x.state == 0){
                if (x.ordersList==null){
                  wx.navigateTo({
                    url: '../../pages/order/order?sellerId=' + x.sellerId + '&tableNum=' + x.tableNum + '&stutas=1' + '&orderId=' + x.id + '&tableType=' + x.tableType,
                  })
                }else {
                  wx.navigateTo({
                    url: '../../pages/Pending/index?orderId=' + x.id + '&tableType=' + x.tableType + '&tableNum=' + x.tableNum + '&sellerId=' + x.sellerId + '&stutas=1'
                  })
                }
              }else{
                wx.navigateTo({
                  url: '../../pages/orderFood/orderFood?sellerId=' + x.sellerId + '&tableNum=' + x.tableNum + '&orderId=' + x.id + '&tableType=' + x.tableType,
                })
              }
            }else if(x.type == 0){
              if (x.state == 7){
                wx.navigateTo({
                  url: '../../pages/Order-confirm/Order-confirm?orderId=' + x.id + '&sellerId=' + x.sellerId + '&tableNum=' + x.tableNum + '&tableType=' + x.tableType,
                })
              } else if (x.state==0){
                if (x.ordersList == null){
                  wx.navigateTo({
                    url: '../../pages/order/order?sellerId=' + x.sellerId + '&tableNum=' + x.tableNum + '&stutas=1' + '&orderId=' + x.id + '&tableType=' + x.tableType,
                  })
                }else{
                  wx.navigateTo({
                    url: '../../pages/Pending/index?orderId=' + x.id + '&tableType=' + x.tableType + '&tableNum=' + x.tableNum + '&sellerId=' + x.sellerId + '&stutas=1'
                  })
                }
              }else if(x.state == 11){
                wx.navigateTo({
                  url: '../../pages/refund/index?orderId=' + x.id + '&userId=' + _this.data.userId,
                })
              }else{
                wx.navigateTo({
                  url: '../../pages/orderFood/orderFood?sellerId=' + x.sellerId + '&tableNum=' + x.tableNum + '&orderId=' + x.id + '&tableType=' + x.tableType,
                })
              }
            }
          }
        }
      })
    }
  }
})