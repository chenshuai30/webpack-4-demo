<template>
    <div id="aia-power" v-loading.fullscreen.lock="powerLoading" element-loading-spinner="aia-loading-circle" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.3)">
        <h4 class="aia-power-title">权限设置 <el-button class="fr" size="mini" style="vertical-align:middle;" @click="save">保存</el-button></h4>
        <el-row style="margin-top:15px;">
            <el-col :span="12" style="padding-right:15px;">
                <h5>角色列表</h5>
                <div class="aia-power-role">
                    <ul class="aia-power-rolelist">
                        <li :class="{'activeItem':(item.id==activeId)}" @click="checkItem(item,index)" v-for="item,index in roleList" :key="index">{{item.roleName}}</li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="12" style="padding-left:15px;border-left:1px solid #e8e8e8;">
                <h5>配置列表</h5>
                <div class="aia-power-tree">
                    <el-tree ref="tree" :check-strictly="true" @check-change="changeNode" show-checkbox :default-checked-keys="initChoice" node-key="id" :highlight-current="false" default-expand-all :data="powerList" :props="defaultProps"></el-tree>
                </div>
            </el-col>
        </el-row>       
    </div>
</template>

<script>
export default {
  name: "power",
  data() {
    return {
      powerLoading: false,
      powerList: [],
      roleList: [],
      defaultProps: {
        children: "children",
        label: "menuName"
      },
      initChoice: [],
      activeId:null,
      activeIndex:0,
      loadingText:'拼命加载中...',
      role:'',
      roleLevel:''
    };
  },
  created() {
    this.roleLevel = sessionStorage.getItem('level');
    console.log('rolelevel...')
    console.log(this.roleLevel);
    this.getRoleList();   

  },
  methods: {
    getPowerList() {
        this.$post({
          url:REQUEST_PATH + "common/getResource",
          data:{},
          loading:'powerLoading',
          success:(res)=>{
            this.powerList = res.data.data;    
            this.$refs.tree.setCheckedKeys( this.roleList[0].resourceIds);
          }
        })
    },

    getRoleList() {
        this.$post({
          url:REQUEST_PATH + "common/getRols",
          data:{level:this.roleLevel},
          success:(res)=>{
            this.roleList = res.data.data;
            this.activeId = this.roleList[0].id;
            this.getPowerList();
          }
        })
    },
    changeNode(data,isChecked) {
      var pid = data.pid;
      if(pid == 0 && !isChecked){          
          data.children && data.children.map(item=>{
              this.$refs.tree.setChecked(item.id, false);
          })
          this.$nextTick(()=>{
              this.$refs.tree.setChecked(data.id, false);
          })
      }
      if(pid !== 0){
        var isHas = this.initChoice.some(item => {
            return item === pid;
        });
        if (!isHas) {
            this.$refs.tree.setChecked(pid, true);
        }
      }

      let arr = this.$refs.tree.getCheckedKeys();
      this.roleList[this.activeIndex].resourceIds = arr.splice(0);

    },
    checkItem(item,index){
        this.activeId = item.id;
        this.activeIndex = index;
        // console.log('click item...')
        // console.log(item);
        this.$refs.tree.setCheckedKeys(item.resourceIds);
    },
    save(){
      console.log('save...');
      this.loadingText = '保存中......'
      this.$post({
        url:REQUEST_PATH + "common/editRoleResource",
        data:{roleArr:this.roleList},
        loading:'powerLoading',
        success:(res)=>{
          console.log('修改...')
          console.log(res)
          let msg = '';
          res.data.data.map(item=>{
            if(!item.status){
              msg += item.message+'!<br/>'
            }
          })
          if(msg){
            this.$message.warning(msg);
          }else{
            this.$message.success('保存成功');
            // this.push('/');
          }
        }
      })
    }
  }
};
</script>

<style lang='less' scoped>

</style>