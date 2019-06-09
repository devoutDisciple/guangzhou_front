// pages/car/car.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		radioSelect: ["0", "1", 2, 3], // 已经选择的radio
		carNum: 20, // 商品数量
		allSelect: false, //是否全选
		data: [{
			id: 1,
			select: false,
		}, {
			id: 2,
			select: false,
		}, {
			id: 3,
			select: false,
		}, {
			id: 4,
			select: false,
		}, {
			id: 5,
			select: false,
		}, {
			id: 6,
			select: false,
		}, {
			id: 7,
			select: false,
		}]
	},
	// radio选择的时候
	radioChange(e) {
		let radio = e.currentTarget.dataset.data;
		let data = this.data.data;
		data.map(item => {
			if (item.id == radio.id) {
				item.select = !item.select;
			}
		});
		// 判断是否已经全选
		let flag = true; // 默认全选
		data.map(item => {
			if(!item.select) flag = false;
		});
		this.setData({
			data,
			allSelect: flag
		});
	},
	//  全选点击的时候
	allSelectChange() {
		console.log(123);
		let data = this.data.data, allSelect = this.data.allSelect;
		if(allSelect) { // 取消全选
			data.map(item => {
				item.select = false;
			});
		} else {
			data.map(item => {
				item.select = true;
			});
		}
		this.setData({data, allSelect: !allSelect});
	},

	// 提交订单
	onSubmitOrder() {
		console.log(123);
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options);
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
			title: "购物车"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000", //前景颜色值
			backgroundColor: "#ffffff" //背景颜色值
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
