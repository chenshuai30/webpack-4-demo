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
                <div style="max-width:678px;">
                  <Setform :list="stepOneformList" ref="formStepOne" labelWidth="80px"></SetForm>
                </div>

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
                <h4>规则设置</h4>
                <el-form :model="quesRuleForm" ref="quesRuleForm" :rules="quesRuleFormRule" label-width="80px" class="demo-ruleForm">
                  <el-row>
                    <el-col :lg="9">
                      <el-form-item label="答题类型" prop="type">
                        <el-select @change="changeTypeChk" :disabled="quesList.length>0" v-model="quesRuleForm.type" placeholder="请选择类型">
                          <el-option v-for="item in quesRuleFormList" :label="item.label" :key="item.value" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :lg="10">
                      <el-form-item label="使用平台" prop="usePlat">
                        <el-select @change="changeUsePlat" v-model="quesRuleForm.usePlat" placeholder="请选择">
                          <el-option v-if="tempDetail.supportWx === 1" label="微信端" :value="1"></el-option>
                          <el-option label="App端" :value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="9">
                      <el-form-item label="使用对象" prop="usePerson">
                        <el-select @change="changeUserType" v-model="quesRuleForm.usePerson" placeholder="请选择">
                          <template v-if="quesRuleForm.usePlat == 2">
                            <el-option label="全部" :value="0"></el-option>
                            <el-option label="跑男" :value="2"></el-option>
                          </template>
                          <!-- <template v-if="quesRuleForm.usePlat !== 2">                                   -->
                          <el-option label="用户" :value="1"></el-option>
                          <!-- </template>  -->
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :lg="10">
                      <el-form-item label="限用城市" prop="limitCity">
                        <el-select multiple collapse-tags @change="changeCity" style="width:260px;" v-model="quesRuleForm.limitCity" filterable placeholder="请选择">
                          <el-option :disabled="item.Id !== 0 && disCity" :label="item.CityName" v-for="item,index in cityList" :key="index" :value="item.Id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :lg="9">
                      <el-form-item label="每题限时" prop="limitTime">
                        <el-select :disabled="quesRuleForm.type != 2" v-model="quesRuleForm.limitTime" placeholder="请选择">
                          <el-option label="不限时" :value="0"></el-option>
                          <el-option label="10秒" :value="1"></el-option>
                          <el-option label="20秒" :value="2"></el-option>
                          <el-option label="30秒" :value="3"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <!-- step 3 -->
              <div v-show="activeStepName === 'ques'">
                <div id="stepOneRule">
                  <div>
                    <el-button icon="el-icon-plus" @click="addRadio" size="mini">添加单选题</el-button>
                    <!-- <el-button icon="el-icon-plus" @click="addBlanks" size="mini" v-if="quesRuleForm.type===1">添加填空题</el-button> -->
                    <el-button icon="el-icon-plus" @click="addInput" v-if="quesRuleForm.type == 3" size="mini">添加单行输入框</el-button>
                    <el-button icon="el-icon-plus" @click="addQa" size="mini" v-if="quesRuleForm.type==1 || quesRuleForm.type == 3">添加问答题</el-button>
                    <span class="allScore" style="padding-left:15px;">题目数：{{quesList.length}}</span>
                  </div>
                  <div class="answer-ques-title-info">
                    <p>* 标题最长可输入75个字符，单选内容最长可输入12个字符</p>
                  </div>
                </div>
                <div style="overflow:hidden;">
                  <div ref="mainlist" id="mainlist" style="position:relative">
                    <!-- 单选题 -->
                    <div v-for="item,index in quesList" :key="index" :index="index" :class="{'quesItem':true,'quesOccur':(item.atype && item.atype=='occur')}" :ref="'ques'+index">
                      <h4 class="dragHandle">
                        <span class="aia-sort" style="padding-right:5px;">{{(index+1)+'.'}}</span>
                        <span @click="titleEditState(item,index)" v-show="!item.editable" class="quesItemTitle">{{item.question}}</span>
                        <el-input :ref="'tin'+index" @blur="titleSaveState(item,index)" style="width:450px;" size="mini" :maxlength="75" v-show="item.editable" v-model="item.question" placeholder="请输入问题内容，最多75个字"></el-input>
                        <div class="fr radiobtn">
                          <el-button size="mini" @click="addRadioItem(item)" v-if="item.type == 'radio'" style="padding: 4px 10px;">添加选项</el-button>
                          <el-button size="mini" @click="delQuesItem(index,item)" style="padding: 4px 10px;">删除</el-button>
                        </div>
                      </h4>
                      <div class="quesItem-content" v-if="item.type == 'radio' || (item.type == 'radio'&& item.atype && item.atype == 'occur') ">
                        <ul class="singleChioce">
                          <li v-for="val,key in item.content" :key="key">
                            <span @click="radioEditState(val,key,index)" v-show="!val.editable" class="singleChioceName">{{quesLetter[key] +'. '+ val.name}}</span>
                            <el-input @blur="saveRadioItem(val,key,index)" :ref="index+'rao'+key" style="width:181px;margin-left: -10px;" :maxlength="12" size="mini" v-show="val.editable" v-model="val.name" placeholder="请输入内容,最多12个字"></el-input>
                            <span class="fr singleChioceDel">
                              <i @click="delRadioItem(item,key)" class="el-icon-delete  aia-icons"></i>
                            </span>
                          </li>
                        </ul>
                        <div v-show="item.error" class="error" style="position:absolute;margin-top:-6px;font-size:12px;">
                          <span>{{item.errorMessage}}</span>
                        </div>
                        <div class="itemScore" v-if="quesRuleForm.type !==1 && quesRuleForm.type !==3 ">
                          <div class="itemScoreItem">
                            <span class="itemScoreItemTitle">答案：</span>
                            <el-select v-model="item.rightKey" placeholder="请选择" size="mini" style="width:115px;">
                              <el-option v-for="val,key in item.content" :key="key" :label="quesLetter[key]" :value="key"></el-option>
                            </el-select>
                          </div>
                        </div>
                      </div>
                      <div class="quesItem-content" v-if="item.type == 'blanks' || (item.type == 'blanks'&&item.atype && item.atype == 'occur')">
                        <el-input type="textarea" style="width:460px;" :rows="3" v-model="item.content" placeholder="请填写填空题"></el-input>
                        <div v-show="item.error" class="error" style="position:absolute;margin-top:5px;font-size:12px;">
                          <span>{{item.errorMessage}}</span>
                        </div>
                        <div class="quesItem-content-info">
                          <span>注意：需要填空的地方请使用两个下划线‘__’代替</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- step 4 -->
              <div v-show="activeStepName === 'reward'">
                <hasreward ref="hasreward" :quesType="quesRuleForm.type" :quesLen="quesList.length" :rewardList="rewardList"></hasreward>
              </div>
              <!-- step 5 -->
              <div v-show="activeStepName === 'share'">
                <wxshare ref="wx"></wxshare>
              </div>

              <!-- step 6 -->
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
import "@assets/js/ddsort.js";
import Vue from "vue";
import rig from "@assets/images/right.png";
export default {
  name: "answer",
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
      if (parseInt(value) > this.quesList.length) {
        callback(new Error("数量必须小于题目数目"));
      } else {
        callback();
      }
    };
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
      rig: rig,
      radioMaxLength: 5,
      globalError: false,
      basicUrl: REQUEST_PATH,
      uploadUrl: REQUEST_PATH + "upload/uploadFile",
      // 皮肤弹框
      skinListFlag: false,
      // 当前配置页面
      activeStep: 0,
      // iframe加载控件
      ifrLoading: true,
      previewIfrLoading: true,
      ifrSrc: "",
      oldIfrSrc: "",
      tempname: "活动模板",
      // stepList: [
      //   { title: "创建活动" },
      //   { title: "规则设置" },
      //   { title: "答题/问卷" },
      //   { title: "奖品设置" },
      //   { title: "完成" }
      // ],
      bgAudioFileList: [],
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
            { required: "true", message: "请填写活动说明", trigger: "blur" },
            // { validator:formateV,trigger:'blur'}
          ]
        }
      ],
      disCity: false,
      stepOneRuleForm: {
        answerType: "",
        answerReward: "",
        limitCity: [],
        usePlat: "",
        usertype: "",
        useritem: "",
        business: ""
      },
      stepOneRuleFormRules: {
        answerType: [
          {
            required: "true",
            type: "number",
            message: "请选择答题类型",
            trigger: "change"
          }
        ],
        answerReward: [
          {
            required: "true",
            type: "number",
            message: "请选择答题类型",
            trigger: "change"
          }
        ],
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
        usertype: [
          {
            required: true,
            type: "number",
            message: "请选择使用对象",
            trigger: "change"
          }
        ],
        useritem: [
          {
            required: true,
            type: "number",
            message: "请选择类别",
            trigger: "change"
          }
        ]
        // business: [
        //   {required: true,type: "number",message: "请选择业务类型",trigger: "change"}
        // ]
      },
      // 配置2的form数据
      quesLetter: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      quesList: [
        // {
        //   type:'radio',
        //   question:'单选1',
        //   editable:false,
        //   error:false,
        //   score:10,
        //   rightKey:0,
        //   errorMessage:'* 选项内容不能为空',
        //   content:[
        //     {name:'选项1',editable:false},
        //     {name:'选项2',editable:false},
        //     {name:'选项3',editable:false},
        //     {name:'选项4',editable:false},
        //   ]
        // },
        // {
        //   type:'radio',
        //   question:'单选2',
        //   editable:false,
        //   error:false,
        //   score:20,
        //   rightKey:1,
        //   content:[
        //     {name:'选项1',editable:false},
        //     {name:'选项2',editable:false},
        //     {name:'选项3',editable:false},
        //     {name:'选项4',editable:false},
        //   ]
        // },
        //   {
        //   type:'radio',
        //   question:'单选3',
        //   editable:false,
        //   error:false,
        //   score:30,
        //   rightKey:2,
        //   content:[
        //     {name:'选项1',editable:false},
        //     {name:'选项2',editable:false},
        //     {name:'选项3',editable:false},
        //     {name:'选项4',editable:false},
        //   ]
        // },
        // {
        //   type:'blanks',
        //   editable:false,
        //   error:false,
        //   score:0,
        //   rightKey:'',
        //   question:'新增填空题'
        // },{
        //   type:'qa',
        //   editable:false,
        //   error:false,
        //   score:0,
        //   rightKey:'',
        //   question:'新增问答题'
        // }
      ],

      // 配置4 数据，复制
      linkAddress: "https://www.uupt.com",
      linkPic: require("@assets/images/code.png"),
      uploadFileDom: "",

      // phone 模板数据
      phoneData: {},

      //  用户类别
      userTypeList: [],
      runmanTypeList: [],
      useritemList: [],
      // 皮肤列表
      skinList: [],
      skinModel: "",
      skinUrl: "",
      baseUrl: REQUEST_PATH,
      quesPosList: [],
      rewardActiveName: "first",
      rewardNullForm: {
        name: "",
        desc: "",
        icon: ""
      },
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
        score:""
      },
      useRewardFormUpload: 0,
      useNullRewardUpload: 0,
      nullPrizefileList: [],
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
      },
      prizefileList: [],
      rewardList: [],
      quesRuleFormList: [
        {
          label: "答题",
          value: 0
        },
        {
          label: "问卷",
          value: 1
        },
        {
          label: "考试",
          value: 2
        },
        {
          label: "表单",
          value: 3
        }
      ],
      // 规则设置
      quesRuleForm: {
        type: 0,
        usePlat: 2,
        usePerson: "",
        limitCity: [],
        personType: 9,
        business: "",
        limitTime: 0
      },
      quesRuleFormRule: {
        type: [
          {
            required: true,
            type: "number",
            message: "请选择类型",
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
            message: "请选择对象",
            trigger: "change"
          }
        ],
        limitCity: [
          {
            required: true,
            // type: "number",
            message: "请选择城市",
            trigger: "change"
          }
        ],
        personType: [
          {
            required: true,
            type: "number",
            message: "请选择分类",
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
        limitTime: [
          {
            required: true,
            type: "number",
            message: "请选择时间限制",
            trigger: "change"
          }
        ]
      },
      cityList: [],
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
      allRewardList: [],
      runmanRewardList: [],
      userRewardList: [],
      hasRewards: 0,
      firstSkin: false,
      formatReg: "",
      showLoading: false,
      // 模板预览
      tempViewFlag: false,
      previewIfrLoaded: false,
      tempPostData: {},
      tempIfr: ""
    };
  },
  created() {
    this.formatReg = new RegExp(
      /[(\#)(\$)(\^)(\&)(\*)(\()(\))(\_)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\.)(\/)(\<)(\>)(\\)]+/
    );
    this.baseUrl = REQUEST_PATH;
    this.ifrSrc = this.tempDetail.htmlSrc;
    if (this.ifrSrc) {
      this.tempIfr = this.baseUrl + this.ifrSrc + "?activityId=0";
    }

    switch (this.tempDetail.htmlSrc) {
      case "templet/Question/index.html": {
        this.quesRuleFormList = [
          {
            label: "答题",
            value: 0
          },
          {
            label: "问卷",
            value: 1
          }
        ];
        this.quesRuleForm.type = 0;
        break;
      }
      case "templet/ExamTpl/index.html": {
        this.quesRuleFormList = [
          {
            label: "考试",
            value: 2
          }
        ];
        this.quesRuleForm.type = 2;
        break;
      }
      case "templet/Enroll/index.html": {
        this.quesRuleFormList = [
          {
            label: "表单模板",
            value: 3
          }
        ];
        this.quesRuleForm.type = 3;
        break;
      }
      default: {
        this.quesRuleFormList = [
          {
            label: "答题",
            value: 0
          },
          {
            label: "问卷",
            value: 1
          },
          {
            label: "考试",
            value: 2
          },
          {
            label: "表单模板",
            value: 3
          }
        ];
        this.quesRuleForm.type = 0;
      }
    }

    if (this.quesRuleForm.type == 3) {
      this.radioMaxLength = 10;
    } else {
      this.radioMaxLength = 5;
    }
  },

  watch: {
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
        // this.ifrSrc = this.publicPath+this.tempDetail.htmlSrc+'/#/'
      },
      deep: true
    }
  },
  computed: {
    prevStep() {
      let len = this.stepList.length - 1;
      return this.activeStep !== 0 && this.activeStep != len;
    },
    nextStep() {
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
      return this.quesRuleForm.usePlat !== 2;
    },
    stepList() {
      if (this.quesRuleForm.usePlat !== 2) {
        return [
          { title: "创建活动", name: "first" },
          { title: "规则设置", name: "rule" },
          { title: "答题/问卷", name: "ques" },
          { title: "奖品设置", name: "reward" },
          { title: "分享设置", name: "share" },
          { title: "完成", name: "end" }
        ];
      } else {
        return [
          { title: "创建活动", name: "first" },
          { title: "规则设置", name: "rule" },
          { title: "答题/问卷", name: "ques" },
          { title: "奖品设置", name: "reward" },
          { title: "完成", name: "end" }
        ];
      }
    },
    activeStepName() {
      return this.stepList[this.activeStep].name;
      // return 'reward';
    }
  },
  mounted() {
    this.tempname = this.tempDetail.templetName;

    // 排序
    // $( '#mainlist' ).DDSort({
    //   target: 'div.quesItem',
    //   own:that,
    // 	floatStyle: {
    // 		'border': '1px solid #ccc',
    // 		'background-color': '#fff'
    // 	}
    // });
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
      // 获取用户、跑男下的分类
      this.getUserType(1, "userTypeList");
      this.getUserType(2, "runmanTypeList");

      // 获取皮肤列表
      this.getSkinList();

      // 获取城市
      this.getCityList();

      // 获取用户、跑男下的分类
      // this.getUserType(1,'userTypeList');
      // this.getUserType(2,'runmanTypeList');

      // 获取用户和跑男奖品类型
      this.getRewards(-999, "allRewardList");
      this.getRewards(1, "userRewardList");
      this.getRewards(2, "runmanRewardList");
    },
    formatStr(str) {
      str.replace(".", "\\.");
      str.replace("\\", "\\\\");
      str.replace("'", "\\'");
      str.replace("\t", "");
      str.replace("\r", "");
      str.replace("\n", "<br/>");
      str.replace("'", "&#39;");
      str.replace('"', "&quot;");
      return encodeURIComponent(str);
    },
    getMusicUrl(url) {
      this.bgAudio = url;
    },
    delMusicUrl(url) {
      this.bgAudio = "";
    },
    setOwnData(item) {
      return escape(JSON.stringify(item));
    },
    getParent(el) {
      let parent = el.parentNode || parentElement;
      if (parent.tagName != "DIV" && parent.clasName !== "quesItem") {
        parent = this.getParent(parent);
      }
      return parent;
    },
    back() {
      this.$router.back();
    },
    changeTypeChk(val) {
      this.quesRuleForm.limitTime = 0;
      if (val == 3) {
        this.radioMaxLength = 10;
      } else {
        this.radioMaxLength = 5;
      }     
    },
    // 限用城市类别
    getCityList() {
      this.$post({
        url: REQUEST_PATH + "common/getCity",
        data: {},
        success: res => {
          this.cityList = res.data.data;
        }
      });
    },
    // 获取奖品属性
    getRewards(type, typename) {
      this.$post({
        url: REQUEST_PATH + "prize/getPrizeAttr",
        data: {
          userTypeId: type,
          sort: "asc"
        },
        success: res => {
          this[typename] = [];
          switch (typename) {
            case "allRewardList": {
              res.data.data.map(item => {
                if (item.id !== 1 && item.id !== 2) {
                  this[typename].push(item);
                }
              });
              break;
            }
            case "userRewardList": {
              res.data.data.map(item => {
                this[typename].push(item);
              });
              break;
            }
            case "runmanRewardList": {
              res.data.data.map(item => {
                this[typename].push(item);
              });
              break;
            }
          }
          if (typename == "allRewardList") {
            this.rewardList = this[typename];
          }
        }
      });
    },
    handleHasRewards(val) {
      this.$nextTick(() => {
        this.$refs.rewardNullForm.resetFields();
        this.rewardNullForm.icon = "";
        this.$refs.nullRewardImgDialog.delCurAudio();
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
    // 获取对象分类
    getUserType(type, name) {
      this.$post({
        url: REQUEST_PATH + "activity/getUseType",
        data: { useType: type },
        success: res => {
          this[name] = res.data.data;
        }
      });
    },
    changeUsePlat(val) {
      this.quesRuleForm.usePerson = "";
    },
    changeUserType(val) {
      switch (val) {
        case 0: {
          //全部
          this.rewardList = this.allRewardList;
          break;
        }
        case 1: {
          //用户
          this.rewardList = this.userRewardList;
          break;
        }
        case 2: {
          //跑男
          this.rewardList = this.runmanRewardList;
          break;
        }
      }
      if(this.$refs.hasreward){
        this.$refs.hasreward.resetFields();
      }
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
    // 选择皮肤
    changeSkin(val) {
      this.skinList.map(item => {
        if (val == item.id) {
          this.skinUrl = item.skinConfig.common.skinImg;
        }
      });
    },
    changeDefaultSkin(item) {
      item.flag = true;
      this.skinModel = item.id;
      this.skinList.map(val => {
        if (val.id !== item.id) {
          if (val.flag) {
            val.flag = false;
          }
        }
      });
    },
    // 设置皮肤
    skinChange(id) {
      this.skinModel = id;
    },
    skinSetOk() {
      let parent = this.$refs.uuphone;
      let child = this.$refs.uuphone.$refs.ifr;
      child.contentWindow.postMessage(
        {
          templetId: this.tempDetail.id,
          skinId: this.skinModel
        },
        this.tempIfr
      );

      this.firstSkin = true;
      this.skinListFlag = false;
    },
    // 获取对象分类
    getUserType(type, name) {
      this.$post({
        url: REQUEST_PATH + "activity/getUseType",
        data: { useType: type },
        success: res => {
          this[name] = res.data.data;
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
      switch (this.activeStepName) { //基础信息
        case "first": {
          // 验证表单
          let flag = this.$refs.formStepOne.submitForm();

          // 验证关闭
          if (!flag) {
            return false;
          }

          // 验证背景音乐
          // console.log("背景音乐验证");
          if (this.useBgAudio == 1) {
            if (!this.bgAudio) {
              this.$message.warning("请选择背景音乐");
              return false;
            }
          }

          // 切换到下一屏
          this.activeStep += 1;
          break;
        }
        case "rule": {
          //规则
          this.$refs.quesRuleForm.validate(valid => {
            if (valid) {
              this.activeStep += 1;
            }
          });

          break;
        }
        case "ques": {
          //题目

          // 测试
          // this.addNewAcitivy();
          if (this.quesList.length <= 0) {
            this.$message.warning("请添加题目!");
            return;
          }

          let titleFlag = true;
          let rightFlag = true;
          // 答题规则验证
          this.quesList.map(item => {
            // item.editable = false;
            if (!item.question) {
              item.errorMessage = "* 标题不能为空";
              item.error = true;
              titleFlag = false;
              return;
            } else {
              if (this.formatReg.test(item.questions)) {
                item.errorMessage = "输入内容不能包含特殊字符,如. ' \"";
                item.error = true;
                titleFlag = false;
                return;
              }
              item.error = false;
            }

            if (
              this.quesRuleForm.type !== 1 &&
              this.quesRuleForm.type !== 3 &&
              item.type == "radio" &&
              item.rightKey === ""
            ) {
              item.errorMessage = "* 答案不能为空";
              item.error = true;
              rightFlag = false;
              return;
            }

            switch (item.type) {
              case "radio": {
                // 判断是否为空
                let flag = item.content.every(val => {
                  // if(val.editable){val.editable = false}
                  return val.name != "";
                });
                if (flag) {
                  item.error = false;
                } else {
                  item.errorMessage = "* 选项不能为空";
                  item.error = true;
                  return;
                }
                // 判断是否包含特殊字符
                let ff = item.content.every(val => {
                  return !this.formatReg.test(val.name);
                });
                if (ff) {
                  item.error = false;
                } else {
                  item.errorMessage = "输入内容不能包含特殊字符,如. ' \"";
                  item.error = true;
                }
                break;
              }
              case "blanks":
              case "input":
              case "qa": {
                break;
              }
            }
            return item;
          });

          let quesflag = this.quesList.every(item => {
            return !item.error;
          });

          // console.log('quelist 处理过后...')
          // console.log(this.quesList);

          if (quesflag && titleFlag && rightFlag) {
            // if(this.quesRuleForm.type == 2){
            //   this.addNewAcitivy();
            // }else{           
            this.activeStep += 1;
            // }
          }

          break;
        }
        case "reward": {
          //奖品          
          let flag = this.$refs.hasreward.validReward();
          if(flag){
            if (!this.showWxModel) {
              this.addNewAcitivy();
            } else {
              this.activeStep += 1;
            }
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
      }
    },
    getRewardsData(){
      let data = this.$refs.hasreward.getData();
      return data;
    },
    addNewAcitivy() {
      let that = this;
      // 基础设置
      let stepone = this.$refs.formStepOne;
      let stepOneData = stepone.searchForm;

      let aQuery = "";
      if (this.quesRuleForm.usePlat === 1) {
        if (this.quesRuleForm.usePerson === 0) {
          aQuery = "";
        } else {
          aQuery = "&token={$token}";
        }
      } else {
        aQuery = "&userid={$userid}&usertoken={$usertoken}&city={$city}";
      }

      let stepRuleData = Object.assign({}, this.quesRuleForm);
      delete stepRuleData.limitCity;
      delete stepRuleData.usePlat;
      delete stepRuleData.usePerson;
      delete stepRuleData.personType;

      let cityName = "";
      this.cityList.map(item => {
        this.quesRuleForm.limitCity.map(val => {
          if (item.Id === val) {
            cityName += item.CityName + "|";
            return;
          }
        });
      });
      cityName = cityName.substring(0, cityName.length - 1);

      stepOneData.desc = stepOneData.desc
        ? stepOneData.desc.replace(/\"/g, "'")
        : "";

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
        limitCity: this.quesRuleForm.limitCity.join("|"),
        limitCityName: cityName,
        usePlat: this.quesRuleForm.usePlat,
        usePerson: this.quesRuleForm.usePerson,
        personType: this.quesRuleForm.personType,
        appLabel: escape(aQuery),
        config: "",
        rule: JSON.stringify(stepRuleData),
        ruleType: this.tempDetail.ruleType,
        serverPort:
          REQUEST_PATH == "http://aiats.mit.cn/" ? "prod" : this.curServerPort
      };

      let config = {};

      let quesArr = [];
      this.quesList.map(item => {
        let val = {};
        if (item.type == "radio") {
          val.content = [];
          item.content.map((v, k) => {
            val.content.push(Object.assign({}, v));
          });
        }

        for (let na in item) {
          if (na != "content") {
            val[na] = item[na];
          }
        }
        quesArr.push(val);
      });

      let answers = [];
      quesArr.map(item => {
        delete item.error;
        delete item.editable;
        delete item.score;
        delete item.errorMessage;
        answers.push(item.rightKey);
        delete item.rightKey;
        item.question = encodeURIComponent(item.question);
        if (item.type == "radio") {
          item.content.map(val => {
            delete val.editable;
            val.name = encodeURIComponent(val.name);
            return val;
          });
        }
        return item;
      });

      // 获取题目设置
      config.questions = quesArr;
      config.answers = answers;

      /*let nullRewardFormData = {
        name: encodeURIComponent(this.rewardNullForm.name),
        desc: encodeURIComponent(
          this.$util.copyFilter(this.rewardNullForm.desc)
        ),
        icon: this.rewardNullForm.icon
      };*/

      // 处理奖品数据
      /*let rewardFormData = {
        condition: this.rewardForm.condition,
        attrs: this.rewardForm.attrs,
        num: this.rewardForm.num,
        name: encodeURIComponent(this.rewardForm.name),
        val:
          this.rewardForm.uucoin ||
          this.rewardForm.coupon ||
          this.rewardForm.account ||
          this.rewardForm.redbag ||
          this.rewardForm.score ||
          "",
        desc: encodeURIComponent(this.rewardForm.desc),
        icon: this.rewardForm.icon
      };*/
      // 奖品数据设置
      /*config.rewards = {
        isHasRewards: this.hasRewards,
        nullReward: nullRewardFormData,
        haveReward: rewardFormData
      };*/

      config.rewards = this.getRewardsData();

      // 微信数据
      if (this.showWxModel) {
        config.wxForm = this.$refs.wx.wxForm;
        config.wxForm.title = encodeURIComponent(config.wxForm.title);
        config.wxForm.desc = encodeURIComponent(config.wxForm.desc);
        config.wxForm.img = encodeURIComponent(config.wxForm.img);
      }     

      obj.config = JSON.stringify(config);

      // obj.config = config;
      console.log('config obj...');
      console.log(obj);
      // return;

      this.activeStep += 1;

      this.showLoading = true;

      this.$post({
        url: REQUEST_PATH + "activity/addActivity",
        data: obj,
        success: res => {
          let that = this;

          // if(res.data.code){
          //   this.$message.warning(res.data.message || '添加活动失败');
          //   setTimeout(function() {
          //     that.activeStep -=1;
          //     that.showLoading = false;
          //   }, 2000);
          //   return;
          // }

          setTimeout(function() {
            that.showLoading = false;
          }, 3600);
          // 返回活动id
          // 根据链接地址返回二维码
          let aQuery = "";
          if (this.quesRuleForm.usePlat === 1) {
            aQuery = "&token={$token}";
          } else {
            aQuery = "&userid={$userid}&usertoken={$usertoken}&city={$city}";
          }

          // that.appArr.map(item=>{
          //     if(item.active){
          //         aQuery +='&'+item.key+'='+item.name;
          //     }
          // })
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
      let that = this;

      let stepone = this.$refs.formStepOne;
      let stepOneData = stepone.searchForm;

      this.tempViewFlag = true;
      if (!this.previewIfrLoaded) {
        this.previewIfrLoading = true;
      } else {
        this.previewIfrLoading = false;
      }
      let quesArr = [];
      this.quesList.map(item => {
        let val = Object.assign({}, item);
        if (item.type == "rodio") {
          val.content = [];
          item.content.map((v, k) => {
            val.content.push(Object.assign({}, v));
          });
        }
        quesArr.push(val);
      });

      stepOneData.desc = stepOneData.desc
        ? stepOneData.desc.replace(/\"/g, "'")
        : "";

      let obj = {
        desc: encodeURIComponent(stepOneData.desc),
        templetId: this.tempDetail.id,
        skinId: this.skinModel,
        type: this.quesRuleForm.type,
        questions: quesArr,
        bgAudio: this.bgAudio,
        condition: this.rewardForm.condition      
      };
      this.tempViewFlag = true;
      this.oldIfrSrc = !this.ifrSrc ? this.oldIfrSrc : this.ifrSrc;
      this.ifrSrc = this.oldIfrSrc;
      this.tempPostData = obj;
    },
    closePreview() {
      this.tempViewFlag = false;
      this.ifrSrc = "";
    },
    titleEditState(item, index) {
      if (this.globalError) {
        return;
      }
      item.editable = true;
      this.$nextTick(() => {
        this.$refs["tin" + index][0].focus();
      });
    },
    titleSaveState(item, index) {
      // console.log('blur');
      if (!item.question) {
        this.globalError = true;
        this.$message.warning("问题不能为空");
        this.$refs["tin" + index][0].focus();
        return;
      } else {
        this.globalError = false;
        item.editable = false;
      }
    },
    addRadio() {
      this.quesList.push({
        type: "radio",
        question: "新增单选题",
        editable: false,
        error: false,
        score: 0,
        rightKey: "",
        errorMessage: "* 选项内容不能为空",
        content: [
          { name: "选项1", editable: false },
          { name: "选项2", editable: false },
          { name: "选项3", editable: false },
          { name: "选项4", editable: false }
        ]
      });
    },
    addBlanks() {
      this.quesList.push({
        type: "blanks",
        editable: false,
        error: false,
        score: 0,
        rightKey: "",
        errorMessage: "* 问题内容不能为空",
        question: "新增填空题"
      });
    },
    addQa() {
      this.quesList.push({
        type: "qa",
        editable: false,
        error: false,
        score: 0,
        rightKey: "",
        errorMessage: "* 问题内容不能为空",
        question: "新增问答题"
      });
    },
    addInput() {
      this.quesList.push({
        type: "input",
        editable: false,
        error: false,
        score: 0,
        rightKey: "",
        errorMessage: "* 问题内容不能为空",
        question: "新增单行输入框"
      });
    },
    addRadioItem(item) {
      let len = item.content.length;
      if (len >= this.radioMaxLength) {
        this.$message.warning("选项最多不能超过" + this.radioMaxLength + "条");
        return;
      }
      item.content.push({
        name: "新增选择",
        editable: false
      });
    },
    saveRadioItem(val, key, index) {
      if (!val.name) {
        this.globalError = true;
        this.$message.warning("选项内容不能为空");
        this.$refs[index + "rao" + key][0].focus();
        return;
      } else {
        this.globalError = false;
        val.editable = false;
      }
    },
    radioEditState(val, key, index) {
      if (this.globalError) {
        return;
      }
      val.editable = true;
      this.$nextTick(() => {
        this.$refs[index + "rao" + key][0].focus();
      });
    },
    delRadioItem(item, key) {
      item.content.splice(key, 1);
    },
    delQuesItem(index, item) {
      this.quesList.splice(index, 1);
    },
    // 传输图片地址
    postImgUrl(url, index) {
      // 测试iframe
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
    handlePrizeSubmit() {
      this.$refs.uploadPrize.submit();
    },
    handleNullPrizeSubmit() {
      this.$refs.uploadNullPrize.submit();
    },
    handleSucces(res, file, fileList, item, index) {
      if (!res.status) {
        this.$message.warning("上传失败");
      } else {
        // 获取上传后的图片地址
        item.form.icon = res.imageUrl;
        // this.postImgUrl(res.imageUrl, index);
      }
    },
    changeNullReward() {
      this.rewardNullForm.icon = "";
    },
    changeReward() {
      this.rewardForm.icon = "";
    },
    handlePrizeSucces(res, file, fileList) {
      if (!res.status) {
        this.$message.warning("上传失败");
      } else {
        // 获取上传后的图片地址
        this.rewardForm.icon = res.imageUrl;
      }
    },
    handleNullPrizeSucces(res, file, fileList) {
      if (!res.status) {
        this.$message.warning("上传失败");
      } else {
        // 获取上传后的图片地址
        this.rewardNullForm.icon = res.imageUrl;
      }
    },
    handleExceed(file, fileList) {
      this.$message.warning(`只能上传一个文件`);
    },
    handleError(err, file, fileList) {
      console.log(err.message);
    },
    changeCity(arr) {
      if (arr.indexOf(0) >= 0) {
        this.disCity = true;
        if (arr.length > 1) {
          this.quesRuleForm.limitCity = [0];
        }
      } else {
        this.disCity = false;
      }
    }
  }
};
</script>
        
<style lang="less"  rel="stylesheet/scss"  scoped>
#mainlist {
  height: 530px;
  padding-right: 30px;
  margin-right: -50px;
  overflow: hidden;
  overflow-y: scroll;
}
#aia-newactivity .aia-newa-main-body {
  width: auto;
  margin-left: 40px;
  min-width: 1050px;
  max-width: 1510px;
}
#aia-newactivity .aia-newa-foot {
  top: inherit;
  bottom: 0px;
}
#aia-newactivity .aia-newa-main-body .aia-newa-main-right {
  top: 0px;
}
#aia-newactivity .aia-newa-main-body .aia-newa-main-right .aia-newa-configform {
  min-height: 565px;
}
.allScore {
  float: right;
  padding-right: 5px;
}
// 问卷答题
.answer-ques-title-info {
  font-size: 12px;
  color: red;
  padding-top: 10px;
  padding-bottom: 10px;
  text-indent: 3px;
}
.quesItem {
  padding: 15px;
  background-color: #fff;
  margin-top: 15px;
  &:first-child {
    margin-top: 0;
  }
  &.quesOccur {
    position: absolute;
    width: 628px;
  }
  > h4.dragHandle {
    margin-top: 0;
    font-size: 13px;
    line-height: 30px;
    height: 32px;
    font-weight: normal;
    margin-bottom: 0;
    .quesItemTitle {
      display: inline-block;
      width: 450px;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
  }
  .quesItem-content {
    position: relative;
    margin-top: 15px;
    padding-right: 162px;
    .quesItem-content-info {
      font-size: 12px;
      color: #888;
      padding-top: 25px;
      text-indent: 4px;
    }
    .itemScore {
      position: absolute;
      width: 167px;
      right: 0;
      top: -3px;
      font-size: 12px;
      .itemScoreItem {
        padding-bottom: 10px;
        padding-left: 10px;
        text-align: right;
        .itemScoreItemTitle {
          display: inline-block;
          vertical-align: middle;
          width: 36px;
          text-align: right;
        }
      }
    }
    .singleChioce {
      li {
        display: inline-block;
        width: 200px;
        border: 1px solid #e8e8e8;
        height: 35px;
        padding: 0 10px;
        line-height: 35px;
        margin-right: 10px;
        margin-bottom: 10px;
        font-size: 13px;
        .singleChioceName {
          display: inline-block;
          width: 181px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        .singleChioceDel {
          display: none;
          font-size: 14px;
          i {
            cursor: pointer;
          }
        }
        &:hover {
          .singleChioceDel {
            display: block;
          }
        }
      }
    }
  }
}
.rewarditem {
  width: 610px;
}
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