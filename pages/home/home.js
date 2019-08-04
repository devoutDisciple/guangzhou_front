const request = require("../../utils/request");
const config = require("../../utils/config");
const app = getApp();
Page({
	/**
   * 页面的初始数据
   */
	data: {
		positionDialogVisible: false, //位置弹框的开关
		interval: 5000, // 轮播图间隔时间
		duration: 1000, // 轮播图延迟时间
		loginPopup: false, // 登录弹出框
		// 轮播图url
		swiperUrls: [
		],
		// 位置按钮种类
		columns: [
		],
		// 缓存的地址信息
		position: "",
		// 商店信息
		todayList: [], //今日推荐
		goodsDetail: {}, // 点击的商品
		goodsList: [], // 全部商品分类
		sortGoodsList: [], // 按销量排序
		type: 1, // 1 综合排序 2 销量排序
		adverDetail: {}, // 广告信息
	},
	// 点击购物车
	goCar() {
		wx.navigateTo({
			url: "/pages/car/car"
		});
	},
	// 用户注册
	getUserInfo(e) {
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
						AppSecret: config.AppSecret,
						grant_type: config.grant_type,
						avatarUrl: userInfo.avatarUrl,
						name: userInfo.nickName
					}),
					success: res => {
						// 保存openid
						app.globalData.openid = res.data.data;
						// 关闭弹框
						this.setData({
							loginPopup: false
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
			fail: res => {
				console.log(res, "loginFail");
			}
		});
	},
	// 点击搜索
	onSearch(e) {
		let value = e.detail;
		// 跳转到type页面
		wx.navigateTo({
			url: `/pages/type/type?value=${value}&type=search`
		});
	},
	// 位置弹框的开关
	onShowPositionDialog() {
		this.setData({
			positionDialogVisible: !this.data.positionDialogVisible
		});
	},
	// 改变位置的时候
	onChangePosition(event) {
		console.log(event);
	},
	// 选取位置确定
	onConfirmPosition(event) {
		// 位置信息保存
		wx.setStorageSync("campus", event.detail.value[2]);
		// 关闭弹框
		this.onShowPositionDialog();
		this.setData({
			position: event.detail.value[2]
		});
		setTimeout(() => {
			// 重新查询页面
			this.getHomeMessage();
		}, 0);

	},
	// 点击轮播图
	swiperClick(e) {
		let shopid = e.currentTarget.dataset.shopid;
		// 跳转到详情页
		wx.navigateTo({
			url: `/pages/shop/shop?id=${shopid}`
		});
	},
	// tab切换
	changeSortType() {
		let type = this.data.type;
		this.setData({
			type: type == 1 ? 2 : 1
		});
	},

	// 商品点击
	onSearchGoodsDetail(e) {
		let data = e.currentTarget.dataset.data;
		wx.navigateTo({
			url: `/pages/goodsDetail/goodsDetail?id=${data.id}`
		});
	},

	// 广告点击
	onSearchGoodsDetailByAdver(e) {
		let data = e.currentTarget.dataset.data;
		let adverDetail = this.data.adverDetail;
		if(adverDetail && adverDetail.status == 1) {
			adverDetail.status = 2;wx.navigateTo({
				url: `/pages/goodsDetail/goodsDetail?id=${data.goods_id}`
			});
			return this.setData({
				adverDetail: adverDetail
			});
		}
		wx.navigateTo({
			url: `/pages/goodsDetail/goodsDetail?id=${data.goods_id}`
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onShow: function () {
		this.getLoactionByUser();
		// 获取所属校园
		let value = wx.getStorageSync("campus");
		// 获取位置信息
		request.get({
			url: "/position/all"
		}).then(res => {
			this.setData({
				columns: [
					{
						values: ["广州"],
						className: "column1"
					},
					{
						values: ["广州"],
						className: "column2"
					},
					{
						values: res.data.map(item => {
							return item.name;
						}),
						className: "column3"
					},
				],
				position: value ? value : res.data[0].name
			});
			if(value) {
				this.getHomeMessage();
			}else{
				wx.setStorageSync("campus", res.data[0].name);
				this.getHomeMessage();
			}
		});
		// 设置标题
		wx.setNavigationBarTitle({
			title: "贝沃思美食"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#ffffff"//背景颜色值
		});
	},

	// 获取首页信息
	getHomeMessage: function() {
		// 判断是否存在该用户
		wx.login({
			success: data => {
				wx.request({
					method: "POST",
					url: config.baseUrl + "/user/getUser",
					data: Object.assign({
						code: data.code,
						appid: config.appid,
						AppSecret: config.AppSecret,
						grant_type: config.grant_type,
					}),
					success: res => {
						// 该用户不存在
						if(res.data.data == "nouser") {
							return this.setData({
								loginPopup: true
							});
						}
						// 用户存在
						let user = res.data.data;
						app.globalData = {
							openid: user.openid,
							userInfo: {
								avatarUrl: user.avatarUrl,
								nickName: user.name
							}
						};
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
				return this.setData({
					loginPopup: true
				});
			}
		});

		// 获取轮播图数据
		request.get({
			url: "/swiper/all"
		}).then(res => {
			this.setData({
				swiperUrls: res.data || []
			});
		});

		// 获取今日推荐数据
		request.get({
			url: "/goods/getToday"
		}).then(res => {
			this.setData({
				todayList: res.data || []
			});
		});

		// 获取全部商品数据
		request.get({
			url: "/goods/getByCampus"
		}).then(res => {
			let data = res.data || [];
			let sortGoodsList = [];
			data.map(item => {
				sortGoodsList.push(item);
			});
			sortGoodsList.sort((a, b) => {
				return b.sales - a.sales;
			});
			this.setData({
				goodsList: data,
				sortGoodsList: sortGoodsList
			});
		});
	},

	// 获取位置信息
	getLoactionByUser: function() {
		wx.getLocation({
			type: "wgs84",
			altitude: false,
			success: function(res) {
				const latitude = res.latitude;
				const longitude = res.longitude;
				console.log(latitude, longitude, 888);
				request.get({
					url: "/position/all"
				}).then(res => {
					console.log(res, 111);
				});
			}
		});
	},

	onLoad: function() {
		// 获取广告图
		request.get({
			url: "/adver/getAll"
		}).then(res => {
			let data = res.data || {};
			console.log(data, 6777);
			this.setData({
				adverDetail: data
			});
		});
	},

	/**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {
		const updateManager = wx.getUpdateManager();
		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: "更新提示",
				content: "新版本已经准备好，是否重启应用？",
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				}
			});
		});
	},
	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function () {
		return {
			title: "贝沃思美食",
			path: "/pages/home/home",
			imageUrl: "http://www.bws666.com/goods/K9B47WOAZCA1-1564311179900.jpg"
		};
	}
});
