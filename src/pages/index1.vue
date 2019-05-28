<template>
    <div class="wrap">
      <div class="sceneBox">
        <div class="cdBox" v-for="item,inx in testList" @mousedown.stop="dragDom($event,inx)" @click.stop="">
          <div class="cdMain">
            <img v-if="item.type === 'img'" :src="item.content">
            <div v-else>{{ item.content }}</div>
          </div>
          <div class="editBox" v-show="item.edit">
            <div class="edit-top-left"></div>
            <div class="edit-top-center"></div>
            <div class="edit-top-right"></div>
            <div class="edit-center-left"></div>
            <div class="edit-center-right"></div>
            <div class="edit-bottom-left"></div>
            <div class="edit-bottom-center"></div>
            <div class="edit-bottom-right"></div>
          </div>
        </div>
      </div>
      <div class="verline" :style="{top: item +'px'}" v-for="item in verLine"></div>
      <div class="horline" :style="{left: item +'px'}" v-for="item in horLine"></div>
    </div>
</template>
<script>
import drag from "@assets/js/drag.js";
export default {
  name: "index",
  data() {
    return {
      verinx: 0, // 竖向索引
      horinx: 0, // 横向索引
      lineMargin: 40,
      verLine: [], // 竖向数组
      horLine: [], // 横向数组
      avail: null, // 可用屏幕像素
      testList: [
        {
          type: "img", // 内容类型
          content: "/assets/images/logo1.png", // 内容
          edit: false
        },
        {
          type: "text",
          content: "特阿斯兰的空间顺利打开附件舍得离开房间数量大幅加快螺丝钉解放螺丝扣就",
          edit: false
        }
      ]
    };
  },
  //页面渲染完成
  mounted() {
    document.onclick = ()=>{
      console.log("1");
      this.testList.map(item=>{
        item.edit = false;
      })
    }
  },
  //实例创建完成
  created() {
    this.drawLine(this.horLine, "hor");
    this.drawLine(this.verLine, "ver");
  },
  //keep-alive激活时执行
  activated() {},
  //keep-alive离开时执行
  deactivated() {},
  //自定义的方法
  methods: {
    // 递归生成线条数组
    drawLine(arr, flag) {
      this.avail =
        flag === "ver" ? window.screen.availHeight : window.screen.availWidth;
      this[flag + "inx"] += this.lineMargin;
      arr.push(this[flag + "inx"]);
      this[flag + "inx"] < this.avail && this.drawLine(arr, flag);
    },
    // 拖拽
    dragDom(e, inx) {
      e = e || window.event;
      this.testList.map(item => {
        item.edit = false;
      });
      this.testList[inx].edit = true;
      drag.startDrag(e, function(x, y) {
        console.log(x + ":" + y);
      });
    }
  }
};
</script>
<style lang='less' scoped>
.wrap {
  width: 100%;
  height: 100%;
  .verline {
    display: none;
    width: 100%;
    height: 1px;
    background: blue;
    position: absolute;
    left: 0;
  }
  .horline {
    display: none;
    width: 1px;
    height: 100%;
    background: red;
    position: absolute;
    top: 0;
  }
  // 场景
  .sceneBox {
    width: 800px;
    height: 100%;
    background: red;
    margin: 0 auto;
    // can drag 可以拖动的盒子
    .cdBox {
      position: absolute;
      background: #000;
      color: #fff;
    }
    // 编辑
    .editBox {
      width: 100%;
      height: 100%;
      border: 1px dotted #ff8b03;
      position: absolute;
      left: 0;
      top: 0;
      div {
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        background: rgba(255, 174, 0, 0.7);
        border: 1px solid #ff8b03;
        border-radius: 50%;
      }
      .edit-top-left {
        position: absolute;
        left: -8px;
        top: -8px;
        cursor: nw-resize;
      }
      .edit-top-center {
        position: absolute;
        left: 50%;
        top: -8px;
        transform: translateX(-50%);
        cursor: ns-resize;
      }
      .edit-top-right {
        position: absolute;
        right: -8px;
        top: -8px;
        cursor: nesw-resize;
      }
      .edit-bottom-left {
        position: absolute;
        left: -8px;
        bottom: -8px;
        cursor: nesw-resize;
      }
      .edit-bottom-center {
        position: absolute;
        left: 50%;
        bottom: -8px;
        transform: translateX(-50%);
        cursor: ns-resize;
      }
      .edit-bottom-right {
        position: absolute;
        right: -8px;
        bottom: -8px;
        cursor: nwse-resize;
      }
      .edit-center-left {
        position: absolute;
        top: 50%;
        left: -8px;
        transform: translateY(-50%);
        cursor: ew-resize;
      }
      .edit-center-right {
        position: absolute;
        top: 50%;
        right: -8px;
        transform: translateY(-50%);
        cursor: ew-resize;
      }
    }
  }
}
</style>