//app.js
const config = require("./utils/config");
App({
	onLaunch: function () {
		// 登录
		wx.login({
			success: data => {
				wx.request({
					method: "GET",
					url: config.baseUrl + "/user/register",
					data: Object.assign({
						code: data.code,
						appid: config.appid,
						AppSecret: config.AppSecret,
						grant_type: config.grant_type,
					}),
					success: res => {
						if (res.data && res.data.code == 200) {
							this.globalData.openid = res.data.data.data;
						} else {
							wx.showModal({
								title: "提示",
								content: "网络异常",
								showCancel: false
							});
						}
					},

					fail: err => {
						console.log(err, 80);
						wx.showModal({
							title: "提示",
							content: "网络异常",
							showCancel: false
						});
					}
				});
			},
			fail: res => {
				console.log(res, "loginFail");
				this.globalData.showUserLoginDialog = true;
			}

		});
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting["scope.userInfo"]) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo;
							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res);
							}
						}
					});
				}
			}
		});
	},
	globalData: {
		userInfo: null, // 用户信息
		openid: "", // 用户code
		showUserLoginDialog: false
	}
});
