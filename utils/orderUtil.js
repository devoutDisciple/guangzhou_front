module.exports = {
	filterStatus: function(type) {
		let result = "订单已完成";
		switch(Number(type)) {
		case 1:
			result = "未支付";
			break;
		case 2:
			result = "商家未接单";
			break;
		case 3:
			result = "已接单";
			break;
		case 4:
			result = "派送中";
			break;
		case 5:
			result = "订单完成";
			break;
		case 6:
			result = "已取消";
			break;
		case 7:
			result = "已评价";
			break;
		default:
			result = "订单已完成";
		}
		return result;
	}
};
