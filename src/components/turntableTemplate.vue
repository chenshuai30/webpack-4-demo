<template>
  <!-- 新建活动 -->
  <div id='aia-newactivity'>
    <div class="aia-newa-head">
      <el-steps :active="activeStep" finish-status="success" process-status="success" simple style="font-size:13px;">
        <el-step v-for="item,index in stepList" :key="index" :title="item.title"></el-step>
      </el-steps>
    </div>
    <div class="aia-newa-main">
      <div class="aia-newa-main-body" style="position:relative;">
        <div class="flex">
          <div class="aia-main-body-left">
            <uuphone :tempname="tempname" :tempIfr="tempIfr" ref="uuphone" @loaded="handlePhoneLoad"></uuphone>
          </div>
          <div class="flex-1 aia-newa-main-right">
            <div class="aia-newa-configform">
              <!-- step 1 -->
              <div v-show="activeStepName === 'first'">
                <h4>基础设置</h4>
                <!-- 表单生成组件 -->
                <Setform :list="stepOneformList" ref="formStepOne" labelWidth="80px">
                </SetForm>

                <el-form ref="bgAudioForm" label-width="80px">
                  <el-form-item label="是否使用背景音乐" label-width="134px">
                    <el-switch active-text="关" inactive-text="开" v-model="useBgAudio" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                  </el-form-item>
                  <el-form-item v-if="useBgAudio" label="背景音乐">
                    <music @musicUrl="getMusicUrl" @del="delMusicUrl" />
                  </el-form-item>

                  <el-form-item v-if="basicUrl != 'http://aiats.mit.cn/'" label="选择服务端端口" label-width="134px">
                    <el-radio-group v-model="curServerPort">
                      <el-radio v-for="item,index in serverPortList" :key="index" :label="item.id">{{item.name}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </div>
              <!-- step 2 -->
              <div v-show="activeStepName === 'rule'">
                <div id="stepOneRule">
                  <h4>规则设置</h4>         
                  <basicrule ref="stepOneRuleForm" @changeUser="changeUserType" :supportWx="tempDetail.supportWx" :data="stepOneRuleForm"></basicrule>
                </div>
              </div>
              <!-- step 3 -->
              <div v-show="activeStepName === 'reward'">
                <el-tabs v-model="accordionActiveName">
                  <el-tab-pane :label="item.title + '('+item.form.proportion+'%)'" v-for="item,index in stepTwoList" :key="index" :name="''+item.id">                    
                    <uureward :ref="item.ref" @changeAttr="changeAttrs" :data="item.form" :rewardList="rewardList" :sort="index">
                      <rewarddialog slot="rewards" :haveInitialData="true" :ref="'materials'+index" @imgUrl="(url)=>{rewardChange(url,item,index);}" btnType="default" :initialAudioList="initialAudioList" :initialAudioTotal="initialAudioTotal" :initialAudioClasses="initialAudioClasses" :initialColorList="initialColorList" />
                    </uureward>
                  </el-tab-pane>
                </el-tabs>
                <div style="position: absolute;right: 30px;bottom: 30px;">
                  <span>奖品总概率：</span>
                  <el-input placeholder="请输入内容" :readonly="true" v-model="allProportion" style="width:130px">
                    <template slot="append">%</template>
                  </el-input>
                </div>
              </div>
              <!-- step 4 -->
              <div v-show="activeStepName === 'share'">
                <wxshare ref="wx"></wxshare>
              </div>
              <!-- step 5 -->
              <div v-show="activeStepName === 'end'">
                <laststep :loading="showLoading" :link="linkAddress"></laststep>
              </div>
            </div>
            <span class="aia-newa-arrow"></span>
          </div>
        </div>

        <div class="aia-newa-foot">
          <uufooter :nextTxt="nextStepText" :prev="prevStep" :next="nextStep" :preview="previewStep" :theme="nextStep" @prev="goPrev" @next="goNext" @preview="previewTemplate" @back="back" @theme="goTeme"></uufooter>
        </div>
      </div>
    </div>

    <!-- 主题 -->
    <skintheme :flag="skinListFlag" @change="skinChange" @set="skinSetOk" :list="skinList"></skintheme>
    <!-- 预览 -->
    <preview @close="closePreview" :flag="tempViewFlag" :templetName="tempDetail.templetName" :classifyName="tempDetail.classifyName" :ifrSrc="ifrSrc" :postData="tempPostData"></preview>
  </div>
</template>
        
<script>
import "@assets/js/jquery.qrcode.min.js";
import tt1 from "@assets/images/tt1.png";
export default {
  name: "turn",
  props: {
    tempData: {
      //当前id
      type: Object,
      default: () => {
        return {};
      }
    },
    isEdit: {
      //是否是编辑状态
      type: Boolean,
      default: () => {
        return false;
      }
    },
    tempDetail: {
      //是否是编辑状态
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    let dateV = (rule, value, callback, source, options) => {
      if (!value) {
        return;
      }
      let cur = new Date().getTime();
      let start = new Date(value[0]).getTime();
      let end = new Date(value[1]).getTime();
      if (start < cur) {
        callback(new Error("开始时间必须大于当前时间"));
      } else {
        if (end <= start) {
          callback(new Error("结束时间必须大于开始时间"));
        } else {
          callback();
        }
      }
    };
    let formateV = (rule, value, callback, source, options) => {
      // let reg = new RegExp("[()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");(\-)
      // (\ )、(\?)、(\~)(\!)(\@)(\%)
      let reg = new RegExp(
        /[(\#)(\$)(\^)(\&)(\*)(\()(\))(\_)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\/)(\<)(\>)(\\)]+/
      );
      if (reg.test(value)) {
        callback(new Error("输入内容不能包含特殊字符,如 ' \""));
      } else {
        callback();
      }
    };

    return {
      basicUrl: REQUEST_PATH,
      // 图标弹框icon
      initialAudioList: [],
      initialAudioTotal: 0,
      initialAudioClasses: [],
      initialColorList: [],
      // 皮肤弹框
      skinListFlag: false,
      // 当前配置页面
      activeStep: 0,
      // iframe加载控件
      ifrSrc: "",
      oldIfrSrc: "",
      tempname: "活动模板",
      useBgAudio: 0,
      bgAudio: "",
      // 配置1的form数据
      serverPortList: [
        { name: "62", id: 62 },
        { name: "63", id: 63 },
        { name: "test", id: "test" }
      ],
      curServerPort: 62,
      stepOneformList: [
        {
          type: "text",
          label: "活动名称",
          prop: "name",
          show: true,
          width: 400,
          value: "",
          show: true,
          haveRule: true,
          maxlength: 12,
          rule: [
            { required: "true", message: "请填写活动名称", trigger: "blur" },
            { validator: formateV, trigger: "blur" }
          ]
        },
        {
          type: "datetimerange",
          label: "活动时间",
          show: true,
          prop: "date",
          value: [],
          separator: "-",
          startPlaceholder: "开始日期",
          endPlaceholder: "结束日期",
          width: 400,
          haveRule: true,
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7;
            }
          },
          rule: [
            {
              required: "true",
              type: "array",
              message: "请选择日期",
              trigger: "change"
            },
            { validator: dateV, trigger: "blur" }
          ]
        },
        {
          type: "formeditor",
          label: "活动说明",
          prop: "desc",
          height: 150,
          zIndex: 1000,
          show: true,
          showModuleName: false,
          value: "",
          width: 400,
          haveRule: true,
          rule: [
            { required: "true", message: "请填写活动说明", trigger: "blur" }
            // { validator:formateV,trigger:'blur'}
          ]
        }
      ],      
      stepOneRuleForm: {
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
      },          
      appArr: [
        {
          name: "{$userid}",
          key: "userid",
          content: "用户ID",
          active: false
        },
        {
          name: "{$usertoken}",
          key: "usertoken",
          content: "用户Token",
          active: false
        },
        {
          name: "{$city}",
          key: "city",
          content: "定位城市",
          active: false
        },
        {
          name: "{$ordercity}",
          key: "ordercity",
          content: "订单城市",
          active: false
        },
        {
          name: "{$ver}",
          key: "ver",
          content: "版本号",
          active: false
        },
        {
          name: "{$ordercounty}",
          key: "ordercounty",
          content: "订单所在的区级行政级别",
          active: false
        }
      ],
      accordionActiveName: "0",
      rewardList: [],
      runmanRewardList: [],
      userRewardList: [],     
      stepTwoList: [
        {
          title: "奖品1",
          id: 0,
          ref: "reward1",
          proportion: "",
          form: { attrs: null, proportion: 0,desc:'',icon:'' },
          fileList: [],
          uploadRef: "upload1",
          isupload: false
        },
        {
          title: "奖品2",
          id: 1,
          ref: "reward2",
          proportion: "",
          form: { attrs: null, proportion: 0,desc:'',icon:'' },
          fileList: [],
          uploadRef: "upload2",
          isupload: false
        },
        {
          title: "奖品3",
          id: 2,
          ref: "reward3",
          proportion: "",
          form: { attrs: null, proportion: 0 ,desc:'',icon:''},
          fileList: [],
          uploadRef: "upload3",
          isupload: false
        },
        {
          title: "奖品4",
          id: 3,
          ref: "reward4",
          proportion: "",
          form: { attrs: null, proportion: 0,desc:'',icon:'' },
          fileList: [],
          uploadRef: "upload4",
          isupload: false
        },
        {
          title: "奖品5",
          id: 4,
          ref: "reward5",
          proportion: "",
          form: { attrs: null, proportion: 0,desc:'',icon:'' },
          fileList: [],
          uploadRef: "upload5",
          isupload: false
        },
        {
          title: "奖品6",
          id: 5,
          ref: "reward6",
          proportion: "",
          form: { attrs: null, proportion: 0 ,desc:'',icon:''},
          fileList: [],
          uploadRef: "upload6",
          isupload: false
        },
        {
          title: "奖品7",
          id: 6,
          ref: "reward7",
          proportion: "",
          form: { attrs: null, proportion: 0,desc:'',icon:'' },
          fileList: [],
          uploadRef: "upload7",
          isupload: false
        },
        {
          title: "奖品8",
          id: 7,
          ref: "reward8",
          proportion: "",
          form: { attrs: null, proportion: 0 ,desc:'',icon:''},
          fileList: [],
          uploadRef: "upload8",
          isupload: false
        }
      ],
      // 配置3 数据
      tableData: [
        {
          isreward: true,
          rewards: 0,
          rate: 10
        },
        {
          isreward: false,
          rewards: 1,
          rate: 15
        },
        {
          isreward: true,
          rewards: 0,
          rate: 5
        },
        {
          isreward: false,
          rewards: 1,
          rate: 3
        }
      ],
      allRate: "",

      // 配置4 数据，复制
      linkAddress: "https://www.uupt.com",

      // 皮肤列表
      skinList: [],
      skinModel: "",
      skinUrl: "",
      baseUrl: REQUEST_PATH,    
      firstSkin: false,
      showLoading: false,      
      popBtn: {
        isOpen: false,
        jumpUrl: ""
      },
      // 模板预览
      tempViewFlag: false,
      tempPostData: {},
      tempIfr: ""
    };
  },
  created() {
    this.baseUrl = REQUEST_PATH;
    this.allRate = 0;
    this.tableData.map(item => {
      this.allRate += parseInt(item.rate);
    });
    this.ifrSrc = this.tempDetail.htmlSrc;
    if (this.ifrSrc) {
      this.tempIfr = this.baseUrl + this.ifrSrc + "?activityId=0";
    }
  },
  watch: {
    tableData: {
      // 监听数据表格变化
      handler: function(cur, old) {
        this.allRate = 0;
        cur.map(item => {
          this.allRate += parseInt(item.rate);
        });
      },
      deep: true
    },
    stepOneformList: {
      // 监听数据表格变化
      handler: function(cur, old) {
        if (cur[0].value !== old[0].value) {
          this.testname = cur[0].value;
        }
      },
      deep: true
    },
    tempDetail: {
      handler: function(cur, old) {
        this.ifrSrc = this.tempDetail.htmlSrc;
        if (this.ifrSrc) {
          this.tempIfr = this.baseUrl + this.ifrSrc + "?activityId=0";
        }
      },
      deep: true
    }
  },
  computed: {
    allProportion: function() {
      let all = 0;
      for (let i in this.stepTwoList) {
        let item = this.stepTwoList[i];
        let proportion = parseInt(item.form.proportion);
        if (!isNaN(proportion)) {
          all += proportion;
        }
      }
      return all;
    },
    prevStep: function() {
      let len = this.stepList.length - 1;
      return this.activeStep !== 0 && this.activeStep != len;
    },
    nextStep: function() {
      let len = this.stepList.length - 1;
      return this.activeStep !== len;
    },
    nextStepText: function() {
      let len = this.stepList.length - 2;
      return this.activeStep == len ? "生成活动" : "下一步";
    },
    previewStep() {
      let len = this.stepList.length - 2;
      return this.activeStep == len;
    },
    showWxModel() {
      return this.stepOneRuleForm.usePlat !== 2;
    },
    stepList() {
      if (this.stepOneRuleForm.usePlat !== 2) {
        return [
          { title: "创建活动", name: "first" },
          { title: "活动规则", name: "rule" },
          { title: "奖品设置", name: "reward" },
          { title: "分享设置", name: "share" },
          { title: "完成", name: "end" }
        ];
      } else {
        return [
          { title: "创建活动", name: "first" },
          { title: "活动规则", name: "rule" },
          { title: "奖品设置", name: "reward" },
          { title: "完成", name: "end" }
        ];
      }
    },
    activeStepName() {
      return this.stepList[this.activeStep].name;
    }
  },
  mounted() {
    this.tempname = this.tempDetail.templetName;
  },
  methods: {
    // 模板加载完成事件
    handlePhoneLoad() {
      let that = this;
      setTimeout(function() {
        that.initData();
      }, 0);
    },
    initData() {    

      // 获取皮肤列表
      this.getSkinList();      

      // 获取用户和跑男奖品类型
      let r1 = this.getRewards(1, "userRewardList");
      let r2 = this.getRewards(2, "runmanRewardList");
      Promise.all([r1,r2]).then(result=>{
        result.map(item=>{
          if(item.name == 'runmanRewardList'){
            this.rewardList = item.data;
          }
        })
      }).catch((error) => {
        this.$message.warning('奖品获取失败，请刷新页面重试');
        console.log(error)
      });      

      // 获取奖品图片
      this.getMaterialList();
      this.getMaterialType();
      this.getColor();
    },
    getMusicUrl(url) {
      this.bgAudio = url;
    },
    delMusicUrl(url) {
      this.bgAudio = "";
    },
    // 获取图标弹框数据
    getMaterialList() {
      this.$post({
        url: REQUEST_PATH + "material/getMaterial",
        data: {
          typeId: "",
          pageIndex: 1,
          pageSize: 18
        },
        success: res => {
          this.initialAudioList = res.data.data;
          this.initialAudioTotal = res.data.total;
        }
      });
    },
    getMaterialType() {
      this.$post({
        url: REQUEST_PATH + "material/getMaterialType",
        data: { sort: "DESC" },
        success: res => {
          this.initialAudioClasses = res.data.data;
        }
      });
    },
    // 获取色系
    getColor() {
      this.$post({
        url: REQUEST_PATH + "material/getMaterialColor",
        data: { sort: "ASC" },
        success: res => {
          this.initialColorList = res.data.data;
        }
      });
    },
    back() {
      this.$router.back();
    },
    getRewards(type, typename) {
      return new Promise((resolve,reject)=>{
        this.$post({
          url: REQUEST_PATH + "prize/getPrizeAttr",
          data: {
            userTypeId: type,
            sort: "asc"
          },
          success: res => {
            if(res.data.status){
              let data = res.data.data;
              resolve({
                name:typename,
                data:data
              });
              this[typename] = data;
            }else{
              reject('奖品获取失败，请刷新页面重试');              
            }            
            //将奖品固定成跑男奖品
            // if(typename == 'userRewardList'){
            // this.rewardList = res.data.data;
            // }
          },
          error: res=>{
            reject('奖品获取失败，请刷新页面重试');
          }
        });
      })      
    },
    // 获取皮肤列表
    getSkinList() {
      let that = this;
      this.$post({
        url: REQUEST_PATH + "skin/getSkin",
        data: {
          templetId: this.tempDetail.id,
          sort: "ASC"
        },
        success: res => {
          let data = res.data.data;
          if (data.length <= 0) {
            this.skinListFlag = false;
            return false;
          }
          data.map((item, index) => {
            item.skinConfig = JSON.parse(item.skinConfig);
            if (index == 0) {
              item.flag = true;
            } else {
              item.flag = false;
            }
          });
          this.skinList = data;
          this.skinModel = data[0].id;
          this.skinUrl = data[0].skinConfig.common.skinImg;

          let promiseAll = this.checkImgLoad(data);
          Promise.all(promiseAll).then(img => {
            that.skinListFlag = true;
          });
        }
      });
    },
    checkImgLoad(arr) {
      let promiseAll = [],
        img = [],
        imgTotal = arr.length;
      for (let i = 0; i < arr; i++) {
        promiseAll[i] = new Promise((resolve, reject) => {
          img[i] = new Image();
          img[i].src = arr[i].skinConfig.common.skinImg;
          img[i].onload = function() {
            resolve(img[i]);
          };
        });
      }
      return promiseAll;
    },
    // 设置皮肤
    skinChange(id) {
      this.skinModel = id;
    },
    // 设置皮肤
    skinSetOk() {
      if(this.previewStep){
        this.tempPostData = this.handleAddObj();
      }
      // console.log('切换皮肤...')
      let parent = this.$refs.uuphone;
      let child = this.$refs.uuphone.$refs.ifr;
      if (this.skinList.length > 0) {
        if (this.skinModel !== this.skinList[0].id) {
          child.contentWindow.postMessage(
            {
              templetId: this.tempDetail.id,
              skinId: this.skinModel
            },
            this.tempIfr
          );
        } else {
          if (this.firstSkin) {
            child.contentWindow.postMessage(
              {
                templetId: this.tempDetail.id,
                skinId: this.skinModel
              },
              this.tempIfr
            );
          }
        }
      }
      this.firstSkin = true;
      this.skinListFlag = false;
    },    
    changeUserType(val) {
      // this.stepOneRuleForm.personType = "";
      // this.stepOneRuleForm.business = "";
      // this.disStepOneBusiness = false;
      if (val == 1) {
        this.rewardList = this.userRewardList;
      } else {       
        this.rewardList = this.runmanRewardList;
      }
      this.stepTwoList.map((item, index) => {
        if (this.$refs[item.ref][0]) {
          if (item.form.attrs === 1 || item.form.attrs === 2) {
            this.$refs[item.ref][0].resetFields();
            this.$refs["materials" + index][0].delCurAudio();   
          }
        }
      });
    },
    // 主题
    goTeme() {
      this.skinListFlag = true;
    },
    // 上一步、下一步
    goPrev() {
      this.activeStep -= 1;
    },
    goNext() {
      // 跳转页面
      switch (this.activeStepName) {
        case "first": {
          // 验证表单
          let flag = this.$refs.formStepOne.submitForm();

          // 验证关闭
          if (!flag) {
            return false;
          }

          // 验证背景音乐
          if (this.useBgAudio == 1) {
            if (!this.bgAudio) {
              this.$message.warning("请选择背景音乐");
              return false;
            }
          }
          // 获取表单数据
          let searchform = this.$refs.formStepOne.searchForm;
          // 将表单数据赋值给父组件
          this.stepOneformList = this.stepOneformList.map(item => {
            if (searchform.hasOwnProperty(item.prop)) {
              item.value = searchform[item.prop];
            }
            return item;
          });

          // 切换到下一屏
          this.activeStep += 1;
          break;
        }
        case "rule": {
          let flag = this.$refs.stepOneRuleForm.validate();
          if(flag){
            // 切换到下一屏
            this.activeStep += 1;
          }        
          break;
        }
        case "reward": {
          // 切换到下一屏
          let flagArr = [];         
          let endFlag = this.stepTwoList.every(item=>{
            return this.$refs[item.ref][0].validate();
          })
         
          //  验证关闭
          if (!endFlag) {
            this.$message.warning("请完善奖品数据");
            return false;
          }

          //  至少有一个空奖
          let oneNullPrizeFlag = false;
          oneNullPrizeFlag = this.stepTwoList.some(item => {
            return item.form.attrs === 4;
          });
          if (!oneNullPrizeFlag) {
            this.$message.warning("至少有一个空奖品");
            return;
          }

          // 验证概率
          if (parseInt(this.allProportion) !== 100) {
            this.$message.warning("概率总和必须为100%");
            return false;
          }

          if (!this.showWxModel) {
            // 测试
            this.addNewAcitivy();
          } else {
            this.activeStep += 1;
          }

          break;
        }
        case "share": {
          let flag = this.$refs.wx.valid();
          if (flag) {
            this.addNewAcitivy();
          }
          break;
        }
        default: {
          //中奖概率
          // 切换到下一屏
          // 验证关闭 
          this.activeStep += 1;
          break;
        }
      }
    },
    handleAddObj() {
      let that = this;
      let stepone = this.$refs.formStepOne;
      let steptwo = this.$refs.stepTwo;

      let aQuery = "";
      if (this.stepOneRuleForm.usePlat === 1) {
        aQuery = "&token={$token}";
      } else {
        aQuery = "&userid={$userid}&usertoken={$usertoken}&city={$city}";
      }

      let stepOneData = stepone.searchForm;
      let stepOneRuleData = Object.assign({}, this.stepOneRuleForm);
      delete stepOneRuleData.limitCity;
      delete stepOneRuleData.usePlat;
      delete stepOneRuleData.usePerson;
      delete stepOneRuleData.personType;
      if(stepOneRuleData.rewardLimit === ''){
        stepOneRuleData.rewardLimit = 0;
      }

      let cityName = "";
      this.$refs.stepOneRuleForm.cityList.map(item => {
        this.stepOneRuleForm.limitCity.map(val => {
          if (item.Id === val) {
            cityName += item.CityName + "|";
            return;
          }
        });
      });
      cityName = cityName.substring(0, cityName.length - 1);

      stepOneData.desc = stepOneData.desc.replace(/\"/g, "'");

      let obj = {
        name: encodeURIComponent(stepOneData.name),
        startTime: that.$util.coverDate(new Date(stepOneData.date[0])),
        endTime: that.$util.coverDate(new Date(stepOneData.date[1])),
        // desc: encodeURIComponent(stepOneData.desc),
        desc: stepOneData.desc,
        typeId: this.tempData.typeId,
        templetId: this.tempData.id,
        state: false,
        skinId: this.skinModel,
        bgAudio: this.bgAudio,
        limitCity: this.stepOneRuleForm.limitCity.join("|"),
        limitCityName: cityName,
        usePlat: this.stepOneRuleForm.usePlat,
        usePerson: this.stepOneRuleForm.usePerson,
        personType: this.stepOneRuleForm.personType,
        appLabel: escape(aQuery),
        config: "",
        rule: JSON.stringify(stepOneRuleData),
        ruleType: this.tempDetail.ruleType,
        serverPort:
          REQUEST_PATH == "http://aiats.mit.cn/" ? "prod" : this.curServerPort
      };

      // 获取奖品数据
      let stepTwoData = [];
      this.stepTwoList.map((item, index) => {
        stepTwoData[index] = {};

        let data = item.form;
        // stepTwoData[index].proportion = data.proportion || '';
        let obj = {
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
          proportion: data.proportion || "",
          code: index
        };
        stepTwoData[index].searchform = obj;
      });

      let config = {};

      config.popBtn = {
        isOpen: this.stepOneRuleForm.isOpen,
        jumpUrl: encodeURIComponent(this.stepOneRuleForm.jumpUrl)
      };

      config.rewardDataList = stepTwoData;
      if (this.showWxModel) {
        config.wxForm = this.$refs.wx.wxForm;
        config.wxForm.title = encodeURIComponent(config.wxForm.title);
        config.wxForm.desc = encodeURIComponent(config.wxForm.desc);
        config.wxForm.img = encodeURIComponent(config.wxForm.img);
      }

      obj.config = JSON.stringify(config);
      return obj;
    },
    addNewAcitivy() {
      let obj = this.handleAddObj();

      // console.log('obj...');
      // console.log(obj);
      // return;

      this.activeStep += 1;
      this.showLoading = true;

      this.$post({
        url: REQUEST_PATH + "activity/addActivity",
        data: obj,
        success: res => {
          let that = this;

          setTimeout(function() {
            that.showLoading = false;
          }, 3600);
          // 返回活动id
          // 根据链接地址返回二维码
          // let aQuery = '&userid={$userid}&usertoken={$usertoken}&city={$city}';
          // that.appArr.map(item=>{
          //     if(item.active){
          //         aQuery +='&'+item.key+'='+item.name;
          //     }
          // })
          let aQuery = "";
          if (this.stepOneRuleForm.usePlat === 1) {
            aQuery = "&token={$token}";
          } else {
            aQuery = "&userid={$userid}&usertoken={$usertoken}&city={$city}";
          }

          this.linkAddress =
            this.baseUrl + res.data.link + "&skinId=" + this.skinModel + aQuery;
          $("#htmlCode").empty();
          $("#htmlCode").qrcode({
            width: 200,
            height: 200,
            text: this.linkAddress
          });
          $("#htmlCode").append(
            '<img src="' +
              tt1 +
              '" style="position:absolute;width:48px;height:48px;top:76px;left:76px;"/>'
          );
        },
        fail: res => {
          let that = this;
          this.$message.warning(res.data.message || "添加活动失败");
          setTimeout(function() {
            that.activeStep -= 1;
            that.showLoading = false;
          }, 2000);
        },
        error: err=>{
          let that = this;
          this.$message.warning(err.message || "添加活动失败");
          setTimeout(function() {
            that.activeStep -= 1;
            that.showLoading = false;
          }, 2000);
        }
      });
    },
    // 预览
    previewTemplate() {
      // console.log('预览')
      this.tempViewFlag = true;
      // console.log(this.tempViewFlag);
      let obj = this.handleAddObj();
      this.oldIfrSrc = !this.ifrSrc ? this.oldIfrSrc : this.ifrSrc;
      this.ifrSrc = this.oldIfrSrc;
      this.tempPostData = obj;
    },
    closePreview() {
      this.ifrSrc = "";
      this.tempViewFlag = false;
    },
    // 传输图片地址
    postImgUrl(url, index) {
      if(this.previewStep){
        this.tempPostData = this.handleAddObj();
      }
      let parent = this.$refs.uuphone;
      let child = this.$refs.uuphone.$refs.ifr;
      child.contentWindow.postMessage(
        {
          icon: url,
          index: index
        },
        this.tempIfr
      );
    },
    // 奖品
    rewardChange(url,item,index){
      this.$set(item.form,'icon',url);
      // item.form.icon = url;
      this.postImgUrl(url,index);
    },
    changeAttrs(index,val) {
      // console.log(item);
      // let item = this.stepTwoList[index];
      if(val == 4){
        // item.form.icon = "http://uufe-web.oss-cn-beijing.aliyuncs.com/atsweb/artlib/1517302739062.png";
        // item.fileList = [{
        //   name:'空奖4',
        //   url:'http://uufe-web.oss-cn-beijing.aliyuncs.com/atsweb/artlib/1517302739062.png'
        // }];
        this.$refs["materials" + index][0].choiceCurAudio({
          colorId: 7,
          colorName: "黄色",
          id: 96,
          materialName: "空奖4",
          materialUrl: "http://uufe-web.oss-cn-beijing.aliyuncs.com/atsweb/artlib/1517302739062.png",
          typeId: 11,
          typeName: "空奖",
        });
      }else{
        // item.form.icon = "";
        // item.fileList = [];
        // this.$set(this.stepTwoList, index, item);
        this.$refs["materials" + index][0].delCurAudio();
      }     
    },
  }
};
</script>
        
<style lang="less"  rel="stylesheet/scss"  scoped>
.aia-dialog-skinlist {
  height: 500px;
  overflow: hidden;
  position: relative;
  width: 100%;
}
.aia-skinlist {
  position: absolute;
  right: -17px;
  top: -10px;
  left: 0px;
  bottom: -10px;
  overflow: hidden;
  overflow-y: auto;
  padding: 20px 0;
}
.aia-skinlist li {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  width: 100px;
  height: 178px;
  overflow: hidden;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
  border-radius: 5px;
  background: url("@assets/images/loading.gif") center center no-repeat;
}
.aia-skinlist li span {
  position: absolute;
  width: 50px;
  height: 32px;
  right: -18px;
  top: -14px;
  background: #4da231;
  z-index: 1;
  transform: rotate(45deg);
}
.aia-skinlist li img.aia-dialog-icon {
  position: absolute;
  right: 3px;
  top: 5px;
  z-index: 2;
}
.aia-skinlist.aia-rewards-list li {
  position: relative;
  border: 1px solid #eee;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  height: 100px;
  overflow: hidden;
  line-height: 100px;
  > img {
    vertical-align: middle;
  }
  &:hover {
    .aia-rewards-info {
      bottom: 0;
    }
  }
  .aia-rewards-info {
    background-color: rgba(255, 255, 255, 0.9);
    position: absolute;
    bottom: -40px;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    transition: all 0.1s linear;
    p {
      font-size: 12px;
      padding: 0 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.appIcon {
  margin-bottom: 22px;
  text-align: center;
  .appIcon-item {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-color: #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: all 0.1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    margin-right: 5px;
    padding: 7px 10px;
    font-size: 12px;
    border-radius: 3px;
  }
  .appIcon-active {
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
}
</style>