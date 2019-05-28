<template>
    <div class="acitivity-detail-info">
        <p class="acitivity-detail-info-item">
            <b>活动id：</b><span>{{data.id ||''}}</span>
        </p>
        <p class="acitivity-detail-info-item">
            <b>活动名称：</b><span>{{data.name ||''}}</span>
        </p>
        <p class="acitivity-detail-info-item">
            <b>所属模板：</b><span>{{data.templetName ||''}}</span>
        </p>
        <p class="acitivity-detail-info-item">
            <b>活动开始时间：</b><span>{{data.startTime ||''}}</span>
        </p>
        <p class="acitivity-detail-info-item">
            <b>活动结束时间：</b><span>{{data.endTime ||''}}</span>
        </p>
        <p class="acitivity-detail-info-item">
            <b>活动描述：</b>
            <div style="text-indent:70px;margin-top:-30px;color:#888;" v-html="data.desc ||''"></div>
        </p>
    </div>
</template>

<script>
export default {
  name: "detailInfo",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>

<style lang="less" scoped>
.acitivity-detail-info {
  font-size: 14px;
  padding: 0 15px;
  line-height: 30px;
  h4 {
    font-size: 15px;
    margin: 10px 0;
  }
  p.acitivity-detail-info-item {
    b {
      font-weight: normal;
      color: #333;
      display: inline-block;
    }
    span {
      color: #888;
      font-size: 13px;
    }
  }
}
</style>