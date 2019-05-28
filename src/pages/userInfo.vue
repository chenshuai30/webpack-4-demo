<template>
    <div id="aia-userinfo">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="aia-user-form">
            <el-form-item label="登录账号" prop="userName">
                <el-input v-model="form.userName" placeholder="请输入账号"></el-input>
            </el-form-item>
             <el-form-item label="登录密码" prop="password">
                <el-input v-model="form.password"  placeholder="请输入密码"></el-input>
            </el-form-item>
             <el-form-item label="确认密码" prop="repassword">
                <el-input v-model="form.repassword"  placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="saveuser" size="small">保存</el-button>
                <el-button @click="back" size="small">取消</el-button>
            </el-form-item>
            </el-form>
    </div>
</template>
<script>
export default {
    name:'userInfo',
    data(){
        let vRepass = (rule, value, callback, source, options)=>{
            if(value !== this.form.password){
                callback(new Error('两次输入的密码不一致'));
            }else{
                callback();
            }
        }
        let pass = (rule, value, callback, source, options)=>{
            let regExp=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,25}$/;
            if(!regExp.test(value)){
                callback(new Error('格式错误，密码由6-25位的字母和数字组成'));
            }else{
                callback()
            }
        }
        return{
            form:{
                userName:'',
                password:'',
                repassword:'',
            },
            rules:{
                userName: [
                    { required: true, message: "请填写用户名", trigger: "blur" },
                    { type: "string", min: 2, message: "账号长度不能小于2位", trigger: "blur", max: 25 }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { validator:pass, trigger:'blur'}
                ],
                repassword: [
                    { required: true, message: "请再次输入密码", trigger: "blur" },
                    { validator:vRepass, trigger:'blur'}
                ]
            },
            username:'',
        }
    },
    created(){
        this.username = sessionStorage.getItem('uname');
        this.form.userName = this.username;
    },
    methods:{
        back(){
            this.$router.back();
        },
        saveuser(){
            this.$refs.form.validate((valid)=>{
                if(valid){
                    this.$post({
                        url:REQUEST_PATH+'common/editUser',
                        data:{
                            id:sessionStorage.getItem('unum'),
                            userName:this.form.userName,
                            password:this.form.password,
                        },
                        success:(res)=>{
                            this.$message.success('账户修改成功,请重新登录!')
                            this.$router.push('/')
                        }
                    })
                }
            })
        }
    }
}    
</script>
<style scoped lang="less" rel="stylesheet/less">
    #aia-userinfo{
        padding-top:200px;
        .aia-user-form{
            width:500px;
            margin:0 auto;
        }
    }
</style>
