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
Page({
  data: {
    orderId:"",
    sellerId:"",
    url:"",
    sellerInfo:[],
    orderInfo:[],
    time:"",
    hidden: true,
    title:"",
    message:"",
    stute:"",
    state:false,
    remind:true,
    xiaoxi:""
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      url: app.globalData.url,
      sellerId: e.sellerId,
      orderId: e.orderId
    })
    wx.request({
      url: _this.data.url + 'api/orderReserveRepository/' + _this.data.orderId,
      method:'GET',
      success:res=>{
        console.log(res);
        var times = formatDateTime(res.data.reserveTime);
        _this.setData({
          orderInfo:res.data,
          time: times
        })
        console.log(times)
        if (res.data.state == 3 || res.data.state == 4){
          _this.setData({
            state:true
          })
        }
      }
    }),
    wx.request({
      url: _this.data.url + 'api/seller/' + _this.data.sellerId,
      method: 'GET',
      success: res => {
        console.log(res);
        _this.setData({
          sellerInfo: res.data
        })
      }
    })
  },
  callSeller:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.sellerInfo.tel
    })
  },
  confrim:function(){
    wx.reLaunch({
      url: '../../pages/index/index'
    })
    // this.setData({
    //   hidden: false,
    //   title:"确认入坐",
    //   message:'确认入坐以后将释放餐桌，用户即可扫描桌面二维码点餐',
    //   stute:"1"      
    // })
  },
  cancel:function(){
    this.setData({
      hidden: false,
      title: "取消订单",
      message: '是否取消订单',
      stute:"2"   
    })
  },
  closeModel:function(){
    this.setData({
      hidden: true,
      title: "",
      message: ''
    })
  },
  clickBtn:function(){
    var _this = this;
    if (_this.data.stute ==1){
      wx.request({
        url: _this.data.url + 'rest/order/reserve/complete/' + _this.data.orderId,
        method: 'PUT',
        success: res => {
          if (res.data.code == 200) {
            _this.setData({
              hidden: true,
              title: "",
              message: '',
              state: true,
              remind: false,
              xiaoxi: "确认入座成功"
            }),
              setTimeout(function () {
                _this.setData({
                  remind: true,
                  xiaoxi: ""
                })
                wx.reLaunch({
                  url: '../../pages/index/index'
                })
              }, 3000)
          } else if (res.data.code == 500) {
            _this.setData({
              remind: false,
              xiaoxi: "确认入座失败"
            }),
              setTimeout(function () {
                _this.setData({
                  remind: true,
                  xiaoxi: ""
                })
              }, 3000)
          }
        }
      })
    } else if (_this.data.stute == 2){
      wx.request({
        url: _this.data.url + 'rest/order/reserve/cancel/' + _this.data.orderId,
        method:'PUT',
        success:res=>{
          if(res.data.code==200){
            _this.setData({
              hidden: true,
              title: "",
              message: '',
              state:true,
              remind:false,
              xiaoxi:"取消订单成功"
            }),
            setTimeout(function(){
              _this.setData({
                remind: true,
                xiaoxi: ""
              })
              wx.reLaunch({
                url: '../../pages/index/index'
              })
            },3000)
          } else if (res.data.code == 500){
            _this.setData({
              remind: false,
              xiaoxi: "取消订单失败"
            }),
              setTimeout(function () {
                _this.setData({
                  remind: true,
                  xiaoxi: ""
                })
              }, 3000)
          }
        }
      })
    }
  }
})