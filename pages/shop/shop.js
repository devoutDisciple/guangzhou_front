// pages/shop/shop.js
// const app = getApp();
const request = require("../../utils/request");
const moment = require("../../utils/moment.min");
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

	// 加入购物车
	goodsGoCar(e) {
		let data = e.currentTarget.dataset.data;
		console.log(data, 99);
		let goods_id = data.id;
		let create_time = (new Date()).getTime();
		request.post({
			url: "/car/addCarGoods",
			data: {
				goods_id,
				create_time,
				shop_id: data.shopid,
				num: 1
			}
		}).then((res) => {
			if(res.data == "have one") {
				return wx.showToast({
					title: "已添加过该商品",
					icon: "warn",
					duration: 1000
				});
			}
			wx.showToast({
				title: "加入成功",
				icon: "success",
				duration: 1000
			});
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		let id = "";
		options.id ? id = options.id : null;
		if (options.scene) {
			let params = decodeURIComponent(options.scene);
			id = params.id;
		}
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
			let data = res.data || [];
			console.log(data, 999);
			data.map(item => {
				let start_time = item.start_time;
				let end_time = item.end_time;
				start_time = moment(moment().format("YYYY-MM-DD ") + start_time).valueOf();
				end_time = moment(moment().format("YYYY-MM-DD ") + end_time).valueOf();
				if(start_time >= end_time) {
					end_time = moment(moment(end_time).add(1, "days")).valueOf();
				}
				let now = moment(new Date().getTime());
				if((now >= start_time && now <= end_time) && item.shopStatus == 1) {
					item.open = true;
				}
			});
			console.log(data, 8999);
			this.setData({data});
		});
	},
});
