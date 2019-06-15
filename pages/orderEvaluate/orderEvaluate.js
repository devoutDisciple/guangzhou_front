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
		shopDetail: {},
		orderitem: {}
	},

	// 对骑手评价改变
	onPeopleGradeChange(e) {
		console.log(e);
		let num = e.detail;
		let {shopGrade} = this.data;
		this.setData({
			peopleGrade: num
		});
		if(shopGrade && num) {
			this.setData({
				success: true
			});
		}
	},

	// 对商家评价改变
	onShopGradeChange(e) {
		let num = e.detail;
		let {peopleGrade} = this.data;
		this.setData({
			shopGrade: num
		});
		if(peopleGrade && num) {
			this.setData({
				success: true
			});
		}
	},

	submit(e) {
		// 跳转订单页面
		if(this.data.success) {
			let value = e.detail.value.textarea,
				{peopleGrade, shopGrade, orderitem} = this.data;
			console.log(peopleGrade, shopGrade, value);
			console.log(this.data.orderitem);
			let goods_id = orderitem.order_list[0].id;
			request.post({
				url: "/evaluate/addEvaluate",
				data: {
					orderid: this.data.orderitem.id,
					shopid: this.data.shopDetail.id,
					desc: value,
					goods_id: goods_id,
					shop_grade: shopGrade,
					sender_grade: peopleGrade,
					create_time: (new Date()).getTime(),
					avatarUrl: app.globalData.userInfo.avatarUrl || "",
					username: app.globalData.userInfo.nickName || "hx...123",
				}
			}).then(res => {
				console.log(res);
				// 跳转订单页面;
				wx.switchTab({
					url: "/pages/my/my",
					success: () => {
						wx.showToast({
							title: "评价成功",
							icon: "success",
							duration: 2000
						});
					}
				});
			});
		}
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function () {
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

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];  //上一个页面
		let data = prevPage.data;
		this.setData({
			shopDetail: data.orderitem.shop_detail,
			orderitem: data.orderitem
		});
	},

});
