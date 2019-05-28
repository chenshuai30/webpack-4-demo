<template>
    <!-- 活动模板列表 -->
    <div id='aia-template'>
        <h3>模板列表
            <!-- <el-button @click="back" class="fr" type="primary" size="mini">返回</el-button> -->
        </h3>
        <div class="searBox">
            <el-form :model="searchForm" label-width="80px" :inline="true">
                <el-form-item label="模板名称">
                    <el-input size="mini" v-model="searchForm.templetName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="search" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="aia-template-content">
            <el-row :gutter="20">
                <el-col v-show="tempList.length<=0" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                  <div><span>暂无数据...</span></div>
                </el-col>
                <el-col  v-show="tempList.length>0" :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="val,key in tempList" :key="key">
                    <div class="aia-template-item">
                        <div class="aia-template-img">
                            <img :src="val.templetIcon" alt="">
                        </div>
                        <div class="aia-template-desc">
                            <h3>{{val.templetName}}</h3>
                        </div>
                        <div class="aia-template-layout">
                            <ul>
                                <li @click="jumpToSetPage(val)">
                                    <div class="aia-template-layout-icon">
                                        <span>
                                            <i class="el-icon-edit"></i>
                                        </span>
                                    </div>
                                    <div class="aia-template-layout-txt">
                                        <span>编辑</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                </el-col>
            </el-row>
        </div>
        <div class="pageination">
            <el-pagination @size-change="pageSizeChange" @current-change="pageIndexChange" :current-page.sync="searchForm.pageIndex" :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
    
<script>
// import imgs0 from '@assets/images/activity0.jpg'
export default {
  name: "templateList",
  data() {
    return {
      total: 100,
      currentPage: 1,
      searchForm: {
        pageIndex: 1,
        pageSize: 10,
        templetName: ""
      },
      tempList: [
        {
          id: 0,
          templetName: "中秋",
          // templetIcon: imgs0
        }
      ]
    };
  },
  created() {
    // 初始化数据
    this.search();
    this.tempList = [];
  },
  methods: {
    // 跳转到模板列表
    jumpToSetPage(val) {
      console.log("click");
      this.$router.push("/main/themes/list/" + val.id);
    },
    back() {
      this.$router.back();
    },
    search() {
      // this.$http
      //   .post("http://192.168.6.108:3001/templet/getTemplet", this.searchForm,{ withCredentials: true })
      //   .then(res => {
      //     // console.log('list...');
      //     // console.log(res);
      //     let data = res.data.data;
      //     this.total = res.data.total;
      //     if(data && data.length>0){
      //       this.tempList = [];
      //       data.map(item=>{
      //         this.tempList.push(item);
      //       })
      //     }
      //   })
        // .catch(function(err) {});
        this.$post({
          url:REQUEST_PATH+"templet/getTemplet",
          data:this.searchForm,
          success:(res)=>{
            let data = res.data.data;
            this.total = res.data.total;
            if(data && data.length>0){
              this.tempList = [];
              data.map(item=>{
                this.tempList.push(item);
              })
            }
          }
        })
    },
    pageSizeChange(val) {
      this.searchForm.pageSize = val;
    },
    pageIndexChange(val) {
      this.searchForm.pageIndex = val;
    }
  }
};
</script>
<style lang='less' scoped>
#aia-template{
  height:100%;
  overflow:hidden; 
  position:relative;
}
#aia-template .pageination{
  position:absolute;
  bottom:20px;
  width:100%;
  padding:0 20px;
  text-align: right;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
#aia-template .aia-template-content{
  position:absolute;
  width:100%;
  top:110px;
  bottom:60px;
  overflow-y:auto;
}
.searBox {
  padding:0 10px;
  margin: 0 0 20px;
}
</style>