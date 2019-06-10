const request = require("../../utils/request");
Page({

	/**
   * 页面的初始数据
   */
	data: {
		data: {}, // 商品详情数据
		evaluateList: [{ // 商品评价列表
			shop_grade: 5,
			create_time: "2018-9-12 10:32",
			desc: "hello test",
			username: "「？....！』",
			avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJibwnzh0pHtTsXFNbFcdnaWW2MztibPkwQ6ZSYpxuPjV30rfXGbxrkiaMxGPAQWyycO9vV2A4lD52Qg/132"
		}, {
			shop_grade: 3,
			create_time: "2018-9-12 10:39",
			desc: "hello111",
			username: "「？....！』",
			avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJibwnzh0pHtTsXFNbFcdnaWW2MztibPkwQ6ZSYpxuPjV30rfXGbxrkiaMxGPAQWyycO9vV2A4lD52Qg/132"
		}]
	},
	// 点击购物车按钮
	onClickGoCarIcon() {
		// 支付订单跳转到订单页面
		wx.switchTab({
			url: "/pages/car/car"
		});
	},
	// 点击加入购物车
	onClickAddCarIcon() {
		console.log(3);
		wx.showToast({
			title: "加入成功",
			icon: "success",
			duration: 1000
		});

	},
	// 点击立即购买
	onClickBuyIcon() {
		wx.showToast({
			title: "暂不支持购买",
			icon: "fail",
			duration: 1000
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		console.log(options);
		let id = options.id || 1;
		// 设置标题
		// 获取轮播图数据
		request.get({
			url: "/goods/getById",
			data: {
				id: id
			}
		}).then(res => {
			console.log(res.data);
			let data = res.data;
			data.desc = data.desc ? JSON.parse(data.desc) : [];
			this.setData({
				data: data || {}
			});
			wx.setNavigationBarTitle({
				title: data.name.length > 10 ? (data.name.slice(0, 10) + "...") : data.name
			});
		});

		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#ffffff"//背景颜色值
		});
	}
});
