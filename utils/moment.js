
const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : "0" + n;
};
module.exports = {
	format: (timestap) => {
		// 简单的一句代码
		let date = new Date(Number(timestap)); //获取一个时间对象
		let year = date.getFullYear();  // 获取完整的年份(4位,1970)
		let month = formatNumber(date.getMonth());  // 获取月份(0-11,0代表1月,用的时候记得加上1)
		let day = formatNumber(date.getDate());  // 获取日(1-31)
		// let time = date.getTime();  // 获取时间(从1970.1.1开始的毫秒数)
		let hours = formatNumber(date.getHours());  // 获取小时数(0-23)
		let minutes = formatNumber(date.getMinutes());  // 获取分钟数(0-59)
		let seconds = formatNumber(date.getSeconds());  // 获取秒数(0-59)
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	},
	formatToDay: (timestap) => {
		let date = new Date(Number(timestap)); //获取一个时间对象
		let year = date.getFullYear();  // 获取完整的年份(4位,1970)
		let month = formatNumber(date.getMonth());  // 获取月份(0-11,0代表1月,用的时候记得加上1)
		let day = formatNumber(date.getDate());  // 获取日(1-31)
		return `${year}-${month}-${day}`;
	},
};

