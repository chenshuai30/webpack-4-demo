<template>
    <div class='lastStep'>
        <h3 v-show="!showLoading" style="text-align:center;font-size:16px;">您已成功创建该活动！</h3>
        <div v-show="!showLoading" style="margin-top: 15px;">
            <el-form label-width="80px">
                <el-form-item label="连接地址">
                    <el-input readonly placeholder="连接地址" v-model="linkAddress" ref="linkAddress">
                        <template slot="append">
                            <div style="cursor:pointer;" @click="copyLink">复制</div>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="二维码">
                    <div id="htmlCode"> </div>
                </el-form-item>
            </el-form>
        </div>
        <div v-show="showLoading" class="generateLoading">
            <div class="hourGlassLoader"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: "lastStep",
  props: ["loading", "link"],
  data() {
    return {
      showLoading: false,
      linkAddress: ""
    };
  },
  watch: {
    loading: {
      handler: function(cur, old) {
        this.showLoading = cur;
      }
    },
    link: {
      handler: function(cur, old) {
        this.linkAddress = cur;
      }
    }
  },
  created() {},
  mounted() {
    this.showLoading = this.loading;
    this.linkAddress = this.link;
  },
  methods: {
    // 复制
    copyLink() {
      let clipBoardContent = this.linkAddress;
      this.$refs.linkAddress.$refs.input.select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: "复制成功",
        type: "success"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.lastStep {
  .generateLoading {
    text-align: center;
    height: 550px;
    line-height: 550px;
  }
}
</style>