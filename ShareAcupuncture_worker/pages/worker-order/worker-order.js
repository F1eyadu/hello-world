const app = getApp();
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
    url : app.globalData.url,
    orders:[]
  },
  onLoad: function (e) {
    
  },
  onShow: function () {
    var _this = this;
    wx.request({
      url: _this.data.url + '/rest/doctor/orders/complete/list/' + app.globalData.userInfo.id,
      method:'GET',
      data:{
        size:100
      },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success:res=>{
        var data = res.data.content;
        data.map(function(x){
          x.acceptTime = formatDateTime(x.acceptTime);
          x.completeServiceTime = formatDateTime(x.completeServiceTime);
          x.createTime = formatDateTime(x.createTime);
        })
        _this.setData({
          orders: data
        })
      }
    })
  },
  checkOrder:function(e){
    wx.navigateTo({
      url: '../complete/index?orderId=' + e.currentTarget.dataset.id,
    })
  }
})



// const app = getApp();
// var url = app.globalData.url;
// var userInfo = app.globalData.userInfo;
// Page({
//   data: {
//       goingStatus: 'block',
//       didStatus:'none',
//       going:'going',
//       did: '',
//       goingshow:'none',
//       didshow:'none'
//   },
//   onLoad: function (options) {
//     var that = this;
//     var userInfo = app.globalData.userInfo;
//     var id = userInfo.id;
//     wx.request({
//       url: url + '/rest/doctor/orders/complete/list/' + id,
//       data: {
//         size: 100
//       },
//       header: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       success:function(res) {
//         var orderInfo = res.data.content;
//         if (orderInfo == [] || orderInfo == undefined || orderInfo.length == 0) {
//           that.setData({
//             didshow:'block',
//             didbox:'none',
//           })
//         } else {
//           var tool='';
//           for (var i=0; i<orderInfo.length;i++) {
//             orderInfo[i].startServiceTime = that.getTime(orderInfo[i].startServiceTime);
//             orderInfo[i].completeServiceTime = that.getTime(orderInfo[i].completeServiceTime);
//             var toolArr = [];
//             for(var j=0;j<orderInfo[i].serviceInfo.length;j++){
//               toolArr.push(orderInfo[i].serviceInfo[j].service.equipmentName);
//               orderInfo[i].tool = toolArr;
//             }
//           }
//           for (var i = 0; i < orderInfo.length;i++) {
//             for (var j = 0; j < orderInfo[i].tool.length;j++) {
//               if (orderInfo[i].toolstr ==undefined){
//                 orderInfo[i].toolstr = orderInfo[i].tool[j]
//               }else{
//                 orderInfo[i].toolstr = orderInfo[i].toolstr+' , '+orderInfo[i].tool[j]
//               }
//             }  
//           }
//           that.setData({
//             completeArr: orderInfo
//           })
//         }
//       }
//     })
//     wx.request({
//       url: url + '/rest/doctor/orders/unComplete/list/' + id,
//       data:{
//         size: 100
//       },
//       header: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       success: function (res) {
//         var orderInfo1 = res.data.content;
//         if (orderInfo1 == [] || orderInfo1 == undefined || orderInfo1.length == 0) {
//           that.setData({
//             goingshow: 'block',
//             goingbox: 'none'
//           })
//         } else {
//           var tool = '';
//           for (var i = 0; i < orderInfo1.length; i++) {
//             orderInfo1[i].startServiceTime = that.getTime(orderInfo1[i].startServiceTime);
//             var toolArr = [];
//             for (var j = 0; j < orderInfo1[i].serviceInfo.length; j++) {
//               toolArr.push(orderInfo1[i].serviceInfo[j].service.equipmentName);
//               orderInfo1[i].tool = toolArr;
//             }
//           }
//           for (var i = 0; i < orderInfo1.length; i++) {
//             for (var j = 0; j < orderInfo1[i].tool.length; j++) {
//               if (orderInfo1[i].toolstr == undefined) {
//                 orderInfo1[i].toolstr = orderInfo1[i].tool[j]
//               } else {
//                 orderInfo1[i].toolstr = orderInfo1[i].toolstr+ +' , '+orderInfo1[i].tool[j]
//               }
//             }
//           }
//           for (var i = 0; i < orderInfo1.length; i++) {
//             if (orderInfo1[i].statusInfo == 2) {
//               orderInfo1[i].class = "waitAccept";
//               orderInfo1[i].words = '待接受';
//               orderInfo1[i].bindtap = 'waitAccept';
//             }
//             if (orderInfo1[i].statusInfo == 6) {
//               orderInfo1[i].class = "waitservice";
//               orderInfo1[i].words = '待服务';
//               orderInfo1[i].bindtap = 'waitservice';
//             }
//             if (orderInfo1[i].statusInfo == 8) {
//               orderInfo1[i].class = "servicing";
//               orderInfo1[i].words = '服务中';
//               orderInfo1[i].bindtap = 'servicing';
//             }
//           }
//         }
//         that.setData({
//           uncompleteArr: orderInfo1
//         })
//       }
//     })
//   },
//   getTime: function (time) {
//     var ob = new Date(time + 18000);
//     var year = ob.getFullYear();
//     var month = twoNum(ob.getMonth() + 1);
//     var day = twoNum(ob.getDate());
//     var hours = twoNum(ob.getHours());
//     var min = twoNum(ob.getMinutes());
//     var allTime = year + '/' + month + '/' + day + ' ' + hours + ':' + min;
//     return allTime;
//     function twoNum(num) {
//       if (num < 10) {
//         num = '0' + num;
//       } else {
//         num = num;
//       }
//       return num;
//     }
//   },  
//   didShow: function() {
//     this.setData({
//       goingStatus: 'none',
//       didStatus: 'block',
//       going: '',
//       did: 'did'
//     })  
//   },
//   goingShow: function () {
//     this.setData({
//       goingStatus: 'block',
//       didStatus: 'none',
//       going: 'going',
//       did: ''
//     })
//   },
//   waitservice:function(e) {
//     var orderId = e.currentTarget.dataset.id;
//     wx.navigateTo({
//       url: '../worker-startServe/worker-startServe?orderId=' + orderId,
//     })
//   },
//   servicing:function(e) {
//     var orderId = e.currentTarget.dataset.id;
//     wx.navigateTo({
//       url: '../worker-serving/worker-serving?orderId=' + orderId,
//     })
//   },
//   waitAccept:function(e) {
//     wx.navigateTo({
//       url: '../index/index',
//     })
//   },
// })