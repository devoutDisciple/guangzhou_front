const request = require("../../utils/request");
import Toast from "../../dist/toast/toast";
const moment = require("../../utils/moment.min");

Page({
	/**
   * 页面的初始数据
   */
	data: {
		// 缓存的地址信息
		position: "",
		// 商店信息
		goodsList: [], // 全部商品分类
		sortGoodsList: [], // 按销量排序
		type: 1, // 1 综合排序 2 销量排序
		carNum: 0, // 购物车数量

		specificationDialog: false, // 规格弹出框
		addCarNum: 1, // 将要添加到购物车的数量
		specification: [], // 规格信息
		specificationActiveIndex: -1, // 默认选择的那个规格小标
		specificationActiveData: {}, // 选择的规格信息
		goodsidForSpecification: "", // 选择规格的菜品信息
		shopidForSpecification: "", // 选择规格的菜品信息
		goodsName: "",
	},

	// 点击购物车
	goCar() {
		wx.navigateTo({
			url: "/pages/car/car"
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

	/**
   * 生命周期函数--监听页面加载
   */
	onShow: function () {
		this.countCarNum();
	},


	onLoad: function(options) {
		// // 获取广告图
		let name = options.name;
		request.get({
			url: "/goods/getGoodsByLikeName",
			data: {
				name: name
			}
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
				goodsList: data
			});
		});
	},

});
