const request = require("../../utils/request");
let app =  getApp();
Page({

	/**
   * 页面的初始数据
   */
	data: {
		peopleGrade: 0,
		shopGrade: 0,
		success: false,
		order: {},
		orderList: [],
		gradeList: []
	},

	// 对商家评价改变
	onGradeChange(e) {
		console.log(e, 332);
		let gradeList = this.data.gradeList;
		let index = e.currentTarget.dataset.index;
		let detail = e.detail;
		gradeList[index] = detail;
		this.setData({
			gradeList
		});
	},

	submit(e) {
		// 跳转订单页面
		let order = this.data.order;
		let value = e.detail.value;
		let orderList = this.data.orderList;
		let gradeList = this.data.gradeList;
		gradeList.map((item, index) => {
			let key = "textarea_" + index;
			request.post({
				url: "/evaluate/addEvaluate",
				data: {
					orderid: order.id,
					desc: value[key],
					shopid: order.shopid,
					goods_id: orderList[index].goodsid,
					goods_grade: gradeList[index],
					create_time: (new Date()).getTime(),
					avatarUrl: app.globalData.userInfo.avatarUrl,
					username: app.globalData.userInfo.nickName,
				}
			});
		});
		wx.navigateTo({
			url: "/pages/order/order",
			success: () => {
				wx.showToast({
					title: "评价成功",
					icon: "success",
					duration: 2000
				});
			}
		});

	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		let id = options.id;
		request.get({url: "/order/getOrderById", data: {id: id}}).then(res => {
			let data = res.data || {order_list: []};
			let orderList = JSON.parse(data.order_list);
			let gradeList = [];
			orderList.map(() => {
				gradeList.push(3);
			});
			this.setData({
				order: data,
				orderList: orderList,
				gradeList
			});
		});
		// 设置标题
		wx.setNavigationBarTitle({
			title: "评价"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#fff"//背景颜色值
		});
	},

});
