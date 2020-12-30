<template>
  <div class="app-container">

    <el-button size="small" type="primary" icon="el-icon-upload" @click="dialogUploadVisible=true">
            上传
    </el-button>

    <el-dialog title="文件上传" :visible.sync="dialogUploadVisible" width="40%">
      <el-upload
        class="upload-demo"
        ref="upload"
        action=""
        :before-upload="beforePicUpload"
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
import { fileUpload } from '@/api/test'

export default {
  name: 'ArticleList',
  data() {
    return {
      dialogUploadVisible: false,
      list: null,
    }
  },
  methods: {
    beforePicUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 1MB!')
        return false
      }
      var data = new FormData();
      data.append('file', file);
      data.append('cluster', this.value);
      console.log(data)
      //这里是我将file作为参数传给了我的接口
      fileUpload(data)
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
  }
}
  
</script>

