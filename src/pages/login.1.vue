<template>
  <div class="login-container" ref="login">
    <div class="login">
      <h1 class="login-title">aiats智能web系统</h1>
      <el-form ref="formInline" :model="formInline" :rules="ruleInline">
        <el-form-item class="login-input">
          <el-input ref="username" class="login-input-inset" v-model="formInline.LoginID" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" ref="password" v-model="formInline.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="login-button">
          <el-button @click="handleSubmit('formline')" type="primary" id="login">{{loginTxt}}</el-button>
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
  data() {
    return {
      formInline: {
        token: "",
        LoginID: "",
        password: "",
        captcha: "",
        Plat: "newcity",
        CType: "geetest",
        action: "vuex-2017"
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
      }
    };
  },
  created() {},
  activated() {},
  mounted() {
    this.getAuthToken();
  },
  methods: {
    // enter登录
    enterLogin() {
      document.onkeydown = function(e) {
        e = e || window.event;
        let keyCode = e.keyCode || e.witch;
        if (keyCode === 13) {
          document.getElementById("login").onclick();
        }
      };
    },
    handleSubmit(name) {
      /// 提交登录
      let url;
      this.loginTxt = "登陆中...";
      if (Util.product) url = this.reqUrl.login + "?type=getuser";
      else url = this.reqUrl.login + encodeURIComponent("?type=getuser");
      Util.post({
        url: url,
        data: this.formInline,
        success: res => {
          if (res.data.Success) {
            Util.session("logined", true);
            Util.session("token", this.formInline.token);
            Util.session("userinfo", res.data.Data);
            this.$http
              .post(
                "http://192.168.6.108:3001/common/checkLogin",
                {
                  token: Util.session("token")
                },
                { withCredentials: true }
              )
              .then(res => {
                if (res.data.Success) {
                  let loginInfo = res.data;
                  this.$router.push("/main/activitylist");
                  this.$message.success(res.data.Message);
                }
              })
              .catch(function(err) {});
          } else {
            this.$Message.error(res.data.Message);
            this.loginTxt = "登录";
          }
        }
      });
    },
    // 第一步请求登录授权码，授权成功直接请求验证码
    getAuthToken() {
      let that = this;
      Util.post({
        url: this.reqUrl.getToken,
        data: { token: "" },
        method: "get",
        success: res => {
          if (res.data.Success) {
            that.formInline.token = res.data.Data;
            Util.session("token", res.data.Data);
            // 授权成功直接请求验证码
            that.getAuthCode();
          } else {
            that.$Message.error(res.data.Message);
          }
        },
        error: error => {
          console.log(error.response);
        }
      });
    },
    // 第二步请求登录验证码
    getAuthCode(fn) {
      let that = this;
      Util.post({
        url: this.reqUrl.getCode,
        data: {
          token: that.formInline.token
        },
        success: res => {
          var rdata = JSON.parse(res.data);
          initGeetest(
            {
              // 省略配置参数
              gt: rdata.gt,
              challenge: rdata.challenge,
              offline: rdata.success,
              new_captcha: rdata.new_captcha,
              width: "380px",
              product: "bind"
            },
            function(captchaObj) {
              // 现在可以调用验证实例 captchaObj 的方法了
              that.$nextTick(() => {
                let ele = document.getElementById("login");
                that.$refs.username.focus();
                ele.onclick = function() {
                  let login = that.$refs.username.$el.children[0].value;
                  let pass = that.$refs.password.$el.children[0].value;
                  if (that.formInline.LoginID === "") {
                    if (login !== "" && login) that.formInline.LoginID = login;
                  }
                  if (that.formInline.password === "") {
                    if (pass !== "" && pass) that.formInline.password = pass;
                  }
                  if (that.formInline.LoginID === "") {
                    that.$Message.error({
                      content: "请先输入账号",
                      duration: 3
                    });
                    return;
                  }
                  if (that.formInline.password === "") {
                    tha.$Message.error({
                      content: "请先输入密码",
                      duration: 3
                    });
                    return;
                  }
                  captchaObj.verify();
                };
                that.enterLogin();
              });
              captchaObj.onSuccess(function() {
                that.formInline.captcha = rdata.challenge;
                that.handleSubmit("formline");
              });
            }
          );
        },
        error: error => {
          console.log(error);
        }
      });
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