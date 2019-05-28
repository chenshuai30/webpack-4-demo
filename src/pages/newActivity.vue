<template>
    <!-- 新建活动 -->
    <div id='aia-active' v-loading.fullscreen.lock="tempLoading"  element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
        <component v-if="tempId" :tempDetail="tempDetail" v-bind:is="currentView" :tempData="tempDetail" :isEdit="false"></component>
    </div>
</template>

<script>
    export default {
        name: 'newActivity',
        data() {
            return {
                currentView: '',
                tempId: '',
                tempDetail:{},
                tempLoading:true
            }
        },
        created() {
            this.tempId = this.$route.params.id;
            this.getTempDetail();
        },
        methods: {
            getTempDetail() {
                let that = this;
                this.$post({
                    url:REQUEST_PATH + "templet/getTemplet",
                    data:{
                        id: this.tempId
                    },
                    loading:'tempLoading',
                    success:(res)=>{
                        this.tempDetail = Object.assign({},res.data.data[0]);
                        this.currentView = this.tempDetail.ruleType;
                    }
                })
            }, 
            // 复制
            copyLink() {
                let clipBoardContent = this.linkAddress;
                console.log(this.$refs.linkAddress);
                this.$refs.linkAddress.$refs.input.select();
                document.execCommand("Copy"); // 执行浏览器复制命令
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            },
        }
    }
</script>

<style scoped>
</style>