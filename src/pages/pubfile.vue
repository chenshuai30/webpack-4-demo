<template>
  <div id="pubfile" element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
    <div class="fileViewBox" v-show="showPreview">
      <div class="closeIcon" @click="closePreview">
        <i class="atsfont ats-xiaoguanbi"></i>
      </div>
      <img :src="fileLink" v-if="preViewObj.pic">
      <audio :src="fileLink" v-if="preViewObj.audio" controls preload ref="audio"></audio>
      <video :src="fileLink" v-if="preViewObj.video" controls preload></video>
    </div>
    <div class="fileHandleBox">
      <ul>
        <li class="uploadBtn" v-if="showUpload">
          <div @click="uploadFile">
            <i class="atsfont ats-shangchuan"></i>
          </div>
        </li>
        <li v-for="item,key in resData">
          <div class="fileBox" :class="{chosed:item.chosed}" @mouseenter.stop="menter(item)" @click="choseDir(item)" @dblclick="goNext(item)">
            <img :src="item.url" v-if="item.type == 1 && item.types == 'file'">
            <i :class="item.className" v-else></i>
            <p>{{ item.oldname }}</p>
            <div class="liShadow" v-show="item.showShadow" @mouseleave.stop="mleave(item)">
              <div class="iconBox" @click="viewFile(item)">
                <i class="atsfont ats-preview"></i>
              </div>
              <div class="iconBox" @click="delFile(item)">
                <i class="atsfont ats-del"></i>
              </div>
              <div class="iconBox" :class="setClass(key)" :data-clipboard-text="item.url" @click="copy(key)">
                <i class="atsfont ats-copy"></i>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-show="showMore" class="pubfile-btn">
      <el-button @click="getMore" size="small" type="primary">获取更多</el-button>
    </div>
    <!-- 文件上传 -->
    <el-dialog title="上传文件" :visible.sync="showModal" width="330px" :modal="false">
      <el-form :model="fileForm" ref="fileform">
        <el-form-item label="所属项目" prop="projectName">
          <el-input placeholder="请输入项目名称" :readonly="haveProject" v-model="fileForm.projectName" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="子目录名" prop="dirUrl">
          <el-input placeholder="例:Aiats/或Aiats/Mobile/" v-model="fileForm.dirUrl" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="文件描述" prop="fileDesc">
          <el-input placeholder="简述文件内容..." v-model="fileForm.fileDesc" type="textarea" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload class="upload-demo" ref="upload" :action="uploadUrl" :headers="headObj" :limit="1" :data="fileForm" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="getFileName" :with-credentials="true" :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">上 传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Clipboard from "clipboard";
//  v-loading.fullscreen.lock="fileLoading"
export default {
  data() {
    return {
      fileForm: {
        projectName: "",
        dirUrl: "",
        fileDesc: ""
      },
      uploadUrl: REQUEST_PATH + "upload/publicUpload",
      resData: [],
      showModal: false,
      totalnum: 0,
      headObj: {
        "Content-Key":
          "u=34vzcWaT" +
          Date.now() +
          ";f=" +
          Date.now() +
          "_KWMatSB" +
          ";e=" +
          "OSUrHqGk" +
          Date.now()
      },
      baseData: [
        {
          oldname: "图片",
          dirUrl: "PicLib/",
          types: "dir",
          type: 1,
          className: "atsfont ats-dir dirCor"
        },
        {
          oldname: "音频",
          dirUrl: "AudioLib/",
          types: "dir",
          type: 2,
          className: "atsfont ats-dir dirCor"
        },
        {
          oldname: "视频",
          dirUrl: "VideoLib/",
          types: "dir",
          type: 3,
          className: "atsfont ats-dir dirCor"
        },
        {
          oldname: "文件",
          dirUrl: "FileLib/",
          types: "dir",
          type: 4,
          className: "atsfont ats-dir dirCor"
        }
      ],
      showPreview: false,
      preViewObj: {
        inx: ["pic", "audio", "video", "file"],
        pic: false,
        audio: false,
        video: false,
        file: false
      },
      // 文件预览地址
      fileLink: "",
      showUpload: false,
      haveProject: false,
      dirPrefix: "",
      pageIndex:1,
      pageSize:20
    };
  },
  created() {
    console.log('created...');
    if (this.$route.query.dir) {
      this.search();
      this.showUpload = true;
    } else {
      this.resData = this.baseData;
      this.showUpload = false;
    }
  },
  methods: {
    closePreview() {
      this.showPreview = false;
      for (let key in this.preViewObj) {
        if (!this.preViewObj.hasOwnProperty(key) || key === "inx") continue;
        this.preViewObj[key] = false;
      }
    },
    menter(obj) {
      if (obj.types === "dir") return;
      this.resData = this.resData.map(item => {
        item.showShadow = false;
        if (obj.filekey === item.filekey) {
          item.showShadow = true;
        }
        return item;
      });
    },
    mleave(obj) {
      this.resData = this.resData.map(item => {
        item.showShadow = false;
        return item;
      });
    },
    setClass(key) {
      return "li" + key;
    },
    copy(key) {
      let clipboard = new Clipboard(".li" + key);
      clipboard.on("success", e => {
        this.$message.success("复制成功!");
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        this.$message.error("当前浏览器不支持复制，请尝试使用其他浏览器!");
        clipboard.destroy();
      });
    },
    viewFile(obj) {
      if (obj.type === 4) {
        window.open(obj.url);
        return;
      }
      this.showPreview = true;
      this.preViewObj[this.preViewObj.inx[obj.type - 1]] = true;
      this.fileLink = obj.url;
    },
    // 单击
    choseDir(obj) {
      if (obj.types === "file") return;
      this.resData = this.resData.map(item => {
        item.chosed = false;
        if (obj.oldname === item.oldname) {
          item.chosed = true;
        }
        return item;
      });
    },
    // 双击
    goNext(obj) {
      // 判断是否是文件夹
      if (obj.types === "file") return;
      this.resData = [];
      this.$router.push({
        name: "pubfile",
        query: {
          dir: obj.dirUrl,
          type: obj.type
        }
      });
    },
    getMore(){
      if(this.showMore){
        this.pageIndex +=1;
        this.search(true);
      }
    },
    // 获取列表
    search(flag) {
      this.$post({
        url: REQUEST_PATH + "upload/getFileList",
        data: {
          dirUrl: this.$route.query.dir,
          type: this.$route.query.type,
          pageIndex:this.pageIndex,
          pageSize:this.pageSize
        },
        success: res => {
          // console.log(res);
          if (res.data.status) {
            let data = res.data.data;            
            if (data.length > 0) {
              data.map(item => {
                item.className = "atsfont ats-";
                if (item.types === "dir") {
                  item.className += "dir dirCor";
                } else {
                  if (item.type != 1) {
                    let code = item.oldname.split(".");
                    item.className += code[code.length - 1];
                    item.className += " " + code[code.length - 1] + "Cor";
                  }
                }
              });
              if(flag){
                this.resData = this.resData.concat(data);
              }else{
                this.resData = null;
                this.resData = data;
              }
            }else{              
              if(flag){
                this.$message.warning('没有更多数据了....');
              }else{
                this.resData = null;
                this.resData = data;
              }
            }
          }
        }
      });
    },
    // 上传文件前检查文件名是否重复
    getFileName(file) {
      let isHaveName = this.resData.some(item => {
        return item.oldname === file.name;
      });
      if (isHaveName) {
        this.$message.warning("文件名重复!");
        return false;
      }
      this.fileForm.dirUrl = this.dirPrefix + this.fileForm.dirUrl;
    },
    // 显示上传弹窗
    uploadFile() {
      let arr = this.$route.query.dir.split("/");
      this.haveProject = false;
      this.dirPrefix = "";
      this.$refs.fileform && this.$refs.fileform.resetFields();
      this.fileForm.projectName = "";
      this.fileForm.fileType = this.$route.query.type;
      if (arr.length > 2) {
        arr.shift();
        arr.pop();
        this.haveProject = true;
        this.dirPrefix = arr.join("/") + "/";
        this.fileForm.projectName = arr[0];
      }
      this.showModal = true;
    },
    // 上传文件
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 删除文件
    delFile(obj) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post({
            url: REQUEST_PATH + "upload/delPublicFile",
            data: {
              filekey: obj.filekey,
              aliname: new Date(obj.time).getTime(),
              url: obj.url
            },
            headers: {
              "Content-Key":
                "u=34vzcWaT" +
                Date.now() +
                ";f=" +
                Date.now() +
                "_KWMatSB" +
                ";e=" +
                "OSUrHqGk" +
                Date.now()
            },
            success: res => {
              console.log(res);
              if (res.data.status) {
                this.$message.success(res.data.message);
                this.search();
              } else {
                this.$message.error(res.data.message);
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 上传成功回调
    uploadSuccess(res) {
      if (!res.status) {
        this.$message.warning(res.message);
        return;
      }
      this.$refs.upload.clearFiles();
      this.$message.success("文件上传成功!");
      this.showModal = false;
      this.search();
    },
    // 上传失败回调
    uploadError(err) {
      this.$message.error(JSON.parse(err.message).message);
    },
    getData() {
      if (this.$route.query.dir) {
        this.pageIndex = 1;
        this.search();
        this.showUpload = true;
      } else {
        this.resData = this.baseData;
        this.showUpload = false;
      }
    }
  },
  components: {},
  computed: {
    showMore(){
      return this.$route.query.dir;
    }
  },
  watch: {
    $route: "getData"
  }
};
</script>

<style lang="less" scoped>
.aia-form-btn {
  position: absolute;
  right: 20px;
  top: 20px;
}
.aia-alist-pagenation {
  background-color: #fff;
  text-align: right;
  position: absolute;
  padding: 0 20px 20px 0;
  bottom: 0;
  right: 0;
  z-index: 2;
}
.fileHandleBox {
  ul {
    li {
      float: left;
      margin: 0 20px 20px 0;
      width: 80px;
      height: 145px;
      .fileBox {
        width: 80px;
        border: 1px solid #fff;
        padding: 10px 0;
        text-align: center;
        position: relative;
        cursor: pointer;
        i {
          font-size: 50px;
          color: #000;
        }
        .pdfCor {
          color: #ef4a4a;
        }
        .dirCor {
          color: #ff8b03;
        }
        .docxCor {
          color: #3a80fc;
        }
        .psdCor {
          color: #0c77c6;
        }
        .mp4Cor {
          color: #9b64b2;
        }
        .exeCor {
          color: #8199af;
        }
        .dmgCor {
          color: #8592a5;
        }
        img {
          width: 50px;
          height: 50px;
        }
        p {
          color: #1a1a1a;
          font-size: 13px;
          margin-top: 5px;
          -moz-user-select: -moz-none;
          -khtml-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          word-break: break-all;
          word-wrap: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .liShadow {
          width: 80px;
          height: 100%;
          background: rgba(13, 10, 49, 0.9);
          border-radius: 5px;
          position: absolute;
          left: 0;
          top: 0;
          overflow: hidden;
          .iconBox {
            float: left;
            width: 100%;
            height: 30px;
            padding-top: 4px;
            box-sizing: border-box;
            &:hover {
              background: #0d0a31;
              i {
                color: #ef4a4a;
              }
            }
            i {
              height: 18px;
              font-size: 18px;
              color: #fff;
              vertical-align: middle;
            }
          }
        }
      }
      .chosed {
        background: #cce8ff;
        border: 1px solid #99d1ff;
      }
    }
    .uploadBtn {
      padding-top: 10px;
      box-sizing: border-box;
      div {
        cursor: pointer;
        padding: 10px 0;
        text-align: center;
        border: 1px dashed #ff8b03;
        i {
          font-size: 50px;
          color: #ff8b03;
        }
      }
    }
  }
}
.fileViewBox {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  z-index: 9999;
  .closeIcon {
    cursor: pointer;
    box-sizing: border-box;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: -80px;
    transform: translateX(-50%);
    -o-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    z-index: 9999999;
    background: rgba(0, 0, 0, 0.7);
    i {
      font-size: 30px;
      color: #fff;
    }
  }
  img,
  audio,
  video {
    max-width: 800px;
    max-height: 700px;
    box-shadow: 0 0 10px #ccc;
  }
  audio {
    border-radius: 26px;
  }
}
.pubfile-btn{
  position:absolute;
  bottom:20px;
  right:30px;
}
</style>
