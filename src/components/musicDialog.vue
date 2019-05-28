<template>
    <div id="musicDialog">
        <el-button v-show="!curAudioEl.musicName" type="success" @click="audioFlag = true" size="mini">选取音乐</el-button>
        <div  v-show="!!curAudioEl.musicName" class="audio-panel-tip" style="font-size:13px;">
            <p><span v-text="curAudioEl.musicName"></span><i v-show="!!curAudioEl.musicName" class="el-icon-circle-close-outline" @click="delCurAudio" style="margin-left:15px;cursor:pointer;"></i></p>
        </div>
        <!-- 音乐弹框 -->
        <el-dialog class="audioDialog" title="选择背景音乐" :visible.sync="audioFlag" :modal-append-to-body="false" width="970px">
            <div class="audio-panel clear" v-loading="audioLoading" element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
                <div class="audio-panel-left">
                <ul>
                    <li :class="{'audio-panel-acitve':(audioActive == 0)}" @click="audioActive = 0">
                    <span>音乐库</span>
                    </li>
                    <!-- <li :class="{'audio-panel-acitve':(audioActive == 1)}" @click="audioActive = 1"><span>我的</span></li> -->
                </ul>
                <div class="audio-panel-upload">
                    <el-button size="mini" @click="popTypeModel" type="success" plain>点击上传</el-button>
                </div>
                </div>
                <div class="audio-panel-right">
                <!-- 音乐库 -->
                <div v-show="audioActive==0" class="audio-panel-musiclibrary">
                    <ul class="audio-panel-classes">
                    <li v-for="item,index in audioClasses" :class="{'audio-panel-classes-item':(audioActiveType==index)}" @click="audioClickType(index,item)" :key="index">{{item.musicType}}</li>
                    </ul>
                    <ul class="audio-panel-audioList">
                    <li v-for="item,index in audioList" :class="{'audio-panel-audioList-active':(curAudioEl.id == item.id)}" @click="choiceCurAudio(item)">
                        <span>{{item.musicName}}</span>
                        <span class="audio-panel-audioList-icon" @click.stop="audioPlay(item)">
                        <i v-show="!item.play" class="el-icon-caret-right"></i>
                        <i v-show="item.play" class="el-icon-loading"></i>
                        </span>
                    </li>
                    </ul>
                    <div class="audio-panel-tip">
                    <p>
                        <span>已选择：</span>
                        <span v-text="curAudioEl.musicName"></span>
                        <i v-show="!!curAudioEl.musicName" class="el-icon-circle-close-outline" @click="delCurAudio" style="margin-left:15px;cursor:pointer;"></i>
                    </p>
                    </div>
                    <div class="audio-panel-toolbar">
                    <el-pagination @current-change="audioCurrentChange" :current-page.sync="audioCurPage" :page-size="10" layout="total, prev, pager, next" :total="audioTotal">
                    </el-pagination>
                    </div>

                </div>
                <!-- 我的 -->
                <div v-show="audioActive==1">

                </div>
                <audio loop :src="audioSrc" ref="aiaAudio" id="aiaAudio"></audio>
                <el-button-group class="audio-foot-btn">
                    <el-button type="info" @click="audioFlag=false" size="mini">取消</el-button>
                    <el-button type="success" @click="audioOk" size="mini">确定</el-button>
                </el-button-group>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="上传音乐" :visible.sync="uploadMusicFlag" :modal-append-to-body="false" width="400px">
            <div style="height:200px;">
                <el-form size="mini" label-width="80px">
                <el-form-item label="音乐类型" required>
                    <el-select v-model="curAudioType" placeholder="请选择">
                    <el-option v-for="item in audioClassesList" :key="item.id" :label="item.musicType" :value="item.id">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传音乐" style="margin-top:30px;">
                    <el-upload :with-credentials="true" ref="musicUpType" accept="audio/*" :data="{fileType:3,musicType:curAudioType}" :action="uploadUrl" :on-success="handleAudioSuccess" :multiple="false" :limit="1" :on-exceed="handleExceed" :file-list="bgAudioFileList" :auto-upload="false">
                    <el-button slot="trigger" size="mini" :disabled="!curAudioType" type="primary" plain>点击上传</el-button>
                    <el-button :disabled="!curAudioType" style="margin-left: 10px;" size="mini" type="success" @click="submitAudioUpload">上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="" style="margin-top:30px;">
                    <span style="color:#888;font-size:12px;">请先选择音乐类型，再上传音乐</span>
                </el-form-item>
                </el-form>

            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'music',   
    porps:{
        // tempData: {
        //     //当前id
        //     type: Object,
        //     default: () => {
        //         return {};
        //     }
        // },
    },
    watch:{
        // tempDetail: {
        //     handler: function(cur, old) {
        //         this.ifrSrc = this.tempDetail.htmlSrc;
        //     },
        //      deep: true
        // },
    },
    data(){
        return{
            audioFlag:false,
            uploadMusicFlag:false,
            audioLoading:false,
            audioActive:0, //当前活动tab
            audioClasses:[],
            audioClassesList:[],
            audioActiveType:0,
            audioList:[],
            curAudioEl:'',
            // 分页
            audioCurPage: 1,
            audioTotal: 1000,
            curMusicType: '',
            curAudioType: "",
            audioSrc: "",
            uploadUrl: REQUEST_PATH + "upload/uploadFile",
            bgAudioFileList: [],
        }
    },
    created(){
        // 获取音乐列表
        this.getMusicList();

        // 获取音乐分类
        this.getMusicType();
    },
    methods:{
        // 获取音乐列表
        getMusicList() {
            this.$post({
                url:REQUEST_PATH + "music/getMusic",
                data:{
                    musicType:this.curMusicType,
                    pageIndex:this.audioCurPage
                },
                loading:'audioLoading',
                success:(res)=>{
                    console.log('music list...')
                    console.log(res);
                    this.audioList = res.data.data;
                    this.audioTotal = res.data.total;
                }
            })
        },
        getMusicType() {
            this.$post({
                url:REQUEST_PATH+"music/getMusicType",
                data:{},
                success:(res)=>{
                    console.log('music type...')
                    console.log(res);
                    res.data.data.map(item => {
                        this.audioClassesList.push(item);
                        this.audioClasses.push(item);
                    });
                    this.audioClasses.unshift({
                        id: '',
                        musicType: "全部"
                    });
                }
            })
        },
        popTypeModel(){
            this.curAudioType = "";
            this.bgAudioFileList = [];
            this.uploadMusicFlag = true;
        },
        audioClickType(index, item){
            // 点击当前类型方法
            this.audioActiveType = index;
            this.curMusicType = item.id;
            this.getMusicList();
        },
        choiceCurAudio(item){
            this.curAudioEl = Object.assign({}, item);
        },
        audioPlay(item){
            let audioEl = document.getElementById("aiaAudio");
            console.log("播放音乐");
            item.play = !item.play;
            this.audioSrc = "";
            this.audioSrc = item.musicUrl;
            this.audioList.map(val => {
                if (item.id != val.id) {
                val.play = false;
                }
            });
            if (!item.play) {
                if (!audioEl.paused) {
                audioEl.pause();
                }
            } else {
                audioEl.pause();
                this.$nextTick(() => {
                audioEl.play();
                });
            }
        },
        audioOk(){
            // console.log("点击音频弹框确定按钮...");
            // console.log(this.curAudioEl.musicUrl);
            this.audioFlag = false;
            this.bgAudio = this.curAudioEl.musicUrl || "";
            let audioEl = document.getElementById("aiaAudio");
            if (!audioEl.paused) {
                audioEl.pause();
                this.curAudioEl = "";
            }
            this.audioList.map(item => {
                if (item.play) {
                    item.play = false;
                }
            });
            this.$emit('musicUrl',this.curAudioEl.musicUrl);
        },
        delCurAudio(){
            this.curAudioEl = {};
            this.$emit('del');
        },
        // 换页
        audioCurrentChange(page) {
            this.audioCurPage = page;
            this.getMusicList();
        },
        handleAudioSuccess(res, file, fileList) {
            console.log("音乐上传成功...");
            console.log(res);
            if (!res.status) {
                this.$message.warning("上传失败");
            } else {
                // 获取上传后的图片地址
                this.getMusicList();
                this.uploadMusicFlag = false;

                // 跟移动端通信
                /*console.log('post autio...');
                                document.querySelector("#ifr").
                                contentWindow.postMessage({
                                'bgAudio':res.imageUrl
                                },this.baseUrl+this.ifrSrc); */
            }
        },
        handleExceed(file, fileList) {
            this.$message.warning(`只能上传一个文件`);
        },
        submitAudioUpload() {
            this.$refs.musicUpType.submit();
        },
    }
}

</script>
<style lang="less" rel="stylesheet/scss" scoped>

</style>
