<template>
    <!-- 活动类别 -->
    <div id='category-list' class="noselect">
        <div class="aia-content-card" v-for="item,index in category" :key="index">
            <h3 class="aia-content-title">{{item.classifyName}}</h3>
            <div class="aia-content-list">
                <el-row :gutter="20">
                    <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3"  v-for="val,key in item.typeList" :key = "key">
                        <div @click="jumpToTemplateList(val)" class="aia-content-list-item">
                            <div class="aia-content-list-img">
                                <img :src="val.typeIcon" alt="">
                            </div>
                            <div class="aia-content-list-content">
                                <h3>{{val.typeName}}</h3>
                                <p>{{val.typeDesc}}</p>
                            </div>
                        </div>                   
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'catetory',
    data() {
        return {
            category:[
                {
                    id:1,
                    title:'互动营销',
                    list:[
                        {
                            id:'1',
                            icon:require('@assets/images/round.png'),
                            name:'大转盘',
                            type:'round',
                            desc:'常见的转盘抽奖玩法',
                            href:''
                        },{
                            id:'1',
                            icon:require('@assets/images/round.png'),
                            name:'大转盘',
                            type:'round',
                            desc:'常见的转盘抽奖玩法',
                            href:''
                        },{
                            id:'1',
                            icon:require('@assets/images/round.png'),
                            name:'大转盘',
                            type:'round',
                            desc:'常见的转盘抽奖玩法',
                            href:''
                        },{
                            id:'1',
                            icon:require('@assets/images/round.png'),
                            name:'大转盘',
                            type:'round',
                            desc:'常见的转盘抽奖玩法',
                            href:''
                        },{
                            id:'1',
                            icon:require('@assets/images/round.png'),
                            name:'大转盘',
                            type:'round',
                            desc:'常见的转盘抽奖玩法',
                            href:''
                        }
                    ]
                },
                {
                    id:1,
                    title:'互动营销',
                    list:[
                        {   
                            id:'1',
                            icon:require('@assets/images/round.png'),
                            name:'大转盘',
                            type:'round',
                            desc:'常见的转盘抽奖玩法',
                            href:''
                        },{
                            id:'2',
                            icon:require('@assets/images/round.png'),
                            name:'大转盘',
                            type:'round',
                            desc:'常见的转盘抽奖玩法',
                            href:''
                        },{
                            id:'3',
                            icon:require('@assets/images/round.png'),
                            name:'大转盘',
                            type:'round',
                            desc:'常见的转盘抽奖玩法',
                            href:''
                        },{
                            id:'4',
                            icon:require('@assets/images/round.png'),
                            name:'大转盘',
                            type:'round',
                            desc:'常见的转盘抽奖玩法',
                            href:''
                        },{
                            id:'5',
                            icon:require('@assets/images/round.png'),
                            name:'大转盘',
                            type:'round',
                            desc:'常见的转盘抽奖玩法',
                            href:''
                        }
                    ]
                }
            ],
        }
    },
    created(){
        this.getList();
    },
    methods: {
        getList(){
            let that = this;
            this.$post({
                url:REQUEST_PATH+'classify/getClassifyType',
                data:{},
                success:(res)=>{
                    this.category = res.data.data;
                }
            })
        },
        // 跳转到模板列表
        jumpToTemplateList(val){
            console.log('click');
            this.$router.push('/main/activitylist/'+val.id);
        }
    }
}
</script>

<style scoped>

</style>