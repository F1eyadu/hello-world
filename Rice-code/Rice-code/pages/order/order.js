const app=getApp()

var SumPrice=function(_this){
  _this.data.priceSum = 0;
  if (_this.data.chooseFood.length>0){
    _this.data.chooseFood.map(function(x){
      if (x.ratio!=null){
        _this.data.priceSum = Number(_this.data.priceSum) + Number(x.discount * x.chooseNum)
      }
      else{
        _this.data.priceSum = Number(_this.data.priceSum) + Number(x.price * x.chooseNum)
      }
    })
  }
  _this.data.priceSum = _this.data.priceSum.toFixed(2)
  _this.setData({
    priceSum: _this.data.priceSum
  })
}

var getDishes = function(_this){
  wx.getStorage({
    key: _this.data.orderId,
    success: function (res) {
      var Storage = JSON.parse(res.data);
      wx.request({
        url: _this.data.url + 'api/seller/' + _this.data.sellerId,
        method: 'GET',
        success: function (res) {
          if (res.data.dishes.length > 0) {
            var data = [];
            _this.data.foods = [];
            _this.data.chooseFood = [];
            res.data.dishes.map(function (x) {
              if (x.status == 0) {
                data.push(x)
              }
            })
            var typeNames = [];
            data.map(function (x) {
              x.type.map(function (type) {
                typeNames.push(type)
              })
            })
            var newArray = Array.from(new Set(typeNames));
            newArray.map(function (x, y) {
              if (x == "特色菜") {
                newArray.splice(y, 1);
                newArray.unshift("特色菜")
              }
            })
            newArray.map(function (x, y) {
              if (x == "活动菜品") {
                newArray.splice(y, 1);
                newArray.unshift("活动菜品")
              }
            })
            newArray.map(function (x, y) {
              if (x == "餐盒费") {
                newArray.splice(y, 1);
              }
            })
            _this.data.typeNameId = newArray[0];
            data.map(function(dish){
              dish.chooseNum = 0;
              Storage.map(function(x){
                if (dish.id == x.id){
                  dish.chooseNum = x.chooseNum;
                  _this.data.chooseFood.push(x);
                }
              })
            })
            data.map(function(dish){
              dish.type.map(function (types) {
                if (types == newArray[0]) {
                  _this.data.foods.push(dish)
                }
              })
            })
            _this.setData({
              dishes: data,
              foods: _this.data.foods,
              typeName: newArray,
              typeNameId: _this.data.typeNameId,
              types: res.data.acceptOrderType[0],
              chooseFood: _this.data.chooseFood,
              desc: res.data.desc
            })
            SumPrice(_this);
          }
        }
      })
    },
    fail:function(res){
      wx.request({
        url: _this.data.url + 'api/seller/' + _this.data.sellerId,
        method: 'GET',
        success: function (res) {
          if (res.data.dishes.length > 0) {
            var data = [];
            res.data.dishes.map(function (x) {
              if (x.status == 0) {
                data.push(x)
              }
            })
            var typeNames = [];
            data.map(function (x) {
              x.type.map(function (type) {
                typeNames.push(type)
              })
            })
            var newArray = Array.from(new Set(typeNames));
            newArray.map(function (x, y) {
              if (x == "特色菜") {
                newArray.splice(y, 1);
                newArray.unshift("特色菜")
              }
            })
            newArray.map(function (x, y) {
              if (x == "活动菜品") {
                newArray.splice(y, 1);
                newArray.unshift("活动菜品")
              }
            })
            newArray.map(function (x, y) {
              if (x == "餐盒费") {
                newArray.splice(y, 1);
              }
            })
            _this.data.typeNameId = newArray[0];
            data.map(function (dish) {
              dish.chooseNum = 0;
              dish.type.map(function (types) {
                if (types == newArray[0]) {
                  _this.data.foods.push(dish)
                }
              })
            })
            _this.setData({
              dishes: data,
              foods: _this.data.foods,
              typeName: newArray,
              typeNameId: _this.data.typeNameId,
              types: res.data.acceptOrderType[0],
              desc:res.data.desc
            })
          }
        }
      })
    }
  })
}
Page({
  data: {
    stuta:true,
    priceSum:"",
    height:120,
    typeName:[],
    dishes:[],
    foods:[],
    chooseFood:[],
    typeNameId:"",
    sellerId:null,
    tableNum:null,
    code:"",
    userId:null,
    orderId:null,
    url:null,
    xiao:null,
    hidden:true,
    free:null,
    stutas:null,
    wait:true,
    types:"",
    tableType:"",
    desc:""
  },
  onLoad:function(e){
    var _this = this;
    _this.setData({
      url: app.globalData.url,
      sellerId: e.sellerId,
      tableNum: e.tableNum,
      orderId: e.orderId,
      stutas: e.stutas,
      tableType:e.tableType
    })
    wx.request({
      url: _this.data.url + 'api/order/' + _this.data.orderId,
      method:'GET',
      success:res=>{
        _this.setData({
          code: res.data.verifyCode
        })
      }
    })
    
  },
  onShow:function(){
    var _this = this;
    getDishes(_this);
  },
  checkFood:function(e){
    var _this = this;
    var foods=[];
    _this.data.dishes.map(function (x) {
        x.type.map(function(type){
          if (type == e.target.dataset.id){
            foods.push(x);
          }
        })
      })
    this.setData({
      foods: foods,
      typeNameId:e.target.dataset.id
    })
  },
  jian:function(e){
    var _this = this;
    var id = e.target.dataset.index;
    _this.data.dishes.map(function(x){
      if (x.id == id) {
        x.chooseNum--;
        _this.data.foods.map(function(dish){
          if(dish.id ==id){
            dish.chooseNum--;
          }
        })
        _this.data.chooseFood.map(function(food,num){
            if(food.id == id){
              food.chooseNum--;
              if (food.chooseNum ==0){
                _this.data.chooseFood.splice(num, 1);
                if (_this.data.stuta == false) {
                  _this.data.height = 160 + (60 * _this.data.chooseFood.length);
                }
              }
            }
        })
      }
    })
    _this.setData({
      dishes: _this.data.dishes,
      chooseFood: _this.data.chooseFood,
      foods: _this.data.foods,
      height: _this.data.height
    })
    SumPrice(_this);
    var choose = JSON.stringify(_this.data.chooseFood)
    if (_this.data.chooseFood.length==0)
    {
      wx.removeStorage({
        key: this.data.orderId,
        success: function (res) {
        }
      })
    }else{
      wx.setStorage({
        key: _this.data.orderId,
        data: choose
      })
    }
  },
  jia:function(e){
    var _this = this;
    var id = e.target.dataset.index;
    _this.data.dishes.map(function(x){
      if(x.id == id){
        x.chooseNum++;
        _this.data.foods.map(function (dish) {
          if (dish.id == id) {
            dish.chooseNum++;
          }
        })
        if (_this.data.chooseFood.length == 0){
          _this.data.chooseFood.push(x);
        }else{
          var result = false;
          _this.data.chooseFood.map(function(food,num){
            if (food.id == id){
              food.chooseNum = x.chooseNum;
              result = true;
            }
          })
          if (!result) {
            _this.data.chooseFood.push(x);
          }
        }
      }
    })
    _this.setData({
      dishes: _this.data.dishes,
      chooseFood: _this.data.chooseFood,
      foods: _this.data.foods,
    })
    SumPrice(_this);
    if (_this.data.stuta ==false){
        _this.setData({
          height:160+(60 * _this.data.chooseFood.length)
        })
    }
    var choose = JSON.stringify(_this.data.chooseFood)
    wx.setStorage({
      key: _this.data.orderId,
      data: choose
    })
  },
  showItem:function(){
    var _this = this;
    if(_this.data.stuta){
      _this.setData({
        height: 160 + (60 * _this.data.chooseFood.length),
        stuta: false
      })
    }else{
      _this.setData({
        height:120,
        stuta: true
      })
    }
  },
  ClearItem:function(){
    this.data.chooseFood=[];
    this.data.foods.map(function(x){
      x.chooseNum= 0
    })
    this.data.dishes.map(function (dish) {
      dish.chooseNum = 0;
    })
    wx.removeStorage({
      key: this.data.orderId,
      success: function (res) {
      }
    })
    this.setData({
      height: 120,
      stuta: true,
      chooseFood: this.data.chooseFood,
      foods: this.data.foods,
      dishes: this.data.dishes
    })
  },
  clickImage:function(e){ 
    var that = this;
    var imgs=[];
    var current = e.target.dataset.src; 
   var src = that.data.url + 'file/noThumbnail/' + that.data.sellerId+'-dish-'+ current;
   imgs.push(src)
    wx.previewImage({
      current: src,
      urls: imgs,
    })
  },
  confrim:function(){//选菜
  var _this = this;
    var dishes=[];
    var chose =[];
    _this.data.chooseFood.map(function(x){
      chose.push(x)
    })
    chose.map(function(dishe){
      var choose={}
      choose.amount = dishe.chooseNum;
      // delete dishe.chooseNum;
      choose.dishe = dishe;
      dishes.push(choose)
    })  
    _this.setData({
      wait:false
    })
    if (_this.data.stutas ==1){
    wx.request({
      url: _this.data.url + 'rest/orders/order/addFood/userId-' + app.globalData.id + '/orderId-' + _this.data.orderId,
      method: 'POST',
      data: JSON.stringify(dishes),
      header: { 'Content-Type': 'application/json; charset=UTF-8' },
      success: res => {
        if(_this.data.types ==1){
          if (res.data.code == 200) {
            // wx.removeStorage({
            //   key: _this.data.orderId,
            //   success: function (res) {
            //   }
            // })
            wx.navigateTo({
              url: '../../pages/StartDish/StartDish?orderId=' + _this.data.orderId + '&sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&tableType=' + _this.data.tableType
            })
            _this.setData({
              wait: true
            })
          } else if (res.data.code == 'fail') {
            wx.removeStorage({
              key: _this.data.orderId,
              success: function (res) {
              }
            })
            wx.navigateTo({
              url: '../../pages/Ordering/Ordering?orderId=' + _this.data.orderId + '&sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&tableType=' + _this.data.tableType
            })
            _this.setData({
              wait: true
            })
          }
          else {
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
        else if(_this.data.types ==0){
          if (res.data.code == 200) {
            // wx.removeStorage({
            //   key: _this.data.orderId,
            //   success: function (res) {
            //   }
            // })
            wx.navigateTo({
              url: '../../pages/Order-confirm/Order-confirm?orderId=' + _this.data.orderId + '&sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&tableType=' + _this.data.tableType
            })
            _this.setData({
              wait: true
            })
          } else if (res.data.code == 'fail') {
            // wx.removeStorage({
            //   key: _this.data.orderId,
            //   success: function (res) {
            //   }
            // })
            wx.navigateTo({
              url: '../../pages/Order-confirm/Order-confirm?orderId=' + _this.data.orderId + '&sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&tableType=' + _this.data.tableType
            })
            _this.setData({
              wait: true
            })
          }
          else {
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
      }
    })
  }
  else if (_this.data.stutas==2){       
    wx.request({
      url: _this.data.url + 'rest/orders/order/addAdish/userId-' + app.globalData.id + '/orderId-' + _this.data.orderId,
      method: 'POST',
      data: JSON.stringify(dishes),
      header: { 'Content-Type': 'application/json; charset=UTF-8' },
      success:res=>{
        if (res.data.code == 200) {
          // wx.removeStorage({
          //   key: _this.data.orderId,
          //   success: function (res) {
          //   }
          // })
          wx.navigateTo({
            url: '../../pages/StartDish/StartDish?orderId=' + _this.data.orderId + '&sellerId=' + _this.data.sellerId + '&tableNum=' + _this.data.tableNum + '&tableType=' + _this.data.tableType
          })
          _this.setData({
            wait: true
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
  }
})