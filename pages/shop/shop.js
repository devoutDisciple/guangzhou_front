// pages/shop/shop.js
// const app = getApp();
const request = require("../../utils/request");
const moment = require("../../utils/moment.min");
const config = require("../../utils/config");
import Toast from "../../dist/toast/toast";
const app = getApp();

Page({

	/**
   * 页面的初始数据
   */
	data: {
		data: [],
		shopid: "",
		goodsData: {},
		specificationDialog: false, // 规格弹出框
		addCarNum: 1, // 将要添加到购物车的数量
		specification: [], // 规格信息
		specificationActiveIndex: -1, // 默认选择的那个规格小标
		specificationActiveData: {}, // 选择的规格信息
		goodsidForSpecification: "", // 选择规格的菜品信息
		shopidForSpecification: "", // 选择规格的菜品信息
		goodsName: ""
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

	// 点击商品的时候，前往商品详情页面
	onSearchGoodsDetail(e) {
		let data = e.currentTarget.dataset.data;
		wx.navigateTo({
			url: `/pages/goodsDetail/goodsDetail?id=${data.id}&type=shop`
		});
	},

	// 加入购物车
	goodsGoCar(e) {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return this.setData({
				loginPopup: true
			});
		}
		let data = e.currentTarget.dataset.data;
		let goods_id = data.id;
		let create_time = (new Date()).getTime();
		let specification = JSON.parse(data.specification) || [];
		if(specification && specification.length != 0) {
			return this.setData({
				specificationActiveIndex: 0,
				goodsData: data,
				specificationActiveData: specification[0],
				specification: specification,
				specificationDialog: true,
				goodsidForSpecification: goods_id,
				shopidForSpecification: data.shopid
			});
		}
		request.post({
			url: "/car/addCarGoods",
			data: {
				goods_id,
				create_time,
				shop_id: data.shopid,
				num: 1
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

	// 加入购物车
	addCar(num, price, specification) {
		if(!app.globalData.userInfo || !app.globalData.userInfo.avatarUrl) {
			return this.setData({
				loginPopup: true
			});
		}
		let goods_id = this.data.goodsData.id;
		let create_time = (new Date()).getTime();
		request.post({
			url: "/car/addCarGoods",
			data: {
				goods_id,
				create_time,
				shop_id: this.data.goodsData.shopid,
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

	// 选择规格确认
	sureSpecificationDialog() {
		let {addCarNum, specificationActiveData} = this.data;
		if(!specificationActiveData.name) return Toast.fail("请选择规格");
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
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		let id = "";
		options.id ? id = options.id : null;
		if (options.scene) {
			let params = decodeURIComponent(options.scene);
			id = params.id;
		}
		// 获取商店列表
		request.get({
			url: `/shop/getById?id=${id}`
		}).then(res => {
			let data = res.data || {};
			// 设置标题
			wx.setNavigationBarTitle({
				title: data.name || "贝沃思私厨"
			});
			// 设置导航栏颜色
			wx.setNavigationBarColor({
				frontColor: "#ffffff",//前景颜色值
				backgroundColor: "#333"//背景颜色值
			});
		});
		// 获取商品列表
		request.get({
			url: `/goods/getByShopId?id=${id}`
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
			this.setData({data, shopid: id});
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

	// 关闭登录弹框
	onCloseLoginDialog() {
		this.setData({
			loginPopup: false,
		});
	},

	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function () {
		return {
			title: "专注每一道私房菜!",
			path: `/pages/home/home?type=shop&id=${this.data.shopid}`,
			imageUrl: "http://www.bws666.com/LOGO.png"
		};
	}
});
