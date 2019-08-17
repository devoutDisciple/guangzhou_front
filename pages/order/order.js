const request = require("../../utils/request");
const orderUtil = require("../../utils/orderUtil");
const moment = require("../../utils/moment.min");
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
			let data = res.data || [];
			this.setData({
				list: data.map(item => {
					console.log(item.order_time, 9999);
					item.status_cn = orderUtil.filterStatus(item.status);
					item.order_time = moment(item.order_time).format("YYYY-MM-DD HH:mm:ss");
					console.log(item.order_time, 678);
					return item;
				})
			});
		});
	},
});
