<template>
    <el-dialog title="皮肤列表" :visible.sync="skinListFlag" :modal-append-to-body="false" :close-on-click-modal="false" :show-close="false" width="701px">
        <div class="aia-dialog-skinlist">
            <ul v-show="skinList.length>0" class="aia-skinlist">
                <li @click="changeDefaultSkin(item)" v-for="item,index in skinList" :key="index" style="width:100px;display:inline-block;margin-right:10px;">
                    <span v-show="item.flag"></span>
                    <img v-show="item.flag" class="aia-dialog-icon" width="10px" :src="rig" alt="选择">
                    <img width="100px" :src="item.skinConfig.common.skinImg" />
                </li>
            </ul>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="skinSetOk">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import rig from "@assets/images/right.png";
export default {
  name: "skinTheme",
  props: ["flag", "list"],
  watch: {
    flag: {
      handler: function(cur, old) {
        this.skinListFlag = cur;
      }
    },
    list: {
      handler: function(cur, old) {
        this.skinList = cur;
      },
      deep: true
    }
  },
  data() {
    return {
      rig: rig,
      skinListFlag: false,
      skinList: []
    };
  },
  created() {
    this.skinListFlag = this.flag;
    this.skinList = this.list;
  },
  methods: {
    changeDefaultSkin(item) {
      item.flag = true;
      this.skinList.map(val => {
        if (val.id !== item.id) {
          if (val.flag) {
            val.flag = false;
          }
        }
      });
      this.$emit('change',item.id);
    },
    skinSetOk() {
      this.$emit("set");
    }
  }
};
</script>

<style lang="less" scoped>
.aia-dialog-skinlist {
  height: 500px;
  overflow: hidden;
  position: relative;
  width: 100%;
}
.aia-skinlist {
  position: absolute;
  right: -17px;
  top: -10px;
  left: 0px;
  bottom: -10px;
  overflow: hidden;
  overflow-y: auto;
  padding: 20px 0;
}
.aia-skinlist li {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  width: 100px;
  height: 178px;
  overflow: hidden;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
  border-radius: 5px;
  background: url("@assets/images/loading.gif") center center no-repeat;
}
.aia-skinlist li span {
  position: absolute;
  width: 50px;
  height: 32px;
  right: -18px;
  top: -14px;
  background: #4da231;
  z-index: 1;
  transform: rotate(45deg);
}
.aia-skinlist li img.aia-dialog-icon {
  position: absolute;
  right: 3px;
  top: 5px;
  z-index: 2;
}
</style>