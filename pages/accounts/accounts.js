import request from "../../utils/request";

// pages/accounts/accounts.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orderList: [], // 订单数据
		totalPrice: 0.00, // 总价
		discountPrice: 0, // 满减优惠
		type: "car", // 默认是从shop点击进来的
		personDetail: {}, // 个人信息
		address: {}, // 默认收货地址
		show: false, // 备注信息弹框是否开启
		commentId: "", // 备注信息id
	},
	// 点击新增收货地址
	onClickAddAddress() {
		wx.navigateTo({
			url: "/pages/address/address?type=create"
		});
	},
	// 点击新增备注
	addComment(e) {
		let data = e.currentTarget.dataset.data;
		console.log(data);
		this.setData({
			show: !this.data.show,
			commentId: data.shop_id
		});
	},
	// 备注信息点击确定的时候
	confirmComment() {
		this.setData({
			show: !this.data.show
		});
	},
	// 备注信息点击取消的时候
	cancelComment() {
		let orderList = this.data.orderList, commentId = this.data.commentId;
		orderList.map(item => {
			if(item.shop_id == commentId) {
				item.comment = "";
				item.showComment = "口味,偏好等要求";
			}
		});
		this.setData({
			orderList
		});
	},
	// 键盘输入的时候
	textareaInput(e) {
		let value = e.detail.value;
		let orderList = this.data.orderList, commentId = this.data.commentId;
		orderList.map(item => {
			if(item.shop_id == commentId) {
				item.comment = value;
				item.showComment = value.length > 7 ? value.slice(0, 7) + "..." : value;
			}
		});
		this.setData({
			orderList
		});
	},
	// 支付订单
	submitOrder() {
		let self = this;
		let shopDetail = {
			id: self.data.shopDetail.id,
			name: self.data.shopDetail.name,
			address: self.data.shopDetail.address,
			url: self.data.shopDetail.url,
			package_cost: self.data.shopDetail.package_cost,
			send_price: self.data.shopDetail.send_price
		};
		let goodIds = [];
		self.data.orderList.map(item => {
			goodIds.push({
				id: item.id,
				num: item.num
			});
		});
		request.get({
			url: "/pay/order",
			data: {
				total_fee: self.data.totalPrice,
			}
		}).then((res) => {
			let data = res.data;
			wx.requestPayment({
				timeStamp: String(data.timeStamp),
				nonceStr: data.nonceStr,
				package: data.package,
				signType: "MD5",
				paySign: data.paySign,
				success(res) {
					if (res.errMsg == "requestPayment:ok") {
						console.log("支付成功");
						// 添加订单
						request.post({
							url: "/order/add",
							data: {
								id: self.data.shopDetail.id,
								goodIds: goodIds,
								shop_detail: JSON.stringify(shopDetail),
								order_list: JSON.stringify(self.data.orderList),
								total_price: self.data.totalPrice, // 总价
								discount_price: self.data.discountPrice, // 优惠价格
								order_time: (new Date()).getTime(),
								desc: self.data.comment, // 备注信息
							}
						}).then(() => {
							// 支付订单跳转到订单页面
							wx.navigateTo({
								url: "/pages/order/order"
							});
						});
					} else {
						wx.showModal({
							title: "支付失败",
							content: "支付失败, 请重新支付",
							confirmText: "重新支付",
							success: (result) => {
								if (result.confirm) self.submitOrder();
							}
						});
					}
				},
				fail(res) {
					console.log(res, "error");
					wx.showModal({
						title: "支付失败",
						content: "支付失败, 请重新支付",
						confirmText: "重新支付",
						success: (result) => {
							if (result.confirm) self.submitOrder();
						}
					});
				}
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
	onLoad: function(options) {
		let type = options.type;
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2]; //上一个页面
		let data = prevPage.data;
		if (type == "detail") { // 从商品详情点击过来
			this.setData({
				type: "shop",
				orderList: data.orderList,
				totalPrice: data.orderList[0].totalPrice,
			});
		}
		if(type == "car") {
			let orderList = data.orderList;
			console.log(orderList, "orderList");
			let newOderList = [];
			let shop_ids = [];
			let globalPrice = 0;
			orderList.map(item => {
				let goods = [];
				let totalPrice = 0;
				orderList.map(item2 => {
					if(item.shop_id == item2.shop_id) {
						goods.push(item2.goodsDetail);
						totalPrice = totalPrice + Number(item2.goodsDetail.price * item2.goodsDetail.num);
					}
				});
				if(!shop_ids.includes(item.shop_id)) {
					totalPrice = totalPrice + Number(item.shopDetail.send_price) + Number(item.shopDetail.package_cost);
					globalPrice = Number(globalPrice + totalPrice);
					item.goods = goods;
					item.showComment =  "口味,偏好等要求";
					item.totalPrice = totalPrice;
					newOderList.push(item);
					shop_ids.push(item.shop_id);
				}
			});
			this.setData({
				type: "car",
				orderList: newOderList,
				totalPrice: globalPrice,
				discountPrice: 0
			});
		}

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
			for (let i = 0; i < addressList.length; i++) {
				if (addressList[i].default) {
					address = addressList[i];
				}
			}
			this.setData({
				personDetail: personDetail,
				address: address
			});
		});
		// 设置标题
		wx.setNavigationBarTitle({
			title: "提交订单"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000", //前景颜色值
			backgroundColor: "#fff" //背景颜色值
		});
	}
});
