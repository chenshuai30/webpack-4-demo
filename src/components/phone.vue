<template>
    <div ref='uuphone'>
        <div class="phoneContainer">
            <div class="phoneBody">
                <div class="aia-phonetitle">{{tempname}}</div>
                <div class="phoneContent">
                    <div v-if="ifrLoading" style="text-align:center;height:486px;line-height:486px;">
                        <img src="@assets/images/loading.gif" alt="loading..." width="50">
                    </div>
                    <!-- <iframe style="width:100%;height:100%"  scrolling="yes" id="ifr" src="/Aiats-Admin/AIATS-tpl/Jiugongge/?activityId=0" frameborder="0"></iframe> -->
                    <iframe @load="handleLoad" v-if="src" style="width:100%;height:100%" scrolling="yes" ref="ifr" :src="src" frameborder="0"></iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "uuphone",
  props: {
    tempIfr: {
      type: String,
      default: ""
    },
    tempname: {
      type: String,
      default: "活动模板"
    }
  },
  watch: {
    tempIfr: {
      handler: function(cur, old) {
        this.src = this.tempIfr;
      }
    }
  },
  data() {
    return {
      ifrLoading: true,
      src: ""
    };
  },
  created() {
    this.src = this.tempIfr;
  },
  mounted() {},
  methods: {
    handleLoad() {
      this.ifrLoading = false;
      this.$emit("loaded");
    }
  }
};
</script>

<style lang="less" scoped>
// 手机容器
.phoneContainer {
  background-image: url("@assets/images/phone.svg");
  background-size: 100%;
  width: 326px;
  height: 620px;
  border-radius: 44px;
  box-shadow: 0 1px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #eee;
  .phoneBody {
    position: relative;
    z-index: 999;
    left: 0;
    top: 0;
    .aia-phonetitle {
      text-align: center;
      color: #fff;
      height: 40px;
      line-height: 40px;
      margin-top: 57px;
      font-size: 15px;
    }
    .phoneContent {
      height: 486px;
      overflow: hidden;
      width: 320px;
      margin: 0 auto;
      position: relative;
      z-index: 4;
    }
  }
}
</style>