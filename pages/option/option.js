// pages/opinion/opinion.js
const request = require("../../utils/request");
import Toast from "../../dist/toast/toast";

Page({

	/**
   * 页面的初始数据
   */
	data: {

	},

	// 表单提交
	formSubmit(e) {
		let value = e.detail.value;
		request.post({
			url: "/option/add",
			data: {
				text: value.text
			}
		}).then((res) => {
			if(res.data == "success") {
				Toast.success("提交成功!");
				setTimeout(() => {
					wx.switchTab({
						url: "/pages/my/my"
					});
				}, 1000);
			}
		});
	},
	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function () {
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
