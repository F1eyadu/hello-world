const app = getApp();
Page({
  data: {
    table:[],
    deskType: [],
    currentType:'',
    currentDesks:[],
    currentDesk:"",
    url:"",
    sellerId:""
  },
  onLoad: function (e) {
    var _this = this;
    _this.setData({
      url: app.globalData.url,
      sellerId: e.sellerId
    })
    wx.request({
      url: _this.data.url + 'rest/seller/table/' + _this.data.sellerId,
      method:'GET',
      success:res=>{
        if(res.data){
          res.data.map(function(x){
            _this.data.deskType.push(x.type)
          })
          var newArray = Array.from(new Set(_this.data.deskType));
          _this.data.currentType = newArray[0],
            res.data.map(function (x) {
            if (x.type == newArray[0]){
              _this.data.currentDesks.push(x);
            }
            })
          _this.setData({
            deskType: newArray,
            currentDesks: _this.data.currentDesks,
            currentType: _this.data.currentType,
            table: res.data
          })
        }
      }
    })
  },
  changeCurrent:function(e){
    var _this = this;
    _this.data.currentDesks=[];
    _this.data.table.map(function(x){
      if (x.type == e.target.dataset.type){
        _this.data.currentDesks.push(x);
      }
    }),
    _this.setData({
      currentDesks: _this.data.currentDesks,
      currentType: e.target.dataset.type
    })
  },
  chooseDesk:function(e){
    app.globalData.table = e.currentTarget.dataset.id
    this.setData({
      currentDesk: e.currentTarget.dataset.id,
    })
  },
  confrim:function(){
    wx.navigateBack()
  }
})