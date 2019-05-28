var params = {
	left: 0,
	top: 0,
	currentX: 0,
	currentY: 0,
	flag: false,
	curDom: null,
};
//获取相关CSS属性
params.getCss = function (o, key) {
	return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
};
params.move = function (event) {
	var e = event ? event : window.event;
	if (e.target != params.curDom) return false;
	if (params.flag) {
		var nowX = e.clientX, nowY = e.clientY;
		var disX = nowX - params.currentX, disY = nowY - params.currentY;
		e.target.style.left = parseInt(params.left) + disX + "px";
		e.target.style.top = parseInt(params.top) + disY + "px";
		if (event.preventDefault) {
			event.preventDefault();
		}
		return false;
	}

}

//拖拽的实现
params.startDrag = function (target) {
	if (params.getCss(target, "left") !== "auto") {
		params.left = params.getCss(target, "left");
	}
	if (params.getCss(target, "top") !== "auto") {
		params.top = params.getCss(target, "top");
	}
	params.curDom = target;
	//o是移动对象
	target.onmousedown = function (event) {
		params.flag = true;
		if (!event) {
			event = window.event;
			//防止IE文字选中
			target.onselectstart = function () {
				return false;
			}
		}
		var e = event;
		params.currentX = e.clientX;
		params.currentY = e.clientY;
	};
	target.onmousedown();
	document.onmouseup = function () {
		params.flag = false;
		if (params.getCss(target, "left") !== "auto") {
			params.left = params.getCss(target, "left");
		}
		if (params.getCss(target, "top") !== "auto") {
			params.top = params.getCss(target, "top");
		}
		document.removeEventListener("mousemove", params.move);
	};
	document.addEventListener('mousemove', params.move);
};
export default params;