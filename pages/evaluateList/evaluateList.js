// pages/evaluateList/evaluateList.js
Page({

	/**
   * 页面的初始数据
   */
	data: {
		evaluateListAll: [],// 评价列表
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function () {
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];  //上一个页面
		let data = prevPage.data;
		this.setData({
			evaluateListAll: data.evaluateListAll,
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
