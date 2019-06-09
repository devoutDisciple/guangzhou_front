// pages/goods/goods.js
const request = require("../../utils/request");
Page({

	/**
   * 页面的初始数据
   */
	data: {
		todayNum: 50, //商品总数
		type: [], // 商品分类数据
	},

	//  当商品列表点击的时候
	onGoodsItemClick(e) {
		console.log(e);
		let data = e.currentTarget.dataset.data;
		console.log(e.currentTarget.dataset);
		wx.navigateTo({
			url: `/pages/goodsDetail/goodsDetail?id=${data}`
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		console.log(options);
		this.getTypes();
	},

	// 获取商品分类数据
	getTypes() {
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
