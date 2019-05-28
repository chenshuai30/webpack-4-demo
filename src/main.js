import 'babel-polyfill'
window.Promise = Promise;
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import '@assets/css/element-variables.scss'
// import 'element-ui/lib/theme-chalk/index.css'

import '@assets/css/reset.less'
import '@assets/css/aiats.less'
import '@assets/css/icon.less'
import '@assets/css/animate.min.css'
import '@assets/css/font-awesome.min.css'
import router from './router'
import axios from 'axios'
import util from '@assets/js/util'
import setform from './pages/setForm.vue'

window.Promise = Promise;

// 模板样式
import '@assets/css/templatestyle.less';


// 模板组件注册文件
import '@components/templates.js'

// 引入editor
import '@assets/js/editor.js'

// 引入滚动条插件
import Scrollbar from 'smooth-scrollbar';
Vue.prototype.scroll = Scrollbar;

Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.prototype.$util = util;

// 封装post
Vue.prototype.$post = function (obj) {
    let that = this;
    let data = {};
    let config = {};
    if (obj.data) {
        data = obj.data;
    }
    if (obj.loading) {
        this[obj.loading] = true;
    }
    if (obj.headers) {
        config.headers = Object.assign({}, obj.headers);
    }
    config.withCredentials = true;
    axios.post(obj.url, data, config).then((res) => {
        if (obj.loading) {
            that[obj.loading] = false;
        }
        if (obj.beforeSuccess) {
            obj.beforeSuccess();
        }
        if (res.data.hasOwnProperty('status')) {
            if (res.data.status) {
                if (obj.success) {
                    obj.success(res);
                }
            } else {
                if (res.data.hasOwnProperty('logined')) {
                    if (!res.data.logined) {
                        console.log('登录失效...')
                        //如果登录失效
                        sessionStorage.clear();
                        that.$router.push('/');
                    }
                } else {
                    if (obj.fail) {
                        obj.fail(res);
                    } else {
                        that.$message.warning(res.data.message)
                    }
                }
            }
        } else {
            if (res.hasOwnProperty('status')) {
                if (res.status) {
                    if (obj.success) {
                        obj.success(res);
                    }
                } else {
                    if (res.hasOwnProperty('logined')) {
                        if (!res.logined) {
                            console.log('登录失效...')
                            //如果登录失效
                            sessionStorage.clear();
                            that.$router.push('/');
                        }
                    } else {
                        if (obj.fail) {
                            obj.fail(res);
                        } else {
                            that.$message.warning(res.message);
                        }
                    }
                }
            } else {
                that.$message.warning('返回数据错误');
            }
        }

    }).catch((err) => {
        if (obj.error) {
            obj.error(err);
        } else {
            console.log(err.message)
        }
    });
}

router.beforeEach((to, from, next) => {
    let logined = sessionStorage.getItem('isLogined');
    if(to.meta.auth) { //是否验证
        if(logined){
            next();
        }else{
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            });
        }
    }else{
        next();
    }
})

Vue.use(ElementUI);
Vue.component('Setform', setform);


new Vue({
    el: '#app',
    router,
    render: h => h(App)
})