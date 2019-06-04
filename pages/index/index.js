//index.js
//获取应用实例
const app = getApp()
const citys = {
  '浙江': ['杭州', '宁波', '州', '嘉兴', '湖州'],
  '福建': ['福州', '厦门', '莆田', '三明', '泉州']
};
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    id: 1,
    columns: [
      {
        values: Object.keys(citys),
        className: 'column1'
      },
      {
        values: citys['浙江'],
        className: 'column2',
        defaultIndex: 2
      }
    ],
    show: false,
    list: [1,2,3,4,5,6],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    console.log(picker, value, index)
    picker.setColumnValues(1, citys[value[0]]);
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onClose() {
    this.setData({ show: false });
    console.log(123)
  },
  onGotUserInfo: function(a, b, c) {
    console.log(a, b, c)
  },
  onSelect(event) {
    console.log(event.detail);
  },
  hello: function(e) {
    wx.setNavigationBarTitle({
      title: "hello world"//页面标题为路由参数
    })
    console.log(e.target)
    this.setData({
      id: e.target.dataset.id,
      show: true,
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
