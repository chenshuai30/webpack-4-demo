<template>
    <div class="musicDialog">
        <el-button v-show="!curAudioEl.materialUrl" :type="btnType" @click="audioFlag = true" size="mini">选取图片</el-button>
        <div  v-show="!!curAudioEl.materialUrl" class="audio-panel-tip">
            <img :src="curAudioEl.materialUrl" width="100" alt="img">
            <i v-show="!!curAudioEl.materialUrl" class="el-icon-circle-close-outline img-icon-delicon" @click="delCurAudio"></i>
        </div>
        <!-- 音乐弹框 -->
        <el-dialog :close-on-click-modal="false" class="audioDialog" title="选择图片" :visible.sync="audioFlag" :modal-append-to-body="false" width="970px">
            <!-- <div class="audio-panel clear" v-loading="audioLoading" element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)"> -->
            <div class="audio-panel clear" v-loading="audioLoading" element-loading-text="拼命加载中...">
                <div class="audio-panel-left">
                <ul>
                    <li :class="{'audio-panel-acitve':(audioActive == 0)}" @click="audioActive = 0">
                    <span>图片库</span>
                    </li>
                    <!-- <li :class="{'audio-panel-acitve':(audioActive == 1)}" @click="audioActive = 1"><span>我的</span></li> -->
                </ul>
                <div class="audio-panel-upload">
                    <el-button size="mini" @click="popTypeModel" type="success" plain>点击上传</el-button>
                </div>
                </div>
                <div class="audio-panel-right">
                <!-- 图片库 -->
                <div v-show="audioActive==0" class="audio-panel-musiclibrary">
                    <ul class="audio-panel-classes">
                        <li v-for="item,index in audioClasses" 
                        :class="{'audio-panel-classes-item':(audioActiveType===item.id)}" 
                        @click.stop.prevent="audioClickType(index,item)" :key="index">
                            {{item.type}}
                            <ul v-if="item.children" class="audio-panel-item">
                                <li :class="{'audio-panel-classes-item':(audioActiveTypeChild === val.id)}"  @click.stop.prevent="audioClickTypeItem(key,val,index,item)" v-for="val,key in item.children" :key="key"> {{val.type}}</li>
                            </ul>                        
                        </li>

                    </ul>
                    <ul class="img-panel-rewardList">
                        <li v-for="item,index in audioList" :class="{'audio-panel-audioList-active':(curAudioEl.id == item.id)}" @click="choiceCurAudio(item)">
                            <span class="img-panel-info">{{item.typeName}}</span>
                            <img class="img-panel-icon" :src="item.materialUrl" alt="">
                            <div class="img-panel-mask">
                                <span @click="choiceCurAudio(item)">使用</span>
                            </div>
                        </li>
                    </ul>
                    <div class="audio-panel-tip">
                    <p>
                        <span>已选择：</span>
                        <span v-text="curAudioEl.materialName"></span>
                        <i v-show="!!curAudioEl.materialName" class="el-icon-circle-close-outline" @click="delCurAudio" style="margin-left:15px;cursor:pointer;"></i>
                    </p>
                    </div>
                    <div class="audio-panel-toolbar">
                    <el-pagination @current-change="audioCurrentChange" :current-page.sync="audioCurPage" :page-size="18" layout="total, prev, pager, next" :total="audioTotal">
                    </el-pagination>
                    </div>

                </div>
                <!-- 我的 -->
                <div v-show="audioActive==1">

                </div>
                <audio loop :src="audioSrc" ref="aiaAudio" id="aiaAudio"></audio>
                <el-button-group class="audio-foot-btn">
                    <el-button type="info" @click="audioFlag=false;curAudioEl={};" size="mini">取消</el-button>
                    <el-button type="success" @click="audioOk" size="mini">确定</el-button>
                </el-button-group>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="上传图片" :visible.sync="uploadMusicFlag" :modal-append-to-body="false" width="400px">
            <div style="height:400px;">
                <el-form :model="materialForm" :rules="materialFormRule" ref="materialForm">
                    <el-form-item label="素材名字" prop="materialName" style="margin-bottom:15px;">
                        <el-input v-model="materialForm.materialName" style="width:200px;" :maxlength="15" placeholder="请输入名字"></el-input>
                    </el-form-item>
                    <el-form-item label="所属类型" prop="materialType" style="margin-bottom:15px;">
                    <!-- <el-select v-model="materialForm.materialType">
                        <el-option v-for="item,inx in typeList" :label="item.type" :value="item.id" :key="inx"></el-option>
                    </el-select> -->
                        <el-cascader
                            v-model="materialForm.materialType"
                            :options="audioClassesList"
                            :props="props"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="所属色系" prop="materialColor" style="margin-bottom:15px;">
                        <el-select v-model="materialForm.materialColor">
                            <el-option v-for="item,inx in colorList" :label="item.colorName" :value="item.colorId" :key="inx" :style="{color: item.colorValue}"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上传素材" prop="materialUrl" style="margin-bottom:15px;">
                        <el-upload 
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
                    </el-form-item>
                </el-form>
                <span slot="footer" class="fr" style="height:40px;line-height:40px;margin-top:15px;">
                    <el-button size="mini" @click="uploadMusicFlag = false">取 消</el-button>
                    <el-button size="mini" type="primary" @click="addMaterial">添 加</el-button>
                </span>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'music',   
    props:{
        btnType: {
            //当前id
            type: String,
            default: () => {
                return 'success';
            }
        },
        haveInitialData:{
            type:Boolean,
            default:()=>{
                return false
            }
        },
        initialAudioList:{
            type:Array,
            default:()=>{
                return []
            }
        },
        initialAudioTotal:{
            type:Number,
            default:()=>{
                return 0
            }
        },
        initialAudioClasses:{
            type:Array,
            default:()=>{
                return []
            }
        },
        initialColorList:{
            type:Array,
            default:()=>{
                return []
            }
        },
    },
    watch:{
        initialAudioList:{
            handler: function(cur, old) {
                if(this.haveInitialData && this.initialAudioListFlag && cur.length > 0 ){
                   this.audioList = cur;
                   this.initialColorListFlag = false;
                }
            },
            deep: true
        },
        initialAudioTotal:{
            handler: function(cur, old) {
                if(this.haveInitialData && this.initialAudioTotalFlag && cur > 0 ){
                   this.audioTotal = cur;
                   this.initialAudioTotalFlag = false;
                }
            },
            deep: true
        },
        initialAudioClasses:{
            handler: function(cur, old) {
                if(this.haveInitialData && this.initialAudioClassesFlag && cur.length > 0 ){
                   cur.map(item=>{
                       this.audioClassesList.push(item);
                       this.audioClasses.push(item);
                   })
                    this.audioClasses.unshift({
                        id:'',
                        type:'全部'
                    });
                   this.initialAudioClassesFlag = false;
                }
            },
            deep: true
        },
        initialColorList:{
            handler: function(cur, old) {
                if(this.haveInitialData && this.initialColorListFlag && cur.length > 0 ){
                   this.colorList = cur;
                   this.initialColorListFlag = false;
                }
            },
            deep: true
        },
    },
    data(){
        return{
            uploadLink:REQUEST_PATH+'upload/uploadFile',
            uploadData: {
                fileType: 1
            },
            audioFlag:false,
            uploadMusicFlag:false,
            audioLoading:false,
            audioActive:0, //当前活动tab
            audioClasses:[],
            audioClassesList:[],
            audioActiveType:'',
            audioActiveTypeChild:null,
            audioList:[],
            curAudioEl:'',
            initialAudioListFlag:true,
            initialAudioTotalFlag:true,
            initialColorListFlag:true,
            initialAudioClassesFlag:true,
            // 分页
            audioCurPage: 1,
            audioTotal: 1000,
            curMusicType: '',
            curAudioType: "",
            audioSrc: "",
            uploadUrl: REQUEST_PATH + "upload/uploadFile",
            bgAudioFileList: [],
            materialForm: {
                materialUrl: "",
                materialColor: 1,
                materialType: []
            },
            materialFormRule:{
                materialName:[
                {required:true,message:'请输入名称',trigger:'blur'}
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
            props: {
                value: 'id',
                label:'type'
            },
            colorList:[],
            fileList:[],
        }
    },
    created(){ 
        if(!this.haveInitialData){
            // 获取音乐列表
            this.getMusicList();

            // 获取音乐分类
            this.getMusicType();

            // 获取色系
            this.getColor();
        }       
    },   
    methods:{
        // 获取音乐列表
        getMusicList() {
            this.$post({
                url:REQUEST_PATH + "material/getMaterial",
                data:{
                    typeId:this.curMusicType,
                    pageIndex:this.audioCurPage,
                    pageSize:18
                },
                loading:'audioLoading',
                success:(res)=>{                   
                    this.audioList = res.data.data;
                    this.audioTotal = res.data.total;
                }
            })
        },
        getMusicType() {
            this.$post({
                url:REQUEST_PATH+"material/getMaterialType",
                data:{sort:'DESC'},
                success:(res)=>{                   
                    res.data.data.map(item => {
                        this.audioClassesList.push(item);
                        this.audioClasses.push(item);
                    });
                    this.audioClasses.unshift({
                        id:'',
                        type:'全部'
                    });
                }
            })
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
        popTypeModel(){
            this.curAudioType = "";
            this.bgAudioFileList = [];
            this.uploadMusicFlag = true;
        },
        audioClickType(index, item){              
            if(item.hasOwnProperty('children')){
                this.curMusicType = '';
                this.audioActiveType = null;
                return;
            }else{
                // 点击当前类型方法
                this.audioActiveTypeChild = null;
                this.audioActiveType = item.id;
                this.curMusicType = item.id;
                this.getMusicList();
            }
        },
        audioClickTypeItem(key,val,index,item){           
            this.audioActiveType = item.id;
            this.audioActiveTypeChild = val.id;
            this.curMusicType = val.id;
            this.getMusicList();
        },
        choiceCurAudio(item){
            this.curAudioEl = Object.assign({}, item);
            this.$emit('imgUrl',this.curAudioEl.materialUrl);
        },
        audioOk(){          
            this.audioFlag = false;
            this.bgAudio = this.curAudioEl.materialUrl || "";
            this.$emit('imgUrl',this.curAudioEl.materialUrl);
        },
        delCurAudio(){
            this.curAudioEl = {};
            this.$emit('imgUrl','');
        },
        // 换页
        audioCurrentChange(page) {
            this.audioCurPage = page;
            this.getMusicList();
        },
        handleAudioSuccess(res, file, fileList) {          
            if (!res.status) {
                this.$message.warning("上传失败");
            } else {
                // 获取上传后的图片地址
                this.getMusicList();
                this.uploadMusicFlag = false;
               
            }
        },
        handleExceed(file, fileList) {
            this.$message.warning(`只能上传一个文件`);
        },
        submitAudioUpload() {
            this.$refs.musicUpType.submit();
        },
        // 添加素材
        addMaterial() {
            this.$refs.materialForm.validate((valid) => {
                if(valid){
                    this.addMaterialAjax();       
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
                success:(res)=>{
                    this.$message.success(res.data.message);
                    this.getMusicList();                  
                    this.$refs["materialForm"].resetFields();
                    this.uploadMusicFlag = false;
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
        beforeAvatarUpload(file) {           
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
    }
}

</script>
<style lang="less" rel="stylesheet/scss" scoped>
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
