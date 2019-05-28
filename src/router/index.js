import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '../../../components/HelloWorld'
//  懒加载引入方式， /**/ 注释是定义懒加载的chunkname的名字，方便输出的chunkfile时候分模块。
const index = () => import( /* webpackChunkName: "index/chunks" */ '../pages/index.vue')
const sence = () => import( /* webpackChunkName: "index/chunks" */ '../pages/sence.vue')
const category = () => import( /* webpackChunkName: "index/chunks" */ '../pages/category.vue')
const templateList = () => import( /* webpackChunkName: "index/chunks" */ '../pages/templateList.vue')
const activityList = () => import( /* webpackChunkName: "index/chunks" */ '../pages/activityList.vue')
const newActivity = () => import( /* webpackChunkName: "index/chunks" */ '../pages/newActivity.vue')
const uploadfile = () => import( /* webpackChunkName: "index/chunks" */ '../pages/uploadfile.vue')
const login = () => import( /* webpackChunkName: "index/chunks" */ '../pages/login.vue')
const regist = () => import( /* webpackChunkName: "index/chunks" */ '../pages/regist.vue')
const activityDetail = () => import( /* webpackChunkName: "index/chunks" */ '../pages/activityDetail.vue')
const themeconfig = () =>   import ( /* webpackChunkName: "index/chunks" */ '../pages/themeconfig.vue')
const themeList = () =>   import ( /* webpackChunkName: "index/chunks" */ '../pages/themesList.vue')
const themeTemplate = () =>   import ( /* webpackChunkName: "index/chunks" */ '../pages/themeTemplate.vue')
const newTemplate = () =>   import ( /* webpackChunkName: "index/chunks" */ '../pages/newTemplate.vue')
const power = () =>   import ( /* webpackChunkName: "index/chunks" */ '../pages/power.vue')
const role = () =>   import ( /* webpackChunkName: "index/chunks" */ '../pages/role.vue')
const userinfo = ()=> import( /* webpackChunkName: "index/chunks" */ '../pages/userInfo.vue')
const classify = ()=> import( /* webpackChunkName: "index/chunks" */ '../pages/classifyManager.vue')
const logs = ()=> import( /* webpackChunkName: "index/chunks" */ '../pages/logs.vue')
const pubfile = () => import( /* webpackChunkName: "index/chunks" */ '../pages/pubfile.vue')

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'login',
        component: login,
        meta: {
            auth: false
        }
    },
    // {
    //     path: '/regist',
    //     name: 'regist',
    //     component: regist,
    //     meta: {
    //         auth: false
    //     }
    // },
     {
        path: '/main',
        component: index,
        meta: {
            auth: true
        },      
        children: [
            // 活动
            // {
            //     path: '/',
            //     name: 'category',
            //     component: category,
            //     meta: {
            //         auth: true
            //     },
            // }, 
            {
                path: 'template',
                name: 'templateList',
                component: templateList,
                meta: {
                    auth: true
                },
            },{
                path: 'userinfo',
                name: 'userinfo',
                component: userinfo,
                meta: {
                    auth: true
                },
            }, {
                path: 'addtemplate/:id',
                name: 'newTemplate',
                component: newTemplate,
                meta: {
                    auth: true
                },
            }, {
                path: 'addtemplate/edit/:id',
                name: 'addTemplate',
                component: newTemplate,
                meta: {
                    auth: true
                },
            }, {
                path: 'activitylist',
                name: 'activitylist',
                component: activityList,
                meta: {
                    auth: true
                },
            }, {
                path: 'activitydetail/:id/:ruletype',
                name: 'activityDetail',
                component: activityDetail,
                meta: {
                    auth: true
                },
            }, {
                path: 'newactivity/:id',
                name: 'newActivity',
                component: newActivity,
                meta: {
                    auth: true
                },
            },
            // 场景
            {
                path: 'sence',
                name: 'sence',
                component: sence,
                meta: {
                    auth: true
                },
            },
            // 上传
            {
                path: 'upload',
                name: 'uploadfile',
                component: uploadfile,
                meta: {
                    auth: true
                },
            },
             // 皮肤
            //  {
            //     path: 'themes',
            //     name: 'themeconfig',
            //     component: themeconfig
            // },
            {
                path: 'themes',
                name: 'themeList',
                component: themeList,
                meta: {
                    auth: true,
                    keep: true
                },
            },{
                path: 'themes/list/:id',
                name: 'themeListId',
                component: themeList,
                meta: {
                    auth: true,
                    keep: true
                },
            },{
                path: 'themes/template/:tempId/:skinId',
                name: 'themeTemplate',
                component: themeTemplate,
                meta: {
                    auth: true,
                    keep: true
                },
            },
            // 权限
            {
                path: 'power',
                name: 'power',
                component: power,
                meta: {
                    auth: true,
                    keep: true
                },
            },
             // 角色管理
             {
                path: 'role',
                name: 'role',
                component: role,
                meta: {
                    auth: true,
                    keep: true
                },
            },
             // 分类管理
             {
                path: 'classify',
                name: 'classify',
                component: classify,
                meta: {
                    auth: true,
                    keep: true
                },
            },
             // 日志管理
             {
                path: 'logs',
                name: 'logs',
                component: logs,
                meta: {
                    auth: true,
                    keep: true
                },
            },
            // 公共文件管理
             {
                path: 'pubfile',
                name: 'pubfile',
                component: pubfile,
                meta: {
                    auth: true,
                    keep: true
                }
            },
        ]
    }]
})