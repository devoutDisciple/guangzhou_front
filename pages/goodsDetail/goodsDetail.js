const request = require("../../utils/request");
const moment = require("../../utils/moment.min");
import Toast from "../../dist/toast/toast";
const config = require("../../utils/config");
const app = getApp();

Page({

	/**
   * 页面的初始数据
   */
	data: {
		data: {}, // 商品详情数据
		goods_id: 1, // 商品id
		shop_id: "1", //商店id
		loginPopup: false, // 登录弹出框
		shopDetail: {
			open: true
		},// 商店详情
		type: "detail", // 正常是商品详情页面，但是从商店点击进来为shop，不显示更多按钮
		isCollection: false, // 是否已经收藏  默认没有收藏
		orderList: [], // 订单页面所需要的数据
		evaluateList: [],// 商品评价列表
		evaluateListAll: [], // 全部评价
		evaluateNum: 0, // 全部评价数量
		avgEvaluate: 0, // 评价平局值
		payType: 1, // 1-购物车 2-立即购买

		specificationDialog: false, // 规格弹出框
		addCarNum: 1, // 将要添加到购物车的数量
		specification: [], // 规格信息
		specificationActiveIndex: -1, // 默认选择的那个规格小标
		specificationActiveData: {}, // 选择的规格信息
		goodsidForSpecification: "", // 选择规格的菜品信息
		shopidForSpecification: "", // 选择规格的菜品信息

		numDialogVisible: false, // 选择数量的弹框
		goodsNum: 1, // 食品数量
		goodsNumPrice: 0, // 食品价格
	},

	// 点击加入购物车
	onClickAddCarIcon() {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return this.setData({
				loginPopup: true
			});
		}
		this.setData({payType: 1});
		let goods_id = this.data.goods_id;
		let goodsData = this.data.data;
		let specification = JSON.parse(goodsData.specification) || [];
		if(specification && specification.length != 0) {
			return this.setData({
				specification: specification,
				specificationDialog: true,
				goodsidForSpecification: goods_id,
				shopidForSpecification: goodsData.shopid
			});
		}
		this.addCar(1, this.data.data.price, {});
	},

	// 加入购物车
	addCar(num, price, specification) {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return this.setData({
				loginPopup: true
			});
		}
		let goods_id = this.data.goods_id;
		let create_time = (new Date()).getTime();
		request.post({
			url: "/car/addCarGoods",
			data: {
				goods_id,
				create_time,
				shop_id: this.data.shop_id,
				num: num,
				price: price,
				specification: JSON.stringify(specification)
			}
		}).then((res) => {
			if(res.data == "have one") {
				return wx.showToast({
					title: "已添加过该商品",
					icon: "warn",
					duration: 1000
				});
			}
			wx.showToast({
				title: "加入成功",
				icon: "success",
				duration: 1000
			});
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

	// 关闭规格弹框
	onCloseSpecificationDialog() {
		this.setData({
			specificationDialog: false, // 规格弹出框
			addCarNum: 1, // 将要添加到购物车的数量
			specification: [], // 规格信息
			specificationActiveIndex: -1, // 默认选择的那个规格小标
			specificationActiveData: {}, // 选择的规格信息
			goodsidForSpecification: "", // 选择规格的菜品信息
			shopidForSpecification: "", // 选择规格的菜品信息
		});
	},

	// 选择规格确认
	sureSpecificationDialog() {
		let {addCarNum, specificationActiveData, payType} = this.data;
		if(!specificationActiveData.name) return Toast.fail("请选择规格");
		if(payType == 1) { // 加入购物车
			this.setData({
				specificationDialog: false, // 规格弹出框
			}, () => {
				this.setData({
					addCarNum: 1, // 将要添加到购物车的数量
					specification: [], // 规格信息
					specificationActiveIndex: -1, // 默认选择的那个规格小标
					specificationActiveData: {}, // 选择的规格信息
				});
			});
			return this.addCar(addCarNum, specificationActiveData.price, specificationActiveData);
		}
		this.buy(addCarNum, specificationActiveData.price, specificationActiveData.name);
	},

	// 关闭数量选择框
	onCloseNumDialog() {
		this.setData({
			numDialogVisible: false,
		});
	},

	// 确定数字选择框
	onSureNumDialog() {
		let goodsNum = this.data.goodsNum;
		let goods = this.data.data;
		this.setData({
			numDialogVisible: false,
		}, () => {
			this.buy(goodsNum, goods.price, "");
		});
	},

	// 加减数字
	onAddNum(e) {
		let data = e.currentTarget.dataset.data;
		let goodsNum = this.data.goodsNum;
		if(data == 1 && goodsNum == 1) return;
		let num = data == 1 ? goodsNum - 1 : goodsNum + 1;
		let goodsNumPrice = Number(num * Number(this.data.data.price)).toFixed(2);
		this.setData({
			goodsNum: num,
			goodsNumPrice: goodsNumPrice
		});
	},

	// 点击收藏 addCollection
	addCollection() {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return this.setData({
				loginPopup: true
			});
		}
		let goods_id = this.data.goods_id;
		let create_time = (new Date()).getTime();
		request.post({
			url: "/collection/addCollectionGoods",
			data: {
				goods_id,
				create_time
			}
		}).then((res) => {
			if(res.data == "have one") return;
			this.setData({
				isCollection: true
			});
		});
	},

	// 关闭登录弹框
	onCloseLoginDialog() {
		this.setData({
			loginPopup: false,
		});
	},

	// 图片预览
	onPreviewImage(e) {
		console.log(e);
		let data = e.currentTarget.dataset.data;
		wx.previewImage({
			current: data, // 当前显示图片的http链接
			urls: [data] // 需要预览的图片http链接列表
		});
	},

	// 移除收藏
	removeCollection() {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return this.setData({
				loginPopup: true
			});
		}
		let goods_id = this.data.goods_id;
		request.post({
			url: "/collection/removeCollectionGoods",
			data: {
				goods_id
			}
		}).then(res => {
			if(res.data) this.setData({
				isCollection: false
			});
		});
	},

	// 点击更多 前往商店
	goShop() {
		let shop_id = this.data.shop_id;
		wx.navigateTo({
			url: `/pages/shop/shop?id=${shop_id}`
		});
	},

	// 点击立即购买
	onClickBuyIcon() {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return this.setData({
				loginPopup: true
			});
		}
		this.setData({payType: 2});
		let goodsData = this.data.data;
		let goods_id = this.data.goods_id;
		let specification = JSON.parse(goodsData.specification) || [];
		if(specification && specification.length != 0) {
			return this.setData({
				specification: specification,
				specificationDialog: true,
				goodsidForSpecification: goods_id,
				shopidForSpecification: goodsData.shopid
			});
		} else {
			this.setData({
				numDialogVisible: true,
				goodsNumPrice: Number(this.data.data.price).toFixed(2)
			});
		}
	},

	// 购买
	buy(num, price, specification) {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return this.setData({
				loginPopup: true
			});
		}
		let goods = this.data.data, shopDetail = this.data.shopDetail;
		goods.num = num;
		goods.origin_price = price;
		goods.price = Number(price) * Number(num);
		goods.specification = specification;
		let totalPrice = Number(goods.price) + Number(shopDetail.send_price) + Number(goods.package_cost);
		if(Number(goods.price) < shopDetail.start_price) {
			Toast.fail(`满${shopDetail.start_price}元起送`);
			return;
		}
		let obj = {
			shopDetail: shopDetail,
			showComment: "口味,偏好等要求",
			goods: [goods],
			totalPrice: totalPrice
		};
		let orderList = [obj];
		this.setData({orderList}, () => {
			// 跳转到编辑地址表单页面
			wx.navigateTo({
				url: "/pages/accounts/accounts?type=detail"
			});
		});
	},

	// 查看收藏的商品
	getCollectionGoods() {
		request.get({
			url: "/collection/getByOpenid"
		}).then((res) => {
			let data = res.data;
			data.map(item => {
				if(item.goods_id == this.data.goods_id) {
					this.setData({
						isCollection: true
					});
				}
			});
		});
	},

	// 获取商店数据
	getShopDetail(id) {
		request.get({
			url: "/shop/getById",
			data: {
				id: id
			}
		}).then(res => {
			let data = res.data;
			let start_time = data.start_time;
			let end_time = data.end_time;
			start_time = moment(moment().format("YYYY-MM-DD ") + start_time).valueOf();
			end_time = moment(moment().format("YYYY-MM-DD ") + end_time).valueOf();
			if(start_time >= end_time) {
				end_time = moment(moment(end_time).add(1, "days")).valueOf();
			}
			let now = moment(new Date().getTime());
			data.open = false;
			if((now >= start_time && now <= end_time) && data.status == 1) {
				data.open = true;
			}
			this.setData({
				shopDetail: data
			});
		});
	},

	// 获取评价列表
	getEvaluate(goods_id) {
		request.get({
			url: "/evaluate/getEvaluateByGoodsId",
			data: {
				goods_id: goods_id
			}
		}).then(res => {
			let data = res.data.result, sumEvaluate = res.data.sumEvaluate, evaluateList = [];
			console.log(data, 111);
			data.map((item, index) => {
				if(item.show == 2) {
					let username = item.username;
					if(username.length == 1) item.username = "**";
					if(username.length == 2) item.username = username.slice(0, 1) + "**";
					if(username.length >= 3) item.username = username.slice(0, 1) + "**" + username.slice(username.length - 1, username.length);
				}
				index < 2 ? evaluateList.push(item) : null;
				item.create_time = moment(Number(item.create_time)).format("YYYY-MM-DD HH:mm:ss");
			});
			this.setData({
				evaluateListAll: data,
				evaluateList: evaluateList,
				evaluateNum: data.length,
				avgEvaluate: Math.round(sumEvaluate / data.length)
			});
		});
	},

	// 查看更多
	onSearchMore() {
		wx.navigateTo({
			url: "/pages/evaluateList/evaluateList"
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		let id = options.id || 1;
		let type = options.type;
		// 获取商品数据
		request.get({
			url: "/goods/getById",
			data: {
				id: id
			}
		}).then(res => {
			let data = res.data;
			data.desc = data.desc ? JSON.parse(data.desc) : [];
			data.num = 1;
			this.setData({
				data: data || {},
				orderList: [data],
				goods_id: id,
				shop_id: data.shopid,
				type: type || "detail"
			}, () => {
				// 获取商店数据
				this.getShopDetail(data.shopid);
				// 查看收藏
				this.getCollectionGoods();
				// 获取评价
				this.getEvaluate(id);
			});
			// 设置微信头部
			wx.setNavigationBarTitle({
				title: data.name.length > 10 ? (data.name.slice(0, 10) + "...") : data.name
			});
		});


		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#ffffff"//背景颜色值
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


	//
	// onShow: function() {
	// 	this.setData({
	// 		specificationDialog: false,
	// 		numDialogVisible: false
	// 	});
	// },

	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function () {
		return {
			title: "专注每一道私房菜!",
			path: `/pages/home/home?type=goods&id=${this.data.goods_id}`,
			imageUrl: this.data.data.url
		};
	}
});
