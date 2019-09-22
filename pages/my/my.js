//index.js
//获取应用实例
const app = getApp();
const config = require("../../utils/config");
Page({
	data: {
		motto: "Hello World",
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse("button.open-type.getUserInfo")
	},

	//事件处理函数
	onLoad: function () {
		console.log(app.globalData.userInfo);
		if (app.globalData.userInfo && app.globalData.userInfo.avatarUrl && app.globalData.userInfo.nickName) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			});
		} else if (this.data.canIUse){
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				});
			};
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo;
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					});
				}
			});
		}
		// 设置标题
		wx.setNavigationBarTitle({
			title: "我的"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#fff"//背景颜色值
		});
	},

	// 点击我的收货地址
	onClickAddAddress() {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return wx.showToast({
				title: "请先登录!",
				icon: "none",
				duration: 1000
			});
		}
		wx.navigateTo({
			url: "/pages/myAddress/myAddress"
		});
	},

	// 我的客服
	onClickMyService() {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return wx.showToast({
				title: "请先登录!",
				icon: "none",
				duration: 1000
			});
		}
		wx.navigateTo({
			url: "/pages/custom/custom"
		});
	},

	// 点击意见与反馈
	onClickOption() {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return wx.showToast({
				title: "请先登录!",
				icon: "none",
				duration: 1000
			});
		}
		wx.navigateTo({
			url: "/pages/option/option"
		});
	},

	// 点击我的订单
	onClickMyOrder() {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return wx.showToast({
				title: "请先登录!",
				icon: "none",
				duration: 1000
			});
		}
		wx.switchTab({
			url: "/pages/order/order"
		});
	},

	// 点击我的收藏
	onClickMyCollect() {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return wx.showToast({
				title: "请先登录!",
				icon: "none",
				duration: 1000
			});
		}
		wx.navigateTo({
			url: "/pages/collection/collection"
		});
	},

	// 登录按钮点击的时候
	getUserInfo: function(e) {
		let userInfo = e.detail.userInfo;
		app.globalData.userInfo = userInfo;
		// 获取用户code
		wx.login({
			success: data => {
				wx.request({
					method: "POST",
					url: config.baseUrl + "/user/register",
					data: Object.assign({
						code: data.code,
						appid: config.appid,
						secret: config.rand_string,
						grant_type: config.grant_type,
						avatarUrl: userInfo.avatarUrl,
						name: userInfo.nickName
					}),
					success: res => {
						console.log(res.data.data);
						// 保存openid
						app.globalData.openid = res.data.data.data;
						// 关闭弹框
						this.setData({
							userInfo: app.globalData.userInfo,
							hasUserInfo: true
						});
					},
					fail: err => {
						console.log(err);
						wx.showModal({
							title: "提示",
							content: "网络异常",
							showCancel: false
						});
					}
				});
			},
			fail: err => {
				console.log(err);
			}
		});
	},

	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function () {
		return {
			title: "专注每一道私房菜!",
			path: "/pages/home/home",
			imageUrl: "http://www.bws666.com/LOGO.png"
		};
	}
});
