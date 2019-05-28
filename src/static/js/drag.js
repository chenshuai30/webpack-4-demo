var params = {
	left: 0,
	top: 0,
	currentX: 0,
	currentY: 0,
	flag: false,
	ele: null,
};
//获取相关CSS属性
params.getCss = function (o, key) {
	return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
};
// 移动dom
params.move = function (event) {
	var e = event ? event : window.event;
	// 获取鼠标和dom顶端的距离
	var nowX = e.clientX, nowY = e.clientY;
	var disX = nowX - params.ele.currentX,
		disY = nowY - params.ele.currentY;
	// dom属性赋值
	params.ele.style.left = params.left + disX + "px";
	params.ele.style.top = params.top + disY + "px";
	if (event.preventDefault) {
		event.preventDefault();
	}
	params.left = params.left + disX;
	params.top = params.top + disY;
	params.ele.currentX = e.clientX;
	params.ele.currentY = e.clientY;
	params.callback && params.callback(params.left, params.top);
}
// 创建边框dom
params.getParentNode = function (obj) {
	if (!obj.parentNode) return false;
	if (obj.parentNode.className === 'cdBox') {
		return obj.parentNode;
	} else {
		return params.getParentNode(obj.parentNode);
	}
}
//拖拽的实现
params.startDrag = function (e, callback) {
	// 实例化当前dom
	if (!params.getParentNode(e.target)) return
	params.ele = params.getParentNode(e.target);
	params.ele.currentX = e.clientX;
	params.ele.currentY = e.clientY;
	params.ele.lastChild.style.display = "block";
	params.callback = callback;
	// 初始化当前dom位置
	params.left = parseInt(params.getCss(params.ele, "left"));
	params.top = parseInt(params.getCss(params.ele, "top"));
	// 监听移动事件
	document.addEventListener('mousemove', params.move);
	// 移除移动事件
	document.onmouseup = function () {
		document.removeEventListener("mousemove", params.move);
	};
};
export default params;