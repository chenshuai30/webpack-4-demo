<template>   
    <div id='acitivityDetail'  v-loading.fullscreen.lock="detailLoading"  element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
        <div class="acitvity-detail-body">
            <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
                <!-- 活动信息 -->
                <el-tab-pane label="活动信息" name="first">
                    <detailinfo :data="activityDetail"></detailinfo>                   
                </el-tab-pane>
                <!-- 题目信息 -->
                <el-tab-pane v-if="ruleType === 'answer'" label="题目信息" name="third">
                    <div class="acitivity-detail-info activity-question-list">
                        <ul class="answer-ques">
                            <li v-for="item,index in activityDetail.config.questions" :key="index">
                                <h4 class="answer-ques-title">{{index+1+'. '+ item.question}}</h4>
                                <template v-if="item.type == 'radio'">
                                    <ul  class="answer-ques-item">
                                        <li v-for="val,key in item.content" :key="key">
                                            <span>{{rightArr[key] +'. '+ val.name}}</span>
                                        </li>
                                    </ul>
                                    <p v-show="activityDetail.rule.type === 0" class="answer-ques-rightkey">正确答案: {{  activityDetail.config.answers ? rightArr[ activityDetail.config.answers[index]]:rightArr[item.rightKey]}}</p>
                                </template>                                
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
                <!-- 奖品信息 -->
                <el-tab-pane label="奖品信息" name="second">
                    <div>
                        <el-row v-if="ruleType === 'turn' || ruleType === 'scratchcard'">
                            <el-col :span="3" v-for="item,index in activityDetail.config.rewardDataList" :key="index" style="margin-bottom:30px;">
                                <div class="acitivity-detail-info" style="border-right:1px solid #e8e8e8;padding-bottom:20px;">
                                    <detailreward :data="item.searchform" :rewardsList="rewardList"></detailreward>                                   
                                </div>
                            </el-col>
                        </el-row>

                        <el-row v-if="ruleType === 'answer'">
                            <div class="acitivity-detail-info">
                                <template v-if="activityDetail.rule.type == 2">
                                    <h3>通过条件</h3>
                                     <p class="acitivity-detail-info-item">
                                        <b>答对&nbsp;</b><span>{{activityDetail.config.rewards.haveReward.proportion || activityDetail.config.rewards.haveReward.condition || 0}}</span><b>&nbsp;道题可通过考试</b>
                                    </p>
                                </template>
                                <template v-else-if="activityDetail.rule.type == 3 || activityDetail.rule.type == 1">   
                                    <el-col :span="4" >
                                        <h4>空奖信息</h4>                                                                
                                        <detailreward rewardName="空" :data="activityDetail.config.rewards.nullReward" :rewardsList="rewardList"></detailreward>
                                    </el-col>
                                    <el-col :span="4" v-if="activityDetail.config.rewards.isHasRewards === 1">
                                         <h4>奖品信息</h4>
                                        <detailreward :data="activityDetail.config.rewards.haveReward" :rewardsList="rewardList"></detailreward>
                                    </el-col>
                                </template>   
                                <template v-else>
                                    <el-col :span="3" v-for="item,index in activityDetail.config.rewards.rewardsList" :key="index">
                                        <detailreward :hasProportion="false" :hasQues="true" :data="item.searchform" :rewardsList="rewardList"></detailreward>
                                    </el-col>               
                                </template> 
                            </div>
                        </el-row>
                    </div>
                </el-tab-pane>    
                <!-- 抽奖规则 -->
                <el-tab-pane label="抽奖规则" name="fourth">
                   <detailrule :data="activityDetail" :ruleType="ruleType"></detailrule>
                </el-tab-pane>
                <!-- 问卷统计 -->
                <el-tab-pane  v-if="ruleType === 'answer'" label="问卷统计">
                    <div class="answer-static-main">                        
                         <el-button size="mini" class="fr" @click="exportAllUserAnsList">导出全部答题记录</el-button>
                         <div v-show="statisticArr.length > 0" class="answer-statistic" v-for="item,index in statisticArr" :key="index">                           
                            <h4 class="answer-statistic-question"><span class="answer-statistic-index">{{'第'+(index+1)+'题'}}</span><span class="answer-statistic-ques">{{item.question}}</span></h4>
                            <ul v-if="item.content" class="answer-statistic-table">
                                <li class="answer-static-tr answer-static-header">
                                    <span class="answer-static-cell answer-static-chk">选项</span>
                                    <span class="answer-static-cell answer-static-sum">选项数</span>
                                    <span class="answer-static-cell answer-static-proption">比例</span>
                                </li>
                                <li v-for="val,key in item.content" :key="key" class="answer-static-tr answer-static-body">
                                    <span class="answer-static-cell answer-static-chk">{{rightArr[key]+'.&nbsp;&nbsp;'+val.name}}</span>
                                    <span class="answer-static-cell answer-static-sum">{{val.num}}</span>
                                    <span class="answer-static-cell answer-static-proption">
                                        <el-progress :text-inside="true" :stroke-width="18" :percentage="val.pct" status="success" style="line-height:40px;"></el-progress>
                                    </span>
                                </li>
                                <li class="answer-static-tr answer-static-footer">
                                    <span class="answer-static-cell answer-static-chk">本题有效填写人次</span>
                                    <span class="answer-static-cell answer-static-sum">{{allUsers}}</span>
                                    <span class="answer-static-cell answer-static-proption"></span>
                                </li>
                            </ul>
                            <div v-else>
                                <el-button @click="openQuestionList(item)" type="success" plain size="mini">查看问题详情</el-button>
                            </div>
                        </div>
                        <div v-show="statisticArr.length <= 0">
                            <p style="text-align:center;padding-top:200px;font-size:14px;color:#909399;">暂无数据...</p>
                        </div>
                    </div>                   
                </el-tab-pane>
                <el-tab-pane label="获奖名单" name="fifth">
                    <div class="winner-search">
                        <el-form size="mini" :inline="true" :model="winnerForm">
                            <el-form-item label="用户ID">
                                <el-input v-model="winnerForm.userId" placeholder="ID" style="width:100px;"></el-input>
                            </el-form-item>
                            <el-form-item label="用户名字">
                                <el-input v-model="winnerForm.userName" placeholder="名称"  style="width:120px;"></el-input>
                            </el-form-item>
                            <el-form-item label="用户电话">
                                <el-input v-model="winnerForm.userPhone" placeholder="电话" :maxlength="11"  style="width:120px;"></el-input>
                            </el-form-item>
                             <el-form-item label="城市">
                                <el-select v-model="winnerForm.cityId" filterable  placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option :label="item.CityName" v-for="item,index in cityList1" :key="index" :value="item.Id"></el-option>
                                </el-select>
                            </el-form-item>
                             <el-form-item label="奖品属性">
                                <el-select v-model="winnerForm.prizeAttr" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option
                                        v-if="item.id != 4"
                                        v-for="item in rewardsList"
                                        :key="item.id"
                                        :label="item.attrName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>                   
                            </el-form-item>
                            <el-form-item  label="活动时间">
                                <el-date-picker
                                    v-model="winnerForm.time"
                                    @change = "getWinnrFormTime"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-button size="mini" class="searchRewardBtn" @click="searchReward" type="primary">查询</el-button>
                        </el-form>
                    </div>
                    <div class="winner-table" v-loading="winTableLoading">
                        <el-table :data="winnerList" style="width: 100%">
                             <el-table-column type="expand">
                                <template slot-scope="props">
                                     <el-form label-position="left" label-width="80px" inline class="demo-table-expand">
                                        <el-row>
                                            <el-form-item label="奖品ID:">
                                                <span>{{props.row.prizeId}}</span>
                                            </el-form-item>
                                            <el-form-item label="奖品名称:">
                                                <span>{{props.row.prizeName}}</span>
                                            </el-form-item>
                                            <el-form-item label="奖品属性:">
                                                <span>{{props.row.prizeParam ? getPrizeName(props.row.prizeParam.attrs) :''}}</span>
                                            </el-form-item>
                                            <el-form-item label="奖品库存:">
                                                <span>{{props.row.prizeParam ? props.row.prizeParam.prizeNum :''}}</span>
                                            </el-form-item>
                                            <el-form-item label="奖品图片:">
                                                <img width="70px" :src="props.row.prizeParam?props.row.prizeParam.prizeIcon:''"/>
                                            </el-form-item>
                                            <el-form-item v-if="props.row.prizeParam.attrs == 2" label="U币金额:">
                                                <span>{{props.row.prizeParam ? props.row.prizeParam.prizeVal :''}}</span>
                                            </el-form-item>
                                            <el-form-item v-if="props.row.prizeParam.attrs == 1" label="优惠券码:">
                                                <span>{{props.row.prizeParam ? props.row.prizeParam.prizeVal :''}}</span>
                                            </el-form-item>
                                            <el-form-item  v-if="props.row.prizeParam.attrs == 3" label="现金金额:">
                                                <span>{{props.row.prizeParam ? props.row.prizeParam.prizeVal :''}}</span>
                                            </el-form-item>
                                        </el-row>                     
                                         <el-row>
                                            <el-col :span="24">
                                                <el-form-item label="奖品描述:">
                                                    <span>{{props.row.prizeParam ? props.row.prizeParam.prizeDesc :''}}</span>
                                                </el-form-item>
                                            </el-col>
                                         </el-row>                                       
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column prop="userId" label="用户ID"  align="center"></el-table-column>
                             <el-table-column prop="cityName" label="所属城市"  align="center"></el-table-column>
                            <el-table-column prop="userName" label="获奖人"  align="center"></el-table-column>
                            <!-- <el-table-column label="头像" align="center" width="50px">
                                <template slot-scope="scope">
                                    <img :src="scope.row.userPhoto" width="30"/>
                                </template>
                            </el-table-column> -->
                            <el-table-column align="center" prop="userPhone" label="用户电话"></el-table-column>
                            <el-table-column align="center" prop="prizeName" label="奖品名称"></el-table-column>
                            <el-table-column align="center" prop="time" label="获奖时间">
                                <template slot-scope="scope">
                                    {{$util.coverDate(new Date(scope.row.time))}}
                                </template>
                            </el-table-column>      
                            <el-table-column align="center" prop="state" label="奖品状态">
                             <template slot-scope="scope">
                                 <span :style="{color:getPrizeColor(scope.row.state)}">{{prizeStateList[scope.row.state+'']}}<i class="el-icon-edit" style="cursor:pointer;margin-left:5px;"  @click="changePrizeState(scope.row)"></i></span>                                 
                            </template>
                            </el-table-column>
                        </el-table>
                        <div class="winner-page">
                            <el-button size="mini" style="vertical-align:middle;" type="success" @click="exportExcel">导出表格</el-button>
                            <el-pagination
                                style="display:inline-block;vertical-align:middle;"
                                :background="true"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="pageIndex"
                                :page-sizes="[10,20,30,40]"
                                :page-size="pageSize"
                                layout="sizes, prev, pager, next,total"
                                :total="winnerTotal">
                            </el-pagination>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="传播数据" name="sixth">
                    <div class="acitvity-echarts">
                        <div class="acitvity-echarts-title">                            
                            <ul> 
                                <li class="acitivity-echarts-title-left"><span><b></b>整体趋势</span></li>
                                <!-- <li :class="{'acitivity-echarts-title-active':activeSub == item.id}" v-for="item,key in subList" @click="changeSub(item)" :key="key"><span>{{item.title}}</span></li> -->
                                <li>
                                    活动时间：
                                    <el-date-picker
                                    :picker-options="dateOptions"
                                    size="mini"
                                    v-model="activityTime"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                    </el-date-picker>
                                </li>
                            </ul>
                            <div class="acitivity-echarts-title-btn">
                                <el-button @click="searchEcharts" size="mini" icon="el-icon-search">查询</el-button>
                                <!-- <el-button size="mini" icon="el-icon-upload2">导出</el-button> -->
                            </div>
                        </div>
                        <div class="acitvity-echarts-nav">
                            <p>
                                <span>浏览：<b>{{activityDetail.uv}}人（{{activityDetail.views}}次）</b></span>
                                <span>参与：<b>{{activityDetail.joinNum}}人（{{activityDetail.joinTime}}次）</b></span>
                                <span>获奖：<b>{{activityDetail.winUser}}人（{{activityDetail.winTime}}次）</b></span>
                                <span>注册人数：<b>{{activityDetail.registerNumer || 0}}人</b></span>
                            </p>
                        </div>
                        <div class="acitivity-echarts-body" id="activityEchartsBody">
                            <div id="activityEcharts" ref="echarts"></div>
                        </div>
                    </div>
                </el-tab-pane>
                <!-- <el-tab-pane label="中奖规则" name="fourth">中奖规则</el-tab-pane> -->
                <!-- <el-tab-pane label="中奖统计" name="fifth">中奖统计</el-tab-pane> -->
            </el-tabs>
        </div> 

        <el-dialog
            title="修改状态"
            :visible.sync="changeRewardStateFlag"
            :modal-append-to-body = "false"
            width="500px">
            <div class="rewardStateContent">
                <div>
                    <el-form ref="rewardStateForm" :model="rewardStateForm" :rules="rewardStateRules" label-width="100px">
                        <el-form-item label="领取状态" prop="state">
                            <!-- 未登记 -->
                            <template v-if="curPrizeElement.state == -1">
                                <el-radio-group v-model="rewardStateForm.state" size="mini">
                                    <el-radio :label="0" border>未领取</el-radio>
                                    <el-radio :label="1" border>已领取</el-radio>
                                </el-radio-group>
                            </template>
                            <!-- 未领取 -->
                            <template v-if="curPrizeElement.state == 0">
                                <el-radio-group v-model="rewardStateForm.state" size="mini">
                                    <el-radio :label="1" border>已领取</el-radio>
                                </el-radio-group>
                            </template>
                            <!-- 已领取 -->
                            <template v-if="curPrizeElement.state == 1">
                                <el-radio-group v-model="rewardStateForm.state" size="mini">
                                    <el-radio :label="0" border>未领取</el-radio>
                                </el-radio-group>
                            </template>
                        </el-form-item>
                        <el-form-item label="修改原因" prop="opReason">
                            <el-input type="textarea" v-model="rewardStateForm.opReason"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeRewardStateFlag = false">取 消</el-button>
                <el-button type="primary" @click="changeRewardStateOk">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="问题详情" :modal-append-to-body = "false" :visible.sync="quesFlag" width="800px">
            <div>
                <div>
                    <h4 style="margin:0;font-size:15px;line-height:25px;">{{quesContent}}</h4>
                </div>
                <div style="padding:15px 0;">
                    <el-input size="mini" v-model="quesTxtForm" style="width:651px;vertical-align:middle"></el-input>
                    <el-button size="mini" @click="getQuesList" type="primary">搜索答案文本</el-button>
                </div>
                <div>           
                    <el-table  v-loading="quesLoading" size="mini" :data="quesList" style="width: 100%" height="400">
                        <el-table-column align="center" prop="id" label="ID" width="60"></el-table-column>
                        <el-table-column align="center" prop="userName" label="用户名称" width="120"></el-table-column>
                        <el-table-column align="center" prop="userPhone" label="用户电话" width="120"></el-table-column>
                        <el-table-column prop="answer" label="答案"></el-table-column>
                        <el-table-column align="center" label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="seeUserAnswers(scope.row)">查看答卷</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-pagination
                    style="display:inline-block;"
                    @size-change="handleQuesSizeChange"
                    @current-change="handleQuesCurrentChange"
                    :current-page="quesPageIndex"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="quesPageSize"
                    layout="sizes, prev, pager, next, total"
                    background
                    :total="quesTotal">                      
                </el-pagination>
                <el-button size="mini" type="primary" @click="exportUserAnsList" style="vertical-align:text-top;">导出</el-button>           
            </span>
        </el-dialog>

        <el-dialog title="用户答卷详情" :modal-append-to-body = "false" :visible.sync="userAnswerFlag" width="700px">
            <div style="height:600px;overflow:hidden;" v-loading="userAnsLoading">
                <div style="padding-bottom:15px;width:100%;height:100%;padding-right:20px;overflow-y:auto;">
                    <ul>
                        <li v-for="item,index in activityDetail.config.questions" :key="index">
                            <h4 style="margin:5px 0;background-color:#d3dce6;line-height:30px;padding-left:5px;">{{index+1+'. '+ item.question}}</h4>
                            <template v-if="item.type == 'radio'">
                                <div style="padding-left:15px;">
                                    <ul>
                                        <li v-for="val,key in item.content" :key="key">
                                            <span>{{rightArr[key] +'. '+ val.name}}</span>
                                        </li>
                                    </ul>
                                    <p>用户答案: {{rightArr[ userAnsList[index]]}}</p>
                                </div>   
                            </template>
                            <template v-else>
                                <p style="padding:0 15px;" v-html="userAnsList[index]"></p>
                            </template>                           
                        </li>
                    </ul>
                </div>
            </div>
            <!-- <span slot="footer" class="dialog-footer"></span> -->
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;
export default {
    name: 'activitydetail',
    data(){
         let formateV =  (rule, value, callback, source, options)=>{
            // let reg = new RegExp("[()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
            // (\ )、(\?)、(\+)、(\=)(\~)(\!)(\@)(\%)(\#)(\$)(\^)(\&)(\*)(\()(\))(\-)(\_)(\[)(\])(\;)(\:)
            let reg = new RegExp(/[(\{)(\})(\|)(\\)(\')(\")(\.)(\/)(\<)(\>)(\\)]+/);
            if(reg.test(value)){
                callback(new Error('输入内容不能包含特殊字符,如. \' "'));
            }else{
                callback();
            }
        }
        let that = this;
        return{
            activeName:'first',
            activityId:'',
            ruleType:'',
            activityDetail:{config:{rewardDataList:[],rewards:{}},rule:{}},
            rewardList:[
                {label:'实物奖品',value:99},
                {label:'优惠券',value:1},
                {label:'U币',value:2},
                {label:'账户余额',value:3},
                {label:"空",value:4},
                {label:"微信红包",value:5},
                {label:"积分",value:7},
                {label:"收益翻倍卡",value:6}
            ],
            userTypeList:[],
            // runmanTypeList:[],
            businessList:[
                {name:'全部',id:-1},
                {name:'帮我送',id:0},
                {name:'帮我买',id:1},
                {name:'电车奔奔',id:2},
                {name:'帮我取',id:3},
                {name:'代排队',id:4},
                {name:'就近买',id:5},
                {name:'计时帮帮',id:6},
                {name:'非计时帮帮',id:7},
                {name:'车服务',id:8},
                {name:'帮我找',id:9},
                {name:'自定义帮帮',id:10},
                {name:'OFFICE专送',id:11},
                {name:'OFFICE专取',id:12},
                {name:'U种兵帮我送',id:13},
                {name:'U种兵帮我取',id:14},
                {name:'拍照帮我送',id:15},
                {name:'疯猴子订单',id:16},
            ],
            ruleList:[
                {id:0,label:'每天累计'},
                {id:1,label:'活动期内累计'},
            ],
            detailLoading:true,
            rewardsList:[],
            platList:[
                {id:-999,name:'全部'},
                {id:0,name:'全部'},
                {id:1,name:'微信端'},
                {id:2,name:'App端'},
            ],
            cityList:[],
            cityList1:[],
            winnerList:[],
            winnerTotal:0,
            pageIndex:1,
            pageSize:10,
            winTableLoading:false,
            limitTimeArr:[
                {id:0,value:'不限时'},
                {id:1,value:'10秒'},
                {id:2,value:'20秒'},
                {id:3,value:'30秒'}
            ],
            rightArr:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','p','Q','R','S','T','U','V','W','X','Y','Z'],
            statisticArr:[],//统计列表
            allUsers:0,
            eDom:"",
            userTypeArr:[
                {id:0,name:'全部'},
                {id:1,name:'用户'},
                {id:2,name:'跑男'},
            ],
            winnerForm:{
                userId:'',
                userName:'',
                userPhone:'',
                prizeAttr:'',
                time:[],
            },
            changeRewardStateFlag:false,
            curPrizeElement:'',
            prizeStateList:{
                '-1':'未登记',
                '0':'未领取',
                '1':'已领取'
            },
            rewardStateForm:{
                opReason:'',
                state:''
            },
            rewardStateRules:{
                state: [
                    { type: 'number', required: true, message: '请选择领取状态', trigger: 'change' }                   
                ],
                opReason: [
                    { required: true, message: '请填写修改原因', trigger: 'blur' },
                    { validator:formateV, trigger:'blur'}
                ]
            },
            formatReg:'',
            quesFlag:false,
            quesPageIndex:1,
            quesPageSize:10,
            quesList:[],
            quesTotal:0,
            quesTxtForm:'',
            quesContent:'',
            quesLoading:false,
            userAnswerFlag:false,
            userAnsDom:'',
            userAnsList:[],
            userAnsLoading:false,
            allUserAnsDom:'',
            option:{
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['浏览人数','参与人数','获奖人数']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {},
                        restore: {  
                            show: true  //还原  
                        },  
                        magicType: {  
                            type: ['line','bar']  //动态类型切换  
                        } 
                    },
                    right:50                 
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['01-01','01-02','01-03','01-04','01-05']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'浏览人数',
                        type:'line',
                        // stack: '总量',
                        data:[0, 0, 0, 0, 0]
                    },
                    {
                        name:'参与人数',
                        type:'line',
                        // stack: '总量',
                        data:[0, 0, 0, 0, 0]
                    },
                    {
                        name:'获奖人数',
                        type:'line',
                        // stack: '总量',
                        data:[0, 0, 0, 0, 0]
                    }                   
                ],                
            },
            myChart:'',
            subList:[
                {
                    id:0,
                    title:'今日',
                },{
                    id:1,
                    title:'昨日',
                },{
                    id:2,
                    title:'最近7日',
                },{
                    id:3,
                    title:'最近30日',
                },{
                    id:4,
                    title:'本月',
                },{
                    id:5,
                    title:'活动期间'
                }                
            ],
            activeSub:5,
            activityTime:[],
            dateOptions:{
                disabledDate(time) {
                    let now = Date.now() - 8.64e7;
                    if(that.startTime){
                        now = that.startTime.getTime()-8.64e7;
                    }
                    // let now = that.startTime ? that.startTime : (Date.now() - 8.64e7);
                    return time.getTime() < now;
                }
            },
            startTime:'',
            aTimeObj:{
                jointime:0,
                uvtime:0,
                wintime:0
            }
        }
    },
    created(){
        this.activityId = this.$route.params.id;  
        this.ruleType = this.$route.params.ruletype;
        this.formatReg = new RegExp(/[(\#)(\$)(\^)(\&)(\*)(\()(\))(\-)(\_)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\.)(\/)(\<)(\>)(\\)]+/);

        // 根据用户和跑男获取列表
        // this.getUserType(1,'userTypeList');
        // this.getUserType(2,'runmanTypeList');

        // 获取用户和跑男奖品类型
        this.getRewards();

        // 获取城市
        this.getCityList();       
       

        // 获取统计数据
        // this.getStatic(this.activityId);

        this.startTime = Date.now();
        
    },
    mounted(){
        this.getDetail();

        let that = this;
        window.onresize = function(){
            if(that.myChart){
                that.myChart.resize();
            }
        };
    },
    methods:{
        tabClick(tab){
            if(tab.name === 'sixth'){
                console.log('options...');
                this.$nextTick(()=>{
                    if(!this.myChart){
                        this.myChart = this.$echarts.init(this.$refs.echarts);  
                    }                    
                    this.myChart.setOption(this.option);
                })               
            }
        },
        back(){
            this.$router.back();
        },
        // 获取活动详情
        getDetail(){
            let that = this;      
            this.$post({
                url:REQUEST_PATH+'activity/getActivity',
                data:{id:this.activityId},
                loading:'detailLoading',
                success:(res)=>{
                    // console.log('activity detail...');
                    // console.log(res)
                    if(!res.data.data){return;}
                    this.startTime = new Date(res.data.data[0].startTime);
                    let aStartTime = new Date(res.data.data[0].startTime);
                    let aEndTime = new Date(res.data.data[0].endTime);
                    aStartTime = aStartTime.getTime();
                    aEndTime = aEndTime.getTime();

                    let nowTime = new Date;
                    nowTime = nowTime.getTime();
                    if(nowTime >= aStartTime){
                        if(nowTime < aEndTime){
                            this.activityTime.push(new Date(res.data.data[0].startTime));
                            this.activityTime.push(new Date);
                        }else{
                            this.activityTime.push(new Date(res.data.data[0].startTime));
                            this.activityTime.push(new Date(aEndTime));
                        }                        
                    }else{
                        let end = aStartTime + 8.64e7;
                        this.activityTime.push(new Date(res.data.data[0].startTime));
                        this.activityTime.push(new Date(end));
                    }
                   
                    this.activityDetail = res.data.data[0];                    
                    this.activityDetail.startTime = this.$util.coverDate(new Date(this.activityDetail.startTime));
                    this.activityDetail.endTime = this.$util.coverDate(new Date(this.activityDetail.endTime));
                    this.activityDetail.config = JSON.parse(this.activityDetail.config);
                    this.activityDetail.rule = JSON.parse(this.activityDetail.rule);
                    if(this.ruleType == 'answer'){
                        if(this.activityDetail.rule.hasOwnProperty('limitTime')){
                             this.limitTimeArr.map(item=>{
                                if(item.id == this.activityDetail.rule.limitTime){
                                    this.activityDetail.rule.limitTimeName = item.value;
                                }
                            });
                        }
                    }

                    this.businessList.map(item=>{
                        if(this.activityDetail.rule.business == item.id){
                            this.activityDetail.rule.businessName = item.name;
                        }
                    })
                    this.platList.map(item=>{
                        if(item.id == this.activityDetail.usePlat){
                            this.activityDetail.usePlatName = item.name;
                            return;
                        }
                    })
                    this.getUserType(this.activityDetail.usePerson);
                    this.getStatic(this.activityId);
                    // console.log(this.activityDetail);

                    //获取表格数据
                    // let curday = new Date();
                    // let end = this.$util.coverDay(curday);
                    // this.getChartData(this.$util.coverDay(res.data.data[0].startTime),end);
                    this.searchEcharts();
                }
            })    
        },
        getRewards(){
            let that = this;
            this.$post({
                url:REQUEST_PATH+'prize/getPrizeAttr',
                data:{
                    userTypeId:-999,
                    sort:'asc'
                },
                success:(res)=>{
                    this.rewardsList = res.data.data; 
                    // 获取奖品列表
                    this.getWinnerList();
                    switch(this.ruleType){
                        case 'turn':{
                            this.activityDetail.config.rewardDataList.map((item,index)=>{                       
                                this.rewardsList.map(val=>{
                                    if(val.id == item.searchform.attrs){
                                        item.searchform.attrName = val.attrName;
                                        return;
                                    }
                                })
                                return item;
                            })
                            break;
                        }
                        case 'answer':{
                            // console.log('attrname...')
                            this.rewardsList.map(item=>{
                                if(item.id == this.activityDetail.config.rewards.haveReward.attrs){
                                    this.activityDetail.config.rewards.haveReward.attrName = item.attrName
                                }
                            })
                            break;
                        }
                    }

                }
            })
        },
        getPrizeName(num){
            let name = '';
            this.rewardsList.map(item=>{
                if(item.id == num){
                    name = item.attrName;
                    return;
                }
            })
            return name;
        },
        getCityList(){
            let that = this;
            this.$post({
                url:REQUEST_PATH+'common/getCity',
                data:{},
                success:(res)=>{
                    this.cityList = res.data.data;
                    res.data.data.map(item=>{
                        this.cityList1.push(item);
                    })                   
                    this.cityList.unshift({CityName:'全部',Id:0});
                    this.cityList.map(item=>{
                        if(item.Id == this.activityDetail.limitCity){                       
                            this.activityDetail.cityName = item.CityName;                     
                        }
                    })        
                }
            })
        },
        // 获取对象分类
        getUserType(type){
            let that = this;
            this.$post({
                url:REQUEST_PATH+'activity/getUseType',
                data:{ useType:type},
                success:(res)=>{
                    this.userTypeList = res.data.data;
                    this.userTypeList.map(item=>{
                        if(item.id == this.activityDetail.personType){
                            this.$set(this.activityDetail,'personTypeName',item.useName);
                        }
                    })
                }
            })
        },        
        getTypeById(arr,id){
            let cur = '';
            arr.map(item=>{
                if(item.id == id){
                    cur = item;
                }
            })
            return cur;
        },
        // 获取统计数据
        getStatic(aid){
            this.$post({
                url:REQUEST_PATH+'activity/getActivityCount',
                data:{activityId:aid},
                success:(res)=>{
                    // console.log('统计...')
                    // console.log(res)
                   this.allUsers = res.data.allUser;
                   res.data.data.map((item,index)=>{
                       if(item.length >0){
                            item.map((val,key)=>{
                                val.name = this.activityDetail.config.questions[index].content[key].name;
                                return val;
                            })
                            this.statisticArr.push({
                                question:this.activityDetail.config.questions[index].question,
                                content:item,
                                answer:this.activityDetail.config.answers[index] || ''
                            });                         
                       } else{
                            this.statisticArr.push({
                                question:this.activityDetail.config.questions[index].question,
                                index:index,
                                content:false,
                                answer:false
                            });     
                       }                   
                   })
                //    console.log(this.statisticArr)
                }
            })
        },
        // 统计问答题弹框
        openQuestionList(item){
            this.quesFlag = true;
            this.quesContent ='第' + (item.index+1) + '题 ' + item.question;
            this.curQuesIndex = item.index;
            this.getQuesList();
        },
        handleQuesSizeChange(size){
            this.quesPageSize = size;
            this.getQuesList();
        },
        handleQuesCurrentChange(page){
            this.quesPageIndex = page;
            this.getQuesList();
        },
        getQuesList(){            
            this.$post({
                url:REQUEST_PATH+'activity/getUserAnswerByIndex',
                data:{
                    activityId:this.activityId,
                    paper:this.quesTxtForm,
                    index:this.curQuesIndex,
                    pageIndex:this.quesPageIndex,
                    pageSize:this.quesPageSize
                },
                loading:'quesLoading',
                success:(res)=>{
                    // console.log('ques list res...')
                    // console.log(res);
                    this.quesList = res.data.data;
                    this.quesTotal = res.data.total;
                }                
            })
        },
        seeUserAnswers(row){
            // 获取用户答案
            this.userAnswerFlag = true;
            this.$post({
                url:REQUEST_PATH+'activity/getUserAllAnswer',
                data:{
                    activityId:this.activityId,
                    userId:row.userId
                },
                loading:'userAnsLoading',
                success:(res)=>{
                    this.userAnsList = res.data.data;
                }             
            })
        },       
        // 导出用户答案记录
        exportUserAnsList(){
            let url = REQUEST_PATH+'activity/downCurrentAnswer?index='+this.curQuesIndex+'&activityId='+this.activityId;          
            if(!this.userAnsDom){
                let a = document.createElement('a');
                a.href = url;
                document.body.append(a)
                this.userAnsDom = a;
                a.download = true;
                a.style.display = 'none';
                a.click();
            }else{          
                this.userAnsDom.href = url;   
                this.userAnsDom.click();
            }
        },
        exportAllUserAnsList(){
            let url = REQUEST_PATH + 'activity/downAllAnswer?activityId='+this.activityId;
            if(!this.allUserAnsDom){
                let a = document.createElement('a');
                a.href = url;
                document.body.append(a)
                this.allUserAnsDom = a;
                a.download = true;
                a.style.display = 'none';
                a.click();
            }else{          
                this.allUserAnsDom.href = url;   
                this.allUserAnsDom.click();
            }
        },
        getArrtName(item){
            let name= '';
            switch(this.ruleType){
                case 'turn':{
                    // this.activityDetail.config.rewardDataList.map((item,index)=>{                       
                        this.rewardsList.map(val=>{
                            if(val.id == item.searchform.attrs){
                                item.searchform.attrName = val.attrName;
                                name = val.attrName;
                                return;
                            }
                        // })
                        return item;
                    })
                    break;
                }
                case 'answer':{
                    console.log('attrname...')
                    this.rewardsList.map(val=>{
                        if(val.id == item.attrs){
                            this.activityDetail.config.rewards.haveReward.attrName = val.attrName;
                            name = val.attrName;
                        }
                    })
                    break;
                }
            }
            return name;
        },
        // 奖品列表
        getWinnerList(){
            if(this.$util.sqlReg.test(this.winnerForm.userName)){
                this.$message.warning('请您不要在参数中输入特殊字符和SQL关键字');
                return;
            }

            if(!this.$util.numReg.test(this.winnerForm.userPhone)){
                this.$message.warning('请输入正确的电话号码');
                return;
            }

            let that = this;
            let obj = {
                activityId:this.activityId,
                pageIndex:this.pageIndex,
                pageSize:this.pageSize
            }
            obj = Object.assign(obj,this.winnerForm);

            this.$post({
                url:REQUEST_PATH+'activity/getWinuser',
                data:obj,
                success:(res)=>{                
                    this.winnerList = res.data.data;
                    this.winnerTotal = res.data.total;
                }
            })
        },
        searchReward(){
            // console.log('查询...');
            this.pageIndex = 1;
            this.getWinnerList();
        },
        handleSizeChange(size){
            this.pageSize = size;
            this.getWinnerList();
        },
        handleCurrentChange(page){
            this.pageIndex = page;
            this.getWinnerList();
        },
        exportExcel(){   
            let params = '';
            for(let i in this.winnerForm){

                params +='&'+i+'='+this.winnerForm[i]
            }
            // console.log(params)
            // '&all=true'
            // return;
            if(!this.eDom){   
                let a = document.createElement('a');
                a.href = REQUEST_PATH + 'activity/downloadExcel?activityId='+this.activityId+params
                document.body.append(a)
                this.eDom = a;
                a.download = true;
                a.style.display = 'none';
                a.click();
            }else{
                this.eDom.href = REQUEST_PATH + 'activity/downloadExcel?activityId='+this.activityId+params
                this.eDom.click();
            }          
    
            // this.exportMethod();
        },
        exportMethod(url){
            if(!this.eDom){
                this.$util.exportFile(url);
            }else{
                this.eDom.submit();
            }
        },
        downFile:(blob, fileName) => {
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, fileName);
            } else {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(link.href);
            }
        },
        getWinnrFormTime(date){
            console.log('时间改变...')
            console.log(date)
        },
        changePrizeState(row){
            // console.log('修改奖品状态...')
            this.curPrizeElement = row;
            this.changeRewardStateFlag = true;
            // console.log(row);
            this.$nextTick(()=>{
                this.$refs.rewardStateForm.resetFields();
            })
        },
        changeRewardStateOk(){
            this.$refs.rewardStateForm.validate((valid)=>{
                if(valid){
                    this.changeRewardStateOkAjax();
                }
            }) 
        },
        changeRewardStateOkAjax(){
            this.$post({
                url:REQUEST_PATH+'activity/editPrizeState',
                data:{
                    id:this.curPrizeElement.id,
                    params:{                        
                        userId:sessionStorage.getItem('unum'),
                        userName:sessionStorage.getItem('uname'),
                        opType:0,
                        opReason:this.rewardStateForm.opReason,
                        oldResult:this.curPrizeElement.state
                    },
                    state:this.rewardStateForm.state
                },
                success:(res)=>{
                    this.$message.success('状态修改成功！');
                    this.changeRewardStateFlag = false;
                    this.getWinnerList();
                }
            })
        },
        getPrizeColor(state){
            switch(state){
                case -1:{
                    return '#E6A23C';
                    break;
                }
                case 0:{
                    return '#909399';
                    break;
                }
                case 1:{
                    return '#67C23A';
                    break;
                }
            }
        },
        changeSub(item){
            this.activeSub = item.id;
        },
        searchEcharts(){
            if(!this.activityTime){this.$message.warning('请选择日期');return}
            if(!this.activityTime[0] || !this.activityTime[1]){
                this.$message.warning('请选择日期');
                return;
            }
            let start,end;
            start = this.$util.coverDay(this.activityTime[0]);
            end = this.$util.coverDay(this.activityTime[1]);
            this.getChartData(start,end);
        },
        // 获取表格数据
        getChartData(start, end){
            this.$post({
                url:REQUEST_PATH+'activity/getActivityCharts ',
                data:{
                    activityId:this.activityId,
                    start:start,
                    end:end,
                    serverPort:this.activityDetail.serverPort
                },
                success:(res)=>{
                    console.log('表格数据 options...');
                    // console.log(res);
                    let d = res.data.data;
                    d.series.map(val=>{
                        delete val.stack;
                    })
                    this.aTimeObj = {
                        jointime : d.jointime,
                        uvtime : d.uvtime,
                        wintime : d.wintime
                    }
                    this.activityDetail.registerNumer = d.registerNumer;
                    console.log(this.activityDetail);
                    this.option.legend = d.legend;
                    this.option.xAxis.data = d.xAxis.data;
                    this.option.series = d.series;
                    if(this.myChart){this.myChart.setOption(this.option);}
                }
            })
        },
    }
}
</script>

<style lang="less" scoped rel="stylesheet/less">
 #acitivityDetail{
     padding:20px;    
     .activity-question-list,
     .answer-static-main{
        position: absolute;
        bottom: 60px;
        top: 0;
        overflow: hidden;
        overflow-y: auto;
        padding-bottom: 20px;
        right: -17px;
        padding-right: 30px;
        left: 0;
     }
 }
 .acitvity-detail-head{
     padding-bottom:20px;
 }
 .acitivity-detail-info{
    font-size:14px;
    padding:0 15px;
    line-height:30px;
    h4{
        font-size:15px;
        margin:10px 0;
    }
 }
 .acitivity-detail-info{
   p.acitivity-detail-info-item{
       b{
        font-weight:normal;
        color:#333;
        display:inline-block;
       }
       span{
           color:#888;
           font-size:13px;
       }
   }
   .answer-ques{
       h4.answer-ques-title{
        //    font-weight: normal;
           margin:0;
        //    height:40px;
           line-height:25px;
       }
       .answer-ques-rightkey{
           font-size:13px;
           color:#888;
       }
   }
 }
 .answer-statistic{
     .answer-statistic-question{
         font-size:14px;
         font-weight:normal;
         line-height:20px;
        .answer-statistic-index{
            float:left;
            padding-right:15px;
        }
        .answer-statistic-ques{
            display:block;
            overflow:hidden;
        }
     }
     .answer-statistic-table{
        border:1px solid #e8e8e8;
        width:1000px;
        line-height:40px;
        font-size:13px;
        color: #606266;
        .answer-static-tr{
            border-bottom:1px solid #e8e8e8;
            font-size:0;
        }
        .answer-static-cell{
            padding:0 10px;
            display:inline-block;
            height:40px;
            vertical-align: middle;
            border-right:1px solid #e8e8e8;    
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;    
            font-size:13px;    
            &:last-child{
                border-right:none;
            }
            &.answer-static-chk{
                width:309px;
            }
            &.answer-static-sum{
                width:89px;
            }
            &.answer-static-proption{
                width:540px;
            }
        }
        .answer-static-header,
        .answer-static-footer{
            background-color: #f6f8f9;
            color: #909399;
            text-align:center;
        }
        .answer-static-footer{
            border-bottom:none;
        }
        .answer-static-body{
            .answer-static-sum{
                text-align: center;
            }
        }
     }     
 }
 .acitvity-echarts{
    .acitvity-echarts-title{
        height:40px;
        line-height: 45px;
        padding-bottom:10px;
        font-size:14px;
        border-bottom:1px solid #e4e7ed;
        overflow:hidden;
        position:relative;
        li.acitivity-echarts-title-left{
            float:left;
            font-size:16px;
            b{
                background-color: #409EFF;
                margin-right: 10px;
                display: inline-block;
                width: 5px;
                height: 20px;
                vertical-align: text-top;     
            }
        }
        ul{
            display:block;
            overflow:hidden;
            padding-right:90px;
            text-align:right;
            li{
                display:inline-block;
                margin-right:15px;
                cursor:pointer;
                &:hover,
                &.acitivity-echarts-title-active{
                    color:#409EFF;
                }
            }
        }
        .acitivity-echarts-title-btn{
            position:absolute;
            right:15px;
            top:0;
        }
    }
    .acitvity-echarts-nav{
        font-size:14px;
        text-align:right;
        height:50px;
        line-height:50px;
        border-bottom:1px solid #e4e7ed;
        span{
            margin-right:15px;
            b{
                font-weight:normal;
                color:#409EFF;
            }
        }
    }
    .acitivity-echarts-body{
        width:100%;
        padding-top:30px;
        #activityEcharts{
            width:100%;
            height:500px;
        }
    }
 }
</style>