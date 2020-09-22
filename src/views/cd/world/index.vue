<template>
  <div class="app-container" >
    <el-select style="width:220px;" v-model="value" placeholder="请选择cluster环境" @change="getWorld();getImages()">
        <el-option
          v-for="item in ClusterList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
    </el-select>
    <el-row style="float:right;margin-top: 15px;margin-right:5px;"  v-if="value!=''">
        <el-button size="medium" type="primary" icon="el-icon-copy-document"  @click="dialogCreateFormVisible=true" style="height:40px;" >{{ create_Value }}</el-button>
    </el-row>
    <el-tabs style="margin-top: 10px" type="card" v-model="paneActiveName" @tab-click="handleClick">
      <el-tab-pane label="world" name="world"></el-tab-pane>
      <el-tab-pane label="global" name="global"></el-tab-pane>
    </el-tabs>
    <el-row style="margin-top: -16px">
        <el-table :data="tableDataList" border fit highlight-current-row style="width: 100%" >
          <el-table-column label="name" align="center" min-width="200px">
            <template slot-scope="scope"> {{ scope.row.name  }} </template>
          </el-table-column>
          <el-table-column label="cluster" align="center" min-width="200px">
            <template> {{ value }} </template>
          </el-table-column>
          <el-table-column label="create_time" align="center" min-width="240px">
            <template slot-scope="scope"> {{ scope.row.create_time }}</template>
          </el-table-column>
          <el-table-column label="update_time" align="center" min-width="240px">
            <template slot-scope="scope"> {{ scope.row.update_time }} </template>
          </el-table-column>
          <el-table-column label="image_tag" align="center" min-width="180px">
            <template slot-scope="scope"> {{ scope.row.image_tag }} </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="300px">
            <template slot-scope="scope">
                <el-button size="small" type="warning" icon="el-icon-odometer" @click="updateDialog(scope.row)">upgrade</el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)">delete</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-row>

    <!-- 实时日志dialog、 -->
    <el-dialog title="RealLog" :visible.sync="dialogRealLogVisible" width="50%" :closeOnClickModal=false :closeOnPressEscape=false :showClose=false>
      <div class="dialogStyle" id="scroll">
        <span class="comment" > {{ dialog_data }} </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="destry()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建dialog、 -->
    <el-dialog title="Create" :visible.sync="dialogCreateFormVisible" width="40%" :closeOnClickModal=false :closeOnPressEscape=false :showClose=false>
      <el-form :model="createForm">
        <el-form-item label="cluster_name" label-width="110px">
          <el-input v-model="this.value" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="createForm.label_name" label-width="110px">
          <el-input v-model="createForm.world_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="image_tag" label-width="110px">
          <el-select style="width:220px;" filterable  v-model="createForm.image_tag" placeholder="请选择镜像版本">
            <el-option
              v-for="item in ImageList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateFormVisible = false; dialogDestry()">取 消</el-button>
        <el-button type="primary" @click="createWorld()">确认</el-button>
      </div>
    </el-dialog> 
    <!-- 更新dialog、 -->
    <el-dialog title="Update" :visible.sync="dialogUpdateFormVisible" width="40%" :closeOnClickModal=false :showClose=false>
      <el-form :model="updateForm">
        <el-form-item :label="updateForm.label_name" label-width="110px">
          <el-input v-model="updateForm.world_name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="image_tag" label-width="110px">
          <el-select style="width:220px;" filterable  v-model="updateForm.image_tag" placeholder="请选择镜像版本">
            <el-option
              v-for="item in ImageList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateFormVisible = false; dialogDestry()">取 消</el-button>
        <el-button type="primary" @click="updateWorld()">确认</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import { getCluster,getWorld,createWorld,getImages,updateWorld,deleteWorld,GetRealLog,DeleteRealLog } from '@/api/cd/world.js'
import store from '@/store'
export default {
  data() {
    return {
      paneActiveName: "world",
      create_Value: "New world",
      ClusterList: "",
      tableDataList: [],
      value: "",
      createForm: {
        world_id: "",
        cluster_name: "",
        image_tag: "",
        label_name: "world_id",
      },
      updateForm: {
        world_name: "",
        image_tag: "",
        world_id: "",
        label_name: "world_name",
      },
      ImageList: "",
      formLabelWidth: '80px',
      path: "",
      timer: "",
      dialog_data: "Loading...",
      dialogRealLogVisible: false,
      dialogCreateFormVisible: false,
      dialogDeleteVisible: false,
      dialogUpdateFormVisible: false,
      // all_reallog: ["/tmp/scale_nodegroup.log"],
    }
  },
  mounted: function () {
    // DeleteRealLog({ path: this.all_reallog })
    this.getCluster()
  },
  methods: {
    getCluster(){
      getCluster()
        .then(response => {
            this.ClusterList = response
        }, response => {
            console.log(response);
        }) 
    },
    handleClick(tab, event) {
      this.getWorld()
      this.create_Value = "New "+this.paneActiveName
      this.createForm.label_name = this.paneActiveName+"_id"
      this.updateForm.label_name = this.paneActiveName+"_name"
    },
    getWorld(){
      getWorld(this.value,this.paneActiveName)
        .then(response => {
            this.tableDataList = response
        }, response => {
            console.log(response);
        }) 
    },
    createWorld() {
      this.dialogCreateFormVisible=false,
      this.dialogRealLogVisible = true,
      this.path = '/tmp/create_world.log',
      createWorld({ cluster: this.value, world_id: this.createForm.world_id, image_tag: this.createForm.image_tag, type: this.paneActiveName })
        .then(response => {
          clearInterval(this.timer)
          this.getData()
        }, response => {
          clearInterval(this.timer)
          this.getData()
          console.log(response);
        });
      this.timer = setInterval(() => {
          setTimeout(this.getData)
      }, 3000)
      this.createForm.world_id=""
    },
    getImages(){
      getImages(this.value)
        .then(response => {
          this.ImageList=response 
        }, response => {
          console.log(response);
        }) 
    },
    updateDialog(row){
      this.dialogUpdateFormVisible=true,
      this.updateForm.world_name=row.name,
      this.updateForm.world_id=row.id
    },
    updateWorld() {
      this.dialogUpdateFormVisible=false,
      this.dialogRealLogVisible = true,
      this.path = '/tmp/update_world.log',
      updateWorld( this.updateForm.world_id,{ image_tag: this.updateForm.image_tag, type: this.paneActiveName })
        .then(response => {
          clearInterval(this.timer)
          this.getData()
        }, response => {
          clearInterval(this.timer)
          this.getData()
          console.log(response);
        });
      this.timer = setInterval(() => {
          setTimeout(this.getData)
      }, 3000)
    },

    deleteConfirm(pk) {
      this.$confirm('此操作将永久删除该world, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteWorld(pk);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteWorld(pk){
      this.dialogDeleteVisible=false,
      this.dialogRealLogVisible = true,
      this.path = '/tmp/delete_world.log',
      deleteWorld(pk)
        .then(response => {
          clearInterval(this.timer)
          this.getData()  
        }, response => {
          clearInterval(this.timer)
          this.getData()
          console.log(response);
        }) 
      this.timer = setInterval(() => {
          setTimeout(this.getData)
      }, 3000)
    },
    getData(){
      GetRealLog(this.path)
        .then(response => {
            this.dialog_data = response
            this.$nextTick(() => {   //滚动条最下函数
            let msg = document.getElementById('scroll') // 获取对象
            msg.scrollTop = msg.scrollHeight // 滚动高度
            })
        }, response => {
            console.log(response);
        })   
    },
    destry() { 
      this.dialogRealLogVisible = false,
      DeleteRealLog({ path: this.path })
      this.dialog_data="loading..."
      clearInterval(this.timer)
      this.getWorld()
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
