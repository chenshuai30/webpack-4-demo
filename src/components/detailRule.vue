<template>
  <div class="acitivity-detail-info">
    <template v-if="ruleType == 'answer'">
      <p class="acitivity-detail-info-item">
        <b>答题类型：</b><span>{{data.rule.type === 0 ? '答题':'问卷'}}</span>
      </p>
      <p v-if="data.rule.type === 0" class="acitivity-detail-info-item">
        <b>每题限时：</b><span>{{data.rule.limitTimeName}}</span>
      </p>
    </template>
    <p class="acitivity-detail-info-item">
      <b>限用城市：</b><span>{{data.limitCityName}}</span>
    </p>
    <p class="acitivity-detail-info-item">
      <b>使用平台：</b><span>{{data.usePlatName}}</span>
    </p>
    <p class="acitivity-detail-info-item">
      <b>使用对象：</b><span>{{data.usePerson === undefined ? '' : userTypeArr[data.usePerson].name }}</span>
    </p>
    <p v-if="ruleType == 'answer'" class="acitivity-detail-info-item">
      <b>对象分类：</b><span>答题问卷</span>
    </p>

    <template v-if="ruleType == 'turn' || ruleType === 'scratchcard'">
      <!-- {{data}} -->
      <p class="acitivity-detail-info-item">
        <!-- <b>对象分类：</b><span>自身接单</span> -->
        <b>对象分类：</b><span>{{data.personTypeName}}</span>
      </p>
      <p class="acitivity-detail-info-item">
        <b>业务类型：</b><span>{{data.rule.businessName ? data.rule.businessName:''}}</span>
      </p>
      <p class="acitivity-detail-info-item">
        <b>累计规则：</b><span>{{ruleList[data.rule.rule]?ruleList[data.rule.rule].label:''}}</span>
      </p>
      <p class="acitivity-detail-info-item">
        <b>达成条件：</b><span>{{data.rule.singleNum}}</span>
      </p>
      <p class="acitivity-detail-info-item">
        <b>抽奖次数：</b><span>{{data.rule.rewardNum}}</span>
      </p>
      <p class="acitivity-detail-info-item">
        <b>上限：</b><span>{{data.rule.rewardLimit}}</span>
      </p>
    </template>
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
    },
    ruleType: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      userTypeArr: [
        { id: 0, name: "全部" },
        { id: 1, name: "用户" },
        { id: 2, name: "跑男" }
      ],
      ruleList: [{ id: 0, label: "每天累计" }, { id: 1, label: "活动期内累计" }]
    };
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