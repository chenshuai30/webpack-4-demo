<template>
    <div>
        <h4>考试设置</h4>
        <div type="card">
            <el-form ref="exameRewardForm" :model="rewardForm" size="small" :rules="rewardFormRule" label-width="80px" style="width:650px;padding-left:10px;">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="通过条件" prop="condition" label-width="80px">
                            <span style="margin-right:10px;">答对 ≥</span>
                            <el-input placeholder="请输入内容" style="width:100px;" v-model="rewardForm.condition"> </el-input>
                            <span style="margin-left:10px;">道题</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="题目数目">
                            <span>{{quesLen}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: "exameReward",
  props: {   
    quesLen: {
      default: 0
    }  
  },
  data() {
    let numV = (rule, value, callback, source, options) => {
      let reg = /^(\d+)$/gi;
      if (!reg.test(value)) {
        callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    };
    let maxV = (rule, value, callback, source, options) => {
      if (parseInt(value) > this.quesLen) {
        callback(new Error("数量必须小于题目数目"));
      } else {
        callback();
      }
    };   
    return {
      rewardForm: {
        condition: "",
        attrs: 20,
        num: "",
        name: "",
        uucoin: "",
        account: "",
        desc: "",
        icon: "",
        redbag: "",
        card: "",
        score: "",
        coupon:"",
        proportion:""
      },
      rewardFormRule: {
        condition: [
          { required: "true", message: "请填写题目数", trigger: "blur" },
          { validator: numV, trigger: "blur" },
          { validator: maxV, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    validate(){
      let flag = false;
      this.$refs.exameRewardForm.validate(valid=>{
        flag  = valid;
      });      
      return flag;
    },
    getData(){
      this.rewardForm.proportion = this.rewardForm.condition;
      let obj = {
        questionType:2,
        isHasRewards:1,
        nullReward: {
          name: "空",
          desc: "空奖",
          icon:"http://uufe-web.oss-cn-beijing.aliyuncs.com/atsweb/artlib/1517302739062.png",
          proportion: 0,
          attrs: 4,
          num: 0,
          coupon:''
        },
        haveReward: this.rewardForm,
        rewardsList:[]
      }
      return obj;
    }
  }
};
</script>

<style lang="less"  rel="stylesheet/scss"  scoped>
</style>