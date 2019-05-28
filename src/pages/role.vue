<template>
  <!-- 当前模板所建活动列表 -->
  <div id='aia-activity-list' v-loading.fullscreen.lock="tableLoading"  element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
    <div class="aia-alist-header">
      <div class="aia-alist-search">
        <el-form :inline="true" size="mini" :model="searchForm" class="aia-form-inline">
          <el-form-item label="用户名称">
            <el-input v-model="searchForm.userName" placeholder="请填写名称"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="searchForm.roleId" placeholder="活动状态">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item,index in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-button-group class="aia-form-btn">
            <el-button type="primary" @click="onSubmit" size="mini" icon="el-icon-search">查询</el-button>
            <el-button @click="newActivity" icon="el-icon-plus" size="mini">新增用户</el-button>
          </el-button-group>
        </el-form>
      </div>
    </div>
    <div class="aia-alist-main" ref="alistMain">
      <el-table :data="tableData" style="width: 100%" :height="tableHeight">
        <el-table-column v-for="item,index in columns" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" :align="item.align || 'left'">
        </el-table-column> 
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.roleId == 1" @click="handleCity(scope.row)" type="text" size="small">城市</el-button>
            <el-button :disabled="scope.row.roleId == 1" @click="handleDetail(scope.row)" type="text" size="small">角色</el-button>
            <!-- <el-button :disabled="scope.row.id == 1" type="text" size="small" @click="editActivity(scope.row)">编辑</el-button> -->
            <el-button :disabled="scope.row.roleId == 1 || scope.row.addBtnLoading" type="text" @click="delActivity(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="aia-alist-pagenation">
        <el-pagination 
        :background="true" 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page.sync="pageIndex" 
        :page-sizes="[10,20,30,40]" 
        :page-size="pageSize" 
        layout="sizes, prev, pager, next, total" :total="totalnum">
        </el-pagination>
      </div>
      <el-popover ref="popover2" placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
      </el-popover>
    </div>

    <el-dialog
      :title="userTitle"
      :visible.sync="editActivityFlag"
      width="400px"
      :modal-append-to-body="false"
      >
      <el-form ref="editActivityForm" size="mini" :model="editActivityForm" :rules="editActivityFormRule" label-width="80px">        
         <el-form-item label="角色" prop="roleId">
            <el-select @change="editChagneRole" v-model="editActivityForm.roleId"  style="width:200px" placeholder="请选择角色">
              <el-option v-for="item,index in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="editActivityForm.userName" style="width:200px" placeholder="请输入姓名" :maxlength="20"></el-input>
          </el-form-item>
           <el-form-item>
             <div style="font-size:12px;color:#888;">默认密码：UU888@asdf</div>
           </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editActivityFlag = false">取 消</el-button>
        <el-button size="mini" type="primary"  :loading="addBtnLoading" @click="editActivityOk">确 定</el-button>
      </span>
    </el-dialog>

     <el-dialog
      title="修改角色"
      :visible.sync="roleFlag"
      width="400px"
      :modal-append-to-body="false"
      >
      <el-form ref="roleForm" size="mini" :model="roleForm" :rules="editActivityFormRule" label-width="80px">        
         <el-form-item label="角色" prop="roleId">
            <el-select @change="changeRoleLevel" v-model="roleForm.roleId"  style="width:200px" placeholder="请选择角色">
              <el-option v-for="item,index in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="roleFlag = false">取 消</el-button>
        <el-button size="mini" type="primary" :loading="editBtnLoading" @click="changeRoleOk">确 定</el-button>
      </span>
    </el-dialog>

     <el-dialog top="50px" title="修改城市" custom-class="aia-role-city" :visible.sync="roleCityFlag" width="1200px" :modal-append-to-body="false">
      <div class="aia-role-city-content">     
        
        <div class="aia-role-city-letter">
          <!-- <a :href="'#'+item" v-for="item,index in citiClsArr" :key="index">{{item}}</a> -->
          <span @click="scrollView(item)" v-for="item,index in citiClsArr" :key="index">{{item}}</span>
        </div>
        <div class="aia-role-city-item">
           <div>
            <h3 id="aia#" class="aia-role-city-item-letter">#</h3>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{allCityData.CityName}}</el-checkbox>  
          </div>
          <el-checkbox-group v-model="ucity"  @change="handleCheckedCitiesChange">
            <div v-for="item,index in citiesArr" :key="index">
              <h3 :id="'aia'+item.title" class="aia-role-city-item-letter">{{item.title}}</h3>
              <el-checkbox v-for="city in item.children" :label="city.Id" :key="city.Id">{{city.CityName}}</el-checkbox>      
            </div>              
          </el-checkbox-group>
        </div>

        <p class="aia-role-city-chk">
          <b>已选择城市：</b>
          <span>{{checkAll ? '全部' : getCityName(ucity)}}</span>
        </p>
       
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="roleCityFlag = false">取 消</el-button>
        <el-button size="mini" type="primary" :loading="ctyBtnLoading" @click="changeRoleCityOk">确 定</el-button>
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
    let formateV = this.$util.formateSql;
    return {
      userTitle:'新增用户',
      baseUrl:REQUEST_PATH,
      tableLoading:false,
      // 编辑活动
      editActivityFlag:false,
      editActivityForm:{
        userName:'',
        roleId:''
      },
      curActivityObj:{},
      editActivityFormRule:{
        userName:[
          {required:true,message:'请填写名字',trigger:'blur'},
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          { validator:formateV,trigger:'blur'}
        ],
        roleId:[
          {required:true,type:'number',message:'请选择角色',trigger:'change'}
        ]
      },
      tableHeight: "100%",
      columns: [
        {
          prop: "id",
          label: "id",
          align: "center"
        },
        {
          prop: "userName",
          label: "用户名称",
          align: "center"
        },
        {
          prop: "createTime",
          label: "创建时间",
          align: "center"
        },
        {
          prop: "roleName",
          label: "用户角色",
          align: "center"
        }      
      ],

      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalnum: 0,
      searchForm: {
        roleId: "",
        userName: "",
        pageSize: 10,
        pageIndex: 1,
      },
      tempId: "",
      powerBtns:{},
      roleList:[],
      roleId:"",
      chkRoleList:[],
      roleFlag:false,
      roleForm:{
        roleId:'',
      },
      curRoleId:'',
      editBtnLoading:false,
      addBtnLoading:false,
      addBtnLoading:false,
      curRole:'',
      roleCityFlag:false,
      ucity:[],
      cities:[],
      citiesArr:[],
      citiClsArr:[],
      allCityData:{},
      allCityIds:[],
      ctyBtnLoading:false,
      checkAll:false,
      isIndeterminate:true
    };
  },
  created() {
    let btns = sessionStorage.getItem('activity');
    this.powerBtns = Object.assign({},JSON.parse(btns));
    this.roleId = sessionStorage.getItem('pnum');
    this.roleLevel = sessionStorage.getItem('level');

    this.getList();
    this.getRoleList();
    this.getCityList();
  },
  mounted() {
    let that = this;
    this.autoHeight();
    window.onresize = function() {
      that.autoHeight();
    };
  },
  methods: {   
    getCityList(){
        this.$post({
            url:REQUEST_PATH+'common/getCity',
            data:{},
            success:(res)=>{
              this.cities = res.data.data;
              
              let letter = '';
              let cArr = {};
              res.data.data.map((item,index)=>{
                if(index > 0){
                  this.allCityIds.push(item.Id);
                }               
                letter == item.FirstZM 
                if(letter != item.FirstZM){
                  letter = item.FirstZM
                }
                if(this.citiClsArr.indexOf(letter) < 0){
                  this.citiClsArr.push(letter);
                }   
                if(!cArr[letter]){
                  cArr[letter] = [];
                }
                cArr[letter].push(item);
              })             
              for(let key in cArr){
                this.citiesArr.push({
                  title:key,
                  children:cArr[key]
                })
              }
              this.allCityData = this.citiesArr.shift().children[0];
              this.cities.shift();
            }
        })
    },
    getRoleList() {
      this.$post({
        url:REQUEST_PATH + "common/getRols",
        data:{level:this.roleLevel},
        success:(res)=>{
          console.log('role...')
          console.log(res)
          this.roleList = res.data.data;
          // this.roleList.map(item=>{
          //   if(item.id == this.roleId){
          //     return;
          //   }else{
          //     this.chkRoleList.push(item);
          //   }
          // })
        }
      })
    },
    getList() {
      if(this.$util.sqlReg.test(this.searchForm.userName)){
        this.$message.warning('请您不要在参数中输入特殊字符和SQL关键字！');
        return;
      }
      let that = this;
      let obj = Object.assign({}, this.searchForm);
      obj.pageSize = this.pageSize;
      obj.pageIndex = this.pageIndex;
      obj.userLevel = this.roleLevel;
        this.$post({
          url:REQUEST_PATH + "common/getUser",
          data:obj,
          loading:'tableLoading',
          success:(res)=>{
            console.log('user ...')
            console.log(res)
            res.data.data.map(item=>{
              let createTime = new Date(item.createTime);
              item.createTime = this.$util.coverDate(createTime);
              item.addBtnLoading = false;
              return item;
            })
            this.tableData = res.data.data;
            this.totalnum = res.data.total;
          }
        })
    },
    // 动态设置table 高度
    autoHeight() {
      let main = this.$refs.alistMain;
      if (main) {
        let mainset = main.getBoundingClientRect();
        this.tableHeight = mainset.height - 45;
      }
    },
    // 新建活动
    newActivity() {
      this.editActivityForm.userName = '';
      this.editActivityForm.roleId = '';
      this.editActivityFlag = true;      
    },
    // 处理分页事件
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageIndex = val;
      this.getList();
    },
    // 删除
    handleDetail(row) {
      console.log('修改角色...')
      console.log(row)
      this.curRoleId = row.id;
      this.roleForm.roleId = row.roleId;
      this.roleFlag = true;
    },
    editChagneRole(val){
      console.log('change roleId...')
      console.log(val);
      this.roleList.map(item=>{
        if(item.id == val){
          console.log(item);
          this.editActivityForm.userLevel = item.roleLevel;
        }
      })
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
      this.$post({
        url:REQUEST_PATH+'common/register',
        data:{
          roleId:this.editActivityForm.roleId,
          userName:this.editActivityForm.userName,
          createTime:new Date(),
          userLevel:this.editActivityForm.userLevel,
          password:'UU888@asdf'
        },
        loading:'addBtnLoading',
        success:(res)=>{
          console.log('新增用户成功...')
          console.log(res)
          this.editActivityFlag = false;
          this.getList();
        }
      })
    },
    // 删除
    delActivity(item){
      // console.log('删除：'+item.id);
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delActivityAjax(item.id,item);
        }).catch(() => {        
        });
    },
    changeRoleLevel(val){
      this.roleList.map(item=>{
        if(val == item.id){
          this.curRoleLevel = item.roleLevel
        }
      })
    },
    changeRoleOk(){
      this.$refs.roleForm.validate((valid)=>{
        if(valid){
          this.$post({
            url:REQUEST_PATH + "common/editUser",
            data:{
              id:this.curRoleId,
              roleId:this.roleForm.roleId,
              userLevel:this.curRoleLevel
            },
            loading:'editBtnLoading',
            success:(res)=>{
              this.roleFlag = false;
              this.getList();
            }
          })
        }
      })
    },
    delActivityAjax(id,item){
      let that = this;
      item.addBtnLoading = true;
      this.$post({
        url:REQUEST_PATH+'common/delUser',
        data:{id:id},
        success:(res)=>{
          item.addBtnLoading = false;
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
        state: state
      };
      this.$post({
        url:REQUEST_PATH + "activity/editActivity",
        data:obj,
        success:(res)=>{
          //开关设置成功
        }
      })
    },
    handleCity(row){
      this.curRole = row;
      if(row.cityIds){
        let idArr = row.cityIds.split(',').map(item=>{
          return parseInt(item);
        })
        if(idArr[0] == 0){
          this.checkAll = true;
          this.ucity = this.allCityIds;
        }else{
          this.checkAll = false;
          this.ucity = idArr;
        }
      }
      this.roleCityFlag = true;
    },
    changeRoleCityOk(){      
      let ids = '';      
      if(this.checkAll){
        ids = '0'
      }else{
        if(this.ucity.length <= 0){
          this.$message.warning('请至少选择一个城市!')
          return;
        }else{
          ids = this.ucity.join(',');
        }        
      }
      this.changeCityAjax(ids);
    },
    changeCityAjax(ids){
      this.$post({
        url:REQUEST_PATH + "common/editUserCity",
        data:{
          id:this.curRole.id,
          cityIds:ids
        },
        loading:'ctyBtnLoading',
        success:(res)=>{
          //开关设置成功
          this.roleCityFlag = false;  
          this.getList();
          this.$message.success('修改成功');
        }
      })
    },
    getCityName(arr){
      let strArr = [];
      for(let j = 0; j< arr.length; j++){
        for(let i=0; i<this.cities.length; i++){
          if(this.cities[i].Id == arr[j]){
            strArr.push(this.cities[i].CityName);
            break;
          }
        }
      }     
      return strArr.join('，');
    },
    handleCheckAllChange(val){
      this.ucity = val ? this.allCityIds : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value){
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    scrollView(letter){
      let id = 'aia'+letter
      console.log(id);
      document.getElementById(id).scrollIntoView();
    },
  }
};
</script>

<style lang="less"  rel="stylesheet/less" scoped>
#aia-activity-list .aia-alist-main{
  top:75px;
}
.aia-form-inline{
  height:46px;
  position:relative;
  overflow:hidden;
  padding-right:200px;
}
.aia-form-btn{
  position:absolute;
  right:20px;
  top:0px;
}
</style>