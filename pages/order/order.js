const request = require("../../utils/request");
const moment = require("../../utils/moment");
const orderUtil = require("../../utils/orderUtil");
Page({

	/**
   * 页面的初始数据
   */
	data: {
		list: [],// 订单数据
		orderitem: {},// 点击的订单详情
	},

	// 点击查看订单详情
	onSearchOrderDetail(e) {
		let orderitem = e.currentTarget.dataset.orderitem;
		this.setData({
			orderitem: orderitem
		}, () => {
			// 跳转订单详情页面
			wx.navigateTo({
				url: "/pages/orderDetail/orderDetail"
			});
		});
	},

	// 评价
	goGrade(e) {
		console.log(e);
		let orderitem = e.currentTarget.dataset.orderitem;
		this.setData({
			orderitem: orderitem
		}, () => {
			// 跳转评价页面
			wx.navigateTo({
				url: "/pages/orderEvaluate/orderEvaluate"
			});
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function () {
		// 设置标题
		wx.setNavigationBarTitle({
			title: "订单"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#fff"//背景颜色值
		});
	},

	/**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {

	},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {
		request.get({url: "/order/getListByOpenid"}).then(res => {
			console.log(res);
			this.setData({
				list: res.data.map(item => {
					item.shop_detail = JSON.parse(item.shop_detail);
					item.order_list = JSON.parse(item.order_list);
					item.order_time = moment.format(item.order_time);
					// item.status = orderUtil.filterStatus(item.status);
					item.status_cn = orderUtil.filterStatus(item.status);
					return item;
				})
			});
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
