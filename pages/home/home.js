const request = require("../../utils/request");
const config = require("../../utils/config");
const moment = require("../../utils/moment.min");
import Toast from "../../dist/toast/toast";
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
		carNum: 0, // 购物车数量
		toolTipShow: true, // 是否显示提示分享

		specificationDialog: false, // 规格弹出框
		addCarNum: 1, // 将要添加到购物车的数量
		specification: [], // 规格信息
		specificationActiveIndex: -1, // 默认选择的那个规格小标
		specificationActiveData: {}, // 选择的规格信息
		goodsidForSpecification: "", // 选择规格的菜品信息
		shopidForSpecification: "", // 选择规格的菜品信息
		goodsName: "",
		shareParams: {

		}
	},

	// 点击购物车
	goCar() {
		wx.navigateTo({
			url: "/pages/car/car"
		});
	},

	// 三秒过后关闭提示分享
	closeToolTip() {
		setTimeout(() => {
			this.setData({toolTipShow: false});
		}, 3000);
	},

	// 立刻关闭
	closeToolTipNow() {
		this.setData({toolTipShow: false});
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
			fail: err => {
				console.log(err);
			}
		});
	},

	// 改变要加入购物车的商品数量
	addGoodsForCarNum(e) {
		let data = e.currentTarget.dataset.data;
		let num = this.data.addCarNum;
		if(data == 1 && num == 1) return;
		this.setData({
			addCarNum: data == 1 ? this.data.addCarNum - 1 : this.data.addCarNum + 1
		});
	},

	// 选择规格
	selectSpecification(e) {
		let {data, index} = e.currentTarget.dataset;
		this.setData({
			specificationActiveIndex: index,
			specificationActiveData: data
		});
	},

	// 加入购物车
	goodsGoCar(e) {
		let data = e.currentTarget.dataset.data;
		let specification = JSON.parse(data.specification) || [];
		if(specification && specification.length != 0) {
			return this.setData({
				goodsName: data.name,
				specification: specification,
				specificationDialog: true,
				goodsidForSpecification: data.id,
				shopidForSpecification: data.shopid
			});
		}
		let goods_id = data.id;
		let create_time = (new Date()).getTime();
		request.post({
			url: "/car/addCarGoods",
			data: {
				goods_id,
				price: data.price,
				create_time,
				shop_id: data.shopid,
				num: 1
			}
		}).then(() => {
			wx.showToast({
				title: "加入成功",
				icon: "success",
				duration: 1000
			});
			this.countCarNum();
		});
	},

	// 关闭规格弹框
	onCloseSpecificationDialog() {
		this.setData({
			specificationDialog: false, // 规格弹出框
			addCarNum: 1, // 将要添加到购物车的数量
			specification: [], // 规格信息
			specificationActiveIndex: -1, // 默认选择的那个规格小标
			specificationActiveData: {}, // 选择的规格信息
		});
	},

	// 选择规格确认
	sureSpecificationDialog() {
		// goodsidForSpecification: "", // 选择规格的菜品信息
		// shopidForSpecification: "", // 选择规格的菜品信息
		let {goodsidForSpecification, shopidForSpecification, addCarNum, specificationActiveData} = this.data;
		if(!specificationActiveData.name) return Toast.fail("请选择规格");
		let create_time = (new Date()).getTime();
		let specificationData = JSON.stringify(specificationActiveData || {});
		request.post({
			url: "/car/addCarGoods",
			data: {
				specification: specificationData,
				price: specificationActiveData.price,
				goods_id: goodsidForSpecification,
				create_time,
				shop_id: shopidForSpecification,
				num: addCarNum
			}
		}).then(() => {
			this.setData({
				specificationDialog: false, // 规格弹出框
				addCarNum: 1, // 将要添加到购物车的数量
				specification: [], // 规格信息
				specificationActiveIndex: -1, // 默认选择的那个规格小标
				specificationActiveData: {}, // 选择的规格信息
			}, () => {
				wx.showToast({
					title: "加入成功",
					icon: "success",
					duration: 1000
				});
				this.countCarNum();
			});
		});
	},

	// 点击搜索
	onSearch(e) {
		let value = e.detail;
		// 跳转到type页面
		wx.navigateTo({
			url: `/pages/search/search?name=${value}`
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
		wx.setStorageSync("campus", event.detail.value[0] || "");
		// 关闭弹框
		this.onShowPositionDialog();
		this.setData({
			position: event.detail.value[0]
		});
		setTimeout(() => {
			// 重新查询页面
			this.getHomeMessage();
			// 获取购物车数据
			this.countCarNum();
		}, 0);

	},

	// 点击轮播图
	swiperClick(e) {
		let data = e.currentTarget.dataset.data;
		// 商店
		if(data.type == 1) return wx.navigateTo({
			url: `/pages/shop/shop?id=${data.shopid}`
		});
		// 食品
		if(data.type == 2) return wx.navigateTo({
			url: `/pages/goodsDetail/goodsDetail?id=${data.goodsid}`
		});
	},

	// tab切换
	changeSortType(e) {
		let type = this.data.type;
		console.log(e);
		this.setData({
			type: type == 1 ? 2 : 1
		});
	},

	// 计算购物车数量
	countCarNum() {
		// getCarNumByOpenid
		request.get({
			url: "/car/getCarNumByOpenid"
		}).then(res => {
			this.setData({
				carNum: res.data || 0
			});
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
		let show = adverDetail.show;
		adverDetail.status = 2;
		if(show == 1) { //关联商店
			wx.navigateTo({
				url: `/pages/goodsDetail/goodsDetail?id=${data.goods_id}`
			});
		} else if(show == 2) { // 关联食品
			wx.navigateTo({
				url: `/pages/shop/shop?id=${data.shop_id}`
			});
		}
		return this.setData({
			adverDetail: adverDetail
		});
	},

	// 关闭广告
	onCloseGoodsDetailByAdver() {
		let adverDetail = this.data.adverDetail;
		adverDetail.status = 2;
		this.setData({
			adverDetail: adverDetail
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onShow: function () {
		// 三秒过后关闭分享
		this.closeToolTip();
		// 获取所属校园
		let value = wx.getStorageSync("campus");
		// 获取位置信息
		request.get({
			url: "/position/all"
		}).then(res => {
			this.setData({
				columns: [
					{
						values: res.data.map(item => {
							return item.name;
						}),
						className: "column3"
					},
				],
				position: value ? value : res.data[0].name
			});
			// 如果位置信息存在
			if(value) {
				this.getHomeMessage();
			}else{
				// this.setData({positionDialogVisible: true});
				wx.setStorageSync("campus", res.data[0].name);
				this.getHomeMessage();
				// this.getLoactionByUser();
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

	onIsLogin: function() {
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
						let sharePrams = this.data.shareParams;
						if(sharePrams.type && sharePrams.id && sharePrams.show) {
							this.setData({
								sharePrams: {}
							}, () => {
								if(sharePrams.type == "shop") {
									wx.navigateTo({
										url: `/pages/shop/shop?id=${sharePrams.id}`
									});
								}
								if(sharePrams.type == "goods") {
									wx.navigateTo({
										url: `/pages/goodsDetail/goodsDetail?id=${sharePrams.id}`
									});
								}
							});
						}
						this.countCarNum();
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
				return this.setData({
					loginPopup: true
				});
			}
		});
	},

	// 获取首页信息
	getHomeMessage: function() {
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
			let data = res.data || [];
			data.map(item => {
				let start_time = item.start_time;
				let end_time = item.end_time;
				start_time = moment(moment().format("YYYY-MM-DD ") + start_time).valueOf();
				end_time = moment(moment().format("YYYY-MM-DD ") + end_time).valueOf();
				if(start_time >= end_time) {
					end_time = moment(moment(end_time).add(1, "days")).valueOf();
				}
				let now = moment(new Date().getTime());
				if((now >= start_time && now <= end_time) && item.shopStatus == 1) {
					item.open = true;
				}
			});
			this.setData({
				todayList: data
			});
		});

		// 获取全部商品数据
		request.get({
			url: "/goods/getByCampus"
		}).then(res => {
			let data = res.data || [];
			data.map(item => {
				let start_time = item.start_time;
				let end_time = item.end_time;
				start_time = moment(moment().format("YYYY-MM-DD ") + start_time).valueOf();
				end_time = moment(moment().format("YYYY-MM-DD ") + end_time).valueOf();
				if(start_time >= end_time) {
					end_time = moment(moment(end_time).add(1, "days")).valueOf();
				}
				let now = moment(new Date().getTime());
				if((now >= start_time && now <= end_time) && item.shopStatus == 1) {
					item.open = true;
				}
			});
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
		let self = this;
		wx.getLocation({
			type: "wgs84",
			altitude: false,
			success: function(res) {
				const latitude = res.latitude; // 纬度
				const longitude = res.longitude; // 经度
				request.get({
					url: "/position/all"
				}).then(res => {
					let position =res.data || [];
					let result = [];
					position.map(item => {
						let distince = Math.pow((Number(item.siteY) * 100 - Number(latitude) * 100), 2) + Math.pow(Number(item.siteX) * 100 - Number(longitude) * 100, 2);
						result.push({
							id: item.id,
							name: item.name,
							distince
						});
					});
					let minDistince = result[0].distince, minIndex = 0;
					result.map((item, index) => {
						if(minDistince > item.distince) {
							minDistince = item.distince;
							minIndex = index;
						}
					});
					let minName = result[minIndex].name;
					wx.setStorageSync("campus", minName);
					self.getHomeMessage();
				});
			}
		});
	},

	onLoad: function(options) {
		this.onIsLogin();
		if (options.type && options.id) {
			let id = options.id;
			let type = options.type;
			this.setData({
				shareParams: {
					type: type,
					id: id,
					show: true
				}
			});
		}
		// 获取广告图
		request.get({
			url: "/adver/getAll"
		}).then(res => {
			let data = res.data || {};
			if(data.time && data.time > 0 && data.status == 1) {
				this.timer = setTimeout(() => {
					data.status = 2;
					this.setData({
						adverDetail: data
					});
					clearTimeout(this.timer);
				}, data.time * 1000);
			}
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
			title: "青年移动餐厅",
			path: "/pages/home/home",
			imageUrl: "http://www.bws666.com/LOGO.png"
		};
	}
});
