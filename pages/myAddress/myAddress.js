const request = require("../../utils/request");
import Dialog from "../../dist/dialog/dialog";

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		addressList: []
	},

	// 点击radio
	changeRadio: function (e) {
		let selectIndex = e.currentTarget.dataset.index;
		let addressList = this.data.addressList;
		addressList.map((item, index) => {
			index == selectIndex ? item.default = true : item.default = false;
		});
		this.setData({
			addressList
		}, () => {
			request.post({
				url: "/user/updateAddress",
				data: {
					address: JSON.stringify(addressList)
				}
			}).then(res => {
				console.log(res);
			});
		});
	},

	// 点击新增地址
	addAddress: function () {
		// 跳转到新增地址表单页面
		wx.redirectTo({
			url: "/pages/address/address?type=create"
		});
	},

	// 编辑收货地址
	goEditPage: function (e) {
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

	onDeleteAdress(e) {
		let addressList = this.data.addressList;
		let currentIndex = e.currentTarget.dataset.index;
		let newAddress = [];
		Dialog.confirm({
			title: "是否确认删除该地址",
			message: "删除后将不可恢复"
		}).then(() => {
			wx.showLoading({
				title: "加载中",
				mask: true
			});
			addressList.map((item, index) => {
				if(index != currentIndex) newAddress.push(item);
			});
			console.log(newAddress, 99);
			request.post({
				url: "/user/updateAddress",
				data: {
					address: JSON.stringify(newAddress)
				}
			}).then(() => {
				request.get({
					url: "/user/getUserByOpenid"
				}).then(res => {
					let address = JSON.parse(res.data.address || []);
					this.setData({
						addressList: address
					});
				});
				wx.hideLoading();
			});
		}).catch(() => {
			// on cancel
			wx.hideLoading();
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		// 设置标题
		wx.setNavigationBarTitle({
			title: "我的收货地址"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000", //前景颜色值
			backgroundColor: "#fff" //背景颜色值
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
		// getUserByOpenid
		request.get({
			url: "/user/getUserByOpenid"
		}).then(res => {
			let address = JSON.parse(res.data.address || []);
			this.setData({
				addressList: address
			});
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
