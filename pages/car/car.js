const request = require("../../utils/request");
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		allSelect: false, //是否全选
		data: [], // 购物车数据
		totalPrice: 0.00, // 总金额
	},

	// 获取购物车信息
	getCarDetail() {
		request.get({
			url: "/car/getByOpenid",
		}).then(res => {
			let data = res.data;
			data.map(item => {
				item.select = false;
			});
			console.log(data);
			this.setData({
				data: data
			});
		});
	},

	// 点击商品图片
	onSearchGoodsDetail(e) {
		let data = e.currentTarget.dataset.data;
		console.log(data, 111);
		wx.navigateTo({
			url: `/pages/goodsDetail/goodsDetail?id=${data.goodsDetail.id}`
		});
	},

	// radio选择的时候
	radioChange(e) {
		console.log(e);
		let radioId = e.currentTarget.dataset.data, data = this.data.data;
		console.log(data);
		data.map(item => {
			if (item.id == radioId) {
				item.select = !item.select;
			}
		});
		// 判断是否已经全选
		let flag = true; // 默认全选
		data.map(item => {
			if(!item.select) flag = false;
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
		console.log(123);
		let data = this.data.data, allSelect = this.data.allSelect;
		if(allSelect) { // 取消全选
			data.map(item => {
				item.select = false;
			});
		} else {
			data.map(item => {
				item.select = true;
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
			if(item.id == goods.id) item.num++;
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
			if(item.select) totalPrice = totalPrice + item.num * item.goodsDetail.price;
		});
		this.setData({
			totalPrice: totalPrice * 100
		});
	},

	// 提交订单
	onSubmitOrder() {
		console.log(123);
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
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
