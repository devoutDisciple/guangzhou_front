module.exports = {
	filterStatus: function(type) {
		let result = "订单已完成";
		switch(Number(type)) {
		case 1:
			result = "未派送";
			break;
		case 2:
			result = "派送中";
			break;
		case 3:
			result = "已完成";
			break;
		case 4:
			result = "已取消";
			break;
		case 5:
			result = "已评价";
			break;
		case 6:
			result = "退款中";
			break;
		default:
			result = "退款完成";
		}
		return result;
	}
};
