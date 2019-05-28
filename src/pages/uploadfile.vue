<template>
  <div class='uploadBox' v-loading.fullscreen.lock="tableLoading"  element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
    <div class="searBox">
      <el-form size="mini" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item label="素材色系">
          <el-select v-model="searchForm.materialColor">
            <el-option label="全部色系" value=""></el-option>
            <el-option v-for="item,inx in colorList" :label="item.colorName" :value="item.colorId" :key="inx" :style="{color: item.colorValue}"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="素材类型">
          <el-select v-model="searchForm.materialType">
            <el-option label="全部类型" :value="-999"></el-option>
            <el-option v-for="item,inx in typeList" :label="item.type" :value="item.id" :key="inx"></el-option>
          </el-select>         
        </el-form-item> -->
         <el-form-item label="素材类型">
            <el-cascader
              v-model="searchForm.materialType"
              :options="typeList"
              :props="props"
            ></el-cascader>
         </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getSearch" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="showAddModel" icon="el-icon-plus">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="aia-upload-list" ref="aiaUploadList">
      <el-table style="width: 100%" :data="tableData" :height="tableHeight">
        <el-table-column prop="materialUrl" align="center" label="id">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
         <el-table-column prop="materialName" align="center" label="名字">
          <template slot-scope="scope">
            <span>{{scope.row.materialName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialUrl" align="center" label="缩略图">
          <template slot-scope="scope">
            <a href="javascript:;"><img :src="scope.row.materialUrl" style="height: 40px;"></a>
          </template>
        </el-table-column>
        <el-table-column v-for="item,inx in tableTit" :prop="item.prop" :label="item.label" align="center" :key="inx"></el-table-column>
        <el-table-column label="操作" width="160" align="center">
           <template slot-scope="scope">              
              <el-popover ref="poperoverlink" placement="right" width="400" trigger="click">
                <input style="width:330px;border:none;outline:none;" readonly :ref="'copy'+scope.row.id" :value="scope.row.materialUrl || 'https://www.uupt.com/'" type="text">
                <el-button type="primary" size="mini"  @click="copyLink(scope.$index,scope.row)"> 复制</el-button>
                <el-button type="text" slot="reference">链接</el-button>
              </el-popover>
              <el-button type="text" @click="editMaterial(scope.row)">编辑</el-button>
              <el-button :disabled="scope.row.delBtnLoading" type="text" @click="delMaterial(scope.row)">删除</el-button>
           </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="aia-upload-footer">
       <el-pagination
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageIndex"
        :page-sizes="[10,20,30,40]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next, total"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="添加素材" :visible.sync="showModal" width="400px" :modal-append-to-body="false">
      <el-form :model="materialForm" :rules="materialFormRule" ref="materialForm">
        <el-form-item label="素材名字" prop="materialName">
          <el-input v-model="materialForm.materialName" style="width:200px;" :maxlength="15" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item label="所属类型" prop="materialType">
          <!-- <el-select v-model="materialForm.materialType">
            <el-option v-for="item,inx in typeList" :label="item.type" :value="item.id" :key="inx"></el-option>
          </el-select> -->
          <el-cascader
              v-model="materialForm.materialType"
              :options="typeListD"
              :props="props"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="所属色系" prop="materialColor">
          <el-select v-model="materialForm.materialColor">
            <el-option v-for="item,inx in colorList" :label="item.colorName" :value="item.colorId" :key="inx" :style="{color: item.colorValue}"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传素材">
          <el-switch active-text="关" inactive-text="开" v-model="useUploadEl" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"></el-switch> 
        </el-form-item>   
        <el-form-item label="素材地址" prop="materialUrl">
          <el-upload 
          v-if="useUploadEl"
          :disabled="editOrAdd == 'edit'"
          :class="{'isCursor':editOrAdd=='edit'}"
          :with-credentials="true" class="avatar-uploader" 
          :action="uploadLink" 
          :show-file-list="false" 
          :data="uploadData" 
          :on-success="handleAvatarSuccess" 
          :on-exceed="handleExceed"
          :file-list="fileList"
          :before-upload="beforeAvatarUpload">
            <img v-if="materialForm.materialUrl" :src="materialForm.materialUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-input v-else v-model="materialForm.materialUrl" style="width:250px;"></el-input>
        </el-form-item>
      </el-form>
     
      <span slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">取 消</el-button>
        <el-button v-if="powerBtns.add" type="primary" :loading="addBtnLoading" @click="addMaterial">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    let formateV = this.$util.formateSql;
    return {
      uploadLink:REQUEST_PATH+'upload/uploadFile',
      editOrAdd:'add',
      searchForm: {
        materialColor: '',
        materialType:['']
      },
      tableLoading:false,
      materialForm: {
        materialUrl: "",
        materialColor: 1,
        materialType: []
      },
      materialFormRule:{
        materialName:[
          {required:true,message:'请输入名称',trigger:'blur'},
          { validator:formateV,trigger:'blur'}
        ],
        materialUrl: [
          {required:true,message:'请上传图片',trigger:'blur'},
        ],
        materialColor: [
          {required:true,message:'请选择色系',trigger:'change'},
        ],
        materialType: [
          {required:true,message:'请选择类型',trigger:'change'},
        ],
      },
      colorList: [],
      typeList: [],
      typeListD:[],
      fileList:[],
      props: {
        value: 'id',
        label:'type'
      },
      tableData: [],
      showModal: false,
      tableTit: [
        {
          prop: "colorName",
          label: "色系"
        },
        {
          prop: "typeName",
          label: "类型"
        }
      ],
      uploadAction: "/upload/uploadFile",
      uploadData: {
        fileType: 1
      },
      powerBtns:{},
      pageIndex:1,
      pageSize:10,
      total:0,
      tableHeight:'100%',
      curFilename:'',
      curIconItem:'',
      addBtnLoading:false,
      useUploadEl:1
    };
  },
  //页面渲染完成
  mounted() {
    let that = this;
    this.autoHeight();
    window.onresize = function() {
      that.autoHeight();
    };
  },
  //实例创建完成
  created() {
    let btns = sessionStorage.getItem('temp');
    this.powerBtns = Object.assign({},JSON.parse(btns));

    this.getColor();
    this.getType();
    this.search();
  },
  //keep-alive激活时执行
  activated() {},
  //自定义的方法
  methods: {
    // 动态设置table 高度
    autoHeight() {
      let main = this.$refs.aiaUploadList;
      if (main) {
        let mainset = main.getBoundingClientRect();
        this.tableHeight = mainset.height - 32;
      }
    },
    // 删除
    delMaterial(item){
      this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delMaterialAjax(item);
        }).catch(() => {        
      });     
    },
    delMaterialAjax(item){
      item.delBtnLoading = true;
      this.$post({
        url:REQUEST_PATH+'material/delMaterial',
        data:{
          id:item.id,
          url:item.materialUrl
        },
        success:(res)=>{
          item.delBtnLoading = false;
          this.$message.success('删除成功');
          this.search();
        }
      })
    },
    // 编辑
    editMaterial(item){
      console.log('编辑...')
      console.log(item)
      this.showModal = true;
      this.editOrAdd = 'edit';

      this.materialForm = Object.assign(this.materialForm,{
        materialName:item.materialName,
        materialColor:item.colorId,
        materialUrl:item.materialUrl,
        materialType:this.getMaterialTypeArr(this.typeListD,item.typeId)
      })

      this.curIconItem = item;
    },
    getMaterialTypeArr(arr,id){
      let type = [];
      let len = arr.length;
      arr.map((item,index)=>{
       if(item.id == id){
         type.push(id);
       }else{
          if(item.hasOwnProperty('children')){
            item.children.map(val=>{
              if(val.id == id){
                type.push(val.pid)
                type.push(val.id)
              }
            })
          }
       }
      })
      return type;
    },
      // 复制
    copyLink(index, row) {
      this.$refs['copy'+row.id].select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
          message: '复制成功',
          type: 'success'
      });
    },
    // 获取色系
    getColor() {
        this.$post({
          url:REQUEST_PATH+"material/getMaterialColor",
          data:{sort:'ASC'},
          success:(res)=>{
            this.colorList = res.data.data;
          }
        })
    },
    // 获取类型
    getType() {      
      this.$post({
        url:REQUEST_PATH+"material/getMaterialType",
        data:{sort:'ASC'},
        success:(res)=>{
          // this.typeList = res.data.data;         
          res.data.data.map((item,index)=>{
              this.typeListD.push(item);
              this.typeList.push(item);
          })
          // console.log('素材类型...')
          // console.log(this.typeListD)
          this.typeList.unshift({
            id:'',
            type:'全部'
          });
        }
      })
    },
    handleSizeChange(size){
      this.pageSize = size;
      this.search();
    },
    handleCurrentChange(page){
      this.pageIndex = page;
      this.search();
    },
    getSearch(){
      this.pageIndex = 1;
      this.search();
    },
    // 搜索
    search() {   
      let obj = {};
      let len = this.searchForm.materialType.length;
      obj.colorId = this.searchForm.materialColor;
      obj.typeId = this.searchForm.materialType[len-1];
      obj.pageIndex = this.pageIndex;
      obj.pageSize = this.pageSize;
      // console.log('serarch...')
      // console.log(obj);
      this.$post({
        url:REQUEST_PATH+"material/getMaterial",
        data:obj,
        loading:'tableLoading',
        success:(res)=>{
          res.data.data.map(item=>{
            item.delBtnLoading = false;
            return item;
          })
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      })
    },
    // 添加素材
    addMaterial() {
      this.$refs.materialForm.validate((valid) => {
        if(valid){
          if(this.editOrAdd == 'add'){
            this.addMaterialAjax();
          }else{
            this.editMaterialAjax();
          }          
        }
      })     
    },
    addMaterialAjax(){
      if (this.materialForm.materialUrl === "") {
        this.$message.warning("请上传图片!");
        return;
      }
      let len = this.materialForm.materialType.length;
      let obj = {
        colorId:this.materialForm.materialColor,
        materialUrl:this.materialForm.materialUrl,
        typeId:this.materialForm.materialType[len-1],
        materialName:this.materialForm.materialName
      }
      this.$post({
        url:REQUEST_PATH+"material/addMaterial",
        data:obj,
        loading:'addBtnLoading',
        success:(res)=>{
            this.$message.success(res.data.message);
            this.search();
            this.showModal = false;
            this.$refs["materialForm"].resetFields();
        }
      })
    },
    editMaterialAjax(){
      let len = this.materialForm.materialType.length;
      let obj = {
        id:this.curIconItem.id,
        colorId:this.materialForm.materialColor,
        typeId:this.materialForm.materialType[len-1],
        materialName:this.materialForm.materialName
      }      
      this.$post({
        url:REQUEST_PATH+"material/editMaterial",
        data:obj,
        loading:'addBtnLoading',
        success:(res)=>{
            this.$message.success(res.data.message);
            this.showModal = false;
            this.search();
        }
      })
    },
    handleAvatarSuccess(res, file) {
      if (res.status) {
        this.materialForm.materialUrl = res.imageUrl;
      } else {
        this.$message.warning("上传失败");
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning('只能上传一个文件');
    },
    beforeAvatarUpload(file) {
      console.log('beforeupload...')
      console.log(file);
      let name = file.name;
      let nameList = name.split('.');
      nameList.pop();
      this.curFilename = nameList.join('.')

      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/svg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("格式错误!");
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过2MB!");
      }
      return isJPG && isLt2M;
    },
    showAddModel(){
      this.showModal = true;
      this.$nextTick(()=>{
        this.$refs.materialForm.resetFields();
      })
     
      // this.materialForm.materialName = '';
      // this.materialForm.materialType = [];
      // this.materialForm.materialColor = '';
      this.materialForm.materialUrl = '';
      this.fileList = [];
      this.editOrAdd = 'add'
    }
  }
};
</script>
<style lang='less' scoped>
.uploadBox{
  width:100%;
  height:100%;
  position: relative;
  overflow:hidden;
}
.searBox {
  padding: 15px;
  /* margin: 0 0 20px; */
}
.aia-upload-list {
  padding: 0 15px;
  position:absolute;
  top:60px;
  bottom:71px;
  left:0;
  right:0;
  overflow:hidden;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  &:hover {
    border-color: #409eff;
  }
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.aia-upload-footer{
  text-align:right;
  position:absolute;
  right:0;
  left:0;
  bottom:20px;
}

</style>