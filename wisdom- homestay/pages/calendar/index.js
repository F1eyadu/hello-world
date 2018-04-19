//index.js
'use strict';
let choose_year = null,
  choose_month = null;
let  orders = [];
let chooseDate ={
  startTime:"",
  endTime:""
};
let houseId;
var url;
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
function GetDateDiff(startDate, endDate) {
  var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
  var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
  var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
  return dates;
} 
const conf = {
  data: {
    hasEmptyGrid: false,
    showPicker: false,
    hidden:true,
    chooseDate:{
      startTime: "",
      endTime: ""
    },
    night:null,
    // houseOrder:[]
  },
  onLoad(e) {
    const app = getApp();
    url = app.globalData.url;
    var that = this;
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    houseId = e.houseId;
    chooseDate = {
      startTime: "",
      endTime: ""
    };
    this.chooseDate = {
      startTime: "",
      endTime: ""
    }
    function getThisMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    };
    function getFirstDayOfWeek(year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    }
    function calculateEmptyGrids(year, month) {//生成周期
      const firstDayOfWeek =getFirstDayOfWeek(year, month);
      let empytGrids = [];
      if (firstDayOfWeek > 0) {
        for (let i = 0; i < firstDayOfWeek; i++) {
          empytGrids.push(i);
        }
        that.setData({
          hasEmptyGrid: true,
          empytGrids
        });
      } else {
        that.setData({
          hasEmptyGrid: false,
          empytGrids: []
        });
      }
    };
    function calculateDays(year, month) {//生成日期
      let days = [];
      var d = new Date()
      var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      const thisMonthDays = getThisMonthDays(year, month);
      for (let i = 1; i <= thisMonthDays; i++) {
        var time = year + "-" + month + "-" + i
        if ((new Date(time.replace(/-/g, "\/"))) >= (new Date(str.replace(/-/g, "\/")))) {
          days.push(
            {
              date: time,
              day: i,
              choosed: false,
              choose: false,
              Size: true
            }
          )
        } else {
          days.push(
            {
              date: time,
              day: i,
              choosed: false,
              choose: false,
              Size: false
            }
          )
        }
      }
      days.map(function (x) {
        orders.map(function (time) {
          if ((new Date((year + "-" + month + "-" + x.day).replace(/-/g, "\/"))) >= (new Date(time.startTime.replace(/-/g, "\/"))) && (new Date((year + "-" + month + "-" + x.day).replace(/-/g, "\/"))) <= (new Date(time.endTime.replace(/-/g, "\/")))) {
            x.choosed = true;
          }
        })
      })
      days.map(function (x) {
        if ((new Date((x.date).replace(/-/g, "\/"))) >= (new Date((chooseDate.startTime).replace(/-/g, "\/"))) && (new Date((x.date).replace(/-/g, "\/"))) <= (new Date((chooseDate.endTime).replace(/-/g, "\/")))) {
          x.choose = true;
        }
        else if ((new Date((x.date).replace(/-/g, "\/"))) < (new Date((chooseDate.startTime).replace(/-/g, "\/"))) || (new Date((x.date).replace(/-/g, "\/"))) > (new Date((chooseDate.startTime).replace(/-/g, "\/")))) {
          x.choose = false;
        }
      })
      that.setData({
        days
      });
      console.log(that.data.days)
    }
    wx.request({//请求订单
      url: url+'rest/house/findOrderEndTimeByHouseId/' + e.houseId,
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        orders = [];
        res.data.msg.map(function (x, y) {
          var order = {};
          order.startTime = formatDateTime(x.startTime).split(" ")[0];
          order.endTime = formatDateTime(x.endTime).split(" ")[0];
          orders.push(order);
        })
        calculateEmptyGrids(cur_year, cur_month)
        calculateDays(cur_year, cur_month)
        // that.setData({
        //   houseOrder: orders
        // })
      }
    })
    that.setData({
      cur_year,
      cur_month,
      weeks_ch
    });
  },


   getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
    },
   getFirstDayOfWeek(year, month) {
  return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {//生成周期
  const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
  let empytGrids = [];
  if (firstDayOfWeek > 0) {
  for (let i = 0; i < firstDayOfWeek; i++) {
    empytGrids.push(i);
  }
  this.setData({
    hasEmptyGrid: true,
    empytGrids
  });
} else {
  this.setData({
    hasEmptyGrid: false,
    empytGrids: []
  });
}
},
calculateDays(year, month) {//生成日期
  // console.log(orders)
  let days = [];
var d = new Date()
var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
const thisMonthDays = this.getThisMonthDays(year, month);
for (let i = 1; i <= thisMonthDays; i++) {
  var time = year + "-" + month + "-" + i
  if ((new Date(time.replace(/-/g, "\/"))) >= (new Date(str.replace(/-/g, "\/")))) {
    days.push(
      {
        date: time,
        day: i,
        choosed: false,
        choose: false,
        Size: true
      }
    )
  } else {
    days.push(
      {
        date: time,
        day: i,
        choosed: false,
        choose: false,
        Size: false
      }
    )
  }
}
days.map(function (x) {
  orders.map(function (time) {
    if ((new Date((year + "-" + month + "-" + x.day).replace(/-/g, "\/"))) >= (new Date(time.startTime.replace(/-/g, "\/"))) && (new Date((year + "-" + month + "-" + x.day).replace(/-/g, "\/"))) <= (new Date(time.endTime.replace(/-/g, "\/")))) {
      x.choosed = true;
    }
  })
})
  if (chooseDate.startTime != "" && chooseDate.endTime == ""){
    days.map(function(a){
      if (a.date === chooseDate.startTime){
        a.choose = true;
      }
    })
  } else if(chooseDate.startTime != "" && chooseDate.endTime != ""){
    days.map(function (x) {
      if ((new Date((x.date).replace(/-/g, "\/"))) >= (new Date((chooseDate.startTime).replace(/-/g, "\/"))) && (new Date((x.date).replace(/-/g, "\/"))) <= (new Date((chooseDate.endTime).replace(/-/g, "\/")))) {
        x.choose = true;
      }
      else if ((new Date((x.date).replace(/-/g, "\/"))) < (new Date((chooseDate.startTime).replace(/-/g, "\/"))) || (new Date((x.date).replace(/-/g, "\/"))) > (new Date((chooseDate.startTime).replace(/-/g, "\/")))) {
        x.choose = false;
      }
    })
  }
  this.setData({
   days
  });
  // console.log(this.data.days);
},

  handleCalendar(e) {//选择月份
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
    }
  },

  tapDayItem(e) {//选择日期
  var _this = this;
    const idx = e.currentTarget.dataset.idx;
    const days = _this.data.days;
    if (_this.data.days[idx].Size == true && _this.data.days[idx].choosed ==false){
      _this.data.days[idx].choose = !_this.data.days[idx].choose;
    }
    if (_this.data.days[idx].choosed != true && _this.data.days[idx].Size ==true){
      if (_this.data.days[idx].choose) {
        if (chooseDate.startTime.length == 0 && chooseDate.endTime.length == 0) {
          chooseDate.startTime = days[idx].date;
          _this.data.chooseDate.startTime = days[idx].date.split("-")[1] +"月"+ days[idx].date.split("-")[2] +"日";
        }
        else if (chooseDate.startTime.length != 0 && chooseDate.endTime.length == 0) {
          var ss=[];
          if ((new Date((_this.data.days[idx].date).replace(/-/g, "\/"))) > (new Date((chooseDate.startTime).replace(/-/g, "\/")))) {
            chooseDate.endTime = days[idx].date;
            _this.data.chooseDate.endTime = days[idx].date.split("-")[1] +"月"+ days[idx].date.split("-")[2]+"日";
          } else {
            var a = _this.data.days[idx].date;
            chooseDate.endTime = chooseDate.startTime;
            _this.data.chooseDate.endTime = chooseDate.startTime.split("-")[1] + "月" + chooseDate.startTime.split("-")[2]+"日";
            _this.data.chooseDate.startTime = a.split("-")[1] + "月" + a.split("-")[2]+"日";
            chooseDate.startTime = a;
          }
          orders.map(function(x){
            if ((new Date((chooseDate.startTime).replace(/-/g, "\/"))) < (new Date((x.startTime).replace(/-/g, "\/"))) && (new Date((chooseDate.endTime).replace(/-/g, "\/"))) > (new Date((x.endTime).replace(/-/g, "\/")))){
              chooseDate.endTime = "";
              _this.data.chooseDate.endTime = "";
            }
          })
        }
        else if (chooseDate.startTime.length != 0 && chooseDate.endTime.length != 0) {
          chooseDate.startTime = days[idx].date;
          chooseDate.endTime = "";
          _this.data.chooseDate.startTime = days[idx].date.split("-")[1] + '月' + days[idx].date.split("-")[2]+"日";
          _this.data.chooseDate.endTime = "";
        }
        
        days.map(function (x) {
          if ((new Date((x.date).replace(/-/g, "\/"))) >= (new Date((chooseDate.startTime).replace(/-/g, "\/"))) && (new Date((x.date).replace(/-/g, "\/"))) <= (new Date((chooseDate.endTime).replace(/-/g, "\/")))) {
               x.choose = true;
          }
          else if ((new Date((x.date).replace(/-/g, "\/"))) < (new Date((chooseDate.startTime).replace(/-/g, "\/"))) || (new Date((x.date).replace(/-/g, "\/"))) > (new Date((chooseDate.startTime).replace(/-/g, "\/")))) {
            x.choose = false;
          }
        })
      } else {
        days.map(function (x, y) {
          x.choose = false;
          chooseDate.startTime ="";
          chooseDate.endTime = "";
          _this.data.chooseDate.startTime = "";
          _this.data.chooseDate.endTime = "";
        })
      }
    }
    var day = GetDateDiff(chooseDate.startTime, chooseDate.endTime);

    _this.setData({
      days,
      chooseDate: _this.data.chooseDate,
      night: day
    });
    // console.log(chooseDate)
    // console.log(_this.data.chooseDate)
  },
  choosedDate:function(e){
    var _this = this;
    if (chooseDate.startTime != "" && chooseDate.endTime != ""){
      var ss = JSON.stringify(chooseDate);
      wx.navigateTo({
        url: "../Occupant/Occupant?time=" + ss + "&houseId=" + houseId,
        success: function (res) {
          console.log("填写信息")
        }
      })
    }else{
        _this.setData({
          hidden:false
        }),
        setTimeout(function(){
          _this.setData({
            hidden: true
          })
        },2000)
    }
  }
};

Page(conf);
