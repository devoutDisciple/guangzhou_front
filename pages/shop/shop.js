// pages/shop/shop.js
// const app = getApp();
const request = require("../../utils/request");
Page({

	/**
   * 页面的初始数据
   */
	data: {
		data: []
	},

	// 点击商品的时候，前往商品详情页面
	onSearchGoodsDetail(e) {
		console.log(e.currentTarget.dataset);
		let data = e.currentTarget.dataset.data;
		wx.navigateTo({
			url: `/pages/goodsDetail/goodsDetail?id=${data.id}&type=shop`
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		let id = options.id || 1;
		// 获取商店列表
		request.get({
			url: `/shop/getById?id=${id}`
		}).then(res => {
			let data = res.data || {};
			// 设置标题
			wx.setNavigationBarTitle({
				title: data.name || "贝沃思美食"
			});
			// 设置导航栏颜色
			wx.setNavigationBarColor({
				frontColor: "#ffffff",//前景颜色值
				backgroundColor: "#333"//背景颜色值
			});
		});
		// 获取商品列表
		request.get({
			url: `/goods/getByShopId?id=${id}`
		}).then(res => {
			let data = res.data;
			this.setData({data});
			console.log(data);
		});
	},
});
