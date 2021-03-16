<template>
  <div class="app-container" >
    <!-- <aside>
      <strong>ServerList Name: </strong>{{ file_name }}
      <br>
      You can click
      <a :href='file_url' target="_blank">here</a>
      to download the serverlist file in aws
    </aside> -->
    <el-row style="float:right;margin:5px 25px 10px 0;z-index:1000">
      <el-button size="medium" type="primary" icon="el-icon-copy-document" v-if="tableloading!=true && checkPermission(['admin','Operation'])" style="height:40px;" @click="adddialog()">New Plan</el-button>
    </el-row>
    <el-tabs style="margin-top: 30px" type="card" v-if="tableloading!=true" v-model="paneActiveName" @tab-click="handleClick">
      <el-tab-pane label="更新计划" name="update"></el-tab-pane>
      <el-tab-pane label="开服计划" name="create"></el-tab-pane>
    </el-tabs>
    <el-row style="margin-top: -16px">
        <el-table v-loading="tableloading" :data="planList" border fit highlight-current-row style="width: 100%" >
          <el-table-column label="world" align="center" min-width="100px">
            <template slot-scope="scope"> 
               {{ scope.row.world.split(",")[0] }}
               <el-tooltip class="item" effect="dark" content="show more world" placement="top-start" v-if="paneActiveName=='update'">
                <a><i class="el-icon-info" @click="dialogWorldInfo(scope.row.id)"></i></a>
               </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="image" align="center" min-width="120px">
            <template slot-scope="scope"> {{ scope.row.image }} </template>
          </el-table-column>
          <!-- <el-table-column label="type" align="center" min-width="80px">
            <template slot-scope="scope"> {{ scope.row.type }} </template>
          </el-table-column> -->
          <el-table-column label="time" align="center" min-width="120px">
            <template slot-scope="scope"> {{ scope.row.time }} </template>
          </el-table-column>
          <el-table-column label="result" align="center" min-width="80px">
            <template slot-scope="scope"> 
              <el-tag :type="scope.row.result | statusFilter">
                {{ scope.row.result }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="remark" align="center" min-width="200px">
            <template slot-scope="scope"> {{ scope.row.remark }}</template>
          </el-table-column>
          <el-table-column label="操作"  align="center" min-width="200px">
            <template slot-scope="scope">
                <el-button type="primary" size="small" v-if="checkPermission(['admin','Operation'])" :disabled="scope.row.result | completebool" icon="el-icon-success" @click="completeConfirm(scope.row.id)">
                  Complete
                </el-button>
                <el-button type="primary" size="small" v-if="checkPermission(['admin','Operation'])" :disabled="scope.row.result | completebool" icon="el-icon-edit" @click="updateBefore(scope.row)">
                  Edit
                </el-button>
                <el-button type="danger" size="small" v-if="checkPermission(['admin','Operation'])" icon="el-icon-delete" @click="deleteConfirm(scope.row.id)">
                  Delete
                </el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-row>
    
    <!-- worldinfo dialog、 -->
    <el-dialog title="World Info" :visible.sync="dialogWorldInfoVisible" width="40%" :closeOnClickModal=false>
      <el-table v-loading="worldInfoTableLoading" :data="worldInfoList" border fit highlight-current-row style="width: 100%" >
          <el-table-column label="name" align="center" min-width="120px">
            <template slot-scope="scope"> {{ scope.row.name }} </template>
          </el-table-column>
          <el-table-column label="prod_name" align="center" min-width="80px">
            <template slot-scope="scope"> {{ scope.row.prod_name }} </template>
          </el-table-column>
          <el-table-column label="image" align="center" min-width="120px">
            <template slot-scope="scope"> {{ scope.row.image }} </template>
          </el-table-column>
        </el-table>
    </el-dialog>

    <!-- add dialog、 -->
    <el-dialog title="New Plan" :visible.sync="dialogCreateFormVisible" width="40%" :closeOnClickModal=false :showClose=false>
      <el-form :model="createForm">
        <el-form-item label="World" label-width="110px">
          <el-select v-model="createForm.world" multiple collapse-tags placeholder="请选择" v-if="paneActiveName=='update'">
            <el-option
            v-for="item in worldList"
            :key="item"
            :label="item"
            :value="item">
            </el-option>
          </el-select>
          <el-input v-model="createForm.world" v-if="paneActiveName=='create'"></el-input>
        </el-form-item>
        <el-form-item label="Image" label-width="110px">
          <el-select style="width:220px;" filterable  v-model="createForm.image" placeholder="请选择镜像版本">
            <el-option
              v-for="item in imageList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Type" label-width="110px">
          <el-input v-model="createForm.type" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Time" label-width="110px">
          <el-date-picker
            v-model="createForm.time"
            type="datetime"
            placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="Remark" label-width="110px">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="createForm.remark">
            </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateFormVisible = false; dialogDestry('添加')">取 消</el-button>
        <el-button type="primary" :loading=isCreateLoading @click="addOperationPlan">新 增</el-button>
      </div>
    </el-dialog>
    <!-- update dialog、 -->
    <el-dialog title="Edit Plan" :visible.sync="dialogUpdateFormVisible" width="40%" :closeOnClickModal=false :showClose=false>
      <el-form :model="updateForm">
        <el-form-item label="World" label-width="110px">
          <el-select v-model="updateForm.world" multiple collapse-tags placeholder="请选择" v-if="paneActiveName=='update'">
            <el-option
            v-for="item in worldList"
            :key="item"
            :label="item"
            :value="item">
            </el-option>
          </el-select>
          <el-input v-model="updateForm.world" v-if="paneActiveName=='create'"></el-input>
        </el-form-item>
        <el-form-item label="Image" label-width="110px">
          <el-select style="width:220px;" filterable  v-model="updateForm.image" placeholder="请选择镜像版本">
            <el-option
              v-for="item in imageList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Type" label-width="110px">
          <el-input v-model="updateForm.type" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Time" label-width="110px">
          <el-date-picker
            v-model="updateForm.time"
            type="datetime"
            placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="Remark" label-width="110px">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="updateForm.remark">
            </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateFormVisible = false; dialogDestry('编辑')">取 消</el-button>
        <el-button type="primary" :loading=updateLoading @click="updateOperationPlan(updateForm.id)">修 改</el-button>
      </div> 
    </el-dialog>
  </div>
</template>
<script>
import { getOperationPlan,detailOperationPlan,addOperationPlan,updateOperationPlan,completeOperationPlan,deleteOperationPlan,getImages,getWorlds } from '@/api/operationplan'
import checkPermission from '@/utils/permission'
export default {
  filters: {
    completebool(status) {
      const completeMap = {
        COMPLETE: true,
        PROCESSING: false,
      }
      return completeMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        COMPLETE: 'success',
        PROCESSING: 'info',
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      planList: [],
      tableloading: true,
      paneActiveName: "update",
      //createForm
      imageList: [],
      worldList: [],
      playtype: ["create","update"],
      dialogCreateFormVisible: false,
      isCreateLoading: false,
      createForm: {
        world: [],
        image: "",
        type: "update",
        time: "",
        remark: "",
        result: "",
      },
      dialogUpdateFormVisible: false,
      updateLoading: false,
      updateFormId: "",
      updateForm: {
        world: [],
        image: "",
        type: "update",
        time: "",
        remark: "",
        result: "",
      },
      dialogWorldInfoVisible: false,
      worldInfoTableLoading: true,
      worldInfoList: [],
    }
  },
  mounted: function () {
    this.getOperationPlan()
    this.getWorlds()
    this.getImages()
  },
  methods:{
    checkPermission(roles){
        return checkPermission(roles)
    },

    getImages(){
      getImages("firestrike-oregon-prod-2")
        .then(response => {
          this.imageList=response 
        }, response => {
          console.log(response);
        }) 
    },
    getWorlds(){
      getWorlds()
        .then(response => {
          this.worldList=response 
        }, response => {
          console.log(response);
        }) 
    },

    // switch plan type create/update
    handleClick(tab, event) {
      this.getOperationPlan()
      this.createForm.type = this.paneActiveName
      this.createForm.world = "firestrike-world"
      this.updateForm.type = this.paneActiveName
    },

    getOperationPlan() {
      getOperationPlan(this.paneActiveName)
        .then(response => {
          this.planList = response
          this.tableloading = false
          console.log(response);
      }, response => {
          console.log(response);
      });
    },

    dialogWorldInfo(pk){
        this.dialogWorldInfoVisible = true
        this.detailOperationPlan(pk)
    },
    detailOperationPlan(pk) {
      detailOperationPlan(pk)
        .then(response => {
          this.worldInfoList = response
          this.worldInfoTableLoading = false
      }, response => {
          console.log(response);
      });
    },

    adddialog(){
      this.dialogCreateFormVisible=true
    },
    addOperationPlan(){
      this.isCreateLoading = true
      this.createForm.world = this.createForm.world.toString()
      addOperationPlan(this.createForm)
        .then(response => {
          this.dialogCreateFormVisible = false
          this.isCreateLoading = false
          this.$message({
            type: 'success',
            message: '添加成功'
          });
          this.createForm.world = this.createForm.world.split(",")
          this.getOperationPlan()
      }, response => {
          console.log(response);
          this.createForm.world = this.createForm.world.split(",")
      });
    },

    updateBefore(row){
        this.dialogUpdateFormVisible=true
        this.updateFormId=row.id
        this.updateForm.world = row.world.split(",")
        this.updateForm.image= row.image
        this.updateForm.type= row.type
        this.updateForm.time= row.time
        this.updateForm.remark= row.remark
        this.updateForm.result= row.result
    },
    updateOperationPlan(){
        this.updateLoading = true
        this.updateForm.world = this.updateForm.world.toString()
        updateOperationPlan(this.updateFormId,this.updateForm)
        .then(response => {
          this.updateLoading = false,
          this.dialogUpdateFormVisible= false,
          this.getOperationPlan()
      }, response => {
          console.log(response);
      });
    },

    completeConfirm(pk){
      this.$confirm('此操作进行后计划将完成, 是否继续?', '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {    
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            completeOperationPlan(pk)
            .then(response => {
              instance.confirmButtonLoading = false;
              done()
              this.getOperationPlan()
              this.$message({
                type: 'success',
                message: '成功'
              });
            }, response => {
              console.log(response);
            });
          } else {
            this.$message({
            type: 'info',
            message: '已取消'
            });
            done();
          }
        }
      })
    },

    deleteConfirm(pk) {
      this.$confirm('此操作将永久删除该计划, 是否继续?', '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {    
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            deleteOperationPlan(pk)
            .then(response => {
              instance.confirmButtonLoading = false;
              done()
              this.getOperationPlan()
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

    dialogDestry(str){
      this.$message({
        type: 'info',
        message: '已取消'+str
      });
    },

  }
}
</script>

