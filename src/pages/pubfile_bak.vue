<template>
  <div id="pubfile" element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
    <div class="aia-alist-header">
      <div class="aia-alist-search">
        <el-form :inline="true" size="mini" :model="searchForm" class="aia-form-inline">
          <el-form-item label="所属项目" prop="project">
            <el-input placeholder="请输入项目名称" v-model="searchForm.project"></el-input>
          </el-form-item>
          <el-form-item label="文件类型" prop="type">
            <el-select v-model="searchForm.type">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="item in fileTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件描述" prop="filedesc">
            <el-input placeholder="请输入文件描述" v-model="searchForm.filedesc"></el-input>
          </el-form-item>
          <el-button-group class="aia-form-btn">
            <el-button type="primary" @click="search" size="mini" icon="el-icon-search">查询</el-button>
            <el-button @click="uploadFile" icon="el-icon-plus" size="mini">上传</el-button>
          </el-button-group>
        </el-form>
      </div>
    </div>
    <div class="ats-file-list">
      <el-table :data="tableData">
        <el-table-column label="所属项目" prop="project" width="200">
        </el-table-column>
        <el-table-column label="文件类型" prop="typename" width="200">
        </el-table-column>
        <el-table-column label="文件原名" prop="oldname" width="300">
        </el-table-column>
        <el-table-column label="文件描述" prop="filedesc">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <!-- <el-button @click="copyLink(scope.row)" type="text" size="small">复制</el-button> -->
            <el-popover placement="right" width="200" trigger="click">
              <input style="width:330px;border:none;outline:none;" readonly :ref="'input'+scope.$index" :value="scope.row.url" type="text">
              <el-button type="primary" size="mini" @click="copyLink(scope.$index,scope.row)"> 复制</el-button>
              <el-button slot="reference" type="text">链接</el-button>
            </el-popover>
            <el-button @click="delFile(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="aia-alist-pagenation">
      <el-pagination :background="true" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchForm.pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="searchForm.pageSize" layout="sizes,prev,pager,next,total" :total="totalnum">
      </el-pagination>
    </div>
    <!-- 文件上传 -->
    <el-dialog title="上传文件" :visible.sync="showModal" width="330px" :modal="false">
      <el-form :model="fileForm">
        <el-form-item label="所属项目" prop="projectName">
          <el-input placeholder="请输入项目名称" v-model="fileForm.projectName" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="存储目录" prop="dirUrl">
          <el-input placeholder="例:Aiats/或Aiats/Mobile/" v-model="fileForm.dirUrl" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType">
          <el-select v-model="fileForm.fileType">
            <el-option v-for="item in fileTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件描述" prop="fileDesc">
          <el-input placeholder="简述文件内容..." v-model="fileForm.fileDesc" type="textarea" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload class="upload-demo" ref="upload" action="http://192.168.6.108:3002/upload/publicUpload" :headers="headObj" :limit="1" :data="fileForm" :on-success="uploadSuccess" :on-error="uploadError" :with-credentials="true" :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">上 传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//  v-loading.fullscreen.lock="fileLoading"
export default {
  data() {
    return {
      searchForm: {
        type: 0,
        project: "",
        filedesc: "",
        pageIndex: 1,
        pageSize: 10
      },
      fileForm: {
        fileType: 1,
        projectName: "",
        dirUrl: "",
        fileDesc: ""
      },
      fileTypeList: [
        {
          value: 1,
          label: "图片"
        },
        {
          value: 2,
          label: "音乐"
        },
        {
          value: 3,
          label: "视频"
        },
        {
          value: 4,
          label: "文件"
        }
      ],
      tableData: [],
      showModal: false,
      totalnum: 0,
      headObj: {
        "Content-Key":
          "u=34vzcWaT" +
          Date.now() +
          ";f=" +
          Date.now() +
          "_KWMatSB" +
          ";e=" +
          "OSUrHqGk" +
          Date.now()
      }
    };
  },
  created() {
    this.search();
  },
  activated() {
    this.search();
  },
  mounted() {},
  methods: {
    // 获取列表
    search() {
      this.$post({
        url: REQUEST_PATH + "upload/getFileList",
        data: this.searchForm,
        success: res => {
          console.log(res);
          if (res.data.status) {
            this.totalnum = res.data.total;
            this.tableData = res.data.data;
            if (this.tableData.length > 0) {
              const typeList = ["图片", "音乐", "视频", "文件"];
              this.tableData.map(item => {
                item.typename = typeList[item.type - 1];
              });
            }
          }
        }
      });
    },
    // 显示上传弹窗
    uploadFile() {
      this.showModal = true;
      // this.$refs.upload.clearFiles();
    },
    // 复制链接
    copyLink(index, obj) {
      console.log(obj);
      this.copyText = obj.url;
      this.$refs["input" + index].select();
      document.execCommand("Copy");
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
    // 删除文件
    delFile(obj) {
      this.$post({
        url: REQUEST_PATH + "upload/delPublicFile",
        data: {
          filekey: obj.filekey,
          aliname: new Date(obj.time).getTime(),
          url: obj.url
        },
        headers: {
          "Content-Key":
            "u=34vzcWaT" +
            Date.now() +
            ";f=" +
            Date.now() +
            "_KWMatSB" +
            ";e=" +
            "OSUrHqGk" +
            Date.now()
        },
        success: res => {
          console.log(res);
          if (res.data.status) {
            this.$message.success(res.data.message);
            this.search();
          } else {
            this.$message.error(res.data.message);
          }
        }
      });
    },
    // 上传文件
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 上传成功回调
    uploadSuccess(res) {
      if (!res.status) {
        this.$message.error(res.message);
        return;
      }
      this.showModal = false;
      this.search();
    },
    // 上传失败回调
    uploadError(err) {
      this.$message.error(JSON.parse(err.message).message);
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.search();
    }
  },
  components: {},
  computed: {},
  watch: {}
};
</script>

<style lang="less" scoped>
.aia-form-btn {
  position: absolute;
  right: 20px;
  top: 20px;
}
.aia-alist-pagenation {
  background-color: #fff;
  text-align: right;
  position: absolute;
  padding: 0 20px 20px 0;
  bottom: 0;
  right: 0;
  z-index: 2;
}
</style>
