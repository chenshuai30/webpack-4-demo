<template>
    <div class="preview">
        <el-dialog title="模板预览" :visible.sync="tempViewFlag" width="800px" :modal-append-to-body="false" @close="closeEvent">
            <div class="temp-view-main">
                <el-row>
                    <el-col :span="12">
                        <!-- <img height="500" :src="tempViewModel.templetIcon" alt="icon"> -->
                        <div id="previewPhone1">
                            <div class="previewPhone-title">{{templetName}}</div>
                            <div class="previewPhone-content">
                                <div v-if="previewIfrLoading" style="text-align:center;height:486px;line-height:486px;">
                                    <img src="/assets/images/loading.gif" alt="loading..." width="50">
                                </div>
                                <iframe @load="handleLoad" style="width:100%;height:100%" scrolling="yes" ref="previewIfrTemp" :src="baseUrl+ifrSrc+'?activityId=preview'" frameborder="0" v-if="ifrSrc"></iframe>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div style="font-size:12px;padding-left:15px;">
                            <h3>基本信息</h3>
                            <p>模板名称：
                                <span>{{templetName}}</span>
                            </p>
                            <p>所属类别：
                                <span>{{classifyName}}</span>
                            </p>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name: "",
  props: ["flag", "templetName", "classifyName", "ifrSrc", "postData"],
  //实例数据
  data() {
    return {
      baseUrl: REQUEST_PATH,
      // baseUrl: '',
      tempViewFlag: false,
      previewIfrLoading: true,
      obj: {}
    };
  },
  watch: {
    flag: {
      handler: function(cur, old) {
        console.log("watch flag:" + cur);
        this.tempViewFlag = cur;
        if(cur && !this.previewIfrLoading){
            !this.ifrSrc && this.postMsg();
        }
      },
      deep: true
    },
    postData: {
      handler: function(cur, old) {
        this.obj = cur;
      },
      deep: true
    }
  },
  mounted() {},
  created() {
    this.tempViewFlag = this.flag;
  },
  methods: {
    handleLoad() {
      console.log("loaded...");
      console.log(this.obj);
      this.previewIfrLoading = false;
      if(!this.ifrSrc) return;
      this.postMsg();
    },
    postMsg() {
      let obj = {
        preview:this.obj
      }
      console.log('post start......')
      console.log(obj);
      // 传递信息
      this.$refs.previewIfrTemp.contentWindow.postMessage(
        obj,
        this.baseUrl + this.ifrSrc + "?activityId=preview"
      );
      console.log("post end......");
    },
    closeEvent() {
      this.$emit("close");
    }
  }
};
</script>
<style lang='less' scoped>
</style>