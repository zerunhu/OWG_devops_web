<template>
  <div class="app-container" >
    <el-row>
        <el-button size="medium" type="primary" icon="el-icon-download" @click="dialogbranchVisible=true;getSvnBranch()" style="float:left; margin: 2px;">同步代码</el-button>
    </el-row>
    <el-row style="margin-top: 10px">
        <el-table :data="containerList" border fit highlight-current-row style="width: 100%" >
          <el-table-column label="编号" align="center" min-width="140px">
            <template slot-scope="scope"> {{ scope.row.id  }} </template>
          </el-table-column>
          <el-table-column label="svn_num" align="center" min-width="180px">
            <template slot-scope="scope"> {{ scope.row.svn_num }} </template>
          </el-table-column>
          <el-table-column label="build_tag" align="center" min-width="280px">
            <template slot-scope="scope"> {{ scope.row.build_tag }}</template>
          </el-table-column>
          <el-table-column label="author" align="center" min-width="180px">
            <template slot-scope="scope"> {{ scope.row.create_user }} </template>
          </el-table-column>
          <el-table-column label="created_time" align="center" min-width="240px">
            <template slot-scope="scope"> {{ scope.row.created_time }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="300px">
            <template slot-scope="scope" v-if="scope.row.create_user == user_name">
                <el-button size="small" type="primary" icon="el-icon-set-up" @click="buildDialog(scope.row.id)">构建</el-button>
                <el-button size="small" type="primary" icon="el-icon-upload" :loading=scope.row.pushloading @click="pushImage(scope.row)">推送</el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-row>

    <el-dialog title="Branch" :visible.sync="dialogbranchVisible" width="40%" :closeOnClickModal=false :showClose=false>
      <el-form :model="branchForm">
        <el-form-item label="branch" label-width="110px">
          <el-select style="width:220px;" filterable  v-model="branchForm.branch" placeholder="请选择分支">
            <el-option
              v-for="item in branchList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogbranchVisible = false; dialogDestry()">取 消</el-button>
        <el-button type="primary" :loading=createLoading @click="createContainer()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <div class="dialogStyle" id="scroll">
        <span class="comment" > {{ result_data }} </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false, getContainer()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Build" :visible.sync="dialogbuildVisible" width="40%" :closeOnClickModal=false :showClose=false>
      <el-form :model="buildForm">
        <!-- <el-form-item label="world_name" label-width="110px">
          <el-input v-model="updateForm.world_name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="ecr_addr" label-width="110px">
          <el-select style="width:220px;" filterable  v-model="buildForm.ecraddr" placeholder="请选择ecr地址">
            <el-option
              v-for="item in EcraddrList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogbuildVisible = false; dialogDestry()">取 消</el-button>
        <el-button type="primary" :loading="buildloading" @click="buildImage()">确认</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import { getContainer,createContainer,deleteContainer,getEcraddr,buildImage,pushImage,getSvnBranch } from '@/api/ci/cicontainer.js'
import store from '@/store'
export default {
  data() {
    return {
      containerList:[],
      EcraddrList: [],
      branchList: [],
      createLoading: false,
      user_name: store.getters.name,
      dialogVisible: false,
      result_data: "",
      dialogTitle: "",
      dialogbuildVisible: false,
      buildForm: {
        id: "",
        ecraddr: "",
      },
      branchForm: {
        branch: "",
      },
      dialogbranchVisible: false,
      buildloading: false
    }
  },
  mounted: function () {
    this.getContainer()
  },

  methods: {
    scrollDown(){
      this.$nextTick(() => {   //滚动条最下函数
        let msg = document.getElementById('scroll') // 获取对象
        msg.scrollTop = msg.scrollHeight // 滚动高度
      })
    },
    getSvnBranch(){
      getSvnBranch()
        .then(response => {
          this.branchList=response 
        }, response => {
          console.log(response);
        }) 
    },
    getEcraddr(){
      getEcraddr()
        .then(response => {
          this.EcraddrList=response 
        }, response => {
          console.log(response);
        }) 
    },
    buildDialog(id){
      this.buildForm.id=id;
      this.getEcraddr();
      this.dialogbuildVisible=true
    },
    buildImage() {
      this.buildloading=true
      buildImage(this.buildForm.id,{ecr_addr: this.buildForm.ecraddr})
        .then(response => {
          if (response.status == 200){
            this.dialogVisible = true,
            this.buildloading=false,
            this.dialogbuildVisible=false,
            this.result_data = response.message,
            this.dialogTitle = "构建成功",
            this.scrollDown()
        }else{
          this.dialogVisible = true,
          this.buildloading=false,
          this.dialogbuildVisible=false,
          this.result_data = response.message,
          this.dialogTitle = "构建失败",
          console.log(response),
          this.scrollDown()
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
            this.$set(row,"pushloading",false),
            this.scrollDown()
          }else{
            this.dialogVisible = true,
            this.result_data = response.message,
            this.dialogTitle = "推送失败",
            this.$set(row,"pushloading",false),
            console.log(response),
            this.scrollDown()
          }
        });
    },
    getContainer() {
      getContainer()
        .then(response => {
            this.containerList = response.map(v =>{
              // this.$set(v,"buildloading",false)
              this.$set(v,"pushloading",false)
              // console.log(v)
              return v
            })
        }, response => {
            console.log(response);
        });
    },
    createContainer() {
      this.createLoading=true
      createContainer({branch: this.branchForm.branch})
        .then(response => {
        if (response.status == 200){
            this.createLoading = false,
            this.dialogbranchVisible = false,
            this.dialogVisible = true,
            this.result_data = response.message,
            this.dialogTitle = "同步成功",
            this.scrollDown()
        }else{
          this.scrollDown()
          this.createLoading = false,
          this.dialogbranchVisible = false,
          this.dialogVisible = true,
          this.result_data = response.message,
          this.dialogTitle = "同步失败",
          console.log(response)
          this.scrollDown()
        }
        });
    },

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
    dialogDestry(){
      this.$message({
        type: 'info',
        message: '已取消'
      });
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
.dialogStyle{
  height: 400px;
  overflow-y:scroll;
  background:black;
  font-size: 16px;
  color: aliceblue;
}
</style>>
