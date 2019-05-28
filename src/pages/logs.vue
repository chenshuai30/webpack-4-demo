<template>
  <!-- 当前模板所建活动列表 -->
  <div id='aia-activity-list' v-loading.fullscreen.lock="tableLoading"  element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
    <div class="aia-alist-header">
      <div class="aia-alist-search">
        <el-form :inline="true" size="mini" :model="searchForm" class="aia-form-inline">
          <el-form-item label="用户id">
            <el-input v-model="searchForm.userId" placeholder="请填写id"></el-input>
          </el-form-item>
          <el-form-item label="用户名称">
            <el-input v-model="searchForm.userName" placeholder="请填写名称"></el-input>
          </el-form-item>
           <el-form-item label="活动id">
            <el-input v-model="searchForm.activityId" placeholder="请填写id"></el-input>
          </el-form-item>
          <el-button-group class="aia-form-btn">
            <el-button type="primary" @click="onSubmit" size="mini" icon="el-icon-search">查询</el-button>
          </el-button-group>
        </el-form>
      </div>
    </div>
    <div class="aia-alist-main" ref="alistMain">
      <el-table :data="tableData" style="width: 100%" :height="tableHeight">
        <el-table-column v-for="item,index in columns" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" :align="item.align || 'left'">
        </el-table-column>        
        <el-table-column prop="type" label="操作类型">
          <template slot-scope="scope">
            <span>{{getType(scope.row.type)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="操作日期">
          <template slot-scope="scope">
            <span>{{scope.row.createAt}}</span>
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
  </div>
</template>

<script>
export default {
  name: "activityList",
  data() {
    let formateV = this.$util.formateSql;
    return {
      baseUrl:REQUEST_PATH,
      tableLoading:false,
      tableHeight: "100%",
      // userId,userName,activityId,name,type,createAt
      columns: [
        {
          prop: "userId",
          label: "用户id",
          align: "center"
        },
        {
          prop: "userName",
          label: "用户名称",
          align: "center"
        },
        {
          prop: "activityId",
          label: "活动ID",
          align: "center"
        },
        {
          prop: "name",
          label: "活动名称",
          align: "center"
        }    
      ],

      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalnum: 0,
      searchForm: {
        userId:'',
        userName: "",
        activityId:'',
        pageSize: 10,
        pageIndex: 1,
      },
      tempId: "",
      powerBtns:{},
      roleId:"",
      addBtnLoading:false,
    };
  },
  created() {
    let btns = sessionStorage.getItem('activity');
    this.powerBtns = Object.assign({},JSON.parse(btns));
    this.roleId = sessionStorage.getItem('pnum');
    this.roleLevel = sessionStorage.getItem('level');

    this.getList();
  },
  mounted() {
    let that = this;
    this.autoHeight();
    window.onresize = function() {
      that.autoHeight();
    };
  },
  methods: {   
    getList() {
      if(this.$util.sqlReg.test(this.searchForm.userName)){
        this.$message.warning('请您不要在参数中输入特殊字符和SQL关键字！');
        return;
      }
      let that = this;
      let obj = Object.assign({}, this.searchForm);
      obj.pageSize = this.pageSize;
      obj.pageIndex = this.pageIndex;
        this.$post({
          url:REQUEST_PATH + "common/getUserLog",
          data:obj,
          loading:'tableLoading',
          success:(res)=>{
            // console.log('user ...')
            // console.log(res)
            res.data.data.map(item=>{
              let createTime = new Date(item.createAt);
              item.createAt = this.$util.coverDate(createTime);
              item.addBtnLoading = false;
              return item;
            })
            this.tableData = res.data.data;
            this.totalnum = res.data.total;
          }
        })
    },
    getType(type){
      let name = '';
      switch(type){
        case 1:{
          name = '新增';
          break;
        }
        case 2:{
          name = '修改';
          break;
        }
        case 3:{
          name = '删除';
          break;
        }
      }
      return name;
    },
    // 动态设置table 高度
    autoHeight() {
      let main = this.$refs.alistMain;
      if (main) {
        let mainset = main.getBoundingClientRect();
        this.tableHeight = mainset.height - 45;
      }
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

    onSubmit() {
      // console.log("sub...");
      this.pageIndex = 1;
      this.getList();
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