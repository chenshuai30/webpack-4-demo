<template>
  <!-- 当前模板所建活动列表 -->
  <div id='aia-activity-list' v-loading.fullscreen.lock="tableLoading"  element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
    <div class="aia-alist-header">
      <div class="aia-alist-search">
        <el-form :inline="true" size="mini" :model="searchForm" :class="{'aia-form-inline':true,'aia-show':isShow}">
          <el-form-item label="类型" ref="firstItem">
            <el-cascader size="mini" :options="selList" @change="getTemplatId" v-model="selVal">
            </el-cascader>
          </el-form-item>
          <el-form-item label="活动名称">
            <el-input v-model="searchForm.name" placeholder="请填写名称"  :maxlength="12"></el-input>
          </el-form-item>
          <el-form-item label="活动状态">
            <el-select v-model="searchForm.state" placeholder="活动状态">
              <el-option label="所有" value=""></el-option>
              <el-option label="开启" :value="1"></el-option>
              <el-option label="关闭" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市">
            <el-select v-model="searchForm.limitCity" filterable  placeholder="请选择">
                <el-option :label="item.CityName" v-for="item,index in cityList" :key="index" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用平台">
            <el-select v-model="searchForm.usePlat" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="App" :value="2"></el-option>
              <el-option label="微信" :value="1"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="使用对象" ref="lastItem">
            <el-select v-model="searchForm.usePerson" filterable  placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="用户" :value="1"></el-option>
              <el-option label="跑男" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="所属类型">
            <el-select v-model="searchForm.typeId" placeholder="所属模板">
              <el-option :label="item.typeName" :value="item.id" v-for="item,index in tempArr" :key="index"></el-option>
            </el-select>
          </el-form-item> -->
          <el-button-group class="aia-form-btn">
            <el-button type="primary" @click="onSubmit" size="mini" icon="el-icon-search">查询</el-button>
            <el-button v-if="powerBtns.add" @click="newActivity" icon="el-icon-plus" size="mini">创建新活动</el-button>
            <el-button v-show="showArrow" @click="isShow = !isShow" size="mini">
              <i v-show="!isShow" class="el-icon-caret-bottom"></i>
              <i v-show="isShow" class="el-icon-caret-top"></i>
            </el-button>
          </el-button-group>
        </el-form>
      </div>
    </div>
    <div class="aia-alist-main" ref="alistMain">
      <el-table :data="tableData" style="width:100%"  :height="tableHeight">
        <!-- <el-table-column v-for="item,index in columns" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" :align="item.align || 'left'">
        </el-table-column> -->
        <el-table-column prop="id" label="id" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
         <el-table-column prop="name" min-width="200" label="活动名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
            <span v-if="baseUrl!=='http://aiats.mit.cn/' && scope.row.serverPort" class="newactivity-tb-badge">{{scope.row.serverPort || ''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="limitCityName" width="170" label="限用城市" align="center">
           <template slot-scope="scope">
             <span>{{scope.row.limitCityName}}</span>
           </template>
        </el-table-column>
         <el-table-column prop="templetName" width="110" label="所属模板" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.templetName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="usePerson" label="使用对象" width="80" align="center">
          <template slot-scope="scope">
            <span>{{userTypeArr[scope.row.usePerson].name}}</span>
          </template>
        </el-table-column>
         <el-table-column prop="usePlat" label="使用平台" width="80" align="center">
          <template slot-scope="scope">
            <span>{{platList[scope.row.usePlat]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="有效期" width="320" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.startTime + ' 至 ' + scope.row.endTime }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="joinNum" label="参与人数" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.joinNum}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="winUser" label="中奖用户" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.winUser}}</span>
          </template>
        </el-table-column>
        <el-table-column  v-if="powerBtns.onOff" label="开启状态" prop="state" width="90" align="center">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.state == -1">活动已过期</span> -->
            <el-switch @change="changeSwitch(scope.row)" active-text="关" inactive-text="开" v-model="scope.row.state" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="可用状态" prop="state" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isEffective">活动有效</span>
             <span v-if="!scope.row.isEffective">活动已过期</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" prop="createAt" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createAt}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button v-if="powerBtns.detail" @click="handleDetail(scope.row)" type="text" size="small">详情</el-button>
            <el-button v-if="powerBtns.edit" type="text" size="small" @click="editActivity(scope.row)">编辑</el-button>
            <el-button v-if="powerBtns.del" type="text" @click="delActivity(scope.row)" size="small">删除</el-button>
            <!-- <el-button type="text" size="small" v-popover:popover2></el-button> -->
            <el-popover ref="poperoverlink" placement="right" width="400" trigger="click">
                <input style="width:330px;border:none;outline:none;" readonly :ref="'input'+scope.row.id" :value="(baseUrl+scope.row.htmlLink+'&skinId='+scope.row.skinId + scope.row.appLabel) || 'https://www.uupt.com/'" type="text">
                <el-button type="primary" size="mini"  @click="copyLink(scope.$index,scope.row)"> 复制</el-button>
                <el-button type="text" slot="reference">链接</el-button>
            </el-popover>
            <!-- <el-button type="text" @click="copyLink(scope.$index,scope.row)" slot="reference">复制链接</el-button> -->
            <!-- <el-button type="text" size="small" v-popover:popover2></el-button> -->
            <el-popover @show="setCodeList(scope.$index,scope.row)" ref="poperovercode" placement="right" width="200" trigger="click">
              <!-- <img src="@assets/images/code.png" alt="code" /> -->
              <div :id="'qrcode'+scope.row.id" style="width:200px;height:200px;font-size:0;">

              </div>
              <el-button type="text" slot="reference">二维码</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="aia-alist-pagenation">
        <el-pagination 
        :background="true" 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page.sync="pageIndex" 
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize" 
        layout="sizes,prev,pager,next,total"
        :total="totalnum">
        </el-pagination>
      </div>
      <el-popover ref="popover2" placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
      </el-popover>
    </div>

    <el-dialog
      title="编辑活动"
      :visible.sync="editActivityFlag"
      width="750px"
      :modal-append-to-body="false"
      >
      <el-form ref="editActivityForm" :model="editActivityForm" :rules="editActivityFormRule" label-width="80px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="editActivityForm.name" :maxlength="12" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker  style="width:300px;" v-model="editActivityForm.endTime" :picker-options="endPickerOption" type="datetime" placeholder="活动结束时间"> </el-date-picker>
        </el-form-item>
        <el-form-item label="活动描述" prop="desc">
          <el-input type="textarea" v-model="editActivityForm.desc" style="display:none;"></el-input>
          <vue-html5-editor @change="editDescChange" :content="editActivityForm.desc" :height="230" :z-index="5" :auto-height="false" show-module-name="false"></vue-html5-editor>
        </el-form-item>
        <el-form-item v-if="curActivityObj.ruleType != 'answer'" label="奖品概率">
          <ul class="activity-editActivityForm">
            <li v-for="val,key in rewardFormList" style="inline-block;">
              <span class="activity-editActivityForm-title">{{val.searchform.attrName +'：'}}</span>
              <el-input placeholder="概率" v-model="val.searchform.proportion" size="mini" :maxlength="3" style="width:120px">
                  <template slot="append">%</template>
              </el-input>
            </li>
            <li>
              <span>奖品总概率：</span>
              <el-input  placeholder="请输入内容" size="mini" v-model="allProportion" :readonly="true"  style="width:130px">
                  <template slot="append">%</template>
              </el-input>
            </li>
          </ul>
        </el-form-item>

      </el-form>      
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editActivityFlag = false">取 消</el-button>
        <el-button size="mini" type="primary" :loading="editBtnLoading" @click="editActivityOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import '@assets/js/jquery.qrcode.min.js'
  import tt1 from '@assets/images/tt1.png'
export default {
  name: "activityList",
  data() {
    let formateV = (rule, value, callback, source, options) => {
      // let reg = new RegExp("[()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");(\-)
      // (\ )、(\?)、(\~)(\!)(\@)(\%)
      let reg = new RegExp(
        /[(\_)(\[)(\])(\{)(\})(\:)(\')(\")]+/
      );
      if (reg.test(value)) {
        callback(new Error("输入内容不能包含特殊字符,如 ' \""));
      } else {
        callback();
      }
    };
    return {
      baseUrl:REQUEST_PATH,
      tableLoading:false,
      // 编辑活动
      editActivityFlag:false,
      editBtnLoading:false,
      editActivityForm:{
        name:'',
        endTime:'',
        desc:''
      },
      curActivityObj:{},
      rewardFormList:[],
      editActivityFormRule:{
        name:[
          { required:true, message:'请填写名字', trigger:'blur'},
          { validator: formateV, trigger: "blur" }
        ],
        endTime: [
          { type: 'date', required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        desc:[
          { required:true, message:'请填写描述', trigger:'blur'},
          // { validator: formateV, trigger: "blur" }
        ]
      },
      endPickerOption:{
        disabledDate(time) {
            return time.getTime() < Date.now() - 24*60*60*1000;
        }
      },
      allProportion:0,
      rewardList:[],      
      selList:[],
      selVal:[],
      cityList:[],
      tableHeight: "100%",
      columns: [
        {
          prop: "id",
          label: "id",
          align: "center"
        },
        {
          prop: "name",
          label: "活动名称",
          align: "center",
          width: "300"
        },
        {
          prop: "templetName",
          label: "所属模板",
          align: "center",
          width: "300"
        }
      ],

      tableData: [
        // {
        //   id: 0,
        //   name: "小暑",
        //   template: "大转盘",
        //   date: "2016-05-02 至 2017-06-08",
        //   state: true,
        //   link: "http://www.baidu.com"
        // },      
      ],
      pageIndex: 1,
      pageSize: 10,
      totalnum: 0,
      searchForm: {
        name: "",
        state: "",
        typeId: "",
        pageSize: 10,
        pageIndex: 1,
        limitCity:'',
        typeId: "",
        usePlat:'',
        usePerson:''
      },
      tempId: "",
      tempArr: [],
      powerBtns:{},
      userTypeArr:[
        {id:0,name:'全部'},
        {id:1,name:'用户'},
        {id:2,name:'跑男'},
      ],
      platList:['全部','微信','App端'],
      isShow:false,
      showArrow:false
    };
  },
  watch:{
    rewardFormList:{
      handler:function(cur,old){
        let all = 0;
        if(!cur){return}
        cur.map(item=>{
          let proportion = parseInt(item.searchform.proportion);
          if(!proportion){
            proportion = 0;
          }
          all += proportion;
        })
        this.allProportion = all;
      },
      deep:true
    }
  },
  created() {
    let btns = sessionStorage.getItem('activity');
    this.powerBtns = Object.assign({},JSON.parse(btns));

    // this.tempId = this.$route.params.id;
    this.getTempList();
    this.getList();

    // 获取分类
    this.getClasses();

    // 获取城市
    this.getCityList();

    // 获取奖品
    this.getRewards();
  },
  mounted() {
    let that = this;
    // this.autoHeight();
    window.addEventListener('resize',function(){
      that.autoHeight();
    },false);
    this.$nextTick(()=>{
      this.autoHeight();
    })
  },
  methods: {
    getRewards(type,typename){
      this.$post({
          url:REQUEST_PATH+'prize/getPrizeAttr',
          data:{
            userTypeId:-999,
            sort:'asc'
          },
          success:(res)=>{
            this.rewardList = res.data.data;
          }
      })
    },
    // 限用城市类别
    getCityList(){
      this.$post({
          url:REQUEST_PATH+'common/getCity',
          data:{},
          success:(res)=>{
            this.cityList = res.data.data;
          }
      })
    },
    getTemplatId(val) {
      this.searchForm.typeId = val[1];
      // this.searchForm.templetId = val[1];
    },
    // 获取模板列表
    getTempList() {
      let that = this;
        this.$post({
          url:REQUEST_PATH + "classify/getClassifyType",
          data:{},
          success:(res)=>{
            //  console.log("template res...");
            //  console.log(res);
             res.data.data.map(item=>{
              if(item.hasOwnProperty('typeList')){
                item.typeList.map(val=>{
                  this.tempArr.push(val);
                })
              }
            })
          }
        })
    },
    // 获取下拉框数据
    getClasses() {
      let that = this;
        this.$post({
          url:REQUEST_PATH + "classify/getClassifyType",
          data:{},
          success:(res)=>{
             this.category = res.data.data;
             this.getClassSel();
          }
        })
    },
    getClassSel() {
      this.category.map(item => {
        this.selList.unshift(item);
      });
      this.selList.map(item => {
        item.label = item.classifyName;
        item.value = item.id;
        if (item.hasOwnProperty("typeList")) {
          if (item.typeList.length > 0) {
            item.typeList.map(val => {
              val.label = val.typeName;
              val.value = val.id;
              return val;
            });
            item.children = item.typeList;
          }
        }
        return item;
      });
      this.selList.unshift({
        label: "所有",
        value: ""
      });
    },
    getList() {
      if(this.$util.sqlReg.test(this.searchForm.name)){
        this.$message.warning('请您不要在参数中输入特殊字符和SQL关键字！');
        return;
      }
      let that = this;
      let obj = Object.assign({}, this.searchForm);
      obj.pageSize = this.pageSize;
      obj.pageIndex = this.pageIndex;
        this.$post({
          url:REQUEST_PATH + "activity/getActivity",
          data:obj,
          loading:'tableLoading',
          success:(res)=>{
            // console.log('getActivity...')
            // console.log(res)
             res.data.data.map(item=>{
              let start = new Date(item.startTime);
              item.startTime = this.$util.coverDate(start);
              let end = new Date(item.endTime);
              item.endTime = this.$util.coverDate(end);
              let createAt = new Date(item.createAt);
              item.createAt = this.$util.coverDate(createAt);
              return item;
            })
            this.tableData = res.data.data;
            this.totalnum = res.data.total;
          }
        })
    },
    // 生成二维码
    setCodeList(index,item){

        let link = (REQUEST_PATH+item.htmlLink+'&skinId='+item.skinId + item.appLabel) || 'https//www.uupt.com'+index;    
        let sid = '#qrcode'+item.id;
        
        let hasChildren = $(sid).children();
       
        if(hasChildren.length<=0){
           $('.el-popover').find(sid).qrcode({
            render: 'canvas',  
            correctLevel: 2,//纠错等级  
            width: 200,
            height: 200,
            text: link,
            background : "#ffffff",       //二维码的后景色  
            foreground : "#000000",        //二维码的前景色  
         });
         $('.el-popover').find(sid).append('<img src="'+tt1+'" style="position:absolute;width:48px;height:48px;top:88px;left:88px;"/>');
        }
    },
    // 动态设置table 高度
    autoHeight() {
      let main = this.$refs.alistMain;
      if (main) {
        let mainset = main.getBoundingClientRect();
        this.tableHeight = mainset.height - 48;
      }
      let fr = this.$refs.firstItem;
      let lr = this.$refs.lastItem;
      if(fr && lr){
        let frb = fr.$el.getBoundingClientRect();
        let lrb = lr.$el.getBoundingClientRect();
        if(lrb.top > frb.top){
          this.showArrow = true;
        }else{
          this.showArrow = false;
        }
      }
    },
    // 新建活动
    newActivity() {
      this.$router.push("/main/template");
    },
    // 处理分页事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getList();
    },
    // 删除
    handleDetail(row) {
      let id = row.id;
      let url = "/main/activitydetail/" + id+'/'+row.ruleType;
      this.$router.push(url);
    },
    // 复制
    copyLink(index, row) {
      this.$refs['input'+row.id].select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
          message: '复制成功',
          type: 'success'
      });
    },
    // 编辑
    editActivity(item){
      // console.log(item);
      let arr = Object.prototype.toString(item.config);
      let type = arr.slice(8,-1);
      if(type == 'Object' && JSON.parse(item.config).rewardDataList ){
        this.rewardFormList =  JSON.parse(item.config).rewardDataList;
        this.rewardFormList.map(item=>{
          this.rewardList.map(val=>{
            if(val.id == item.searchform.attrs){
              item.searchform.attrName = val.attrName;
              return;
            }
            if(!item.searchform.proportion){
              item.searchform.proportion = 0;
            }
          })
          return item;
        })
      }
      this.editActivityFlag = true;
      this.editActivityForm.name = item.name;
      this.editActivityForm.endTime = new Date(item.endTime);
      this.editActivityForm.desc = item.desc;
      this.curActivityObj = item;
      this.editBtnLoading = false;
    },
    // 编辑成功
    editActivityOk(){
     this.$refs.editActivityForm.validate((valid)=>{
       if(valid){
         this.editActivityAjax();
       }
     })
    },
    editActivityAjax(){
      let that = this;     
      
      let config = JSON.parse(this.curActivityObj.config);

      if(this.curActivityObj.ruleType !== 'answer'){      
        
        let allProportion = parseInt(this.allProportion);
        if(isNaN(allProportion) || allProportion !== 100){
          this.$message.warning('概率总和必须为100%');
          return;
        }

        config.rewardDataList = this.rewardFormList;
      }
      
      if(config.popBtn && config.popBtn.jumpUrl){
        config.popBtn.jumpUrl = encodeURIComponent(config.popBtn.jumpUrl)
      }
      if(config.wxForm && config.wxForm.title){
        config.wxForm.title = encodeURIComponent(config.wxForm.title);
        config.wxForm.desc = encodeURIComponent(config.wxForm.desc);
        config.wxForm.img = encodeURIComponent(config.wxForm.img);
      }

      let obj = {
        id:this.curActivityObj.id,
        name:encodeURIComponent(this.editActivityForm.name),        
        serverPort:REQUEST_PATH == 'http://aiats.mit.cn/' ? 'prod' : this.curActivityObj.serverPort,
        desc:encodeURIComponent(this.$util.copyFilterMore(this.editActivityForm.desc)),
        endTime:that.$util.coverDate(new Date(this.editActivityForm.endTime)),
        config:JSON.stringify(config)
      }

      // console.log('edit obj.........');
      // console.log(obj);
      // return;

      this.$post({
        url:REQUEST_PATH+'activity/editActivityInfo',
        data:obj,
        loading:'editBtnLoading',
        success:(res)=>{
          this.getList();
          this.editActivityFlag = false;
          this.$message.success('修改成功');
        }
      })
    },
    editDescChange(val){
      this.editActivityForm.desc = val;
    },
    // 删除
    delActivity(item){
      // console.log('删除：'+item.id);
      // console.log(item)
      if(item.state === 1){
        this.$message.warning('活动仍在进行中，请先行关闭活动!!!');
         return;
      }
      this.$confirm('此操作将删除该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delActivityAjax(item.id);
        }).catch(() => {        
        });
    },

    delActivityAjax(id){
      let that = this;
      this.$post({
        url:REQUEST_PATH+'activity/delActivity',
        data:{id:id},
        success:(res)=>{
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getList();
        }
      })
    },

    onSubmit() {
      // console.log("sub...");
      this.isShow = false;
      this.pageIndex = 1;
      this.getList();
    },
    // 开关change
    changeSwitch(row) {
      let id = row.id;
      let state = row.state;
      let that = this;
      console.log(state);

      let obj = {
        id: id,
        state: state,
        serverPort:REQUEST_PATH == 'http://aiats.mit.cn/' ? 'prod' : row.serverPort
      };
      this.$post({
        url:REQUEST_PATH + "activity/editActivity",
        data:obj,
        success:(res)=>{
          //开关设置成功
          this.$message.success('状态修改成功');
        }
      })
    },
  }
};
</script>

<style lang="less"  rel="stylesheet/less" scoped>
#aia-activity-list .aia-alist-main{
  top:75px;
  bottom:15px;
}
.aia-form-inline{
  height:46px;
  position:relative;
  overflow:hidden;
  padding-right:240px;
  z-index:5;
  background-color:#fff;
  border-bottom:1px solid #E4E7ED;  
  padding-left:5px;
}
.aia-show{
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.1);
  height: auto;
}
.aia-form-btn{
  position:absolute;
  right:20px;
  top:0px;
}
.newactivity-tb-badge{
  display: inline-block;
  vertical-align: middle;
  width: 26px;
  height: 16px;
  line-height: 16px;
  font-size:12px;
  background-color:#f56c6c;
  color:#fff;
  border-radius: 10px;
  margin-left:5px;
  text-align: center;
}

.activity-editActivityForm{
    li{
      display:inline-block;
      span.activity-editActivityForm-title{
        display:inline-block;
        width:80px;
        text-align:right;
      }
      &:last-child{
        display:block;
        text-align:right;
      }
    }
  }
</style>