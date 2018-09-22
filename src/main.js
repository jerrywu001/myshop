import Vue from 'vue';
import App from './App';
import router from './router';
import ajax from './ajax';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);

Vue.config.productionTip = false;

Vue.prototype.$ajax = ajax;

Vue.prototype.trim = function (str) {
    if (!str) return '';
    return str.replace(/(^\s*)|(\s*$)/g, '');
};

Vue.prototype.isEmpty = function (str) {
    var length = str.replace(/(^\s*)|(\s*$)/g, "").length;
    if (length == 1 && str.charCodeAt(0) == '8203') { //处理 换行控制符
        length = 0;
    }
    return length == 0;
};

//时间格式化
Vue.prototype.format = function (date, fmt) { //author: meizz 
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Vue.prototype.isParent = function (obj, parentObj) {
    if (!parentObj)
        return false;
    while (obj != undefined && obj != null && !!obj.tagName && obj.tagName.toUpperCase() != 'BODY') {
        if (obj == parentObj) {
            return true;
        }
        obj = obj.parentNode;
    }
    return false;
};

//"yyyy-MM-dd hh:mm:ss" 转化为 DateTime
Vue.prototype.dateStrToDate = function (dateStr) {
    if (!!dateStr) {
        return new Date(dateStr.replace(/-/g, '/'));
    }
};

Vue.prototype.getRootPath = function () {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    if (pos === 5) localhostPaht = curWwwPath;
    if (localhostPaht.indexOf("file") != -1) {
        return ".";
    }
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
};

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
        App
    }
});
