// pages/orderDetail/orderDetail.js
Page({

	/**
   * 页面的初始数据
   */
	data: {
		shopDetail: {},
		orderList: [],
		orderDetail: {},
		package_cost: 0
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
		let package_cost = 0;
		let orderList = data.orderitem.order_list;
		orderList.map(item => {
			package_cost += Number(item.package_cost);
		});
		console.log(data);
		console.log(orderList, 8);
		orderList.map((item) => {
			item.totalPrice = Number(item.num) * Number(item.price);
		});
		this.setData({
			orderList,
			orderDetail: data.orderitem,
			package_cost
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
