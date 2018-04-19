const app=getApp()
Page({
  data: {
    
  },
  contact:function(){
    wx.makePhoneCall({
      phoneNumber: '02363701181' //仅为示例，并非真实的电话号码
    })
  }
})