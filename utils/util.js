//  删除数组的指定元素
const removeArrItem = (arr, val) => {
	let index = -1;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == val) index = i;
	}
	arr.splice(index, 1);
	return arr;
};
module.exports = {
	removeArrItem: removeArrItem
};
