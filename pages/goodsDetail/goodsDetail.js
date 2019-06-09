// pages/goodsDetail/goodsDetail.js
Page({

	/**
   * 页面的初始数据
   */
	data: {
		evaluateList: [{
			shop_grade: 5,
			create_time: "2018-9-12 10:32",
			desc: "hello test",
			username: "「？....！』",
			avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJibwnzh0pHtTsXFNbFcdnaWW2MztibPkwQ6ZSYpxuPjV30rfXGbxrkiaMxGPAQWyycO9vV2A4lD52Qg/132"
		}, {
			shop_grade: 3,
			create_time: "2018-9-12 10:39",
			desc: "hello111",
			username: "「？....！』",
			avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJibwnzh0pHtTsXFNbFcdnaWW2MztibPkwQ6ZSYpxuPjV30rfXGbxrkiaMxGPAQWyycO9vV2A4lD52Qg/132"
		}]
	},
	// 点击购物车按钮
	onClickGoCarIcon() {
		console.log(123);
	},
	// 点击加入购物车
	onClickAddCarIcon() {
		console.log(3);
	},
	// 点击立即购买
	onClickBuyIcon() {
		console.log(24234);
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		console.log(options);
		let id = options.id;
		// 设置标题
		wx.setNavigationBarTitle({
			title: `点击商品id为${id}`
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#ffffff"//背景颜色值
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
