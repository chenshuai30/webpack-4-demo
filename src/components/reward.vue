<template>
  <div class="uureward">
    <el-form ref="reward" :model="form" label-width="80px" :rules="stepTwoRule">
      <el-row>
        <el-col :span="12">
          <el-form-item label="奖品属性" prop="attrs">
            <el-select @change="changeAttrs" v-model="form.attrs" placeholder="请选择">
              <el-option v-for="item,index in rewardArr" :key="index" :label="item.attrName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.attrs != 4" label="奖品名称" prop="name">
            <el-input v-model="form.name" style="width:200px" :maxlength="15" placeholder="请输入名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="form.attrs !== 4" :span="12">
          <el-form-item label="奖品数量" prop="num">
            <el-input v-model="form.num" style="width:200px" placeholder="请输入数量"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="showProportion">
          <el-form-item label="奖品概率" prop="proportion">
            <el-input placeholder="概率" :maxlength="3" v-model="form.proportion" style="width:120px">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="showQues && form.attrs!=4">
          <el-form-item label="通过条件" prop="condition" label-width="80px">
              <span style="margin-right:10px;">答对 ≥</span>
              <el-input placeholder="请输入数目" style="width:100px;" v-model="form.condition"> </el-input>
              <span style="margin-left:10px;">道题</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="form.attrs == 1" label="优惠券码" prop="coupon">
        <el-input v-model="form.coupon" style="width:200px" placeholder="请输入编码"></el-input>
      </el-form-item>
      <el-form-item v-if="form.attrs == 2" label="U币金额" prop="uucoin">
        <el-input v-model="form.uucoin" style="width:200px" placeholder="请输入U币金额"></el-input>
      </el-form-item>
      <el-form-item v-if="form.attrs == 3" label="账户金额" prop="account">
        <el-input v-model="form.account" style="width:200px" placeholder="请输入余额"></el-input>
      </el-form-item>
      <el-form-item v-if="form.attrs == 5" label="红包金额" prop="redbag">
        <el-input v-model="form.redbag" style="width:200px" placeholder="请输入金额"></el-input>
      </el-form-item>
      <el-form-item v-if="form.attrs == 6" label="道具编码" prop="card">
        <el-input v-model="form.card" style="width:200px" placeholder="请输入翻倍卡编码"></el-input>
      </el-form-item>
      <el-form-item v-if="form.attrs == 7" label="积分数量" prop="score">
        <el-input v-model="form.score" style="width:200px" placeholder="请输入积分数量" :maxlength="20"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="奖品图片" prop="icon">
            <slot name="rewards"></slot>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="奖品说明" prop="desc">
            <el-input type="textarea" palceholder="请填写说明" :maxlength="50" style="width:520px" v-model="form.desc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <span v-if="form.attrs == 5" style="font-size:13px;color:#f56c6c;line-height:40px;">* 红包需要该城市开启"用户红包"功能</span>
      <span v-if="form.attrs == 6" style="font-size:13px;color:#f56c6c;line-height:40px;">* 需要该城市开启"跑男卡包"功能</span>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "uureward",
  props: {
    data: {
      type: Object,
      default: {
        attr: ""
      }
    },
    rewardList: {
      type: Array,
      default: []
    },
    sort: {
      type: Number,
      default: 0
    },
    showProportion:{
      type:Boolean,
      default:true
    },
    showQues:{
      type:Boolean,
      default:false
    },
    quesLen:{
      type:Number,
      default:0
    }
  },
  watch: {
    data: {
      handler: function(cur, old) {    
        this.form = cur;
      },
      deep: true
    },
    rewardList: {
      handler: function(cur, old) {
        this.rewardArr = cur;
      },
      deep: true
    }
  },
  data() {
    let numV = (rule, value, callback, source, options) => {
      let reg = /^(\d+)$/gi;
      if (!reg.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    let formateV = (rule, value, callback, source, options) => {
      let reg = new RegExp(
        /[(\#)(\$)(\^)(\&)(\*)(\()(\))(\_)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\/)(\<)(\>)(\\)]+/
      );
      if (reg.test(value)) {
        callback(new Error("输入内容不能包含特殊字符,如 ' \""));
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
    const validMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写金额'));
      }
      let ex = /^([1-9][\d]+|[\d])(\.[\d]{1,2})?$/;
      if (ex.test(value) && Number(value)) {
        callback();
      } else {
        callback(new Error('金额最多保留两位小数'));
      }
    }
    return {
      form: {},
      stepTwoRule: {
        attrs: [
          {
            required: "true",
            type: "number",
            message: "奖品属性",
            trigger: "change"
          }
        ],
        name: [
          { required: "true", message: "请填写奖品名称", trigger: "blur" },
          { validator: formateV, trigger: "blur" }
        ],
        num: [
          { required: "true", message: "请填写奖品数量", trigger: "blur" },
          { validator: numV, trigger: "blur" }
        ],
        coupon: [
          { required: "true", message: "请填写优惠券码", trigger: "blur" },
          { validator: numV, trigger: "blur" }
        ],
        uucoin: [
          { required: "true", message: "请填写U币金额", trigger: "blur" },
          { validator: numV, trigger: "blur" }
        ],
        score: [
          { required: "true", message: "请填写积分数量", trigger: "blur" },
          { validator: numV, trigger: "blur" }
        ],
        redbag: [
          { required: "true", message: "请填写红包金额", trigger: "blur" },
          { validator: validMoney, trigger: "blur" }
        ],
        card: [
          { required: "true", message: "请填写道具编码", trigger: "blur" },
          { validator: numV, trigger: "blur" }
        ],
        account: [
          { required: "true", message: "请填写账户金额", trigger: "blur" },
          { validator: validMoney, trigger: "blur" }
        ],
        icon: [{ required: "true", message: "请上传图片", trigger: "blur" }],
        proportion: [
          { required: "true", message: "请填写概率", trigger: "blur" },
          { validator: numV, trigger: "blur" }
        ],
        desc: [
          { required: "true", message: "请填写奖品说明", trigger: "blur" },
          { validator: formateV, trigger: "blur" }
        ],
        condition: [
          { required: "true", message: "请填写题目数", trigger: "blur" },
          { validator: numV, trigger: "blur" },
          { validator: maxV, trigger: "blur" }
        ]
      },
      rewardArr:[]
    };
  },
  created() {
    this.form = this.data;
    this.rewardArr = this.rewardList;
  },
  methods: {
    changeAttrs(val) {
      this.$emit("changeAttr", this.sort,val);      
      if(this.form.attrs == 4){
        this.form.desc = '谢谢参与'
      }else{
        this.form.desc = ''
      }
      
    },
    setIcon(url) {
      this.form.icon = url;
    },
    validate() {
      let flag = false;
      this.$refs.reward.validate(valid => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
    resetFields() {
      this.$refs.reward.resetFields();
    }
  }
};
</script>

<style scoped>
</style>