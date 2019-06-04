// pages/home/home.js
// const app = getApp();
const request = require("../../utils/request");
// const app = getApp();
// const config = require("../../utils/config");

Page({

	/**
   * 页面的初始数据
   */
	data: {
		positionDialogVisible: false, //位置弹框的开关
		interval: 5000, // 轮播图间隔时间
		duration: 1000, // 轮播图延迟时间
		// 轮播图url
		swiperUrls: [
		],
		// 商品种类
		type: [
		],
		// 位置按钮种类
		columns: [
		],
		// 缓存的地址信息
		position: "",
		// 商店信息
		shop: [],
		// 按销量排序的商店
		sortSelesData: [],
		freeList: [], //免费霸王餐
		freeItem: {}, //点击的免费霸王餐
		timeList: {}, // 限时抢购列表
		timeItem: {}, // 点击的限时抢购
		tempTimeData: [], // 限时抢购的临时数据
	},
	// 点击搜索
	onSearch(e) {
		let value = e.detail;
		// 跳转到type页面
		wx.navigateTo({
			url: `/pages/type/type?value=${value}&type=search`
		});
	},
	// 位置弹框的开关
	onShowPositionDialog() {
		this.setData({
			positionDialogVisible: !this.data.positionDialogVisible
		});
	},
	// 改变位置的时候
	onChangePosition(event) {
		console.log(event);
	},
	// 选取位置确定
	onConfirmPosition(event) {
		console.log(event.detail.value, "position sure");
		// 位置信息保存
		wx.setStorageSync("campus", event.detail.value[2]);
		// 关闭弹框
		this.onShowPositionDialog();
		this.setData({
			position: event.detail.value[2]
		});
		setTimeout(() => {
			// 重新查询页面
			this.getHomeMessage();
		}, 0);

	},
	// 点击轮播图
	swiperClick(e) {
		let shopid = e.currentTarget.dataset.shopid;
		// 跳转到详情页
		wx.navigateTo({
			url: `/pages/shop/shop?id=${shopid}`
		});
	},
	// 点击商店
	shopClick(e) {
		let id = e.currentTarget.dataset.id;
		// 跳转到商店
		wx.navigateTo({
			url: `/pages/shop/shop?id=${id}`
		});
	},
	// type点击
	toTypeListPage(e) {
		let id = e.currentTarget.dataset.id;
		// 跳转到type页面
		wx.navigateTo({
			url: `/pages/type/type?value=${id}&type=type`
		});
	},
	// 点击免费霸王餐
	// wx.navigateTo({
	// 	url: "/pages/accounts/accounts?type=shop"
	// });
	toFreeCount(e) {
		let data = e.currentTarget.dataset.item;
		if(data.total == 0) {
			return wx.showModal({
				title: "提示",
				content: "已售罄",
				showCancel: false
			});
		}
		this.setData({
			freeItem: data
		}, () => {
			wx.navigateTo({
				url: "/pages/accounts/accounts?type=free"
			});
		});
	},
	// 点击限时抢购
	toTimeCount(e) {
		let data = e.currentTarget.dataset.item;
		let nowTime = (new Date()).getTime();
		if(data.total <= 0) {
			return wx.showModal({
				title: "提示",
				content: "已售罄",
				showCancel: false
			});
		}
		if(Number(data.start_time) > nowTime) {
			return wx.showModal({
				title: "提示",
				content: "暂未开售",
				showCancel: false
			});
		}
		if(Number(data.start_time) <= nowTime && nowTime < Number(data.end_time) ) {
			this.setData({
				timeItem: data
			}, () => {
				wx.navigateTo({
					url: "/pages/accounts/accounts?type=time"
				});
			});
		}
		if(nowTime > Number(data.end_time) ) {
			return wx.showModal({
				title: "提示",
				content: "活动已结束",
				showCancel: false
			});
		}
	},
	/**
   * 生命周期函数--监听页面加载
   */
	onShow: function () {
		// 获取所属校园
		let value = wx.getStorageSync("campus");
		// 获取位置信息
		request.get({
			url: "/position/all"
		}).then(res => {
			this.setData({
				columns: [
					{
						values: ["上海"],
						className: "column1"
					},
					{
						values: ["上海"],
						className: "column2"
					},
					{
						values: res.data.map(item => {
							return item.name;
						}),
						className: "column3"
					},
				],
				position: value ? value : res.data[0].name
			});
			if(value) {
				this.getHomeMessage();
			}else{
				wx.setStorageSync("campus", res.data[0].name);
				this.getHomeMessage();
			}
		});
		// 设置标题
		wx.setNavigationBarTitle({
			title: "雀送"
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#ffffff"//背景颜色值
		});

	},
	// 获取首页信息
	getHomeMessage: function() {
		// 获取轮播图数据
		request.get({
			url: "/swiper/all"
		}).then(res => {
			this.setData({
				swiperUrls: res.data || []
			});
		});
		// 获取商品类型分类
		request.get({
			url: "/type/all"
		}).then(res => {
			this.setData({
				type: res.data || []
			});
		});
		// 获取免费霸王餐
		request.get({
			url: "/free/getFreeGoods"
		}).then(res => {
			let data = res.data;
			this.setData({
				freeList: data
			});
		});
		// 获取限时抢购列表
		request.get({
			url: "/time/getTimeGoods"
		}).then(res => {
			let data = res.data;
			this.setData({
				tempTimeData: data
			}, () => {
				this.changeTime();
			});

		});
		// 获取商店列表
		request.get({
			url: "/shop/all"
		}).then(res => {
			let data = res.data || [], sortSelesData = [];
			data.map(item => {
				let special = item.special.includes("@@") ? item.special.split("@@") : [];
				let tempData = [];
				special.map(item2 => {
					let tempData2 = item2.split(",");
					tempData.push({
						origin: tempData2[0].split("=")[1],
						discount: tempData2[1].split("=")[1],
					});
				});
				item.special = tempData;
				sortSelesData.push(item);
			});
			sortSelesData.sort((a, b) => {
				return b.sales - a.sales;
			});
			this.setData({
				shop: data || [],
				sortSelesData
			});
		});
	},

	// 更改限时抢购时间
	changeTime() {
		let data = this.data.tempTimeData;
		data.map(item => {
			let nowTime = (new Date()).getTime();
			if(Number(item.start_time) > nowTime) {
				item.timeText = "暂未开售";
			}
			if(Number(item.start_time) <= nowTime && nowTime < Number(item.end_time) ) {
				let time = item.end_time - nowTime,
					seconds = parseInt(time / 1000),
					firstNum = parseInt(seconds / 3600),
					secondNum = parseInt(seconds % 3600 / 60),
					lastNum = parseInt(seconds % 3600 % 60);
				item.timeText = `${this.addZero(firstNum)}:${this.addZero(secondNum)}:${this.addZero(lastNum)}`;
			}
			if(nowTime > Number(item.end_time) ) {
				item.timeText = "已经结束";
			}
		});
		this.setData({
			timeList: data,
		}, () => {
			setTimeout(() => {
				this.changeTime(data);
			}, 5000);
		});
	},

	addZero(num) {
		num = Number(num);
		if(num < 10) {
			num = "0" + num;
		}
		return num;
	},

	/**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {
		const updateManager = wx.getUpdateManager();
		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: "更新提示",
				content: "新版本已经准备好，是否重启应用？",
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				}
			});
		});
	},

	// 	/**
	//    * 生命周期函数--监听页面显示
	//    */
	// 	onShow: function () {
	// 		// 设置标题
	// 		wx.setNavigationBarTitle({
	// 			title: "雀送"
	// 		});
	// 		// 设置导航栏颜色
	// 		wx.setNavigationBarColor({
	// 			frontColor: "#000000",//前景颜色值
	// 			backgroundColor: "#ffffff"//背景颜色值
	// 		});
	// 	},

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
	},

	// 按条件遍历
	// circulationByCondition(citys, columns, name) {
	//   let column = {
	//     values: []
	//   };
	//   citys.map((item,index) => {
	//     column.values.push(item.name);
	//     if(name) {
	//       if(item.children && item.children.length != 0 && item.name == name) {
	//         this.circulation(item.children, columns, "")
	//       }
	//     } else {
	//       if(item.children && item.children.length != 0 && index == 0) {
	//         this.circulation(item.children, columns, "")
	//       }
	//     }

	//   })
	//   this.circulation(item.children, columns)
	//   return columns;
	// },

	// // 遍历城市
	// circulation(citys, columns) {
	//   let column = {
	//     values: []
	//   };
	//   citys.map((item,index) => {
	//     column.values.push(item.name);
	//     if(item.children && item.children.length != 0 && index== 0) {
	//       this.circulation(item.children, columns)
	//     }
	//   })
	//   columns.unshift(column);
	//   return columns;
	// },
});
