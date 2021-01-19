<template>
  <div class="app-container">
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="name" width="260">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="Author">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="140px" align="center" label="type">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="330px" align="center" label="desc">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" min-width="400">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="$router.push({path:'edit/'+scope.row.id})"> 
            Edit
          </el-button> 
          <el-button size="small" type="primary" icon="el-icon-upload" @click="dialogUploadVisible=true; upload_id=scope.row.id">
            上传
          </el-button>
          <el-button size="small" type="primary" icon="el-icon-download" @click="fileDownload(scope.row)">
            下载
          </el-button>
          <el-button size="small" :loading=isSyncLoading type="primary" icon="el-icon-refresh" v-if="scope.row.name=='Dockerfile.prod'" @click="syncFileConfirm(scope.row.id)">
            同步
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="文件上传" :visible.sync="dialogUploadVisible" width="40%">
      <el-upload
        class="upload-demo"
        ref="upload"
        action=""
        :before-upload="beforePicUpload"
        :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip" style="font-size:16px">只能上传文件，且不超过1mb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogUploadVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Filelist,fileUpload,fileDownload,syncFile } from '@/api/ci/file'

export default {
  name: 'ArticleList',
  data() {
    return {
      fileList: [],
      upload_id: "",
      dialogUploadVisible: false,
      list: null,
      total: 0,
      listLoading: true,
      isSyncLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.Filelist()
  },
  methods: {
    beforePicUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 1MB!')
        return false
      }
      var data = new FormData();
      data.append('path', file);
      //这里是我将file作为参数传给了我的接口
      fileUpload(data,this.upload_id)
        .then(response => {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.dialogUploadVisible=false
          console.log(response);
      }, response => {
        console.log(response);
      });
      return false
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    Filelist() {
      this.listLoading = true
      Filelist()
        .then(response => {
          this.list = response
          this.listLoading = false
      }, response => {
        console.log(response);
      });
    },
    fileDownload(row){
      fileDownload(row.id)
        .then(res => {
          const blob = new Blob([res])
          // window.URL.createObjectURL(blob)
          const elink = document.createElement('a')
          elink.download = row.name
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          // elink.setAttribute('download', 'excel.xlsx')
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
        }, response => {
          console.log(response);
        });
      },
    syncFileConfirm(pk) {
      this.$confirm('此操作将会把Dockerfile.dev文件复制到Dockerfile.prod文件, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isSyncLoading=true;
        this.syncFile(pk);
        this.isSyncLoading=false;
        this.$message({
          message: 'success sync',
          type: 'success'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    syncFile(pk) {
      syncFile(pk)
        .then(response => {
          console.log(response);
      }, response => {
        console.log(response);
      });
    },
  }
}
  
</script>

