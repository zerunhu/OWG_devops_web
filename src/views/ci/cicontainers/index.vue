<template>
  <div class="home move" >
    <el-row display="margin-top:10px">
        <el-button type="primary" :loading=createLoading @click="createContainer()" style="float:left; margin: 2px;">新增构建容器</el-button>
    </el-row>
    <el-row>
        <el-table :data="containerList" style="width: 100%" >
          <el-table-column label="编号" min-width="50">
            <template slot-scope="scope"> {{ scope.row.id  }} </template>
          </el-table-column>
          <el-table-column label="svn_num" min-width="50">
            <template slot-scope="scope"> {{ scope.row.svn_num }} </template>
          </el-table-column>
          <el-table-column label="container_id" min-width="50">
            <template slot-scope="scope"> {{ scope.row.container_id }}</template>
          </el-table-column>
          <el-table-column label="创建人" min-width="50">
            <template slot-scope="scope"> {{ scope.row.create_user }} </template>
          </el-table-column>
          <el-table-column label="build_count" min-width="50">
            <template slot-scope="scope"> {{ scope.row.build_count }}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope" v-if="scope.row.create_user == user_name">
                <el-button size="medium" type="primary" :loading=scope.row.buildloading @click="buildImage(scope.row)">构建</el-button>
                <el-button size="medium" type="primary" :loading=scope.row.pushloading @click="pushImage(scope.row)">推送</el-button>
                <el-button size="medium" type="danger" @click="deleteConfirm(scope.row.id)">删除</el-button>
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
            this.dialogTitle = "创建成功",
            this.createLoading = false
        }else{
          this.dialogVisible = true,
          this.result_data = response.message,
          this.dialogTitle = "创建失败",
          console.log(response)
        }
        });
    },

    deleteConfirm(pk) {
      this.$confirm('此操作将永久删除该容器, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteContainer(pk);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteContainer(index){
      deleteContainer(index)
        .then(response => {
          this.$message({message: '删除成功',type: 'success'});
          this.getContainer()
        }, response => {
          console.log(response);
      });
    },
    // deleteRes(data){
    //   this.$alert(data, "title", {
    //     confirmButtonText: '确定',
    //     callback: action => {
    //       this.getContainer()
    //     }
    //   })
    // },
     
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
