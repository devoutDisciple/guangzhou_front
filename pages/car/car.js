const request = require("../../utils/request");
const moment = require("../../utils/moment.min");
import Toast from "../../dist/toast/toast";

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		allSelect: false, //是否全选
		data: [], // 购物车数据
		totalPrice: 0.00, // 总金额
		orderList: [], // 提交的订单
		dataForDeleteCar: [], // 结算成功要输出的购物车信息
	},

	// 获取购物车信息
	getCarDetail() {
		wx.showLoading({
			title: "加载中",
			mask: true
		});
		request.get({
			url: "/car/getByOpenid",
		}).then(res => {
			let data = res.data || [];
			data.map(item => {
				let start_time = item.start_time;
				let end_time = item.end_time;
				start_time = moment(moment().format("YYYY-MM-DD ") + start_time).valueOf();
				end_time = moment(moment().format("YYYY-MM-DD ") + end_time).valueOf();
				item.specification = JSON.parse(item.specification);
				if(start_time >= end_time) {
					end_time = moment(moment(end_time).add(1, "days")).valueOf();
				}
				let now = moment(new Date().getTime());
				if((now >= start_time && now <= end_time) && item.shopStatus == 1) {
					item.open = true;
				}
				item.select = false;
			});
			this.setData({
				data: data
			}, () => {
				wx.hideLoading();
			});
		});
	},

	// 点击商品图片
	onSearchGoodsDetail(e) {
		let data = e.currentTarget.dataset.data;
		wx.navigateTo({
			url: `/pages/goodsDetail/goodsDetail?id=${data.goodsDetail.id}`
		});
	},

	// radio选择的时候
	radioChange(e) {
		let radioId = e.currentTarget.dataset.data, data = this.data.data;
		data.map(item => {
			if (item.id == radioId) {
				item.select = !item.select;
			}
		});
		// 判断是否已经全选
		let flag = true; // 默认全选
		data.map(item => {
			if(!item.select && item.open && item.leave == 1) flag = false;
		});
		this.setData({
			data,
			allSelect: flag
		}, () => {
			this.countPrice();
		});
	},

	//  全选点击的时候
	allSelectChange() {
		let data = this.data.data, allSelect = this.data.allSelect;
		if(allSelect) { // 取消全选
			data.map(item => {
				item.select = false;
			});
		} else {
			data.map(item => {
				if(item.open && item.leave == 1) item.select = true;
			});
		}
		this.setData({
			data,
			allSelect: !allSelect
		}, () => {
			this.countPrice();
		});
	},

	// 增加商品数量
	addGoodsNum(e) {
		let goods = e.currentTarget.dataset.data;
		let data = this.data.data;
		data.map(item => {
			if(goods.id == item.id) item.num++;
		});
		this.setData({data}, () => {
			this.countPrice();
		});
		return request.post({
			url: "/car/modifyNum",
			data: {
				id: goods.id,
				num: 1
			}
		});
	},

	// 减少商品数量
	subGoodsNum(e) {
		let goods = e.currentTarget.dataset.data;
		let data = this.data.data;
		data.map(item => {
			if(item.id == goods.id && item.num > 1) {
				item.num--;
				request.post({
					url: "/car/modifyNum",
					data: {
						id: goods.id,
						num: -1
					}
				});
			}
		});
		this.setData({data}, () => {
			this.countPrice();
		});
	},

	// 计算价格
	countPrice() {
		let data = this.data.data;
		let totalPrice = 0;
		data.map(item => {
			if(item.select) totalPrice = totalPrice + item.num * item.price;
		});
		this.setData({
			totalPrice: totalPrice * 100
		});
	},

	// 提交订单
	onSubmitOrder() {
		let data = this.data.data;
		let orderList = data.filter(item => {
			item.specification = item.specification ? item.specification.name : "";
			if(item.select) return item;
		});
		if(orderList.length == 0) return wx.showModal({
			content: "请选择购买的物品",
			showCancel: false
		});
		let shopids = [], result = [];
		orderList.map(item => {
			shopids.includes(item.shopid) ? null : shopids.push(item.shopid);
		});
		shopids.map(item => {
			result.push(orderList.filter(dataItem => {
				dataItem.origin_price = dataItem.price;
				return dataItem.shopid == item;
			}));
		});
		let flag = false;
		let goodsName = "";
		result.map(goods => {
			let countPrice = 0;
			let start_price = 0;
			let tempName = "";
			goods.map(item => {
				countPrice = countPrice + Number(item.num) * Number(item.price);
				start_price = item.start_price;
				tempName = tempName + item.goodsName + " ";
			});
			if(countPrice < start_price) {
				goodsName = tempName;
				return flag = true;
			}
		});
		if(flag) return Toast.fail(`${goodsName} 等食物未超过商店起送价格!`);
		this.setData({orderList: result, dataForDeleteCar: orderList}, () => {
			wx.navigateTo({
				url: "/pages/accounts/accounts?type=car"
			});
		});
	},

	// 提交删除
	onDeleteCar: function(e) {
		let data = e.currentTarget.dataset.item;
		let id = data.id;
		request.post({
			url: "/car/delteItem",
			data: {
				id: id,
			}
		}).then(res => {
			if(res.data == "success") this.getCarDetail();
		});
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// 清空数据
		this.setData({
			allSelect: false, //是否全选
			totalPrice: 0.00, // 总金额
			orderList: [], // 提交的订单
		});
		// 获取购物车
		this.getCarDetail();
		// 设置标题
		wx.setNavigationBarTitle({
			title: "购物车"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000", //前景颜色值
			backgroundColor: "#ffffff" //背景颜色值
		});
	},
});
