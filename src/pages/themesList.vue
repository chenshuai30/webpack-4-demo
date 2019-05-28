<template>
    <!-- 当前模板所建活动列表 -->
    <div id='aia-activity-list' v-loading.fullscreen.lock="loadingTable"  element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
        <div class="aia-alist-header">
            <div class="aia-alist-header-btn">
                <span style="font-size:13px;margin-right:10px;">所属模板</span>
              <el-select @change="getTemplatId" size="mini" v-model="selVal" placeholder="请选择模板">
                  <el-option
                    v-for="item in tempList"
                    :key="item.id"
                    :label="item.templetName"
                    :value="item.id">
                  </el-option>
                </el-select>
              <el-button-group style="margin-left:10px;">
                  <el-button type="primary" @click="getSearch"  size="mini" icon="el-icon-search">查询</el-button>
                  <el-button v-if="powerBtns.add" @click="addTheme"  size="mini" icon="el-icon-plus" >新增</el-button>
              </el-button-group>
                
            </div>           
        </div>       
        <div class="aia-alist-main aia-themelist-main" ref="alistMain">
            <ul>
              <li  class="aia-alist-item" v-for="item,index in tableData" :key="index">
                <div class="aia-alist-img">
                    <img :src="item.skinConfig ? item.skinConfig.common.skinImg:''" alt="img">                    
                </div>
                <div class="aia-alist-desc">
                    <div class="aia-alist-desc-title">
                        <h3>{{item.skinConfig ? item.skinConfig.common.name:''}}</h3>
                    </div>
                    
                    <div class="aia-alist-desc-tool clearfix">                                                              
                        <ul>
                            <li v-if="powerBtns.edit" @click="handleEdit(item)" class="aia-template-desc-tool-edit"><i class="el-icon-edit"></i>编辑</li>
                            <li v-if="powerBtns.del" @click="handleDel(index,item)" class="aia-template-desc-tool-del"><i class="el-icon-delete"></i>删除</li>
                        </ul>
                    </div>
                </div>
                <div class="aia-alist-layout"></div>
                <div class="aia-alist-tag">
                  <span>{{item.templetName}}</span>
                </div>
              </li>
            </ul>              
        </div>
      <div class="aia-alist-pagenation" style="bottom:10px;">
          <el-pagination
            :background="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageIndex"
            :page-sizes="[9,18,27,36,45]"
            :page-size="pageSize"
            layout="sizes, prev, pager, next, total"
            :total="totalpage">
          </el-pagination>
        </div>
        <!-- 模板 -->
        <el-dialog
        title="选择模板"
        :modal-append-to-body = "false"
        :visible.sync="skinFlag"
        custom-class="themeTemplate"
        width="464px">
        <el-radio-group v-model="curskinId" size="mini">     
            <el-radio-button :label="val.id" :key="key" name="temp" v-for="val,key in tempList">{{val.templetName}}</el-radio-button>      
      </el-radio-group>
       <div slot="footer" class="dialog-footer">
          <el-button @click="skinFlag = false">取 消</el-button>
          <el-button type="primary" @click="addNewSkin">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="皮肤预览"
        :visible.sync="imgPreviewFlag"
        style="height:900px;"
        :modal-append-to-body = "false">
        <div style="height:590px;text-align:center;">
          <img :src="curPreviewImg" height="100%" alt="img">
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'activityList',
    data() {
        return {
          loadingTable:false,
          category:[],
          selList:[],
          selVal:[],
          themeId:'',
          curPreviewImg:'',
          imgPreviewFlag:false,
          tableHeight:'100%',
          columns:[
              {
                prop:'id',
                label:'id',
                align:'center'
              },{
                prop:'templetName',
                label:'所属模板',
                align:'center'
              }
          ],
          tableData: [{
            id:0,
            name: '小暑',
            template:'大转盘',
            date: '2016-05-02 至 2017-06-08',
            state: true,
            link:'http://www.baidu.com'
          }],
          pageIndex: 1,
          pageSize:27,
          totalpage:0,
          linkAddress:'http://www.baidu.com',
          searchForm:{
            name:'',
            state:'',
            template:''
          },

          // 模板选择
          skinFlag:false,
          curskinId:'',
          tempList:[],
          powerBtns:{}
        }
    },
    created(){
      let btns = sessionStorage.getItem('skin');
      this.powerBtns = Object.assign({},JSON.parse(btns));

      // 获取模板id
      this.themeId = this.$route.params.id;
      this.getThemeList();

      // 获取分类
      // this.getClasses();

      // 获取模板列表
      this.getAllTempList()
    },
    mounted(){
      let that = this;
      this.autoHeight();
      window.onresize = function(){
        that.autoHeight();
      }      
    },
    methods:{
      getTemplatId(val){
        this.themeId = val;
      },
      getSearch(){
        this.pageIndex = 1;
        this.getThemeList();
      },
      getThemeList(){
        let obj = {
          templetId:this.themeId,
          id:"",
          pageIndex:this.pageIndex,
          pageSize:this.pageSize
        }
        this.$post({
          url:REQUEST_PATH+'skin/getSkin',
          data:obj,
          loading:'loadingTable',
          success:(res)=>{
            res.data.data.map(item=>{
              item.skinConfig = JSON.parse(item.skinConfig);
              item.delBtnLoading = false;
              return item;
            })
            this.tableData = res.data.data;
            this.totalpage = res.data.total;
          }
        })
      },
      getClasses(){
        this.$post({
          url:REQUEST_PATH+'classify/getClassifyType',
          data:{},
          success:(res)=>{
            this.category = res.data.data;
            this.getClassSel();
          }
        })
      },
      getClassSel(){
          this.category.map(item=>{
            this.selList.unshift(item);
          });
          this.selList.map(item=>{
            item.label = item.classifyName;
            item.value = item.id;
            if(item.hasOwnProperty('typeList')){
              if(item.typeList.length >0){
                item.typeList.map(val=>{
                  val.label = val.typeName;
                  val.value = val.id;
                  return val;
                })
                item.children = item.typeList;
              }              
            }
            return item;
          })
          this.selList.unshift({
            label:'所有',
            value:''
          })
      },
      // 获取模板列表
      getAllTempList(){
        this.$post({
          url:REQUEST_PATH+'templet/getTemplet',
          data:{},
          success:(res)=>{
            this.tempList = res.data.data;
          }
        })
      },
      // 动态设置table 高度
      autoHeight(){
        let main = this.$refs.alistMain;
        if(main){
          let mainset = main.getBoundingClientRect();
          this.tableHeight = mainset.height - 32;
        }       

      },
      // 新建活动
      addTheme(){
        // console.log('add new activity...');
        let id = this.curskinId;
        this.skinFlag = true;
      },
      // 新增皮肤
      addNewSkin(){
        // console.log('add new...');
        // console.log(this.curskinId);
        if(!this.curskinId){
          this.$message.warning('请选取一个模板');
          return;
        }
        this.$router.push('/main/themes/template/'+this.curskinId+"/add")
      },
      // 处理分页事件
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getThemeList();
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.pageIndex = val;
        this.getThemeList();
      },
      // 编辑
      handleEdit(row){
        // console.log('编辑...');
        // console.log(row);
        let templateId = row.templetId;
        let skinId = row.id;
        this.$router.push('/main/themes/template/'+templateId+'/'+skinId);
      },
      // 删除
      handleDel(index,row){ 
        // console.log('删除');
        let that = this;
        if(row.delBtnLoading){
          return;
        }
        this.$confirm('此操作将删除该项皮肤, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {     
          let id = row.id;     
          that.delSkin(index,id,row);
        }).catch(() => {
           
        });
       
      }, 
      delSkin(index,id,row){
        row.delBtnLoading = true;
        this.$post({
          url:REQUEST_PATH+'skin/delSkin',
          data:{id:id},
          success:(res)=>{
            row.delBtnLoading = false;
            this.$message.success('删除成功')
            this.tableData.splice(index,1);
          }
        })
      },
      // 预览缩略图
      handlePreviewImg(index,row){
        // console.log('缩略图...');
        let config = JSON.parse(row.skinConfig);
        this.curPreviewImg = config.common.skinImg;
        this.imgPreviewFlag = true;      
      },
    }
}
</script>

<style lang='less' rel="stylesheet/less">
#aia-activity-list .el-switch__label{
  position:absolute;
  font-size:11px;
  color:#fff;
  z-index:1;
  transform:scale(0.8);
}
#aia-activity-list .el-switch__label--left{
  left:4px;
}
.el-switch__label--right{
  right:4px;
}
.el-switch__core .el-switch__button{
  z-index:3;
}
#aia-activity-list .aia-alist-main{
  top:61px;
}
</style>