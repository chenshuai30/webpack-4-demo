<template>
  <div class="ques-reward">
    <!-- 考试 -->
    <template v-if="quesType == 2">
      <examereward ref="exameReward" :quesLen="quesLen"></examereward>
    </template>
    <!-- 表单 -->
    <template v-else-if="quesType == 3 || quesType == 1">
      <siginupreward ref="siginReward" :quesType="quesType" :quesLen="quesLen" :rewardList="rewardList"></siginupreward>
    </template>
    <!-- 问卷答题 -->
    <template v-else>
      <el-tabs ref="quesTab" v-model="accordionActiveName" type="card" @tab-remove="removePrizeTab" @tab-click="clickTab">
        <el-tab-pane :closable="index === 0 ? false : true" :label="'奖品' + (index+1)" v-for="item,index in stepTwoList" :key="item.id" :name="''+item.id">
          <uureward :showProportion="false" :showQues="true" :quesLen="quesLen" :ref="item.ref" @changeAttr="changeAttrs" :data="item.form" :rewardList="rewardList" :sort="index">
            <rewarddialog slot="rewards" :ref="'materials'+index" @imgUrl="(url)=>{rewardChange(url,item,index);}" btnType="default" />
          </uureward>
        </el-tab-pane>
      </el-tabs>
      <div style="position: absolute;right: 30px;bottom: 30px;">
        <el-button size="small" style="margin-left:10px;" @click="addNewPrize">新增奖品
          <i class="el-icon-plus"></i>
        </el-button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "hasReward",
  props: {
    quesType: {
      default: ''
    },
    quesLen: {
      default: 0
    },
    rewardList: {
      default: []
    }
  },
  data() {
    return {
      accordionActiveName: 0,
      tabIndex: 1,
      stepTwoList: [
        {
          title: "奖品1",
          id: 0,
          ref: "reward0",
          proportion: "",
          form: { attrs: null, proportion: 0 ,desc:"",icon:''},
          fileList: [],
          uploadRef: "upload0",
          isupload: false
        }
      ]
    };
  },
  watch: {
    quesType(cur, old) {
      if (cur == 0 && old == 1) {
        this.accordionActiveName = "0";
        this.stepTwoList = [];
        this.stepTwoList.push({
          title: "奖品1",
          id: 0,
          ref: "reward0",
          proportion: "",
          form: { attrs: null, proportion: 0 ,desc:"",icon:''},
          fileList: [],
          uploadRef: "upload0",
          isupload: false
        });          
      }
    }
  },
  methods: {
    resetFields() {
      if (this.quesType == 3 || this.quesType == 1) {
        this.$refs.siginReward.resetFields();
      } else if (this.quesType == 0) {
        this.stepTwoList.map((item, index) => {
          if (
            item.form.attrs != 4 &&
            item.form.attrs != 3 &&
            item.form.attrs != 99
          ) {
            this.$refs[item.ref][0].resetFields();
          }
        });
      }
    },
    getData() {
      let obj = {};
      if (this.quesType == 2) {
        // 考试
        obj = this.$refs.exameReward.getData();
      } else if (this.quesType == 3 || this.quesType == 1) {
        // 表单
        obj = this.$refs.siginReward.getData();
      } else {
        let rewardsList = [];
        this.stepTwoList.map((item, index) => {
          rewardsList[index] = {};
          let data = item.form;
          let val = {
            attrs: data.attrs || "",
            name: encodeURIComponent(data.name || ""),
            num: encodeURIComponent(data.num || ""),
            // maxnum:data.maxnum || '',
            coupon:
              data.coupon ||
              data.uucoin ||
              data.account ||
              data.redbag ||
              data.card ||
              data.score ||
              "",
            icon: data.icon || "",
            desc: encodeURIComponent(this.$util.copyFilter(data.desc) || ""),
            proportion: data.proportion || data.condition || "",
            code: index
          };
          rewardsList[index].searchform = val;
        });
        obj = {
          questionType: this.quesType,
          isHasRewards: this.stepTwoList.length > 1 ? 1 : 0,
          nullReward: {},
          haveReward: {},
          rewardsList: rewardsList
        };
      }
      return obj;
    },
    validReward() {
      console.log("验证奖品");
      let flag = false;
      if (this.quesType == 2) {
        // 考试
        flag = this.$refs.exameReward.validate();
        this.alertMsg(flag);
      } else if (this.quesType == 3 || this.quesType == 1) {
        // 表单
        flag = this.$refs.siginReward.validate();
        this.alertMsg(flag);
      } else {
        // 问卷答题
        // 奖品数量不能大于10个
        if (this.stepTwoList.length > 10) {
          this.$message.warning("奖品数量不能多于10个");
          flag = false;
        } else {
          let endFlag = this.stepTwoList.every(item => {
            return this.$refs[item.ref][0].validate();
          });
          if (endFlag) {
            //  至少有一个空奖
            let oneNullPrizeFlag = false;
            oneNullPrizeFlag = this.stepTwoList.some(item => {
              return item.form.attrs === 4;
            });
            if (!oneNullPrizeFlag) {
              this.$message.warning("至少有一个空奖品");
            }
            flag = oneNullPrizeFlag;
          } else {
            flag = false;
            this.alertMsg(false);
          }
        }
      }
      return flag;
    },
    alertMsg(flag) {
      if (!flag) {
        this.$message.warning("请完善奖品数据!");
      }
    },
    clickTab(tab, event) {
      console.log(tab);
      this.accordionActiveName = tab.name;
    },
    // 新增奖品
    addNewPrize() {
      // console.log('新增奖品...');
      let maxId = ++this.tabIndex + "";
      let obj = {
        title: "奖品" + maxId,
        id: maxId,
        ref: "reward" + maxId,
        proportion: "",
        form: { attrs: null, proportion: 0,desc:'',icon:'' },
        fileList: [],
        uploadRef: "upload" + maxId,
        isupload: false
      };
      this.stepTwoList.push(obj);
      this.accordionActiveName = "" + maxId;
    },
    removePrizeTab(targetName) {
      let tabs = this.stepTwoList;
      let activeName = this.accordionActiveName;
      let curIndex = null;
      let newArr = [];
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          let atName = tab.id + "";
          if (atName === targetName) {
            curIndex = index;
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.id + "";
            }
          }
        });
      }
      this.accordionActiveName = activeName;
      this.stepTwoList = tabs.filter(tab => tab.id + "" !== targetName);
    },
    rewardChange(url, item, index) {
      // item.form.icon = url;
      this.$delete(item.form,'icon');
      this.$set(item.form,'icon',url);
    },
    changeAttrs(index, val) {
      if (val == 4) {
        this.$refs["materials" + index][0].choiceCurAudio({
          colorId: 7,
          colorName: "黄色",
          id: 96,
          materialName: "空奖4",
          materialUrl:
            "http://uufe-web.oss-cn-beijing.aliyuncs.com/atsweb/artlib/1517302739062.png",
          typeId: 11,
          typeName: "空奖"          
        });
      } else {
        this.$refs["materials" + index][0].delCurAudio();
      }
    }
  }
};
</script>

<style lang="less"  rel="stylesheet/scss"  scoped>
</style>