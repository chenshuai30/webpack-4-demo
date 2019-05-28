<template>
    <div>
        <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="使用平台" prop="usePlat">
                        <el-select @change="changeUsePlat" v-model="form.usePlat" placeholder="请选择">
                            <el-option v-if="supportWx === 1" label="微信端" :value="1"></el-option>
                            <el-option label="App端" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="使用对象" prop="usePerson">
                        <el-select @change="changeUserType" v-model="form.usePerson" placeholder="请选择">
                            <el-option label="用户" :value="1"></el-option>
                            <el-option v-if="form.usePlat == 2" label="跑男" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="对象分类" prop="personType">
                        <el-select @change="changePersonType" :disabled="useritemList.length<=0" v-model="form.personType" placeholder="请选择">
                            <el-option v-for="item,index in useritemList" :key="item.id" :label="item.useName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="业务类型" prop="business">
                        <el-select :disabled="disBusiness" v-model="form.business" placeholder="请选择">
                            <el-option v-for="item,index in businessList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col v-if="form.personType != 15" :span="12">
                    <el-form-item label="累计规则" prop="rule">
                        <el-radio-group size="mini" v-model="form.rule">
                            <el-radio-button :label="0">每天累计</el-radio-button>
                            <el-radio-button :label="1">活动期内累计</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="限用城市" prop="limitCity">
                        <el-select multiple collapse-tags @change="changeCity" style="width:260px;" v-model="form.limitCity" filterable placeholder="请选择">
                            <el-option :disabled="item.Id !== 0 && disCity" :label="item.CityName" v-for="item,index in cityList" :key="index" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="达成条件" prop="singleNum">
                        <el-input :readonly="rewardProDis" v-model="form.singleNum" placeholder="条件">
                            <template slot="append">{{singleNumTxt}}</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="抽奖次数" prop="rewardNum">
                        <el-input :readonly="rewardNumDis" v-model="form.rewardNum" placeholder="次数">
                            <template slot="append">次</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="showRewardLimit">
                    <el-form-item label="上限" label-width="60px" prop="rewardLimit">
                        <el-input :readonly="rewardProDis" v-model="form.rewardLimit" placeholder="上限">
                            <template slot="append">次</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="是否启用引导链接" label-width="140px" :show-message="form.isOpen" prop="jumpUrl">
                        <el-switch v-model="form.isOpen" @change="changePopOpen" active-color="#13ce66" inactive-color="#ff4949" active-text="开" inactive-text="关">
                        </el-switch>
                        <el-input v-show="form.isOpen" v-model="form.jumpUrl" style="width:300px;margin-left:10px;" placeholder="请填写链接地址"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
export default {
  name: "basicrule",
  props: {
    data: {
      type: Object,
      default: {
        limitCity: [],
        usePlat: 2,
        usePerson: 2,
        personType: null,
        rule: 0,
        singleNum: "",
        rewardNum: "1",
        rewardLimit: "",
        business: "",
        isOpen: false,
        jumpUrl: ""
      }
    },
    supportWx: {
      type: Number,
      default: 1
    }
  },
  watch: {
    data: {
      handler: function(cur, old) {
        this.form = cur;
      },
      deep: true
    }
  },
  computed:{
    singleNumTxt(){
      return this.form.personType == 15 ? '积分':'个';
    },
    showRewardLimit(){
      return this.form.personType != 15
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
    let minV = (rule, value, callback, source, options) => {
      if (value < 1) {
        callback(new Error("条件次数最小为1"));
      } else {
        callback();
      }
    };
    let jumpV = (rule, value, callback, source, options) => {
      if (this.form.isOpen) {
        if (!value) {
          callback(new Error("输入内容不能为空"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      form: {},
      formRules: {
        limitCity: [
          {
            required: true,
            // type: "number",
            message: "请选择使城市",
            trigger: "change"
          }
        ],
        usePlat: [
          {
            required: true,
            type: "number",
            message: "请选择平台",
            trigger: "change"
          }
        ],
        usePerson: [
          {
            required: true,
            type: "number",
            message: "请选择使用对象",
            trigger: "change"
          }
        ],
        personType: [
          {
            required: true,
            type: "number",
            message: "请选择类别",
            trigger: "change"
          }
        ],
        business: [
          {
            required: true,
            type: "number",
            message: "请选择业务类型",
            trigger: "change"
          }
        ],
        rule: [
          {
            required: true,
            type: "number",
            message: "请选择规则",
            trigger: "change"
          }
        ],
        rewardNum: [
          { required: true, message: "请填写次数", trigger: "blur" },
          { validator: numV, trigger: "blur" },
          { validator: minV, trigger: "blur" }
        ],
        singleNum: [
          { required: true, message: "请填写个数", trigger: "blur" },
          { validator: numV, trigger: "blur" },
          { validator: minV, trigger: "blur" }
        ],
        rewardLimit: [
          { required: true, message: "请填写限制", trigger: "blur" },
          { validator: numV, trigger: "blur" }
        ],
        jumpUrl: [{ validator: jumpV, trigger: "blur" }]
      },
      disBusiness: true,
      useritemList: [],
      userTypeList: [],
      runmanTypeList: [],
      businessList: [
        { name: "全部", id: -1 },
        { name: "帮我送", id: 0 },
        { name: "帮我买", id: 1 },
        { name: "电车奔奔", id: 2 },
        { name: "帮我取", id: 3 },
        { name: "代排队", id: 4 },
        { name: "就近买", id: 5 },
        { name: "计时帮帮", id: 6 },
        { name: "非计时帮帮", id: 7 },
        { name: "车服务", id: 8 },
        { name: "帮我找", id: 9 },
        { name: "自定义帮帮", id: 10 },
        { name: "OFFICE专送", id: 11 },
        { name: "OFFICE专取", id: 12 },
        { name: "U种兵帮我送", id: 13 },
        { name: "U种兵帮我取", id: 14 },
        { name: "拍照帮我送", id: 15 },
        { name: "疯猴子订单", id: 16 }
      ],
      cityList: [],
      disCity: false,
      // 配置2的form数据
      rewardNumDis: true,
      rewardProDis: false
    };
  },
  created() {
    this.form = this.data;
    // 获取用户、跑男下的分类
    this.getUserType(1, "userTypeList");
    this.getUserType(2, "runmanTypeList");
    // 获取城市
    this.getCityList();
  },
  methods: {
    validate() {
      let flag = false;
      this.$refs.form.validate(valid => {
        flag = valid;
      });
      return flag;
    },
    changeUsePlat(val) {
      this.form.usePerson = "";
      this.form.personType = "";
      this.form.business = "";
      this.disBusiness = false;
    },
    // '对象分类'切换事件
    changePersonType(val) {
      switch (val) {
        case 2:
        case 3:
        case 6:
        case 7:
        case 11: {
          this.form.business = null;
          this.disBusiness = false;
          this.rewardProDis = false;
          this.rewardNumDis = true;
          this.form.singleNum = "";
          this.form.rewardLimit = "";
          this.form.rewardNum = 1;
          break;
        }
        case 13:
        case 14: {
          this.form.business = -1;
          this.disBusiness = true;
          this.rewardProDis = true;
          this.rewardNumDis = false;
          this.form.singleNum = 1;
          this.form.rewardLimit = 1;
          this.form.rewardNum = "";
          break;
        }
        default: {
          this.form.business = -1;
          this.disBusiness = true;
          this.rewardProDis = false;
          this.rewardNumDis = true;
          this.form.singleNum = "";
          this.form.rewardLimit = "";
          this.form.rewardNum = 1;
        }
      }
    },
    changeUserType(val) {
      this.form.personType = "";
      this.form.business = "";
      this.disBusiness = false;
      if (val == 1) {
        this.useritemList = this.userTypeList;
      } else {
        this.useritemList = this.runmanTypeList;
      }
      this.$emit("changeUser", val);
    },
    // 获取对象分类
    getUserType(type, name) {
      this.$post({
        url: REQUEST_PATH + "activity/getUseType",
        data: { useType: type },
        success: res => {
          this[name] = res.data.data;
          // 暂时处理
          this.useritemList = this.runmanTypeList;
        }
      });
    },
    getCityList() {
      this.$post({
        url: REQUEST_PATH + "common/getCity",
        data: {},
        success: res => {
          this.cityList = res.data.data;
        }
      });
    },
    changeCity(arr) {
      if (arr.indexOf(0) >= 0) {
        this.disCity = true;
        if (arr.length > 1) {
          this.form.limitCity = [0];
        }
      } else {
        this.disCity = false;
      }
    },
    changePopOpen(flag) {
      if (!flag) {
        this.form.jumpUrl = "";
      }
    }
  }
};
</script>

<style scoped>
</style>