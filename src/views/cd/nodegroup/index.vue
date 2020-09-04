<template>
  <div class="app-container" >
    <el-row>
        <el-button size="medium" type="primary" icon="el-icon-download" :loading=createLoading @click="createContainer()" style="float:left; margin: 2px;">同步代码</el-button>
    </el-row>
    <el-row style="margin-top: 10px">
        <el-table :data="containerList" border fit highlight-current-row style="width: 100%" >
          <el-table-column label="编号" align="center" width="160px">
            <template slot-scope="scope"> {{ scope.row.id  }} </template>
          </el-table-column>
          <el-table-column label="svn_num" align="center" width="200px">
            <template slot-scope="scope"> {{ scope.row.svn_num }} </template>
          </el-table-column>
          <el-table-column label="container_id" align="center" width="240px">
            <template slot-scope="scope"> {{ scope.row.container_id }}</template>
          </el-table-column>
          <el-table-column label="创建人" align="center" width="200px">
            <template slot-scope="scope"> {{ scope.row.create_user }} </template>
          </el-table-column>
          <el-table-column label="build_count" align="center" width="180px">
            <template slot-scope="scope"> {{ scope.row.build_count }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope" v-if="scope.row.create_user == user_name">
                <el-button size="small" type="primary" icon="el-icon-set-up" :loading=scope.row.buildloading @click="buildImage(scope.row)">构建</el-button>
                <el-button size="small" type="primary" icon="el-icon-upload" :loading=scope.row.pushloading @click="pushImage(scope.row)">推送</el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <div style="height: 400px;overflow-y:scroll;">
        <span class="comment" > {{ result_data }} </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false, getContainer()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
import { getContainer,createContainer,deleteContainer,buildImage,pushImage } from '@/api/cicontainer.js'
import store from '@/store'
export default {
  data() {
    return {
      containerList:[],
      createLoading: false,
      user_name: store.getters.name,
      dialogVisible: false,
      result_data: "",
      dialogTitle: "",
    }
  },
  mounted: function () {
    this.getContainer()
  },

  methods: {
    
    buildImage(row) {
      this.$set(row,"buildloading",true)
      buildImage(row.id)
        .then(response => {
          if (response.status == 200){
            this.dialogVisible = true,
            this.result_data = response.message,
            this.dialogTitle = "构建成功",
            this.$set(row,"buildloading",false)
        }else{
          this.dialogVisible = true,
          this.result_data = response.message,
          this.dialogTitle = "构建失败",
          console.log(response)
        }
        });
    },
    pushImage(row) {
      this.$set(row,"pushloading",true)
      pushImage(row.id)
        .then(response => {
          if (response.status == 200){
            this.dialogVisible = true,
            this.result_data = response.message,
            this.dialogTitle = "推送成功",
            this.$set(row,"buildloading",false)
          }else{
            this.dialogVisible = true,
            this.result_data = response.message,
            this.dialogTitle = "推送失败",
            console.log(response)
          }
        });
    },
    getContainer() {
      getContainer()
        .then(response => {
            this.containerList = response.map(v =>{
              this.$set(v,"buildloading",false)
              this.$set(v,"pushloading",false)
              return v
            })
        }, response => {
            console.log(response);
        });
    },
    createContainer() {
      this.createLoading=true
      createContainer()
        .then(response => {
        if (response.status == 200){
            this.dialogVisible = true,
            this.result_data = response.message,
            this.dialogTitle = "同步成功",
            this.createLoading = false
        }else{
          this.dialogVisible = true,
          this.result_data = response.message,
          this.dialogTitle = "同步失败",
          console.log(response)
        }
        });
    },

    // deleteConfirm(pk) {
    //   this.$confirm('此操作将永久删除该容器, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.deleteContainer(pk);
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     });
    //   });
    // },
    // deleteContainer(index){
    //   deleteContainer(index)
    //     .then(response => {
    //       this.$message({message: '删除成功',type: 'success'});
    //       this.getContainer()
    //     }, response => {
    //       console.log(response);
    //   });
    // },  


    deleteConfirm(pk) {
      this.$confirm('此操作将永久删除该容器, 是否继续?', '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            deleteContainer(pk)
            .then(response => {
              instance.confirmButtonLoading = false;
              done()
              this.getContainer()
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }, response => {
              console.log(response);
            });
          } else {
            this.$message({
            type: 'info',
            message: '已取消删除'
            });
            done();
          }
        }
      })
    },
  }
}
</script>
<style scoped>
.move {
  padding-left: 30px;
  padding-top: 30px;
}
.comment{
    white-space:pre-wrap;
} 
</style>>
