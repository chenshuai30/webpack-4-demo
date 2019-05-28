<template>
    <div id='add-template' v-loading.fullscreen.lock="tableLoading" element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
        <div class="add-temp-main">
            <h3 class="add-temp-main-title">{{title}}</h3>
            <el-form :model="tempForm" :rules="tempRules" ref="tempForm" label-width="130px" class="add-temp-main-form">
                <el-form-item label="所属类别" prop="classifyId">
                    <!-- <el-select :disabled="typeOnly" v-model="tempForm.typeId" placeholder="请选择类别" style="width:400px;">
                        <el-option v-for="item in typeArr" :key="item.id" :label="item.classifyName" :value="item.id">
                        </el-option>
                    </el-select> -->
                    <el-cascader style="width:400px;" placeholder="请选择类别" :disabled="typeOnly" :options="typeArr" v-model="tempForm.classifyId">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="模板名称" prop="templetName">
                    <el-input v-model="tempForm.templetName" placeholder="请填写模板名称" style="width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="是否支持微信平台" prop="supportWx">
                   <el-checkbox v-model="tempForm.supportWx" :true-label="1" :false-label="0"></el-checkbox>
                </el-form-item>
                <el-form-item label="活动配置规则" prop="ruleType">
                    <el-select v-model="tempForm.ruleType" placeholder="请选择规则" style="width:400px;">
                        <el-option label="抽奖（ 固定8个奖品，如：九宫格、大转盘 ）" value="turn"></el-option>
                        <el-option label="抽奖（ 奖品数量不固定，如：刮刮卡、娃娃机 ）" value="scratchcard"></el-option>
                        <el-option label="考题（ 带有奖品设置，如：问卷、答题、考试 ）" value="answer"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可上传缩略图">
                    <el-switch active-text="关" inactive-text="开" v-model="showUploadFlag" active-color="#13ce66" inactive-color="#d1d1d1"></el-switch>
                </el-form-item>
                <el-form-item v-if="showUploadFlag" label="模板缩略图地址" prop="templetIcon">
                    <el-upload class="upload-demo" ref="upload" :data="{fileType:4}" :with-credentials="true" accept="image/jpeg,image/png" :action="uploadImgUrl" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture-card" :multiple="false" :on-success="handleBgImgSuccess" :limit="1" :on-exceed="handleExceed" :auto-upload="false">
                        <i slot="trigger" class="el-icon-plus"></i>
                        <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过500kb</div>
                    </el-upload>
                    <el-button size="small" type="success" @click="submitUpload('upload')">上传图片</el-button>
                    <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" size="tiny" style="height:890px;text-align:center;">
                        <img height="600px" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item v-else label="模板缩略图地址" prop="templetIcon">
                    <el-input v-model="tempForm.templetIcon" placeholder="请填写模板缩略图地址" style="width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="模板文件">
                    <el-upload :data="{id:typeId}" :with-credentials="true" style="width:400px;" ref="fileUp" accept="application/zip" :action="uploadTemUrl" :before-upload="handleBeforeUpload" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="fileuploadSuccess" multiple :limit="1" :on-exceed="handleExceed" :auto-upload="false" :file-list="fileNameList">
                        <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="mini" type="success" @click="submitUpload('fileUp')">上传模板</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传zip压缩文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="模板地址" prop="htmlSrc">
                    <el-input :disabled="true" placeholder="模板文件地址，只能通过上传模板文件获取" v-model="tempForm.htmlSrc" style="width:400px;"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button size="mini" @click="submitForm" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
export default {
  name: "addtemplate",
  data() {
    let formateV = this.$util.formateSql;
    return {
      uploadImgUrl: REQUEST_PATH + "upload/uploadFile",
      uploadTemUrl: REQUEST_PATH + "upload/uploadTemplet",
      typeId: "",
      title: "新增模板",
      tempForm: {
        templetName: "",
        classifyId: [],
        ruleType: "",
        templetIcon: "",
        htmlSrc: "",
        supportWx:0 //1支持，0不支持
      },
      typeOnly: false,
      typeArr: [],
      tempRules: {
        templetName: [
          { required: true, message: "请填写名称", trigger: "blur" },
          { validator: formateV, trigger: "blur" }
        ],
        classifyId: [
          {
            required: true,
            type: "array",
            message: "请选择类别",
            trigger: "change"
          }
        ],
        ruleType: [
          { required: true, message: "请选择类别", trigger: "change" }
        ],
        templetIcon: [
          {
            required: true,
            message: "请上传图片或者填写图片地址",
            trigger: "blur"
          }
        ],
        // templetConfig:'',
        htmlSrc: [
          { required: true, message: "请上传模板文件", trigger: "blur" }
        ]
      },
      // 图片上传
      dialogVisible: false,
      dialogImageUrl: "",
      fileList: [],
      showUploadFlag: false,
      curTempDetail: "",
      addOrEdit: "add",
      // 模板文件上传
      fileNameList: [],
      initialComPath: "",
      initialComName: "",
      isAddSubmit: false,
      tableLoading: false
    };
  },
  created() {
    // console.log("template created...");
    // console.log(this.$route);
    this.initialComPath = this.$route.fullPath;
    this.initialComName = this.$route.name;

    this.typeId = this.$route.params.id;
    let path = this.$route.fullPath;

    if (path.indexOf("edit") > 0) {
      this.addOrEdit = "edit";
      this.title = "编辑模板";
    } else {
      this.addOrEdit = "add";
      this.title = "新增模板";
    }

    if (this.typeId !== "add") {
      this.tempForm.typeId = parseInt(this.typeId);
      this.typeOnly = true;
      this.getTempDetail();
    } else {
      this.typeOnly = false;
    }

    this.getClassesList();
  },
  beforeRouteLeave(to, from, next) {
    // console.log("router leave");
    if (
      !this.isAddSubmit &&
      this.initialComName == "newTemplate" &&
      !!this.tempForm.htmlSrc
    ) {
      this.leaveRouteAjax();
    }
    next();
  },
  mounted() {
    let that = this;
    window.onbeforeunload = function(e) {
      if (
        !that.isAddSubmit &&
        that.initialComName == "newTemplate" &&
        !!that.tempForm.htmlSrc
      ) {
        that.leaveRouteAjax();
      }
    };
  },
  methods: {
    leaveRouteAjax() {
      this.$post({
        url: REQUEST_PATH + "templet/delTempletZip",
        data: { tempSrc: this.tempForm.htmlSrc },
        success: res => {
          console.log("删除成功");
        }
      });
    },
    // 获取模板列表
    getClassesList() {
      this.$post({
        url: REQUEST_PATH + "classify/getClassifyType",
        data: {},
        success: res => {
          // console.log("classify res...");
          // console.log(res);
          let classArr = res.data.data;
          this.getClassSel(classArr);
        }
      });
    },
    getClassSel(arr) {
      arr.map(item => {
        this.typeArr.unshift(item);
      });
      this.typeArr.map(item => {
        item.label = item.classifyName;
        item.value = item.id;
        if (item.hasOwnProperty("typeList")) {
          if (item.typeList.length > 0) {
            item.typeList.map(val => {
              val.label = val.typeName;
              val.value = val.id;
              return val;
            });
            item.children = item.typeList;
          }
        }
        return item;
      });
    },
    getTempDetail() {
      this.$post({
        url: REQUEST_PATH + "templet/getTemplet",
        data: {
          id: parseInt(this.typeId)
        },
        success: res => {
          // console.log("template detail...");
          // console.log(res);
          this.curTempDetail = res.data.data[0];
          this.tempForm = Object.assign(
            {},
            {
              templetName: this.curTempDetail.templetName,
              classifyId: [
                this.curTempDetail.classifyId,
                this.curTempDetail.typeId
              ],
              templetIcon: this.curTempDetail.templetIcon,
              templetConfig: this.curTempDetail.templetConfig,
              htmlSrc: this.curTempDetail.htmlSrc,
              ruleType: this.curTempDetail.ruleType,
              supportWx: this.curTempDetail.supportWx
            }
          );
          this.showUploadFlag = true;
          let imgName = this.curTempDetail.templetIcon.split("/").pop();
          this.fileList.push({
            name: imgName,
            url: this.curTempDetail.templetIcon
          });
          if (this.$route.name == "newTemplate") {
            this.tempForm.htmlSrc = "";
          }
          if (this.$route.name == "addTemplate") {
            let tempName = this.curTempDetail.htmlSrc.split("/")[1];
            let tempUrl = this.curTempDetail.htmlSrc
              .split("/")
              .slice(0, -1)
              .join("/");
            this.fileNameList.push({
              name: tempName,
              url: REQUEST_PATH + this.curTempDetail.htmlSrc
            });
          }
        }
      });
    },
    // 背景图片上传
    submitUpload(name) {
      this.$refs[name].submit();
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log("preview...");
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    handleBgImgSuccess(res, file, fileList) {
      // console.log('upload success...');
      // console.log(res);
      this.tempForm.templetIcon = res.imageUrl;
    },
    handleBeforeUpload(file) {
      // console.log('before upload...')
      // console.log(file)
      const flag = file.size / 1024 / 1024 <= 2;
      if (!flag) {
        this.$message({
          message: "上传文件大小不能超过 2MB!",
          type: "warning"
        });
      }
      return flag;
    },
    fileuploadSuccess(res, file, fileList) {
      // console.log('file upload success')
      // console.log(res);
      // console.log(file);
      if (res.status) {
        this.tempForm.htmlSrc = res.src;
      } else {
        this.tempForm.htmlSrc = "";
        this.$message.warning(res.message || "上传文件失败");
      }
    },

    // 上传
    submitForm() {
      this.$refs.tempForm.validate(valid => {
        if (valid) {
          // if(this.fileNameList.length<=0){
          //     this.$message.warning('请上传模板文件');
          //     return;
          // }
          if (this.addOrEdit == "add") {
            this.submitAjax();
          } else {
            this.submitEditAjax();
          }
        }
      });
    },
    submitAjax() {
      let obj = Object.assign({}, this.tempForm);
      // console.log(obj);
      obj.classifyId = this.tempForm.classifyId[0];
      obj.typeId = this.tempForm.classifyId[1];
      this.$post({
        url: REQUEST_PATH + "templet/addTemplet",
        data: obj,
        loading: "tableLoading",
        success: res => {
          this.$message.success("新建模板成功!");
          this.$router.back();
        },
        beforeSuccess: () => {
          this.isAddSubmit = true;
        }
      });
    },
    submitEditAjax() {
      let obj = Object.assign({}, this.tempForm);
      obj.classifyId = this.tempForm.classifyId[0];
      obj.typeId = this.tempForm.classifyId[1];
      obj.id = this.typeId;
      this.$post({
        url: REQUEST_PATH + "templet/editTemplet",
        data: obj,
        loading: "tableLoading",
        success: res => {
          this.$message.success("模板保存成功!");
          this.$router.back();
        }
      });
    }
  }
};
</script>

<style lang="less"  rel="stylesheet/less" scoped>
#add-template {
  height: 100%;
}
.add-temp-main {
  padding: 20px;
  .add-temp-main-title {
    font-size: 15px;
  }
}
</style>