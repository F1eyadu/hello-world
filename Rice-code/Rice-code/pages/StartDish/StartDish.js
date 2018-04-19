const app = getApp()
var times;
var length;
var qingqiu = function (_this){
  _this.data.dishes = [];
  _this.data.otherDishes = [];
  wx.request({
    url: app.globalData.url + 'api/order/' + _this.data.orderId,
    method: 'GET',
    success: res => {
      console.log(res);
      length = res.data.ordersList.length;
      if(length>1){
        var show = res.data.ordersList;
        show.map(function(x){
          if (x.user == null && x.submitTime ==null){
            x.dishes.map(function(dish){
              if (dish.user.id == _this.data.userId){
                   _this.data.dishes.push(dish)
              }else{
                _this.data.otherDishes.push(dish)
              }
            })
            _this.data.total = x.orderTotal;
          }
        })
        if (show[length - 1].user != null && show[length - 1].submitTime != null){
          wx.redirectTo({
            url: '../../pages/Ordering/Ordering?orderId=' + _this.data.orderId + '&sellerId-' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&tableType=' + _this.data.tableType
          })
        }
      }else{
        var diancai = res.data.ordersList[0].dishes;
        diancai.map(function(x){
          if (x.user.id == _this.data.userId) {
            _this.data.dishes.push(x)
          } else {
            _this.data.otherDishes.push(x)
          }
        })
        _this.data.total = res.data.ordersList[0].orderTotal;
      }   
      if (_this.data.userNum==null){
        _this.setData({
          code: res.data.verifyCode,
          dishes: _this.data.dishes,
          otherDishes: _this.data.otherDishes,
          total: _this.data.total,
          userNum: res.data.numberOfMeals
        })
      }else{
        _this.setData({
          code: res.data.verifyCode,
          dishes: _this.data.dishes,
          otherDishes: _this.data.otherDishes,
          total: _this.data.total
        })
      }
    }
  })
}
Page({
  data: {
    userId:null,
    code:"",
    url:null,
    dishes:[],
    otherDishes:[],
    total:"",
    orderId:null,
    hidden:true,
    xiaoxi:null,
    sellerId:'',
    setFree:"",
    stuta:true,
    userNum:null,
    wait:true,
    tableNum:"",
    hiddens:true,
    NewMess:"",
    tableType:""
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      orderId: e.orderId,
      sellerId: e.sellerId,
      userId: app.globalData.id,
      tableNum:e.tableNum,
      tableType: e.tableType
    })
      wx.request({
        url: app.globalData.url + 'rest/seller/findByTableNumber/sellerId-' + _this.data.sellerId + '/tableNum-' + _this.data.tableNum,
        method: 'POST',
        data: {
          tableType: _this.data.tableType,
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: res => {
          _this.setData({
            setFree: res.data.seatingFee
          })
        }
      })
  }, 
  onShow:function(){
    var _this = this;
    qingqiu(_this)
    times = setInterval(function(){
      qingqiu(_this)
    },3000)
  },
  onHide:function(){
    clearInterval(times);
  },
  onUnload: function () {
    clearInterval(times);
  },
  preventTouchMove: function () {
  },
  close:function(){
    this.setData({
      stuta:true
    })
  },
  inputNum: function (e) {
    var _this =this;
    var reg = /^[1-9]\d*$/;
    if (reg.test(e.detail.value) && e.detail.value>0){
      _this.setData({
        userNum: e.detail.value
      })
    }else{
      _this.setData({
        userNum:"",
        hiddens:false,
        NewMess:"请重新输入正确的人数"
      });
      setTimeout(function(){
        _this.setData({
          hiddens: true,
          NewMess: ""
        });
      },3000)
    }
  },
  startDish:function(){
    var _this = this
    if (_this.data.userNum == null || _this.data.userNum == "") {
      _this.setData({
        stuta: false
      })
    }else{
      wx.request({
        url: app.globalData.url + 'rest/orders/order/OrderaddAdish/userId-' + app.globalData.id + '/orderId-' + _this.data.orderId + '/numberOfMeals-' + _this.data.userNum,
        method: 'POST',
        header: { 'content-type': 'application/json' },
        success: res => {
          if (res.data.code == 200) {
          wx.removeStorage({
            key: _this.data.orderId,
            success: function (res) {
            }
          })
            wx.redirectTo({
              url: '../../pages/Ordering/Ordering?orderId=' + _this.data.orderId + '&sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&tableType=' + _this.data.tableType
            })
          } else {
            _this.setData({
              hidden: false,
              xiaoxi: "订单错误"
            }),
              setTimeout(function () {
                _this.setData({
                  hidden: true,
                  xiaoxi: null
                })
              }, 3000)
          }
        }
      })
    }
},
confrim:function(){
    var _this = this;
    _this.setData({
      wait: false
    })
    if (_this.data.userNum != "" && _this.data.userNum !=null){
          wx.request({
            url: app.globalData.url + 'rest/orders/order/OrderStartFood/userId-' + app.globalData.id + '/orderId-' + _this.data.orderId + '/numberOfMeals-' + _this.data.userNum,
            method: 'POST',
            header: { 'content-type': 'application/json' },
            success: res => {
              if (res.data.code == 200) {
                wx.removeStorage({
                  key: _this.data.orderId,
                  success: function (res) {
                  }
                })
                wx.redirectTo({
                  url: '../../pages/Ordering/Ordering?orderId=' + _this.data.orderId + '&sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&tableType=' + _this.data.tableType
                })
              } else {
                _this.setData({
                  hidden: false,
                  xiaoxi: "该订单已被下单,正在紧张跳转...."
                }),
                  wx.removeStorage({
                    key: _this.data.orderId,
                    success: function (res) {
                    }
                  })
                  setTimeout(function () {
                    _this.setData({
                      hidden: true,
                      xiaoxi: null
                    })
                    wx.redirectTo({
                      url: '../../pages/Ordering/Ordering?orderId=' + _this.data.orderId + '&sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&tableType=' + _this.data.tableType
                    })
                  }, 3000)
              }
            }
          })
        }else{
      _this.setData({
        userNum: "",
        hiddens: false,
        wait:true,
        NewMess: "请重新输入正确的人数"
      });
      setTimeout(function () {
        _this.setData({
          hiddens: true,
          NewMess: ""
        });
      }, 3000)
        }
  }
})