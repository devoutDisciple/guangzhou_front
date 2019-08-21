const request = require("../../utils/request");
const orderUtil = require("../../utils/orderUtil");
const moment = require("../../utils/moment.min");
Page({

	/**
   * 页面的初始数据
   */
	data: {
		activeBar: 1, // 应该显示的订单bar
		list: [], // 显示的订单
	},

	// 点击切换bar
	onChange(event) {
		let type = event.detail.index + 1;
		this.onSearchOrder(type);
	},

	// 查询订单
	onSearchOrder(type) {
		request.get({url: "/order/getListByOpenid", data: {type: type}}).then(res => {
			let data = res.data || [];
			console.log(data, 888);
			this.setData({
				list: data.map(item => {
					item.status_cn = orderUtil.filterStatus(item.status);
					item.order_time = moment(item.order_time).format("YYYY-MM-DD HH:mm:ss");
					return item;
				})
			});
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function () {
		wx.setNavigationBarTitle({
			title: "我的订单"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000", //前景颜色值
			backgroundColor: "#f2f2f2" //背景颜色值
		});
	},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {
		this.onSearchOrder(1);
	},
});
