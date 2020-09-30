<template>
  <div class="app-container" >

    <el-select style="width:220px;" v-model="value" placeholder="请选择cluster环境" @change="getNodegroup()">
        <el-option
          v-for="item in ClusterList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
    </el-select>

    <!-- <el-row style="margin-top: 10px">
        <el-button size="medium" type="primary" icon="el-icon-download"  @click="ScaleNodeGroup()" style="float:left; margin: 2px;">同步代码</el-button>
    </el-row> -->
    <el-row style="margin-top: 10px">
        <el-table :data="nodegroupList" border fit highlight-current-row style="width: 100%" >
          <el-table-column label="name" align="center" min-width="200px">
            <template slot-scope="scope"> {{ scope.row.name  }} </template>
          </el-table-column>
          <el-table-column label="cluster" align="center" min-width="230px">
            <template> {{ value }} </template>
          </el-table-column>
          <el-table-column label="min_size" align="center" min-width="190px">
            <template slot-scope="scope"> {{ scope.row.min_size }}</template>
          </el-table-column>
          <el-table-column label="max_size" align="center" min-width="190px">
            <template slot-scope="scope"> {{ scope.row.max_size }} </template>
          </el-table-column>
          <el-table-column label="capacity" align="center" min-width="170px">
            <template slot-scope="scope"> {{ scope.row.capacity }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center"  min-width="300px">
            <template slot-scope="scope">
                <el-button size="small" type="primary" icon="el-icon-connection" :loading=scope.row.pushloading @click="sacleFrom(scope.row)">scale</el-button>
                <el-button size="small" type="danger" icon="el-icon-delete">delete</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-row>
    
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :closeOnClickModal=false :closeOnPressEscape=false :showClose=false>
      <div class="dialogStyle" id="scroll">
        <span class="comment" > {{ dialog_data }} </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="destry()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Scale" :visible.sync="dialogFormVisible" width="40%" :closeOnClickModal=false :closeOnPressEscape=false :showClose=false>
      <el-form :model="form">
        <el-form-item label="max_size" :label-width="formLabelWidth">
          <el-input v-model="form.max_size" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="capacity" :label-width="formLabelWidth">
          <el-input v-model="form.capacity" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="sacleLoading" @click="ScaleNodeGroup()">{{sacleLoading?"提交中...":"确定"}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { DeleteRealLog,GetRealLog,ScaleNodeGroup,GetNodegroup,getCluster } from '@/api/cd/nodegroup.js'
import store from '@/store'
export default {
  data() {
    return {
      ClusterList: "",
      nodegroupList: [],
      timer: "",
      dialog_data: "loading...",
      dialogTitle: "",
      dialogVisible: false,
      dialogFormVisible: false,
      path: "",
      value: "", 
      form: {
        max_size: '',
        capacity: '',
        ng_id: '',
      },
      sacleLoading: false,
      formLabelWidth: '80px',
    }
  },
  mounted: function () {
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
    getNodegroup(){
      GetNodegroup(this.value)
        .then(response => {
            this.nodegroupList = response
        }, response => {
            console.log(response);
        }) 
    },
    sacleFrom(row){
      this.dialogFormVisible=true
      this.form.max_size=row.max_size
      this.form.capacity=row.capacity
      this.form.ng_id=row.id
      console.log(this.form)
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
    ScaleNodeGroup() {
      this.dialogFormVisible=false,
      this.dialogVisible = true,
      this.path = '/tmp/scale_nodegroup.log',
      this.dialogTitle = "Loading"
      ScaleNodeGroup(this.form.ng_id, { max_size: this.form.max_size, capacity:this.form.capacity })
        .then(response => {
          clearInterval(this.timer)
          setTimeout(this.getData(),3000)
        }, response => {
          clearInterval(this.timer)
          setTimeout(this.getData(),3000)
          console.log(response);
        });
      this.timer = setInterval(() => {
          setTimeout(this.getData)
      }, 3000)
    },
    destry() { 
      this.dialogVisible = false,
      DeleteRealLog({ path: this.path })
      this.dialog_data="loading..."
      clearInterval(this.timer)
      this.getNodegroup()
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
