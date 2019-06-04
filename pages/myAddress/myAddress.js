const request = require("../../utils/request");
Page({

	/**
   * 页面的初始数据
   */
	data: {
		addressList: []
	},

	// 点击radio
	changeRadio: function(e) {
		console.log(e);
		let selectIndex = e.currentTarget.dataset.index;
		let addressList = this.data.addressList;
		addressList.map((item, index) => {
			index == selectIndex ? item.default = true : item.default = false;
		});
		this.setData({addressList}, () => {
			request.post({
				url: "/user/updateAddress",
				data: {
					address: JSON.stringify(addressList)
				}
			}).then(res => {
				console.log(res, 6378);
			});
		});
	},

	// 点击新增地址
	addAddress: function() {
		// 跳转到新增地址表单页面
		wx.navigateTo({
			url: "/pages/address/address?type=create"
		});
	},
	// 编辑收货地址
	goEditPage: function(e) {
		console.log(e.currentTarget.dataset.item, "editData-----");
		this.setData({
			editData: e.currentTarget.dataset.item,
			editIndex: e.currentTarget.dataset.index,
		}, () => {
			// 跳转到编辑地址表单页面
			wx.navigateTo({
				url: "/pages/address/address?type=edit"
			});
		});
	},
	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		console.log(options);
		// 设置标题
		wx.setNavigationBarTitle({
			title: "我的收获地址"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#fff"//背景颜色值
		});
		// getUserByOpenid
		request.get({
			url: "/user/getUserByOpenid"
		}).then(res => {
			console.log(res);
			let address = JSON.parse(res.data.address || []);
			console.log(address, 999);
			this.setData({
				addressList: address
			});
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
