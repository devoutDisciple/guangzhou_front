module.exports = {
	filterStatus: function(type) {
		let result = "订单已完成";
		// 1-未派送 2-派送中 3-订单完成 4-已取消 5-已评价 6-退款中 7-退款完成 8-退款失败
		switch(Number(type)) {
		case 1:
			result = "待派送";
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
			result = "已完成";
			break;
		case 6:
			result = "退款中";
			break;
		case 7:
			result = "退款完成";
			break;
		case 8:
			result = "退款失败";
			break;
		default:
			result = "订单关闭";
		}
		return result;
	}
};
