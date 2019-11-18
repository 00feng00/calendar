// 0 1 2 3 4 5 6
// 日
// 获取这个月的天数 比如30 31 28
function getDaysInOneMonth(
  year = new Date().getFullYear(),
  month = new Date().getMonth()
) {
  month = parseInt(month, 10) + 1
  var d = new Date(year, month, 0)
  return d.getDate()
}
function getCurrentMonthFirstWeek(
  year = new Date().getFullYear(),
  month = new Date().getMonth()
) {
  var date = new Date(year, month, 1)
  return date.getDay()
}
function getCurrentMonthFirstDay(
  year = new Date().getFullYear(),
  month = new Date().getMonth()
) {
  var date = new Date(year, month, 1)
  return date.getDate()
}
function getCurrentMonthLastDay(
  year = new Date().getFullYear(),
  month = new Date().getMonth()
) {
  return new Date(year, month, getDaysInOneMonth(year, month)).getDate()
}
function getCurrentMonthLastWeek(
  year = new Date().getFullYear(),
  month = new Date().getMonth()
) {
  return new Date(year, month, getDaysInOneMonth(year, month)).getDay()
}
// 生成这个月的天数
function daysDateArray(
  year = new Date().getFullYear(),
  month = new Date().getMonth()
) {
  var _array = []
  for (let i = 0; i < getDaysInOneMonth(year, month); i++) {
    _array.push({ number: i + 1, active: false })
  }
  return _array
}
Component({
  data: {
    days: daysDateArray(),
    activeDays: [new Date().getDate()],
    selectDay: new Date().getTime(),
    selectDateShow: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
  },
  properties: {},
  methods: {
    // 个位数显示 2位数
    fixed2wei(number) {
      if (number < 10) {
        return `0${number}`
      } else {
        return number
      }
    },
    bindDown() {
      var year = new Date(this.data.selectDay).getFullYear()
      var month = new Date(this.data.selectDay).getMonth()
      var lastMonth = month - 1
      var date = new Date(
        lastMonth == 0 ? year - 1 : year,
        lastMonth == 0 ? 12 : lastMonth,
        1
      )
      this.setData(
        {
          selectDay: date,
          selectDateShow: `${date.getFullYear()}-${this.fixed2wei(
            date.getMonth() + 1
          )}`
        },
        () => this.caculateDay(date.getFullYear(), date.getMonth())
      )
    },

    bindUp() {
      var year = new Date(this.data.selectDay).getFullYear()
      var month = new Date(this.data.selectDay).getMonth()
      var nextMonth = month + 1
      var date = new Date(
        nextMonth == 0 ? year + 1 : year,
        nextMonth == 0 ? 12 : nextMonth,
        1
      )
      this.setData(
        {
          selectDay: date,
          selectDateShow: `${date.getFullYear()}-${this.fixed2wei(
            date.getMonth() + 1
          )}`
        },
        () => this.caculateDay(date.getFullYear(), date.getMonth())
      )
    },
    // pick 时间选择事件
    pickDateDayEvent(e) {
      var date = new Date(
        e.detail.value.split('-')[0],
        e.detail.value.split('-')[1] - 1,
        e.detail.value.split('-')[2]
      )
      var year = date.getFullYear()
      var month = date.getMonth()
      this.setData(
        {
          selectDay: date.getTime(),
          selectDateShow: `${year}-${this.fixed2wei(month + 1)}`
        },
        () => this.caculateDay(year, month)
      )
    },
    /* 
    输入年月 选择界面
    求出上个月要显示几天 beginArray
    下个月要显示几天  nextArray
    这个月显示几天 this.data.days
    year 默认当前年
    month 默认当前月
    */

    caculateDay(
      year = new Date().getFullYear(),
      month = new Date().getMonth()
    ) {
      // 得出这个月要显示几天
      this.data.days = daysDateArray(year, month).map(item => {
        var result = this.data.activeDays.filter(item1 => item1 == item.number)
        if (result && result.length >= 1) {
          item.active = true
          item.disabled = false
        }
        return item
      })
      // var startDay = getCurrentMonthFirstWeek(year, month)
      // var lastDay = getCurrentMonthLastWeek(year, month)
      var startWeek = getCurrentMonthFirstWeek(year, month)
      // console.log('startDay 星期几', startDay)
      // console.log('lastDay 星期几', lastDay)
      var lasetMonthDay = getCurrentMonthLastDay(year, month - 1)
      // var lasetMonthWeek = getCurrentMonthLastWeek(year, month - 1)
      // console.log('lasetMonthDay 星期几', lasetMonthDay)
      // console.log(' lasetMonthDay, startWeek,', lasetMonthDay, startWeek)
      /**
       * 求上个月要显示几天
       * startWeek 这个月最开始是星期几
       * lasetMonthDay 上个月最后一天的日期
       */
      var beginArray = []
      for (let i = 0; i < startWeek; i++) {
        beginArray.push({
          number: lasetMonthDay - startWeek + 1 + i,
          disabled: true //disabled=>true 界面灰色
        })
      }

      // var nextMonthFirstWeek = getCurrentMonthFirstWeek(
      //   new Date().getFullYear(),
      //   new Date().getMonth() + 1
      // )
      var currentMonthLastWeek = getCurrentMonthLastWeek(year, month)
      var nextMonthFirstDay = getCurrentMonthFirstDay(year, month + 1)
      // console.log('currentMonthLastWeek', currentMonthLastWeek)
      // console.log('nextMonthFirstDay', nextMonthFirstDay)
/* 
计算下个月要显示多少
currentMonthLastWeek 这个月最后一天是星期几
6是星期6的意思
nextMonthFirstDay  下个月第一天的日期
*/
      var nextArray = []
      for (let i = 0; i < 6 - currentMonthLastWeek; i++) {
        nextArray.push({ number: i + nextMonthFirstDay, disabled: true })
      }

      this.setData({
        days: beginArray.concat(this.data.days).concat(nextArray)
      })
    }
  },
  lifetimes: {
    attached: function() {
      this.caculateDay()
    },
    detached: function() {
      //在组件实例被从页面节点树移除时执行
    }
  }
})
