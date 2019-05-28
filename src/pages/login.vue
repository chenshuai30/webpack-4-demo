<template>
  <div class="login-container" ref="login">
    <div class="login">
      <h1 class="login-title">AIATS智能Web系统</h1>
      <el-form ref="formInline" :model="formInline" :rules="ruleInline">
        <el-form-item class="login-input" prop="LoginID">
          <el-input ref="username" class="login-input-inset" v-model="formInline.LoginID" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" ref="password" v-model="formInline.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="login-button">
          <el-button @click="handleSubmit('formline')" type="success">{{loginTxt}}</el-button>      
           <!-- <el-button @click="goRegist" style="width:182px;margin-left:11px;" type="primary">注册</el-button>     -->
        </el-form-item>
         <el-form-item class="login-button">
           
         </el-form-item>
      </el-form>
      <div class="about">
        郑州时空隧道信息技术有限公司
      </div>
    </div>
  </div>
</template>
<script>
import Util from "@assets/js/util";
import "@assets/js/gt";
export default {
  name:'login',
  data() {    
    return {
      formInline: {
        LoginID: "",
        password: "",
      },
      loginTxt: "登录",
      ruleInline: {
        LoginID: [
          { required: true, message: "请填写用户名", trigger: "blur" },
          {
            type: "string",
            min: 2,
            message: "账号长度不能小于2位",
            trigger: "blur",
            max: 22
          }
        ],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          {
            type: "string",
            min: 4,
            message: "密码长度不能小于4位",
            trigger: "blur",
            max: 24
          }
        ]
      },
      reqUrl: {
        login: "/common/login/goto",
        getToken: "/common/login/gocheck",
        getCode: "/common/login/geetest"
      },
      navList:[],
      menuList:[]
    };
  },
  created() {
     sessionStorage.clear();
  },
  activated(){
    sessionStorage.clear();
  },
  mounted() {

  },
  methods: {
    getPower(id){
      this.$post({
        url:REQUEST_PATH+'common/getOwnResource',
        data:{
          id:id
        },
        success:(res)=>{
          // console.log('权限系统...')
          // console.log(res)
          this.navList = res.data.data.slice(0);
          sessionStorage.setItem('list',JSON.stringify(this.navList));
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
              this.menuList.push('/main/template')
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
      sessionStorage.setItem('menu',JSON.stringify(this.menuList));

      // 跳转活动页面
      this.$router.push('/main/activitylist')
    },
    handleSubmit(name) {
      this.$refs.formInline.validate((valid)=>{
        if(valid){          
          this.login();
        }
      })
      
    },
    login(){
      this.$post({
        url:REQUEST_PATH+'common/login',
        data:{
          userName:this.formInline.LoginID,
          password:escape(this.formInline.password)
        },
        success:(res)=>{
          // console.log('登录成功...')
          // console.log(res)
          let data = res.data.data[0]
          sessionStorage.setItem('isLogined',true);
          sessionStorage.setItem('uname',data.userName);
          sessionStorage.setItem('pnum',data.roleId);
          sessionStorage.setItem('unum',data.id);
          sessionStorage.setItem('level',data.userLevel);
          this.getPower(data.roleId);
        }
      })
    },
    goRegist(){
      this.$router.push('/regist')
    }
  }
};
</script>
<style lang='less'>
@time: 100s;
input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px white inset !important;
}
.login-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
}
.geetest_holder.geetest_wind .geetest_radar_btn,
.geetest_holder.geetest_wind .geetest_success_btn {
  border-radius: 5px;
}
.login {
  width: 380px;
  height: 300px;
  position: absolute;
  z-index: 5;
  margin-top: -75px;
  top: 380px;
  left: 50%;
  margin-left: -195px;
  .login-title {
    font-size: 36px;
    color: #fff;
    font-weight: bold;
    padding: 15px 20px;
    text-align: center;
  }
  .login-button {
    text-align: center;
    margin-top: 30px;
    button {
      width: 100%;
      letter-spacing: 5px;
      font-size: 15px;
      color: #fff;
      -webkit-background-size: 110%;
      background-size: 110%;
      border: none;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      height: 46px;
      outline: none;
    }
  }
}

.about {
  width: 100%;
  color: #fff;
  margin-top: 10%;
  text-align: center;
}
</style>