import axios from 'axios'
let util = {
    // product: true // 是否直接请求ip
}
axios.defaults.timeout = 5000

// axios.defaults.baseURL = 'http://192.168.6.130:8002' // 陈志军本地调试
axios.defaults.baseURL = 'http://192.168.6.108:8081' // 孙超本地调试

util.baseUrl = axios.defaults.baseURL + '/ApiTranser'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8' // 设置请求头

// axios.defaults.withCredentials = true // 请求时候是否带cookie
util.title = function (title) {
    title = title ? title + ' - Home' : 'aiats智能web系统'
    window.document.title = title
}

util.isChrome = window.getComputedStyle

// util.baseUrl = baseUrl
// 打包环境请求方法
function post(obj) {
    let data = null,
        baseurl = null
    let host = obj.host || ''
    let mothod = obj.method || 'post'
    if (obj.method === 'get') {
        data = ''
        for (let i in obj.data) {
            if (!obj.data.hasOwnProperty(i)) continue
            if (data === '') data += i + '=' + obj.data[i]
            else data += '&' + i + '=' + obj.data[i]
        }
        data = encodeURIComponent(data)
    } else {
        data = JSON.stringify(obj.data)
    }
    axios.post('/ApiTranser', { action: obj.url, dataParams: data, rt: mothod, host: host })
        .then(res => {
            obj.success ? obj.success(res) : null
        })
        .catch(error => {
            obj.error ? obj.error(error) : null
        })
}

// 本地测试环境get请求
function get(obj) {
    let url = REQUEST_PATH + obj.url + '?'
    let data = ''
    for (let i in obj.data) {
        if (!obj.data.hasOwnProperty(i)) continue
        if (data === '') data += i + '=' + obj.data[i]
        else data += '&' + i + '=' + obj.data[i]
    }
    axios.get(url + data).then(res => {
        obj.success ? obj.success(res) : null
    }).catch(error => {
        obj.error ? obj.error(error) : null
    })
}

// 本地测试环境post请求
function developmentPost(obj) {
    let url = REQUEST_PATH + obj.url
    let data = JSON.stringify(obj.data)
    axios.post(url, data).then(res => {
        obj.success ? obj.success(res) : null
    }).catch(error => {
        obj.error ? obj.error(error) : null
    })
}
// 新请求方法 
util.post = (obj) => {
    if (util.product) {
        if (obj.method === 'get') get(obj)
        else developmentPost(obj)
        return
    }
    post(obj)
}

// 存储session 或者获取session
util.session = (key, value) => {
    if (typeof value === 'number' || typeof value === 'boolean') {
        sessionStorage.setItem(key, value)
        return
    }

    // if (value === false || value === null) {
    //     sessionStorage.setItem(key, value)
    //     return
    // }

    if (value) {
        if (typeof value == 'object') {
            value = JSON.stringify(value)
        }
        sessionStorage.setItem(key, value)
        return
    }
    let session = sessionStorage.getItem(key)
    if (session) {
        try {
            session = JSON.parse(session)
        } catch (e) {
            session = session
        }
    } else {
        session = null
    }
    return session
}

// 格式化时间格式 y-m-d h:m:s
util.coverDate = (date) => {
    if (!date) return ''
    if (typeof date === 'string') {
        date = date.replace('T', ' ').replace(/\-/g, '/')
        date = new Date(date)
    }
    if(isNaN(date)){
        return '0000-00-00 00:00:00'
    }
    if (date.getFullYear) {
        let year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds()
        month = month > 9 ? month : '0' + month
        day = day > 9 ? day : '0' + day
        h = h > 9 ? h : '0' + h
        m = m > 9 ? m : '0' + m
        s = s > 9 ? s : '0' + s
        return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s
    }
    return ""
}

// 处理统计时间
util.handleRangeTime = (obj) => {
    if (obj != undefined) {
        if (obj[0] != "" && obj[0] != null) {
            return (util.coverDay(obj[0]) + "," + util.coverDay(obj[1]))
        }
        return ""
    }
    return ""
}

// 格式化时间  h:m:s
util.coverTime = (date) => {
    if (!date) return ''
    if (typeof date === 'string') {
        date = date.replace('T', ' ').replace(/\-/g, "/")
        date = new Date(date)
    }
    let h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds()
    m = m > 9 ? m : '0' + m
    h = h > 9 ? h : '0' + h
    s = s > 9 ? s : '0' + s
    return h + ':' + m + ':' + s
}

// 格式化时间 y-m-d
util.coverDay = (date) => {
    if (!date) return ''
    if (typeof date === 'string') {
        date = date.replace('T', ' ').replace(/\-/g, '/')
        date = new Date(date)
    }
    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate()
    month = month > 9 ? month : '0' + month
    day = day > 9 ? day : '0' + day
    return year + '-' + month + '-' + day
}

// 获取dom元素的位置属性
util.getStyle = (prop, ele) => {
    if (!ele) {
        return null
    }
    let pro = null
    if (!util.isChrome) {
        pro = ele.currentStyle[prop]
        if (pro) {
            return parseInt(pro)
        }
        return null
    }
    pro = getComputedStyle(ele, false)[prop]
    if (pro) {
        return parseInt(pro)
    }
    return null
}

// 获取通用数据的name值
util.getName = (a, b, key) => {
    for (let i = 0; i < b.length; i++) {
        if (b[i].id == a) {
            if (key) return b[i][key]
            return b[i].name
        }
    }
    return '--'
}

// 获取基础设置
util.getBase = (key) => {
    let obj = sessionStorage.getItem('BaseData')
    if (obj) {
        obj = JSON.parse(obj)
        if (obj[key]) {
            return obj[key]
        }
    }
    return null
}

// 获取两个时间之间的日期列表
util.getDateList = (start, end) => {
    var result = []
    var beginDay = start.split("-")
    var endDay = end.split("-")
    var diffDay = new Date()
    var dateList = new Array()
    var i = 0
    diffDay.setDate(beginDay[2])
    diffDay.setMonth(beginDay[1] - 1)
    diffDay.setFullYear(beginDay[0])
    result.push(start)
    while (i == 0) {
        var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000
        diffDay.setTime(countDay)
        dateList[2] = diffDay.getDate()
        dateList[1] = diffDay.getMonth() + 1
        dateList[0] = diffDay.getFullYear()
        if (String(dateList[1]).length == 1) {
            dateList[1] = "0" + dateList[1]
        }
        if (String(dateList[2]).length == 1) {
            dateList[2] = "0" + dateList[2]
        }
        result.push(dateList[0] + "-" + dateList[1] + "-" + dateList[2])
        if (
            dateList[0] == endDay[0] &&
            dateList[1] == endDay[1] &&
            dateList[2] == endDay[2]
        ) {
            i = 1
        }
    }
    return result
}

/**
 * 
 * 处理echart数据
 * ldata     -  echart图例        Array
 * lcode     -  图例对应的参数     Array
 * startTime -  开始时间 'y-m-d'  String
 * endTime   -  结束时间 'y-m-d'  String
 * datas     -  后端返回数据       Array
 * datasArg  -  X轴对应的字段     String
 * 
 */

util.coverEcharts = (ldata, lcode, datas, datasArg, startTime, endTime) => {
    // echart数据模型
    let obj = {
        legend: {
            data: ldata
        },
        series: [],
        xAxis: {
            data: util.getDateList(startTime, endTime)
        }
    }
    let inx = 0 // 索引
    let interval = null // 定时器
    function setData() {
        let curArr = []
        if (obj.xAxis.data.length === datas.length) {
            datas.map(item => {
                curArr.push(item[lcode[inx]])
            })
        } else {
            obj.xAxis.data.forEach((item, index) => {
                let edata = datas.filter(items => {
                    if (items[datasArg] === item) {
                        return items
                    }
                })
                if (edata.length != 0) {
                    curArr.push(edata[0][lcode[inx]])
                } else {
                    curArr.push(0)
                }
            })
        }
        obj.series.push({
            name: ldata[inx],
            type: "line",
            data: curArr
        })
        inx++
        if (inx <= lcode.length - 1) {
            setData()
        }
    }
    setData()
    return obj
}

// 属性拷贝复制，在obj1和obj2中都有某个属性时， 将obj2对象中的属性值阀盖obj1对象中对应的属性的值
util.copyProp = (obj1, obj2) => {
    for (let i in obj2) {
        if (!obj2.hasOwnProperty(i)) continue
        if (obj1.hasOwnProperty(i)) {
            obj1[i] = obj2[i]
        }
    }
    return obj1
}
util.getId = (randomLength)=>{
    return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
}
// 页面公用方法
util.exportFile = (fileUrl)=>{
    let formDom
    formDom = document.createElement('form');
    formDom.method = 'get';
    formDom.action = fileUrl;
    document.body.appendChild(formDom);
    formDom.submit();            
    formDom.style.display = 'none';
    return formDom;
}
// let reg = new RegExp("[()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
// (\ )、(\?)、(\~)(\!)(\@)(\%)[(\#)(\$)(\^)(\&)(\*)(\()(\))(\-)(\_)(\[)(\])(\<)(\>)(\;)(\:)(\|)(\{)(\})
util.specLetterReg = new RegExp(/[(\{)(\})(\\)(\')(\")(\.)(\/)(\\)]+/);
util.sqlReg = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
util.numReg = /^((\d+-*\d+)|(\s*))$/
util.formateSql =  (rule, value, callback, source, options)=>{
    let reg = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
    if(reg.test(value)){
        callback(new Error('请您不要在参数中输入特殊字符和SQL关键字！'));
    }else{
        callback();
    }
}

util.copyFilter = (str)=>{
    if(!str){return ''}
    var end = str.replace(/\ +/g, ""); //去掉空格
    end = end.replace(/[\r\n]/g, ""); //去掉回车换行  
    end = end.replace(/<[^>]+>/g,"");
    return end;
}

util.copyFilterMore = (str)=>{
    if(!str){return ''}
    var end = str.replace(/(^\s*)|(\s*$)/g,""); //去掉空格
    end = end.replace(/[\r\n]/g, ""); //去掉回车换行
    end = end.replace(/(<!--)(.*)(-->)/g,'');
    end = end.replace(/"/g,"'");
    end =  end.replace(/<script.*?>.*?<\/script>/ig, '');
    return end;
}

//去掉所有的html标记
util.delHtmlTag = (str)=>{
    return str.replace(/<[^>]+>/igm,"").replace(/\'/igm,'‘').replace(/\"/igm,'“').replace(/\./igm,'').replace(//igm,'');
}

util.textInit = (e) => {
    e.preventDefault();
    var text;
    var clp = (e.originalEvent || e).clipboardData;
    if (clp === undefined || clp === null) {
        text = window.clipboardData.getData("text") || "";
        text = util.delHtmlTag(text);
        if (text !== "") {
            if (window.getSelection) {
                var newNode = document.createElement("span");
                newNode.innerHTML = text;
                window.getSelection().getRangeAt(0).insertNode(newNode);
            } else {
                document.selection.createRange().pasteHTML(text);
            }
        }
    } else {
        text = clp.getData('text/plain') || "";
        text = util.delHtmlTag(text);
        if (text !== "") {
            // console.log(text);
            document.execCommand('insertText', false, text);
        }
    }
}

export default util;