const request = require("../../utils/request");
Page({

	/**
   * 页面的初始数据
   */
	data: {
		data: []
	},

	// 点击商品的时候
	onSearchGoodsDetail(e) {
		console.log(e);
		let data = e.currentTarget.dataset.data;
		wx.navigateTo({
			url: `/pages/goodsDetail/goodsDetail?id=${data.goods_id}`
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function () {
		// 获取收藏信息
		request.get({
			url: "/collection/getByOpenid"
		}).then((res) => {
			this.setData({
				data: res.data
			});
		});
		// 设置微信头部
		wx.setNavigationBarTitle({
			title: "我的收藏"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#ffffff"//背景颜色值
		});
	},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {

	},
});
