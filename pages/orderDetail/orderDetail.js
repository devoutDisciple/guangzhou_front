// pages/orderDetail/orderDetail.js
Page({

	/**
   * 页面的初始数据
   */
	data: {
		shopDetail: {},
		orderList: []
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function () {
		// 设置标题
		wx.setNavigationBarTitle({
			title: "订单详情"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#fff"//背景颜色值
		});
	},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];  //上一个页面
		let data = prevPage.data;
		console.log(data);
		console.log(data.orderitem.order_list, 8);
		this.setData({
			shopDetail: data.orderitem.shop_detail,
			orderList: data.orderitem.order_list,
			orderDetail: data.orderitem
		});
	},

	/**
   * 生命周期函数--监听页面隐藏
   */
	onHide: function () {

	},

	/**
   * 生命周期函数--监听页面卸载
   */
	onUnload: function () {

	},

	/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
	onPullDownRefresh: function () {

	},

	/**
   * 页面上拉触底事件的处理函数
   */
	onReachBottom: function () {

	},

	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function () {

	}
});
