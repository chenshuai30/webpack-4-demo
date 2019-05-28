<template>
  <div id='aia-main'>
      <el-container>
        <el-header>
          <img src="/assets/images/UUFE.png" width="30" style="vertical-align:middle;margin-right:8px"/><span>AIATS系统 V1.2.5</span>
          
          <!-- <el-button class="fr" style="margin-top:10px;" type="primary" @click="goLogin">退出系统</el-button> -->
          <el-menu class="topmenu"  background-color="#31364a" text-color="#fff" active-text-color="#ff8b03" :default-active="activeIndex" mode="horizontal" @select="handleSelect">
            <el-submenu index="1">
              <template slot="title">设置</template>
              <el-menu-item index="11">退出登录</el-menu-item>
              <el-menu-item index="12">修改密码</el-menu-item>
            </el-submenu>
          </el-menu>
          <span class="fr" style="font-size:13px;margin-right:20px;">欢迎您，{{this.username}}</span>
          
        </el-header>       
        <el-container class="aia-body">
          <!-- 左侧菜单 -->
          <el-aside class="aia-menu">
              <el-menu
              :default-active="activeMenu"
              class="aia-menu-ul"
              @select = "selMenu"
              background-color="#f5f7fa"
              text-color="#656565"
              active-text-color="#ff8b03" :router="true">
                <el-menu-item v-for="item in navList" :key="item.id" :index="item.menuUrl">
                  <i :class="item.menuIcon"></i>
                  <span slot="title" class="cantSelect">{{item.menuName}}</span>
                </el-menu-item>              
              </el-submenu>
            </el-menu>
          </el-aside>
          <!-- 右侧主页面 -->
          <el-main class="aia-content">
              <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
  </div>
</template>

<script>
export default {
  name: 'name',
  data() {
    return {
      activeMenu:'/main/activitylist',
      navList:[
        // {
        //   title:'活动',
        //   id:'/main/activitylist',
        //   icon:'el-icon-menu'
        // },{
        //   title:'模板',
        //   id:'/main/template',
        //   icon:'el-icon-view'
        // },
        // {
        //   title:'场景',
        //   id:'/main/sence',
        //   icon:'el-icon-picture-outline'
        // },{
        //   title:'上传',
        //   id:'/main/upload',
        //   icon:'el-icon-upload2'
        // },{
        //   title:'皮肤',
        //   id:'/main/themes',
        //   icon:'el-icon-goods'
        // },{
        //   title:'权限',
        //   id:'/main/power',
        //   icon:'el-icon-setting'
        // }
      ],
      isCollapse: true,
      username:'',
      role:'',   
      menuList:['/','/login','/main/userinfo','/main/pubfile'],
      activeIndex:'1',
    }
  },
  created(){
    this.activeMenu = sessionStorage.getItem('defaultMenu') || '/main/activitylist';    
    this.username = sessionStorage.getItem('uname');
    this.role = sessionStorage.getItem('pnum');
    // this.getPower();
    this.navList = JSON.parse(sessionStorage.getItem('list'));
    let list = JSON.parse(sessionStorage.getItem('menu'));
    list.map(item=>{
      this.menuList.push(item);
    })
  },
  beforeRouteUpdate(to, from, next) {
      let toPath = to.redirectedFrom || to.fullPath;
      let fromPath = from.redirectedFrom || from.fullPath;
      let paramsId = to.params.id 
      let tempId = to.params.tempId;
      let skinId = to.params.skinId;
      let ruleType = to.params.ruletype;
      let query = to.query;
      let index = null;
      // console.log('router')
      // console.log(ruleType);
      if(Object.keys(query).length != 0){
        toPath = toPath.split("?")[0]
      }
      if (paramsId) {
          if(ruleType){
            toPath = toPath.replace(/\/+([0-9]*)\/+([a-z]*)$/ig,'');
          }else{
            toPath = toPath.replace(/\/+([0-9]*)$/ig, '');
          }         
      }
      if(tempId || skinId){
        toPath = toPath.replace(/\/+([0-9]*)\/(add|[0-9]*)$/ig, '');
      }
      index = this.menuList.indexOf(toPath);
     
      // console.log(this.menuList)
      // console.log(toPath);
      // console.log(index);
      if (index != -1) {
          next();
      } else {
          next({ path: fromPath });
      }
  },
  mounted(){  
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log('选择菜单');
      // console.log(key);
      if(key == '11'){
        this.goLogin();
      }
      if(key == '12'){
        this.$router.push('/main/userinfo')
      }
    },
    goLogin(){
      this.$post({
        url:REQUEST_PATH+'common/logout',
        data:{},
        success:(res)=>{
          this.$router.push('/');
          sessionStorage.removeItem('isLogined')
        }
      })
    },
    selMenu(index,indexpath){
      sessionStorage.setItem('defaultMenu',indexpath);
    },
    getPower(){
      this.$post({
        url:REQUEST_PATH+'common/getOwnResource',
        data:{
          id:this.role
        },
        success:(res)=>{
          console.log('权限系统...')
          console.log(res)
          this.navList = res.data.data.slice(0);
          this.setBtns();
        }
      })
    },
    setBtns(){
      this.navList.map(item=>{
        this.menuList.push(item.menuUrl);
        if(item.hasOwnProperty('children')){
          switch(item.menuName){
            case '活动':{
              this.menuList.push('/main/newactivity')
              this.menuList.push('/main/activitydetail')
              let obj = {
                add:false,
                detail:false,               
                edit:false,
                del:false,
                onOff:false,
              };
              item.children.map(item=>{
                switch(item.menuName){
                  case '创建新活动':{
                    obj.add = true;
                    break;
                  }
                  case '详情':{
                    obj.detail = true;
                    break;
                  }
                  case '编辑':{
                    obj.edit = true;
                    break;
                  }
                  case '删除':{
                    obj.del = true;
                    break;
                  }
                  case '活动开关':{
                    obj.onOff = true;
                    break;
                  }
                }
              })
              sessionStorage.setItem('activity',JSON.stringify(obj))
              break;
            }
            case '模板':{
              this.menuList.push('/main/addtemplate/add');
              this.menuList.push('/main/addtemplate/edit');
              this.menuList.push('/main/addtemplate');
              let obj = {
                add:false,
                edit:false,
                del:false,
              }
              item.children.map(item=>{
                 switch(item.menuName){
                  case '新增':{
                    obj.add = true;
                    break;
                  }
                  case '编辑':{
                    obj.edit = true;
                    break;
                  }
                  case '删除':{
                    obj.del = true;
                    break;
                  }
                }
              })
              sessionStorage.setItem('temp',JSON.stringify(obj))
              break;
            }
            case '场景':{             
              break;
            }
            case '上传':{
              let obj = {
                add:false,
              }
              item.children.map(item=>{
                 switch(item.menuName){
                  case '新增':{
                    obj.add = true;
                    break;
                  }
                }
              })
              sessionStorage.setItem('upload',JSON.stringify(obj))
              break;
            }
            case '皮肤':{
              this.menuList.push('/main/themes/list');
              this.menuList.push('/main/themes/template');              
              let obj = {
                add:false,
                edit:false,
                del:false,
              }
              item.children.map(item=>{
                 switch(item.menuName){
                  case '新增':{
                    obj.add = true;
                    break;
                  }
                  case '编辑':{
                    obj.edit = true;
                    break;
                  }
                  case '删除':{
                    obj.del = true;
                    break;
                  }
                }
              })
              sessionStorage.setItem('skin',JSON.stringify(obj))
              break;
            }
            case '权限':{              
              break;
            }
            case '用户':{             
              break;
            }
          }
        }
      })
    }
  }
}
</script>

<style lang='less' rel="stylesheet/less">
  .topmenu{
    width:100px;
    float:right;
    background-color:#31364a!important;
    &.el-menu--horizontal .el-submenu .el-submenu__title{
      border-bottom:none!important;
      color:#fff!important;
      &:hover{
        background-color:#31364a!important;
      }
    }
    .el-submenu .el-menu-item{
        min-width:100px;
    }       
  }
  .cantSelect {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>