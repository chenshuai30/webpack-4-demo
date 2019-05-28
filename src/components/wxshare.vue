<template>
  <div class="wxshare">
    <h4>分享设置</h4>
    <div>
      <el-form :model="wxForm" :rules="wxRule" ref="wxForm" label-width="80px">
        <el-form-item label="分享图片" prop="img">
          <el-upload ref="wxupload" class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :limit="1" :data="{fileType:4}" accept="image/jpg,image/png" :on-success="wxHandleSuccess" :with-credentials="true" :before-upload="wxBeforeUpload">
            <img v-if="wxForm.img" :src="decodeURIComponent(wxForm.img)" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png的正方形图片，且不超过2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="分享标题" prop="title">
          <el-input :maxlength="18" v-model="wxForm.title" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="分享描述" prop="desc">
          <el-input :maxlength="32" type="textarea" :rows="4" v-model="wxForm.desc"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  //实例数据
  data() {
    let formateV = (rule, value, callback, source, options) => {
      // let reg = new RegExp("[()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");(\-)
      // (\ )、(\?)、(\~)(\!)(\@)(\%)
      let reg = new RegExp(
        /[(\#)(\$)(\^)(\&)(\*)(\()(\))(\_)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\.)(\/)(\<)(\>)(\\)]+/
      );
      if (reg.test(value)) {
        callback(new Error("输入内容不能包含特殊字符,如. ' \""));
      } else {
        callback();
      }
    };
    return {
      uploadUrl: REQUEST_PATH + "upload/uploadFile",
      wxForm: {
        title: "",
        desc: "",
        img: ""
      },
      wxRule: {
        title: [
          { required: "true", message: "请填写分享标题", trigger: "blur" },
          { validator: formateV, trigger: "blur" }
        ],
        desc: [
          { required: "true", message: "请填写说明", trigger: "blur" },
          { validator: formateV, trigger: "blur" }
        ],
        img: [{ required: "true", message: "请上传图片", trigger: "blur" }]
      },
      wxfileList: []
    };
  },
  mounted() {},
  created() {},
  methods: {
    // 微信分享
    wxBeforeUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    wxsubmitUpload() {
      this.$refs.wxupload.submit();
    },
    wxHandleSuccess(res, file) {
      // this.wxForm.img = URL.createObjectURL(file.raw);
      this.wxForm.img = res.imageUrl;
    },
    valid() {
      let flag = false;
      this.$refs.wxForm.validate(valid => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    }
  }
};
</script>
<style lang='less' scoped>
.wxshare {
}
</style>