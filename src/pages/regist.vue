<template>
  <div class="login-container" ref="login">
    <div class="login">
      <h1 class="login-title">AIATS智能Web系统</h1>
      <el-form ref="registForm" :model="formInline" :rules="ruleInline">
        <el-form-item class="login-input" prop="LoginID">
          <el-input ref="username" class="login-input-inset" v-model="formInline.LoginID" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" ref="password" v-model="formInline.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input type="password" ref="repassword" v-model="formInline.repassword" placeholder="请再输入密码"></el-input>
        </el-form-item>
        <el-form-item class="login-button">         
           <el-button @click="regist" type="primary">注册</el-button>    
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
  name:'regist',
  data() {
    let vRepass = (rule, value, callback, source, options)=>{
      if(value !== this.formInline.password){
          callback(new Error('两次输入的密码不一致'));
      }else{
          callback();
      }     
    }
    return {
      formInline: {
        LoginID: "",
        password: "",
        repassword:''
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
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            type: "string",
            min: 4,
            message: "密码长度不能小于4位",
            trigger: "blur",
            max: 24
          }
        ],
        repassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            type: "string",
            min: 4,
            message: "密码长度不能小于4位",
            trigger: "blur",
            max: 24
          },
          {validator:vRepass,trigger:'blur'}
        ]
      },
      reqUrl: {
        login: "/common/login/goto",
        getToken: "/common/login/gocheck",
        getCode: "/common/login/geetest"
      }
    };
  },
  created() {},
  methods: {
    regist() {
      console.log('1111')
      this.$refs.registForm.validate((valid)=>{
        if(valid){         
          this.registAjax();
        }
      })      
    },
    registAjax(){
      this.$post({
        url:REQUEST_PATH+'common/register',
        data:{
          userName:this.formInline.LoginID,
          password:this.formInline.password
        },
        success:(res)=>{
          this.$router.push('/')
        }
      })
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
  margin-top: -150px;
  top: 380px;
  left: 50%;
  margin-left: -190px;
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