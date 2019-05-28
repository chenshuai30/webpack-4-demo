<template>
    <!-- 活动模板列表 -->
    <div id='aia-template' v-loading.fullscreen.lock="tempLoading"  element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
        <h3>模板列表  <el-button-group  class="fr">
            <el-button @click="back" type="primary" size="mini">返回</el-button><el-button  v-if="powerBtns.add" @click="handleAddTemp()" size="mini">新增模板</el-button>
        </el-button-group></h3>
        <div class="aia-template-type"> 
            <h3>
                <span style="padding-right:10px;">类型 </span>
                <el-button-group>
                    <el-button @click="checkType" plain size="mini" checked>所有</el-button>
                    <el-button @click="checkType(item)" v-for="item,index in classesList" :key="item.id" plain size="mini">{{item.classifyName}}</el-button>
                </el-button-group>
            </h3>            
        </div>
        <div class="aia-template-content">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4"  v-for="val,key in tempList" :key = "key" style="width:265px;">
                    <div class="aia-template-item">
                        <div class="aia-template-img">
                            <img :src="val.templetIcon" alt="">                           
                        </div>
                        <div class="aia-template-desc">
                            <div class="aia-template-desc-title">
                                <h3>{{val.templetName}}</h3>
                            </div>
                           
                            <div v-if="userPower" class="aia-template-desc-tool clearfix">                                                              
                                <ul>
                                    <li v-if="powerBtns.add" @click="handleAddTemp(val)" class="aia-template-desc-tool-add"><i class="el-icon-plus"></i>复制</li>
                                    <li v-if="powerBtns.edit" @click="handleEditTemp(val)" class="aia-template-desc-tool-edit"><i class="el-icon-edit"></i>编辑</li>
                                    <li v-if="powerBtns.del" @click="handleDelTemp(val)" class="aia-template-desc-tool-del"><i class="el-icon-delete"></i>删除</li>
                                </ul>
                            </div>
                        </div>
                        <img class="aia-template-qrcode" src="@assets/images/qrcode.png" alt="code"> 
                        <div class="aia-template-code">
                            <div class="aia-template-code-detail" :ref="'tempQr'+val.id" :id="'tempQr'+val.id"></div>
                            <!-- <img  class="aia-template-code-detail" src="@assets/images/code.png" alt="code"> -->
                        </div>
                        <div class="aia-template-layout">
                            <ul class="clearfix">
                                <li @click="jumpToSetPage(val)">
                                    <div class="aia-template-layout-icon"><span><i class="el-icon-check"></i></span></div>
                                    <div class="aia-template-layout-txt"><span>使用此模板</span></div>
                                </li>
                                <li @click="viewTempDetail(val)">
                                    <div class="aia-template-layout-icon"><span><i class="el-icon-view"></i></span></div>
                                    <div class="aia-template-layout-txt"><span>预览</span></div>
                                </li>
                            </ul>
                        </div>
                        <div class="aia-template-tag">
                            <span>{{val.classifyName}}</span>
                        </div>
                    </div>                   
                </el-col>
            </el-row>
        </div>
        <div class="aia-template-pagenation">
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

        <el-dialog title="模板预览" :visible.sync="tempViewFlag" width="800px" :modal-append-to-body="false">
            <div class="temp-view-main">
                <el-row>
                    <el-col :span="12">
                        <!-- <img height="500" :src="tempViewModel.templetIcon" alt="icon"> -->
                        <div id="previewPhone">
                            <div class="previewPhone-title">{{tempViewModel.templetName}}</div>
                            <div class="previewPhone-content">                                
                                <div v-if="ifrLoading" style="text-align:center;height:486px;line-height:486px;">
                                    <img src="/assets/images/loading.gif" alt="loading..." width="50">
                                </div>
                                <iframe style="width:100%;height:100%" scrolling="yes" id="ifrTemp" :src="baseUrl+tempViewModel.htmlSrc+'?activityId=0'" frameborder="0"></iframe>
                            </div>                            
                        </div>
                    </el-col>
                    <el-col :span="12">                       
                        <div style="font-size:12px;padding-left:15px;">       
                            <h3>基本信息</h3>                         
                            <p>模板名称：<span>{{tempViewModel.templetName}}</span></p>
                            <p>所属类别：<span>{{tempViewModel.classifyName}}</span></p>
                        </div>                  
                    </el-col>
                </el-row>
            </div>
            
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span> -->
        </el-dialog>

    </div>
</template>

<script>
import '@assets/js/jquery.qrcode.min.js'
import tt1 from '@assets/images/tt1.png'
export default {
    name: 'templateList',
    data() {
        return {
            ifrLoading: true,
            baseUrl:REQUEST_PATH,
            // 控制用户权限
            userPower:true,
            tempList:[
                // {
                //     id:0,
                //     name:'中秋',     
                //     icon:imgs0          
                // },{
                //     id:1,
                //     name:'中秋',     
                //     icon:imgs1              
                // }
            ],
            tempId:'',
            classesList:[],
            tempLoading:true,

            // 模板预览
            tempViewFlag:false,
            tempViewModel:{},
            powerBtns:'',
            pageIndex:1,
            pageSize:10,
            totalnum:0,
        }
    },
    created(){
        let btns = sessionStorage.getItem('temp');
        this.powerBtns = Object.assign({},JSON.parse(btns));
        // this.tempId = this.$route.params.id;
        this.getTempList();
        this.getClassesList();
    },
    mounted(){
        let that = this;
    },
    methods: {
        getClassesList(){
            this.$post({
                url:REQUEST_PATH+'classify/getClassifyType',
                data:{},
                success:(res)=>{
                    this.classesList = res.data.data;
                }
            })
        },
        // 跳转到模板列表
        jumpToSetPage(val){
            // console.log('click');
            this.$router.push('/main/newactivity/'+val.id);
        },
        // 预览
        viewTempDetail(val){
            let that = this;
            console.log('预览');
            console.log(val);
            // return;
            this.tempViewFlag = true;
            this.ifrLoading = true;
            this.tempViewModel = Object.assign({},val);

            this.$nextTick(()=>{
                document.getElementById("ifrTemp").onload = function() {
                    // console.log('loaded...');
                    that.ifrLoading = false;
                };
            })
        },
        back(){
            
            this.$router.back();
        },
         // 获取模板列表
        getTempList(){
            this.$post({
                url:REQUEST_PATH+"templet/getTemplet",
                data:{
                    pageIndex:this.pageIndex,
                    pageSize:this.pageSize,
                    classifyId:this.tempId
                },
                loading:'tempLoading',
                success:(res)=>{
                    res.data.data.map(item=>{
                        item.disBtnLoading = false;
                        return item;
                    })
                    this.tempList = res.data.data;     
                    this.totalnum = res.data.total;
                    this.$nextTick(()=>{
                        this.tempList.map(item=>{  
                            this.setQrcode('#tempQr'+item.id,REQUEST_PATH+item.htmlSrc+'?activityId=0');
                        })
                    }) 
                }
            })
        },
        handleSizeChange(size){
            this.pageSize = size;
            this.getTempList();
        },
        handleCurrentChange(page){
            this.pageIndex = page;
            this.getTempList();
        },
        setQrcode(id,link){
            // console.log('qrcode...');
            let hasChildren = $(id).children();
           
            if(hasChildren.length<=0){
               $(id).qrcode({
                width: 200,
                height: 200,
                text: link});
            }
            $(id).append('<img src="'+tt1+'" style="position:absolute;width:48px;height:48px;top:76px;left:76px;"/>');
        },
        checkType(item){
            if(!item){
                this.tempId = '';
            }else{
                this.tempId = item.id;
            }
            this.getTempList();
        },
        // 新增模板
        handleAddTemp(val){
            // this.$message.warning('功能暂未开放');
            // return;

            // console.log('新增...');
            // console.log(val);
            let id = '';
            if(val){
                id = val.id;
            }else{
                id = 'add'
            }
            let link = '/main/addtemplate/'+id;
            this.$router.push(link);
        },
        // 编辑模板
        handleEditTemp(val){
            // this.$message.warning('功能暂未开放');
            // return;
            // console.log('编辑...');
            // console.log(val);       
            let id = val.id;    
            let link = '/main/addtemplate/edit/'+id;
            this.$router.push(link);
        },
        // 删除
        handleDelTemp(val){
            // this.$message.warning('功能暂未开放');
            // return;
            if(val.disBtnLoading){
                return;
            }
            this.$confirm('此操作将永久删除该模板以及该模板下的所有皮肤, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.delAjax(val);
            }).catch(() => {
                  
            });
        },
        delAjax(val){
            val.disBtnLoading = true;
            this.$post({
                url:REQUEST_PATH+'templet/delTemplet',
                data:{
                    id:val.id,
                    htmlSrc:val.htmlSrc
                },
                success:(res)=>{
                    val.disBtnLoading = false;
                    this.$message.success('模板删除成功!');
                    this.getTempList();
                }
            })
        },
    }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
#aia-template .aia-template-type{
  padding:20px;
  padding-top:0;  
}
#aia-template .aia-template-type h3{
    font-size: 15px;
    padding:0;
    margin:0;
}
</style>