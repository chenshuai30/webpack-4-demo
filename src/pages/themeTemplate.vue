<template>
    <!-- 新建活动 -->
    <div id='aia-newactivity'>
        <div class="aia-newa-head">
            <el-button type="primary" size="mini" @click="back">返回</el-button>
        </div>
        <div class="aia-newa-main">
            <div class="aia-newa-main-body">
                <div class="flex">
                    <div class="aia-main-body-left">
                        <div id="phoneContainer">
                            <div id="phoneBody">
                                <div class="aia-phonetitle">{{phonetitle}}</div>
                                <div id="phoneContent">
                                    <div v-if="ifrLoading" style="text-align:center;height:486px;line-height:486px;">
                                        <img src="@assets/images/loading.gif" alt="loading..." width="50">
                                    </div>
                                    <iframe style="width:100%;height:100%" scrolling="yes" id="ifr" :src="templateSrc" frameborder="0"></iframe>
                                    <!-- <img id="imgContainer" :src="" alt="template" width="320"> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 aia-newa-main-right">
                        <div class="aia-newa-configform">
                            <!-- step 1 -->                            
                            <input style="width:0px;display:none;" id="importJson" class="inport-json" accept=".json" type="file">
                            <h3>通用规则 
                                <el-button class="fr" size="mini" @click="exportJson">导出皮肤配置</el-button>
                                <el-button style="margin-right:10px;" class="fr"  size="mini"  @click.prevent="importSkinJson($event)">导入皮肤配置</el-button>                               
                            </h3>
                            <el-form :model="commonForm" ref="commonForm" :rules="commonFormRule" label-width="130px" style="padding-top:22px;border:1px dashed #ccc;padding-right:10px;">
                                <el-form-item label="标题名称" prop="name">
                                    <el-input v-model="commonForm.name" style="width:300px"></el-input>
                                </el-form-item>
                                <el-form-item label="是否显示背景图片">
                                    <el-switch @change="switchChange('bgImg')" active-text="关" inactive-text="开" v-model="bgimgflag" active-color="#13ce66" inactive-color="#d1d1d1"></el-switch>
                                </el-form-item>
                                <el-form-item v-show="!bgimgflag" label="背景图片url地址" prop="bgImg">
                                    <el-input v-model="commonForm.bgImg" placeholder="请输入图片地址" style="width:300px"></el-input>
                                </el-form-item>
                                <el-form-item v-show="bgimgflag" label="背景图片" prop="bgImg">
                                    <el-upload class="upload-demo" ref="upload" 
                                        :with-credentials="true"
                                        :data="{fileType:4}"
                                        accept="image/jpeg,image/png" 
                                        :action="uploadUrl"
                                        :on-preview="handlePreview" 
                                        :on-remove="handleRemove" 
                                        :file-list="fileList" 
                                        list-type="picture-card"
                                        :multiple="false" 
                                        :on-success="handleBgImgSuccess"
                                        :limit="1" 
                                        :on-exceed="handleExceed"
                                         :auto-upload="false">
                                        <i slot="trigger" class="el-icon-plus"></i>
                                        <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过500kb</div>
                                    </el-upload>
                                    <el-button size="small" type="success" @click="submitUpload('upload')">上传到服务器</el-button>
                                    <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" size="tiny">
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                                </el-form-item>
                                <el-form-item label="是否显示背景颜色" prop="bgColor">
                                    <el-switch @change="switchChange('bgColor')" active-text="关" inactive-text="开" v-model="bgcolorflag" active-color="#13ce66"
                                        inactive-color="#d1d1d1" style="margin-left:10px;"></el-switch>
                                </el-form-item>
                                <el-form-item v-show="bgcolorflag" label="背景颜色" prop="bgColor">
                                    <el-color-picker v-model="commonForm.bgColor" size="mini" style="vertical-align:middle;"></el-color-picker>
                                </el-form-item>
                                <el-form-item label="是否显示背景音乐" prop="bgVideo">
                                    <el-switch @change="switchChange('bgVideo')" active-text="关" inactive-text="开" v-model="bgvideoflag" active-color="#13ce66"
                                        inactive-color="#d1d1d1" style="margin-left:10px;"></el-switch>
                                </el-form-item>
                                <el-form-item v-show="bgvideoflag" label="背景音乐" prop="bgVideo">
                                    <el-upload class="upload-demo" ref="uploadvideo" 
                                        :with-credentials="true"
                                        :data="{fileType:3}"
                                        accept="audio/*" 
                                        :action="uploadUrl" :on-preview="handlePreview"
                                        :on-remove="handleRemove" 
                                        :file-list="audiofileList" 
                                        :multiple="false"
                                        :limit="1" 
                                        :on-success="handleVideoSuccess"
                                        :on-exceed="handleExceed" 
                                        :auto-upload="false">
                                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>      
                                        <el-button size="small" type="success" @click="submitUpload('uploadvideo')">上传到服务器</el-button>                                 
                                        <div slot="tip" class="el-upload__tip">只能上传音频文件，且不超过2000kb</div>
                                    </el-upload>
                                    
                                    </el-switch>
                                </el-form-item>

                                <el-form-item label="皮肤效果图" prop="skinImg">
                                    <el-upload class="upload-demo" ref="uploadskin" 
                                        :with-credentials="true"
                                        :data="{fileType:4}"
                                        accept="image/jpeg,image/png" 
                                        :action="uploadUrl"
                                        :on-preview="handleSkinPreview" 
                                        :on-remove="handleRemove" 
                                        :file-list="skinfileList" 
                                        list-type="picture-card"
                                        :multiple="false" 
                                        :on-success="handleSkinSuccess"
                                        :limit="1" 
                                        :on-exceed="handleExceed"
                                            :auto-upload="false">
                                        <i slot="trigger" class="el-icon-plus"></i>
                                        <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过500kb</div>
                                    </el-upload>
                                    <el-button size="small" type="success" @click="submitUpload('uploadskin')">上传到服务器</el-button>
                                    <el-dialog :modal-append-to-body="false" :visible.sync="skinVisible" size="tiny">
                                        <img width="100%" :src="skinImageUrl" alt="">
                                    </el-dialog>
                                </el-form-item>

                            </el-form>

                            <h3>自定义规则
                                <el-button size="mini" @click="addRules">新增规则</el-button>
                            </h3>

                            <div v-show="selfList.length>0" style="padding-top:22px;border:1px dashed #ccc;padding-right:10px;">
                                <Setform @delItem="delselfitem" :list="selfList" :showicon="true" ref="selfForm" labelWidth="130px">
                                </SetForm>
                            </div>

                            <div class="clear" style="padding-top:22px;">
                                <el-button type="primary" size="mini" :loading="addSkinLoading" @click="addThemesOk" class="fr">确定</el-button>
                            </div>
                        </div>
                        <span class="aia-newa-arrow"></span>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="新增规则" :visible.sync="ruleflag" width="500px" :modal-append-to-body="false">
            <el-form ref="ruleForm" :model="ruleForm" :rules="ruleFormRules" label-width="80px">
                <el-form-item label="规则类型" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择活动区域" style="width:300px;">
                        <el-option v-for="item,index in ruletypes" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则描述" prop="label">
                    <el-input placeholder="如：背景颜色" v-model="ruleForm.label" style="width:300px;"></el-input>
                </el-form-item>
                <el-form-item label="字段名称" prop="prop">
                    <el-input placeholder="如：bgColor" v-model="ruleForm.prop" style="width:300px;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ruleflag = false">取 消</el-button>
                <el-button type="primary" @click="ruleOk">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    // import imgs0 from '@assets/images/turnluck.png'
    export default {
        name: 'newActivity',

        data() {
            let formateV = this.$util.formateSql;
            return {
                uploadUrl:REQUEST_PATH+'upload/uploadFile',
                dialogImageUrl: '',
                dialogVisible: false,
                skinImageUrl:'',
                skinVisible:false,
                templateSrc: '',
                phonetitle:'新增模板',
                skinfileList:[],
                // iframe加载控件
                ifrLoading: true,
                // 通用规则
                bgimgflag: false,
                bgcolorflag: false,
                bgvideoflag: false,
                commonForm: {
                    name: '',
                    bgImg: '',
                    bgColor: '',
                    bgVideo: '',
                    skinImg:''
                },
                commonFormRule: {
                    'name': [
                        { required: true, message: '请填写名称', trigger: 'blur' },
                        { validator:formateV,trigger:'blur'}
                    ],
                    'bgImg': [
                        { required: true, message: '请上传图片或者图片地址', trigger: 'blur' }
                    ]
                },

                // 自定义规则
                fileList: [],
                audiofileList: [],
                // 配置1的form数据
                selfList: [],

                //  新增规则弹框
                ruleflag: false,
                ruletypes: [
                    { label: "文本", value: "text" },
                    { label: "上传图片", value: "uploadimg" },
                    { label: "上传文件", value: "uploadfile" },
                    { label: "颜色选择器", value: "colorpicker" },
                ],
                ruleForm: {
                    type: '',
                    label: '',
                    prop: ''
                },
                ruleFormRules: {
                    'type': [
                        { required: true, trigger: 'change', message: '请选择类型' }
                    ],
                    'label': [
                        { required: true, trigger: 'blur', message: '请输入规则描述' },
                        { validator:formateV,trigger:'blur'}
                    ],
                    'prop': [
                        { required: true, trigger: 'blur', message: '请输入字段名称' },
                        { validator:formateV,trigger:'blur'}
                    ]
                },
                curSkinData:'',
                eOrAdd:'add',
                linkParams:{},
                curTempDetail:[],
                addSkinLoading:false,
            }
        },
        created() {
            // console.log(this.id);
            // console.log(this.isEdit);
            let param = this.$route.params;
            // console.log('template and id...');
            // console.log(param.tempId);
            // console.log(param.skinId);
            this.linkParams = param;

            this.getTempDetail(param.tempId);
            
            if(param.skinId != 'add'){
                this.eOrAdd = 'edit';
                // 如果是新增皮肤，则获取模板皮肤配置？？？
                // this.getTemplateConfig();

                this.getThemeList(param.tempId,param.skinId);

            }else{
                this.eOrAdd = 'add';                
            }
            this.allRate = 0;
        },
        mounted() {
            let that = this;
            // this.scroll.init(document.querySelector('#phoneContent'));
            document.getElementById('ifr').onload = function () {
                that.ifrLoading = false;
                if(that.$route.params.skinId != 'add'){
                    document.querySelector("#ifr").contentWindow.postMessage(
                        {
                            templetId: that.$route.params.tempId,
                            skinId: that.$route.params.skinId
                        },
                        that.templateSrc
                    );
                }
            }
            
        },
        methods: {
            importSkinJson(e){
                let that = this;
                if (typeof (FileReader) === 'undefined') {
                    this.$message.warning('抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！')
                } else {                   
                    //开启监听, 导入皮肤json配置
                    document.getElementById('importJson').addEventListener('change',function(e){
                        var files = e.target.files;
                        let reader = new FileReader();
                        reader.readAsText(files[0]);
                        reader.onload = function(e){
                            var result= this.result;
                            console.log('导入文件...');               
                            console.log(JSON.parse(result));
                            that.setDefaultSkinData(JSON.parse(result))
                        };      
                        reader.onabort = function(){
                            that.$message.warning('导入配置中断，请重新导入')
                        }   
                        reader.onerror = function(){
                            that.$message.warning('导入配置出错，请重新导入')
                        }
                    },false)
                    document.getElementById('importJson').click();
                }
            },
            back() {
                this.$router.back();
            },
            getTempDetail(tempId){
                this.$post({
                    url:REQUEST_PATH + "templet/getTemplet",
                    data:{
                        id:tempId
                    },
                    success:(res)=>{
                        console.log("template detail...");
                        console.log(res);
                        this.curTempDetail = res.data.data[0];         
                        this.templateSrc = REQUEST_PATH + this.curTempDetail.htmlSrc + '?activityId=0'                      
                        this.phonetitle = this.curTempDetail.templetName;
                    }
                })
            },
            // 获取皮肤详情
            getThemeList(tempId,skinId){
                // let that = this;
                let obj = {
                    templetId:tempId,
                    id:skinId
                }
                this.$post({
                    url:REQUEST_PATH+'skin/getSkin',
                    data:obj,
                    success:(res)=>{
                        if(!res.data.data || res.data.data.length<0){
                            return;
                        }
                        this.curSkinData = res.data.data[0];
                        this.curSkinData.skinConfig = JSON.parse(this.curSkinData.skinConfig);
                        
                        this.setDefaultSkinData(this.curSkinData.skinConfig);
                    }
                })
            },
            // 设置皮肤默认参数
            setDefaultSkinData(config){
                // 获取皮肤配置
                let obj = Object.assign({},config);
                // 获取通用规则
                this.commonForm = Object.assign({},obj.common);
                // 设置手机图片
                // this.templateSrc = this.commonForm.skinImg;
                // this.phonetitle = this.commonForm.name;

                // 获取自定义骨子
                this.selfList = [];
                obj.selfList.map(item=>{
                    let prop = item.prop;
                    if(!item.hasOwnProperty('show')){
                        item.show = true;
                    }
                    item.value = obj.self[prop];
                    if(item.type == 'upload'){
                        let imgName = item.value.split('/').pop();
                        item.fileList = [];
                        item.fileList.push({
                            name:imgName,
                            url:item.value
                        })                        
                    }
                   this.selfList.push(item);
                })

                if(!!this.commonForm.bgImg){
                    this.bgimgflag = true;                   
                    let bgimgsrc = this.commonForm.bgImg.split('/').pop();
                    this.dialogImageUrl = this.commonForm.bgImg;
                    // console.log('common img...');                    
                    this.fileList.push({
                        name:bgimgsrc,
                        url:this.commonForm.bgImg
                    })
                    // console.log(this.fileList);
                }
                if(!!this.commonForm.skinImg){
                    this.skinImageUrl = this.commonForm.skinImg;
                    let skinimgsrc = this.commonForm.skinImg.split('/').pop();
                    this.skinfileList.push({
                        name:skinimgsrc,
                        url:this.commonForm.skinImg
                    })
                    this.skinImageUrl = this.commonForm.skinImg;
                }
                if(!!this.commonForm.bgColor){
                    this.bgcolorflag = true;
                }

                if(!!this.commonForm.bgVideo){
                    this.bgvideoflag = true;
                    let audiosrc = this.commonForm.bgVideo.split('/').pop();
                    this.audiofileList.push({
                        name:audiosrc,
                        url:this.commonForm.bgVideo
                    })
                    // console.log('bg video...');
                    // console.log(this.audiofileList);
                }                                                
            },
            // 通用规则
            switchChange(key) {
                this.commonForm[key] = '';
            },
            // 自定义规则
            addRules() {
                this.ruleflag = true;
                this.$nextTick(()=>{
                    this.$refs.ruleForm.resetFields();
                })                
            },
            // 新增规则弹框
            ruleOk() {
                // console.log('新增...');
                // console.log(this.ruleForm);
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.ruleFormValidOk();
                    }
                })
            },
            ruleFormValidOk() {
                this.ruleflag = false;
                let obj = {
                    "label": this.ruleForm.label + ' (' + this.ruleForm.prop + ')',
                    "prop": this.ruleForm.prop,
                }
                switch (this.ruleForm.type) {
                    case 'text': {
                        obj = Object.assign(obj, {
                            "type": "text",
                            "width": 400,
                            "value": "",
                            "show":true,
                            "haveRule": true,
                            "rule": [
                                { "required": "true", "message": "内容不能为空", "trigger": "blur" },
                                { "validator":this.$util.formateSql,"trigger":'blur'}
                            ]
                        })
                        break;
                    }
                    case 'colorpicker': {
                        obj = Object.assign(obj, {
                            "type": "colorpicker",
                            "value": "",
                            "haveRule": true,
                            "show":true,
                            "rule": [
                                { "required": "true", "message": "请选取颜色值", "trigger": "blur" }
                            ]
                        })
                        break;
                    }
                    case 'uploadimg': {
                        obj = Object.assign(obj, {
                            "type": "upload",
                            "show":true,
                            "ref":this.$util.getId(),
                            "filetype": 'image/jpg,image/png',
                            "fileList": [],
                            "value": "",
                            "haveRule": true,
                            "tip": "只能上传jpg/png文件，且不超过500kb",
                            "url": this.uploadUrl,
                            "data":{fileType:4},
                            "rule": [
                                { "required": "true", "message": "请上传图片", "trigger": "blur" }
                            ],
                            onpreview(file) {
                                console.log(file);
                            },
                            onremove(file, fileList) {
                                console.log(file, fileList);
                            }                          
                        })
                        break;
                    }
                    case 'uploadfile': {
                        obj = Object.assign(obj, {
                            "type": "upload",
                            "show":true,
                            "filetype": '*/*',
                            "ref":this.$util.getId(),
                            "fileList": [],
                            "value": "",
                            "haveRule": true,
                            "tip": "可以上传任意类型的文件",
                            "url": this.uploadUrl,
                            "data":{fileType:4},
                            "rule": [
                                { "required": "true", "message": "请上传文件", "trigger": "blur" }
                            ],
                            onpreview(file) {
                                console.log(file);
                            },
                            onremove(file, fileList) {
                                console.log(file, fileList);
                            }                           
                        })
                        break;
                    }
                }

                let searchform = this.$refs.selfForm.searchForm;
                this.selfList.map(item=>{
                    let prop = item.prop;
                    item.value = searchform[prop];
                    return item;
                })
                this.selfList.push(obj);
            },
            // 背景图片上传
            submitUpload(name) {
                this.$refs[name].submit();
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleSkinPreview(file){
                this.skinImageUrl = file.url;
                this.skinVisible = true;
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件`);
            },
            handleBgImgSuccess(res, file, fileList){
                // console.log('upload success...');
                // console.log(res);
                this.commonForm.bgImg = res.imageUrl;
            },
            handleVideoSuccess(res, file, fileList){
                // console.log('upload success...');
                // console.log(res);
                this.commonForm.bgVideo = res.imageUrl;
            },
            handleSkinSuccess(res,file,fileList){
                // console.log('skin upload success...');
                // console.log(res);
                this.commonForm.skinImg = res.imageUrl;               
            },
            exportJson(){
                console.log('导出json文件');
                let skinConfig = {
                    common:this.commonForm,
                    self:this.$refs.selfForm.searchForm,
                    selfList:this.$refs.selfForm.list
                }
                this.downloadFile(JSON.stringify(skinConfig),'skinConfig.json');
            },
            downloadFile:(content, filename) => {
                // 创建隐藏的可下载链接
                var eleLink = document.createElement('a');
                eleLink.download = filename;
                eleLink.style.display = 'none';
                // 字符内容转变成blob地址
                var blob = new Blob([content]);
                eleLink.href = URL.createObjectURL(blob);
                // 触发点击
                document.body.appendChild(eleLink);
                eleLink.click();
                // 然后移除
                document.body.removeChild(eleLink);
            },
            // 新增皮肤
            addThemesOk() {
                console.log('新增皮肤...');
                // console.log(this.commonForm);
                // console.log(this.$refs.selfForm.searchForm);

                this.$refs.commonForm.validate((valid) => {
                    if (valid) {
                        if (this.selfList.length > 0) {
                            // console.log(this.$refs.selfForm.searchForm);
                            // 自定义验证
                            let flag = this.$refs.selfForm.submitForm();
                            if (!flag) {
                                return;
                            }
                        }
                        // 整合通用和自定义设置 
                        let config = {
                            common:this.commonForm,
                            self:this.$refs.selfForm.searchForm,
                            selfList:this.$refs.selfForm.list
                        }
                        // console.log('config...');
                        // console.log(config);
                        // this.$router.back();
                        if(this.eOrAdd == 'add'){
                            this.addThemeMethod(config);
                        }else{
                            this.editThemeMethod(config);
                        }                        

                    }
                })

            },
            addThemeMethod(config) {
                this.$post({
                    url:REQUEST_PATH + 'skin/addSkin',
                    data:{
                        skinConfig: JSON.stringify(config),
                        templetId: this.linkParams.tempId
                    },
                    loading:'addSkinLoading',
                    success:(res)=>{
                        this.$router.push('/main/themes');
                    }
                })
            },
            editThemeMethod(config){
                this.$post({
                    url:REQUEST_PATH + 'skin/editSkin',
                    data:{
                        skinConfig: JSON.stringify(config),
                        id: this.linkParams.skinId
                    },
                    loading:'addSkinLoading',
                    success:(res)=>{
                        this.$router.push('/main/themes');
                    }
                })
            },
            // 删除自定义规则
            delselfitem(index){
                this.selfList.splice(index,1);
            }
        }
    }
</script>

<style scoped>
    #aia-newactivity .aia-newa-main-body{
        padding-right:inherit;
    }
    #aia-newactivity .aia-newa-main-body .aia-newa-main-right .aia-newa-configform{
        top:0;
    }

    #aia-newactivity .aia-newa-main {
        bottom: 0px;
        top: 0px;
        padding-top: 30px;
        padding-bottom:100px;
    }
    #aia-newactivity .aia-newa-main-body .aia-newa-main-right{
        top:0;
    }
    .aia-newa-head {
        position: relative;
        z-index: 1;
    }
</style>