import Vue from 'vue'

import turntableStep from '@components/turntableTemplate.vue';// 抽奖规则模板
import Answer from '@components/answer.vue';// 答题规则模板
import ScratchCard from '@components/scratchCard.vue';// 刮刮卡规则模板
import music from '@components/musicDialog.vue';// 音乐弹框
import rewardDialog from '@components/rewardDialog.vue';// 奖品弹框
import WxShare from '@components/wxshare.vue';// 微信分享
import Preview from '@components/previewTemplate.vue';// 预览
import LastStep from '@components/lastStep.vue';//创建活动成功
import UUphone from '@components/phone.vue';//活动浏览窗口
import SkinTheme from '@components/skinTheme.vue';//皮肤主题
import UUfooter from '@components/ruleStep.vue';//步骤按钮
import UUreward from '@components/reward.vue';//奖品form表单
import BasicRule from '@components/basicRule.vue';//基础规则
import hasReward from '@components/hasReward.vue';//问卷答题，是否有奖品配置
import exameReward from '@components/exameReward.vue';//考试奖品设置
import siginUpReward from '@components/siginUpReward.vue';//报名奖品设置
import DetailReward from '@components/detailReward.vue';//详情奖品模块
import DetailInfo from '@components/detailInfo.vue';//详情基础信息
import DetailRule from '@components/detailRule.vue';//详情规则信息

Vue.component('turn',turntableStep);// 抽奖规则模板
Vue.component('answer',Answer);// 答题规则模板
Vue.component('scratchcard',ScratchCard);// 答题规则模板
Vue.component('music',music);// 音乐弹框
Vue.component('rewarddialog',rewardDialog);// 奖品弹框
Vue.component('wxshare',WxShare);// 微信分享
Vue.component('preview',Preview);// 预览
Vue.component('laststep',LastStep);//创建活动成功
Vue.component('uuphone',UUphone);//活动浏览窗口
Vue.component('skintheme',SkinTheme);//皮肤主题
Vue.component('uufooter',UUfooter);//步骤按钮
Vue.component('uureward',UUreward);//奖品form表单
Vue.component('basicrule',BasicRule);//基础规则
Vue.component('hasreward',hasReward);//问卷答题奖品设置
Vue.component('examereward',exameReward);//考试奖品设置
Vue.component('siginupreward',siginUpReward);//报名奖品设置
Vue.component('detailreward',DetailReward);//详情奖品模块
Vue.component('detailinfo',DetailInfo);//详情基础信息
Vue.component('detailrule',DetailRule);//详情规则信息