import request from "../../utils/request";

// pages/accounts/accounts.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orderList: [], // 订单数据
		totalPrice: 0.00, // 总价
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
		// 付钱
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
						let {type, address, orderList} = this.data;
						if(!address.phone) {
							wx.showModal({
								title: "请填写收货地址",
								confirmText: "确定"
							});
							return;
						}
						let reqParams = {};
						if(type == "shop") {
							let orderDetail = orderList[0];
							let goodsDetail = orderDetail.goods[0];
							reqParams = {
								shopid: orderDetail.shopDetail.id,
								totalPrice: orderDetail.totalPrice,
								desc: orderDetail.comment,
								discount: 0,
								status: 1,
								order_list: JSON.stringify([{
									goodsid: goodsDetail.id,
									goodsName: goodsDetail.name,
									goodsUrl: goodsDetail.url,
									num: 1,
									price: goodsDetail.price,
									send_price: orderDetail.shopDetail.send_price,
									package_cost: goodsDetail.package_cost,
									totalPrice: orderDetail.totalPrice,
								}]),
							};
							request.post({
								url: "/order/add",
								data: reqParams
							}).then(() => {
								// 支付订单跳转到订单页面
								wx.navigateTo({
									url: "/pages/order/order"
								});
							});
						}
						if(type == "car") {
							console.log(123);
						}
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
			let orderList = data.orderList;
			orderList.map(item => {
				item.comment = "";
				item.package_cost = item.goods[0].package_cost;
				item.showComment = "口味,偏好等要求";
			});
			console.log(orderList, 99999);
			this.setData({
				type: "shop",
				orderList: data.orderList,
				totalPrice: data.orderList[0].totalPrice,
			});
		}
		if(type == "car") {
			let orderList = data.orderList;
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
					totalPrice = totalPrice + Number(item.shopDetail.send_price) + Number(item.goodsDetail.package_cost);
					globalPrice = Number(globalPrice + totalPrice);
					item.goods = goods;
					item.comment = "";
					item.package_cost = item.goodsDetail.package_cost;
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
