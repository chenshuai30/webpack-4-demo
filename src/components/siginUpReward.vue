<template>
    <div>
        <h4>奖品设置</h4>
        <div style="padding-bottom:20px;padding-top:10px;">
            <span style="font-size:12px;padding-right:5px;">是否有奖励</span>
            <el-switch @change="handleHasRewards" active-text="无" inactive-text="有" v-model="hasRewards" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </div>
        <ul class="ques-reward-btns">
            <li v-if="hasRewards===0" :class="{actived:(rewardActiveName=='first')}" @click="rewardActiveName='first'">无奖</li>
            <li v-if="hasRewards===1" :class="{actived:(rewardActiveName=='second'),lasQuesChild:true}" @click="rewardActiveName='second'">有奖</li>
        </ul>
        <div type="card">
            <div v-if="hasRewards===1" v-show="rewardActiveName == 'second'" label="有奖" name="second">
                <!-- 实物 -->
                <el-form ref="rewardForm" :model="rewardForm" size="small" :rules="rewardFormRule" label-width="80px" style="width:650px;padding-left:10px;">
                    <el-row>
                        <el-col v-if="quesType == 0" :span="12">
                            <el-form-item label="奖励条件" prop="condition" label-width="80px">
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
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="奖品属性" prop="attrs" label-width="80px">
                                <el-select v-model="rewardForm.attrs" placeholder="请选择">
                                    <el-option v-if="val.id != 4" v-for="val,key in rewardList" :key="key" :label="val.attrName" :value="val.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="奖品数量" prop="num">
                                <el-input v-model="rewardForm.num" placeholder="请输入数量"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="奖品名称" prop="name">
                                <el-input v-model="rewardForm.name" placeholder="请输入名称" :maxlength="20" style="width:200px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="rewardForm.attrs == 2" :span="12">
                            <el-form-item label="U币金额" prop="uucoin">
                                <el-input v-model="rewardForm.uucoin" placeholder="请输入U币金额" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="rewardForm.attrs == 1" :span="12">
                            <el-form-item label="优惠券码" prop="coupon">
                                <el-input v-model="rewardForm.coupon" placeholder="请输入优惠券码" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="rewardForm.attrs == 3" :span="12">
                            <el-form-item label="账户金额" prop="account">
                                <el-input v-model="rewardForm.account" placeholder="请输入账户金额" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="rewardForm.attrs == 5" :span="12">
                            <el-form-item label="红包金额" prop="redbag">
                                <el-input v-model="rewardForm.redbag" placeholder="请输入金额" :maxlength="10"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="rewardForm.attrs == 6" :span="12">
                            <el-form-item label="道具编码" prop="card">
                                <el-input v-model="rewardForm.card" placeholder="请输入翻倍卡编码" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="rewardForm.attrs == 7" :span="12">
                            <el-form-item label="积分数量" prop="score">
                                <el-input v-model="rewardForm.score" placeholder="请输入积分数量" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="rewardForm.attrs == 99" :span="12">
                            <el-form-item label="奖励实物">
                                <span>1 个</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="奖品描述" prop="desc">
                        <el-input type="textarea" :rows="3" placeholder="请输入描述" :maxlength="30" v-model="rewardForm.desc"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="奖品图片" prop="icon">
                                <!-- 奖品弹框 -->
                                <rewarddialog ref="haveRewardImgDialog" v-show="!useRewardFormUpload" @imgUrl="(url)=>{rewardForm.icon=url;}" btnType="default" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div label="空奖" name="first">
                <el-form :model="rewardNullForm" ref="rewardNullForm" :rules="rewardFormRule" label-width="80px" style="padding-left:10px;">
                    <el-form-item label="空奖名称" prop="name">
                        <el-input v-model="rewardNullForm.name" placeholder="请输入名称" :maxlength="15" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="空奖描述" prop="desc">
                        <el-input type="textarea" :rows="3" placeholder="请输入描述" :maxlength="30" style="width:500px" v-model="rewardNullForm.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="空奖图片" prop="icon">
                        <!-- 奖品弹框 -->
                        <rewarddialog ref="nullRewardImgDialog" v-show="!useNullRewardUpload" @imgUrl="(url)=>{rewardNullForm.icon=url;}" btnType="default" />
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "siginUpReward",
  props: {
    quesType: {
      default: 2
    },
    quesLen: {
      default: 0
    },
    rewardList: {
      default: []
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
    let maxV = (rule, value, callback, source, options) => {
      // console.log('大小限制')
      if (parseInt(value) > this.quesLen) {
        callback(new Error("数量必须小于题目数目"));
      } else {
        callback();
      }
    };
    let formateV = (rule, value, callback, source, options) => {
      // let reg = new RegExp("[()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
      // (\ )、(\?)、(\+)、(\=)(\~)(\!)(\@)(\%)
      let reg = new RegExp(
        /[(\#)(\$)(\^)(\&)(\*)(\()(\))(\_)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\/)(\<)(\>)(\\)]+/
      );
      if (reg.test(value)) {
        callback(new Error("输入内容不能包含特殊字符,如 ' \""));
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
      hasRewards: 0,
      rewardActiveName: "first",
      rewardNullForm: {
        name: "",
        desc: "",
        icon:
          "http://uufe-web.oss-cn-beijing.aliyuncs.com/atsweb/artlib/1517302739062.png"
      },
      useNullRewardUpload: 0,
      useRewardFormUpload: 0,
      rewardForm: {
        condition: "",
        attrs: "",
        num: "",
        name: "",
        uucoin: "",
        coupon: "",
        account: "",
        desc: "",
        icon: "",
        redbag: "",
        card: "",
        score: ""
      },
      rewardFormRule: {
        condition: [
          { required: "true", message: "请填写题目数", trigger: "blur" },
          { validator: numV, trigger: "blur" },
          { validator: maxV, trigger: "blur" }
        ],
        attrs: [
          {
            required: "true",
            type: "number",
            message: "请选择奖品属性",
            trigger: "change"
          }
        ],
        num: [
          { required: "true", message: "请填写奖品数量", trigger: "blur" },
          { validator: numV, trigger: "blur" }
        ],
        name: [
          { required: "true", message: "请填写奖品名称", trigger: "blur" },
          { validator: formateV, trigger: "blur" }
        ],
        desc: [
          { required: "true", message: "请填写奖品说明", trigger: "blur" },
          { validator: formateV, trigger: "blur" }
        ],
        coupon: [
          { required: "true", message: "请填写优惠券码", trigger: "blur" },
          { validator: numV, trigger: "blur" }
        ],
        card: [
          { required: "true", message: "请填写翻倍卡编码", trigger: "blur" },
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
        account: [
          { required: "true", message: "请填写账户金额", trigger: "blur" },
          { validator: validMoney, trigger: "blur" }
        ],
        icon: [{ required: "true", message: "请上传图片", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.initNullImg();
  },
  methods: {
    getData() {
      let nullRewardFormData = {
        name: encodeURIComponent(this.rewardNullForm.name),
        desc: encodeURIComponent(
          this.$util.copyFilter(this.rewardNullForm.desc)
        ),
        icon: this.rewardNullForm.icon,
        proportion: 0,
        attrs: 4,
        num: 0,
        coupon:''
      };
      let rewardFormData = {
        proportion: this.rewardForm.condition,
        attrs: this.rewardForm.attrs,
        num: this.rewardForm.num,
        name: encodeURIComponent(this.rewardForm.name),
        coupon:
          this.rewardForm.uucoin ||
          this.rewardForm.coupon ||
          this.rewardForm.account ||
          this.rewardForm.redbag ||
          this.rewardForm.score ||
          "",
        desc: encodeURIComponent(this.rewardForm.desc),
        icon: this.rewardForm.icon
      };
      let obj = {
        questionType: 3,
        isHasRewards: this.hasRewards,
        nullReward: nullRewardFormData,
        haveReward: rewardFormData,
        rewardsList: []
      };
      return obj;
    },
    initNullImg() {
      this.$refs.nullRewardImgDialog.choiceCurAudio({
        colorId: 7,
        colorName: "黄色",
        id: 96,
        materialName: "空奖4",
        materialUrl:
          "http://uufe-web.oss-cn-beijing.aliyuncs.com/atsweb/artlib/1517302739062.png",
        typeId: 11,
        typeName: "空奖"
      });
    },
    handleHasRewards(val) {
      this.$nextTick(() => {
        this.$refs.rewardNullForm.resetFields();
        this.rewardNullForm.icon =
          "http://uufe-web.oss-cn-beijing.aliyuncs.com/atsweb/artlib/1517302739062.png";
        this.initNullImg();
        // this.$refs.nullRewardImgDialog.delCurAudio();
      });
      if (val === 0) {
        this.rewardActiveName = "first";
      } else {
        this.rewardActiveName = "second";
        this.$nextTick(() => {
          this.$refs.rewardForm.resetFields();
          this.rewardForm.icon = "";
          this.$refs.haveRewardImgDialog.delCurAudio();
        });
      }
    },
    validate() {
      let flag = false;
      if (this.hasRewards == 1) {
        // 有奖
        let nflag = false,
          rflag = false;
        this.$refs.rewardForm.validate(valid => {
          rflag = valid;
        });
        this.$refs.rewardNullForm.validate(valid => {
          nflag = valid;
        });
        flag = nflag && rflag;
      } else {
        // 空奖
        this.$refs.rewardNullForm.validate(valid => {
          flag = valid;
        });
      }
      return flag;
    },
    resetFields(){
        if(this.hasRewards == 1){
            if(this.rewardForm.attrs === 1 || this.rewardForm.attrs === 2){
                this.$refs.rewardForm.resetFields();
            }
        }       
    }
  }
};
</script>

<style lang="less"  rel="stylesheet/scss"  scoped>
.ques-reward-btns {
  margin-bottom: 20px;
  font-size: 0;
  width: 164px;
  > li {
    display: inline-block;
    border: 1px solid #e8e8e8;
    cursor: pointer;
    height: 35px;
    line-height: 35px;
    font-size: 13px;
    width: 80px;
    text-align: center;
    background: #fff;
    &.actived {
      color: #ff8b03;
    }
  }
}
</style>