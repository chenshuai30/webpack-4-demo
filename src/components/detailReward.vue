<template>
    <div id='detailReward'>
        <p class="acitivity-detail-info-item">
            <b>奖品属性：</b><span>{{rewardName || getArrtName() || ''}}</span>
        </p>
        <p v-show="data.attrs!=4" class="acitivity-detail-info-item">
            <b>奖品名称：</b><span>{{data.name || '无'}}</span>
        </p>
        <p v-show="data.attrs!=4" class="acitivity-detail-info-item">
            <b>奖品数量：</b><span>{{data.num || 0}}</span>
        </p>
        <p v-if="couponName" class="acitivity-detail-info-item">
            <b>{{couponName}}：</b><span>{{data.coupon || ''}}</span>
        </p>
        <p v-show="hasQues && data.attrs!=4" class="acitivity-detail-info-item">
            <b>奖励条件：</b><span>答对&nbsp;</span><span>{{data.proportion || ''}}&nbsp;道题</span>
        </p>
        <p v-show="hasProportion" class="acitivity-detail-info-item">
            <b>中奖概率：</b><span>{{(data.proportion || 0) + '%'}}</span>
        </p>
        <p v-show="data.attrs!=4" class="acitivity-detail-info-item">
            <b>奖品说明：</b><span>{{data.desc || '无'}}</span>
        </p>
        <p class="acitivity-detail-info-item">
            <template v-if="data.icon">
                <b>奖品图片：</b><span><img :src="data.icon" alt="img" width="80px" style="vertical-align:top"></span>
            </template>
            <template v-else>
                <b>奖品图片：</b><span>无</span>
            </template>
        </p>
    </div>
</template>

<script>
export default {
  name: "detailReward",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    rewardsList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    hasProportion: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    hasQues: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    rewardName: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      rewardNameList: {
        "1": "优惠券码",
        "2": "U币金额",
        "3": "现金金额",
        "5": "红包金额",
        "6": "道具编码",
        "7": "积分数量"
      }
    };
  },
  computed: {
    couponName() {
      return this.rewardNameList[this.data.attrs];
    }
  },
  methods: {
    getArrtName() {
      let name = "";
      this.rewardsList.map(item => {
        if (item.value == this.data.attrs) {
          name = item.label;
        }
      });
      return name;
    }
  }
};
</script>

<style lang="less" scoped>
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
</style>