const request = require("../../utils/request");
Page({

	/**
   * 页面的初始数据
   */
	data: {
		data: {}, // 商品详情数据
		goods_id: 1, // 商品id
		isCollection: false, // 是否已经收藏  默认没有收藏
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
	// 点击加入购物车
	onClickAddCarIcon() {
		let goods_id = this.data.goods_id;
		let create_time = (new Date()).getTime();
		request.post({
			url: "/car/addCarGoods",
			data: {
				goods_id,
				create_time,
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
	// 点击收藏 addCollection
	addCollection() {
		let goods_id = this.data.goods_id;
		let create_time = (new Date()).getTime();
		request.post({
			url: "/collection/addCollectionGoods",
			data: {
				goods_id,
				create_time
			}
		}).then((res) => {
			if(res.data == "have one") return;
			this.setData({
				isCollection: true
			});
		});
	},
	// 移除收藏
	removeCollection() {
		let goods_id = this.data.goods_id;
		request.post({
			url: "/collection/removeCollectionGoods",
			data: {
				goods_id
			}
		}).then(res => {
			if(res.data) this.setData({
				isCollection: false
			});
		});
	},
	// 点击更多 前往商店
	goShop(e) {

	},
	// 点击立即购买
	onClickBuyIcon() {
		wx.showToast({
			title: "暂不支持购买",
			icon: "fail",
			duration: 1000
		});
	},
	// 查看收藏的商品
	getCollectionGoods() {
		request.get({
			url: "/collection/getByOpenid"
		}).then((res) => {
			let data = res.data;
			console.log(data);
			data.map(item => {
				if(item.goods_id == this.data.goods_id) {
					this.setData({
						isCollection: true
					});
				}
			});
		});
	},
	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		let id = options.id || 1;
		// 获取商品数据
		request.get({
			url: "/goods/getById",
			data: {
				id: id
			}
		}).then(res => {
			let data = res.data;
			data.desc = data.desc ? JSON.parse(data.desc) : [];
			this.setData({
				data: data || {},
				goods_id: id
			}, () => {
				// 查看收藏
				this.getCollectionGoods();
			});
			// 设置微信头部
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
