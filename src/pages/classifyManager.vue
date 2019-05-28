<template>
  <!-- 当前模板所建活动列表 -->
  <div id="aia-classify">
    <div class="aia-classify-ope">
      <el-button  @click="addNewCls(null)" size="mini">新增分类<i class="el-icon-plus el-icon--right"></i></el-button>
    </div>
    <div class="aia-classify-content">
        <dl v-for="item,index in classArr" :key="index">
          <dt>
            <span>{{item.classifyName}}</span>
            <span class="aia-classify-title-icon">
              <i class="el-icon-edit" @click="editTemp(item,'cls')"></i>
              <i class="el-icon-delete" @click="delTemp(item,'cls')"></i>
            </span>
          </dt>
          <dd v-for="val,key in item.typeList" :key="key">
            <span>{{val.typeName}}</span>
            <div class="aia-cliassify-icon">
              <i class="el-icon-edit" @click="editTemp(val,'tmp')"></i>
              <i class="el-icon-delete" @click="delTemp(val,'tmp')"></i>
            </div>
          </dd>
          <dd class="aia-classify-content-add">
            <span @click="addNewCls(item.id)">新增模板类别 <i class="el-icon-plus"></i></span>
          </dd>
        </dl>
    </div>
    <el-dialog
      title="新增分类"
      :visible.sync="addClasFlag"
      :modal-append-to-body="false"
      width="500px">
      <el-form :model="clsForm" :rules="clsRule" ref="clsForm" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="clsForm.name" placeholder="分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <el-input v-model="clsForm.icon" placeholder="图标地址"></el-input>
        </el-form-item>
        <el-form-item label="分类描述" prop="desc">
          <el-input type="textarea" v-model="clsForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addClasFlag = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addClsOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "activityList",
  data() {
    return {
      classArr:[],
      addClasFlag:false,
      clsForm:{
        name:'',
        icon:'',
        desc:''
      },
      clsRule:{
        name:[
          {required:'true',message:'请填写名称',trigger:'blur'}
        ]
      },
      addType:'cls',
      curClsId:'',
      addOrEdit:'add'
    };
  },
  created() {
    this.getClassesList();
  },
  mounted() {

  },
  methods: {
    getClassesList() {
      this.$post({
          url:REQUEST_PATH + "classify/getClassifyType",
          data:{},
          success:(res)=>{
              this.classArr = res.data.data;
              console.log('类别')
              console.log(this.classArr)
          }
      })
    },
    addNewCls(id){
      this.addOrEdit = 'add';
      if(id){
        this.addType = 'temp';
        this.curClsId = id;
      }else{
        this.addType = 'cls'
      }
      this.addClasFlag = true;
      this.$nextTick(()=>{
        this.$refs.clsForm.resetFields();
      })
    },
    addClsOk(){
      this.$refs.clsForm.validate((valid)=>{
        if(valid){
          this.addClsData();          
        }
      })     
    },
    addClsData(){
      let obj = null,url=null;     
      if(this.addType == 'cls'){
        obj = {
          classifyName:this.clsForm.name,
          classifyIcon:this.clsForm.icon,
          classifyDesc:this.clsForm.desc
        }
        if(this.addOrEdit == 'add'){
           url='classify/addClassify'
        }else{
           url='classify/editClassify'
           obj.id = this.curClsId;
        }       
      }else{
        obj = {
          typeName:this.clsForm.name,
          typeIcon:this.clsForm.icon,
          typeDesc:this.clsForm.desc
        }
        if(this.addOrEdit == 'add'){
           obj.classifyId = this.curClsId
           url='type/addType'
        }else{
          url='type/editType'
          obj.id = this.curClsId;
        }        
      }
      this.addClsAjax(obj,url);
    },
    addClsAjax(obj,url){
      this.$post({
          url:REQUEST_PATH + url,
          data:obj,
          success:(res)=>{
            console.log('新增类别成功')
            console.log(res)
            this.getClassesList();
            this.addClasFlag = false;
          }
      })
    },
    delTemp(val,type){
      this.$confirm('此操作将删除该分类，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = null;
        if(type == 'cls'){
          url = 'classify/delClassify'
        }else{          
          url = 'type/delType';
        }
        this.delTempAjax(val.id,url);
      }).catch(() => {});
    },
    delTempAjax(tid,url){
      this.$post({
        url: REQUEST_PATH + url,
        data:{id:tid},
        success:(res)=>{
          if(res.status){
            this.$message.success('删除成功');
            this.getClassesList();
          }else{
            this.$message.warning('删除失败');
          }
        }
      })
    },
    editTemp(val,type){
      this.addOrEdit = 'edit';
      let obj = {
        name:'',
        icon:'',
        desc:''
      }
      let name = null;
      if(type == 'tmp'){
        this.addType = 'temp';        
        name = 'type'
      }else{
        this.addType = 'cls';
        name = 'classify' 
      }
      this.curClsId = val.id;
      obj.name = val[name+'Name'];
      obj.icon = val[name+'Icon'];
      obj.desc = val[name+'Desc'];
      this.clsForm = Object.assign(this.clsForm,obj);
      this.addClasFlag = true;
    }
  }
};
</script>

<style lang="less"  rel="stylesheet/less" scoped>
  #aia-classify{
    padding:20px;
    .aia-classify-content{
      dl{
        dt{
          line-height:50px;
          height:50px;
          font-weight:bold;
          &:hover{
            span.aia-classify-title-icon{
              display:inline;
            }
          }
          span.aia-classify-title-icon{
            margin-left:5px;
            font-size:14px;
            display:none;
            i{
              cursor:pointer;
              &:first-child{
                margin-right:5px;
              }
            }
          }
        }
        dd{
          display:inline-block;
          margin-left:0;
          font-size: 12px;
          padding: 0 10px;
          min-width:70px;
          line-height: 33px;
          margin-right: 5px;
          text-align: center;
          display: inline-block;
          background: linen;
          border: 1px solid #dcdfe6;
          border-radius: 3px;          
          position: relative;
          &.aia-classify-content-add{
            background-color:#fff;
            border: 1px solid #dcdfe6;
            cursor: pointer;
          }         
          .aia-cliassify-icon{
            // display:none;
            opacity:0;
            position:absolute;
            width:100%;
            height:100%;
            top:0;
            left:0;
            color:#fff;
            background:rgba(0,0,0,0.7);
            border-radius: 3px;
            transition: opacity .2s;
            i{
              cursor:pointer;
            }
            i:first-child{
              margin-right:6px;
            }
          }
          &:hover{
            .aia-cliassify-icon{
              // display:block;
              opacity:1;
            }
          }
        }
      }
    }
  }
</style>