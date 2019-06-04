const request = require("../../utils/request");
Page({
	/**
   * 页面的初始数据
   */
	data: {
		sexRedio: "1", // 默认选中男同学
		campusRadio: "1", // 默认是校内
		positionDialogVisible: false, // 学校位置弹框
		username: "",
		phone: "",
		otherPhone: "",
		campus: "",
		floor: "",
		home: "",
		family: "",
		table: "",
		// 位置按钮种类
		positionColumns: [
		],
		type: "create", //默认是新增

		floorDialogVisible: false, // 宿舍楼号
		floorColumns: [
			{
				values: ["宿舍楼"],
				className: "column1"
			},
			{
				values: [ "1号楼", "2号楼", "3号楼", "4号楼", "5号楼", "6号楼", "7号楼", "8号楼" ],
				className: "column2"
			},
		],
	},

	// 改变男女同学按钮
	onChangeSexRadio(e) {
		this.setData({
			sexRedio: e.detail
		});
	},
	// 改变校内还是校外
	onChangeCampusRadio(e) {
		this.setData({
			campusRadio: e.detail
		});
	},
	// 位置相关---------------------
	// 位置弹框的开关
	onShowPositionDialog() {
		this.setData({
			positionDialogVisible: !this.data.positionDialogVisible
		});
	},
	// 改变位置的时候
	onChangePosition(event) {
		console.log(event.detail, "change position");
	},
	// 选取位置确定
	onConfirmPosition(event) {
		console.log(event.detail.value, "position sure");
		// 关闭弹框
		this.onShowPositionDialog();
		this.setData({
			campus: event.detail.value.join(" ")
		});
	},

	// 楼号相关-------------------------
	// 位置弹框的开关
	onShowFloorDialog() {
		let floorDialogVisible = this.data.floorDialogVisible;
		if(!floorDialogVisible && !this.data.campus) {
			return wx.showModal({
				title: "提示",
				content: "请选择学校地址",
				showCancel: false
			});
		}
		this.setData({
			floorDialogVisible: !floorDialogVisible
		});
	},
	// 改变位置的时候
	onChangeFloor(event) {
		console.log(event.detail, "change Floor");
	},
	// 选取位置确定
	onConfirmFloor(event) {
		console.log(event.detail.value, "Floor sure");
		// 关闭弹框
		this.onShowFloorDialog();
		this.setData({
			floor: event.detail.value.join(" ")
		});
	},

	// 表单提交
	formSubmit(e) {
		let value = e.detail.value;
		console.log(value, "formsubmit------");
		// 选择校内
		if(!value.username) return this.formMessage("请输入联系人姓名");
		if(!value.phone) return this.formMessage("请输入手机号");
		let params = {
			username: value.username,
			sex: this.data.sexRedio,
			phone: value.phone,
			otherPhone: value.otherPhone,
		};
		if(this.data.campusRadio == 1) {
			if(!value.campus) return this.formMessage("请选择校区");
			if(!value.floor) return this.formMessage("请选择楼号");
			if(!value.home) return this.formMessage("请输入宿舍号");
			let address = JSON.stringify(Object.assign({
				isSchool: true,
				campus: value.campus,
				floor: value.floor,
				home: value.home
			}, params));
			params.address = address;
		} else {
			if(!value.family) return this.formMessage("请输入收货地址");
			if(!value.table) return this.formMessage("请输入门牌号");
			let address = JSON.stringify(Object.assign({
				isSchool: false,
				family: value.family,
				table: value.table
			}, params));
			params.address = address;
		}
		let type = this.data.type;
		if(type == "create") {
			return request.post({
				url: "/user/addAddress",
				data: params
			}).then(() => {
				// 跳转到详情页
				wx.navigateTo({
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
					let itemAddress = JSON.parse(params.address);
					if(item.default) itemAddress.default = true;
					newAddress.push(itemAddress);
					return;
				}
				newAddress.push(item);
				return;
			});
			request.post({
				url: "/user/updateAddress",
				data: {
					address: JSON.stringify(newAddress)
				}
			}).then(() => {
				// 跳转到详情页
				wx.navigateTo({
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
		}
		// 如果是编辑
		if(type == "edit") {
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2];  //上一个页面
			let data = prevPage.data, editData = data.editData;
			console.log(editData, "编辑地址");
			this.setData({
				type: "edit",
				username: editData.username,
				sexRedio: editData.sex,
				phone: editData.phone,
				otherPhone: editData.otherPhone,
				campusRadio: editData.isSchool ? "1" : "2", // 校内或者校外
				campus: editData.campus || "",
				floor: editData.floor || "",
				home: editData.home || "",
				family: editData.family || "",
				table: editData.table || ""
			});
		}
		// 获取位置信息
		request.get({
			url: "/position/all"
		}).then(res => {
			this.setData({
				positionColumns: [
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
				]
			});
		});
		// 设置标题
		wx.setNavigationBarTitle({
			title: "新增收货地址"
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
