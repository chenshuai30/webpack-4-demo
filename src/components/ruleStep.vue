<template>
    <div class="uufooter">
        <div v-if="prev">
            <el-button size="mini" style="width:100px;" @click="handleClick('prev')">上一步</el-button>
        </div>
        <div v-if="next">
            <el-button size="mini" style="width:100px;" @click="handleClick('next')">{{nextTxt}}</el-button>
        </div>
        <div v-if="preview">
            <el-button type="primary" size="mini" style="width:100px;" @click="handleClick('preview')">预览</el-button>
        </div>
        <div v-if="theme">
            <el-button type="primary" size="mini" style="width:100px;" @click="handleClick('theme')">切换主题</el-button>
        </div>
        <div>
            <el-button type="primary" size="mini" style="width:100px;" @click="handleClick('back')">返回模板页</el-button>
        </div>
    </div>
</template>

<script>
export default {
  name: "uufooter",
  props: ["prev", "next", "preview", "theme", "nextTxt"],
  data() {
    return {};
  },
  methods: {
    handleClick(tag) {
      this.$emit(tag);
    }
  }
};
</script>

<style lang="less" scoped>
.uufooter {
  > div {
    padding-top: 10px;
  }
}
</style>