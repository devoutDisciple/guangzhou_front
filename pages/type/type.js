const request = require("../../utils/request");
Page({

	/**
   * 页面的初始数据
   */
	data: {
		shop: [], // 商店
		sortSelesData: [], // 销量排序商店
	},

	// 点击商店
	shopClick(e) {
		let id = e.currentTarget.dataset.id;
		console.log(id);
		// 跳转到详情页
		wx.navigateTo({
			url: `/pages/shop/shop?id=${id}`
		});
	},

	// 将商店的信息尽心处理
	handleShopDetail(res) {
		let data = res.data || [], sortSelesData = [];
		data.map(item => {
			let special = item.special.includes("@@") ? item.special.split("@@") : [];
			let tempData = [];
			special.map(item2 => {
				let tempData2 = item2.split(",");
				tempData.push({
					origin: tempData2[0].split("=")[1],
					discount: tempData2[1].split("=")[1],
				});
			});
			item.special = tempData;
			sortSelesData.push(item);
		});
		sortSelesData.sort((a, b) => {
			return b.sales - a.sales;
		});
		this.setData({
			shop: data || [],
			sortSelesData
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		let type = options.type;
		if(type == "type") {
			let id = options.value;
			return request.get({
				url: "/shop/getShopByType",
				data: {
					id: id
				}
			}).then(res => {
				this.handleShopDetail(res);
			});
		}
		if(type == "search") {
			let value = options.value;
			console.log(value, 111);
			request.get({
				url: "/shop/getShopByName",
				data: {
					name: value
				}
			}).then(res => {
				this.handleShopDetail(res);
			});
		}

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
