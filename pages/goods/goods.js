// pages/goods/goods.js
const request = require("../../utils/request");
Page({

	/**
   * 页面的初始数据
   */
	data: {
		todayNum: 50, //商品总数
		type: [], // 商品分类数据
		data: [], // 全部商品数据
		showData: [], //要展示的商品数据
	},

	//  当商品列表点击的时候
	onGoodsItemClick(e) {
		let data = e.currentTarget.dataset.data;
		console.log(data);
		wx.navigateTo({
			url: `/pages/goodsDetail/goodsDetail?id=${data.id}`
		});
	},
	// 当点击tab的时候
	onClickTab(e) {
		let type = e.detail.title, data = this.data.data, showData = [];
		if(type == "全部") {
			return this.setData({
				showData: data
			});
		}
		data.map(item => {
			if(item.type == type) showData.push(item);
		});
		this.setData({
			showData
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		console.log(options);
	},

	// 获取商品数据
	getData() {
		// 获取商品类型分类
		request.get({
			url: "/type/all"
		}).then(res => {
			console.log(res.data);
			let data = res.data || [];
			if(data) {
				data.unshift({
					id: 0,
					name: "全部",
				});
				this.setData({
					type: res.data || []
				});
			}
		});
		// 获取全部数据
		request.get({
			url: "/goods/getByCampus"
		}).then(res => {
			console.log(res.data);
			let data = res.data;
			this.setData({
				data: data,
				showData: data
			});
		});
	},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {
		// 获取商品数据
		this.getData();
		// 设置标题
		wx.setNavigationBarTitle({
			title: "商品列表"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#ffffff"//背景颜色值
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
