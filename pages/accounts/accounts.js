import request from "../../utils/request";

// pages/accounts/accounts.js
Page({

	/**
   * 页面的初始数据
   */
	data: {
		shopDetail: {}, // 商店详情
		orderList: [], // 订购的菜品
		totalPrice: 0, // 总价
		discountPrice: 0, // 满减优惠

		type: "shop", // 默认是从shop点击进来的
		personDetail: {}, // 个人信息
		address: {}, // 默认收货地址
		show: false, // 备注信息弹框是否开启
		comment: "", // 备注信息
		showComment: "口味,偏好等要求"
	},
	// 点击新增收货地址
	onClickAddAddress() {
		wx.navigateTo({
			url: "/pages/address/address?type=create"
		});
	},
	// 点击新增备注
	addComment() {
		this.setData({
			show: !this.data.show
		});
	},
	// 备注信息点击确定的时候
	confirmComment() {
		this.addComment();
	},
	// 备注信息点击取消的时候
	cancelComment() {
		this.setData({
			comment: "",
			showComment: "口味,偏好等要求"
		});
	},
	// 键盘输入的时候
	textareaInput(e) {
		console.log(e.detail.value);
		let value = e.detail.value;
		this.setData({
			comment: value,
			showComment: value.length > 7 ? value.slice(0, 7) + "..." : value
		});
	},
	// 支付订单
	submitOrder() {
		// console.log((new Date()).getTime());
		// wx.requestPayment({
		// 	timeStamp: (new Date()).getTime(),// 时间戳
		// 	nonceStr: "",//随机字符串，长度为32个字符以下
		// 	package: "",//统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
		// 	signType: "MD5",//签名算法
		// 	paySign: "",//签名
		// 	success(res) { },
		// 	fail(res) { }
		// });
		let shopDetail = {
			id: this.data.shopDetail.id,
			name: this.data.shopDetail.name,
			address: this.data.shopDetail.address,
			url: this.data.shopDetail.url,
			package_cost: this.data.shopDetail.package_cost,
			send_price: this.data.shopDetail.send_price
		};
		let goodIds = [];
		this.data.orderList.map(item => {
			goodIds.push({
				id: item.id,
				num: item.num
			});
		});
		request.post({
			url: "/order/add",
			data: {
				id: this.data.shopDetail.id,
				goodIds: goodIds,
				shop_detail: JSON.stringify(shopDetail),
				order_list: JSON.stringify(this.data.orderList),
				total_price: this.data.totalPrice, // 总价
				discount_price: this.data.discountPrice, // 优惠价格
				order_time: (new Date()).getTime(),
				desc: this.data.comment, // 备注信息
			}
		}).then(res => {
			console.log(res);
			if(this.data.type == "free") {
				request.get({
					url: "/free/subFreeGoods",
					data: {
						id: this.data.freeItemId,
					}
				});
			}
			if(this.data.type == "time") {
				request.get({
					url: "/time/subTimeGoods",
					data: {
						id: this.data.timeItemId,
					}
				});
			}
			// 支付订单跳转到订单页面
			wx.switchTab({
				url: "/pages/order/order"
			});
		});
	},
	// 点击编辑收货地址
	goEditPage() {
		// 跳转到编辑地址表单页面
		wx.navigateTo({
			url: "/pages/myAddress/myAddress"
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		let type = options.type;
		console.log(type, 111);
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];  //上一个页面
		let data = prevPage.data;
		if(type == "shop") { // 从商店点击过来
			this.setData({
				type: "shop",
				shopDetail: data.shopDetail,
				orderList: data.orderList,
				totalPrice: Number(data.totalPrice) + Number(data.shopDetail.send_price) + Number(data.shopDetail.package_cost),
				discountPrice: data.discountPrice
			});
		}
		if(type == "free") { // 从免费霸王餐点击过来
			let goodsDetail = data.freeItem.goodsDetail, shopDetail = data.freeItem.shopDetail;
			goodsDetail = Object.assign(goodsDetail, {
				num: 1,
				price: 0,
				package_cost: 0,
			});
			shopDetail = Object.assign(shopDetail,{
				send_price: 0,
				package_cost: 0,
			});
			this.setData({
				type: "free",
				shopDetail: shopDetail,
				orderList: [goodsDetail],
				freeItemId: goodsDetail.id,
				totalPrice: 0,
				discountPrice: 0
			});
		}
		if(type == "time") { // 从限时抢购点击过来
			let goodsDetail = data.timeItem.goodsDetail, shopDetail = data.timeItem.shopDetail;
			goodsDetail = Object.assign(goodsDetail, {
				num: 1,
			});
			this.setData({
				type: "time",
				shopDetail: shopDetail,
				orderList: [goodsDetail],
				timeItemId: goodsDetail.id,
				totalPrice: Number(goodsDetail.price) + Number(shopDetail.send_price) + Number(shopDetail.package_cost),
				discountPrice: 0
			});
		}


		// 设置标题
		wx.setNavigationBarTitle({
			title: "提交订单"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#fff"//背景颜色值
		});
	},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {
		// 获取个人信息
		request.get({
			url: "/user/getUserByOpenid"
		}).then(res => {
			let personDetail = res.data;
			let addressList = personDetail.address ? JSON.parse(personDetail.address) : [];
			let address = {};
			console.log(addressList, 1111);
			for(let i = 0; i < addressList.length; i++) {
				if(addressList[i].default) {
					address = addressList[i];
				}
			}
			this.setData({
				personDetail: personDetail,
				address: address
			});
		});
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
