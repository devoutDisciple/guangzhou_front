const request = require("../../utils/request");
Page({
	/**
   * 页面的初始数据
   */
	data: {
		type: "create", //默认是新增
		positionDialogVisible: false, // 学校位置弹框
		floorDialogVisible: false, // 取餐点的弹框
		username: "",
		phone: "",
		room: "",
		campus: "",
		floor: "",
		position: [], // 全部位置
		// 位置按钮种类
		positionColumns: [
		],
		floorColumns: [
		],
	},

	// 选取位置确定
	onConfirmPosition() {
		// 设置学校取餐点
		let campus = this.data.campus, position = this.data.position, floorColumns = [], floorData = {};
		position.map(item => {
			if(item.name == campus) {
				try {
					let campus = JSON.parse(item.floor);
					let obj = {};
					let defaultName = "";
					if(campus && campus.length != 0) {
						campus.map((floor, index) => {
							if(index == 0) defaultName = floor.name;
							obj[floor.name] = [];
							let children = floor.children;
							if(children && children.length != 0) {
								children.map(item => {
									obj[floor.name].push(item.name);
								});
							}
						});
					}
					floorData = obj;
					floorColumns =  [
						{
							values: Object.keys(obj),
							className: "column1"
						},
						{
							values: obj[defaultName],
							className: "column2",
							defaultIndex: 0
						}
					];
				} catch (error) {
					console.log(error);
					floorColumns.push({
						values: ["无"],
						className: "column1"
					});
				}

			}
		});
		this.setData({
			campus: campus,
			floorColumns,
			floorData,
			floor: ""
		});
	},

	// 楼号相关-------------------------
	// 位置弹框的开关
	onShowFloorDialog() {
		let floorDialogVisible = this.data.floorDialogVisible;
		this.onConfirmPosition();
		this.setData({
			floorDialogVisible: !floorDialogVisible
		});
	},

	// 楼号改变的时候
	floorChange(event) {
		let floorData = this.data.floorData;
		const { picker, value } = event.detail;
		picker.setColumnValues(1, floorData[value[0]]);
	},

	// 选取位置确定
	onConfirmFloor(event) {
		// 关闭弹框
		this.onShowFloorDialog();
		this.setData({
			floor: event.detail.value.join(" ")
		});
	},

	// 表单提交
	formSubmit(e) {
		let value = e.detail.value;
		// 选择校内
		if(!value.username) return this.formMessage("请输入联系人姓名");
		if(!value.phone) return this.formMessage("请输入手机号");
		if(!value.floor) return this.formMessage("请选择取餐点");
		if(!value.room) return this.formMessage("请输入房间号");
		let campus = this.data.campus;
		let type = this.data.type;
		value.campus = campus;
		if(type == "create") {
			let params = {
				username: value.username,
				phone: value.phone,
				campus: campus,
				address: JSON.stringify(value),
				room: value.room
			};
			return request.post({
				url: "/user/addAddress",
				data: params
			}).then(() => {
				// 跳转到我的地址页面
				wx.redirectTo({
					url: "/pages/myAddress/myAddress"
				});
			});
		}
		if(type == "edit") {
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2];  //上一个页面
			let data = prevPage.data;
			let newAddress = [];
			data.addressList.map((item, index) => {
				if(index == data.editIndex) {
					let itemAddress = JSON.parse(JSON.stringify(value));
					if(item.default) itemAddress.default = true;
					return newAddress.push(itemAddress);
				}
				return newAddress.push(item);
			});
			request.post({
				url: "/user/updateAddress",
				data: {
					address: JSON.stringify(newAddress)
				}
			}).then(() => {
				// 跳转到详情页
				wx.redirectTo({
					url: "/pages/myAddress/myAddress"
				});
			});
		}

	},

	// 表单提示信息
	formMessage(content) {
		wx.showModal({
			title: "提示",
			content: content,
			showCancel: false
		});
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		let type = options.type;
		// 如果是新增
		if(type == "create") {
			this.setData({
				type: "create"
			});
			// 设置标题
			wx.setNavigationBarTitle({
				title: "新增收货地址"
			});
		}
		// 如果是编辑
		if(type == "edit") {
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2];  //上一个页面
			let data = prevPage.data, editData = data.editData;
			console.log(data, editData, 999);
			this.setData({
				type: "edit",
				username: editData.username,
				phone: editData.phone,
				room: editData.room,
				campus: editData.campus || "",
				floor: editData.floor || "",
			});
			// 设置标题
			wx.setNavigationBarTitle({
				title: "编辑收货地址"
			});
		}
		// 获取位置信息
		request.get({
			url: "/position/all"
		}).then(res => {
			this.setData({
				position: res.data,
				positionColumns: [
					{
						values: res.data.map(item => {
							return item.name;
						}),
						className: "column2"
					},
				]
			});
		});
		// 设置导航栏颜色
		wx.setNavigationBarColor({
			frontColor: "#000000",//前景颜色值
			backgroundColor: "#fff"//背景颜色值
		});
	},

	/**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {

	},

	/**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {
		let position = wx.getStorageSync("campus");
		this.setData({
			campus: position || ""
		}, () => {
			this.onConfirmPosition();
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
