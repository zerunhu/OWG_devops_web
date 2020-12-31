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
    <el-row style="float:right;margin-top: 15px;margin-right:25px;"  v-if="value!=''">
        <el-button size="medium" type="primary" icon="el-icon-copy-document" v-if="checkPermission(['admin','Operation'])" @click="dialogCreateFormVisible=true" style="height:40px;" >{{ create_Value }}</el-button>
    </el-row>
    <el-row style="float:right;margin-top: 15px;margin-right:35px;"  v-if="value=='firestrike-oregon-prod-2'">
        <el-button size="medium" type="primary" icon="el-icon-upload" @click="dialogUploadVisible=true" v-if="checkPermission(['admin','Operation']) && paneActiveName=='world'" style="height:40px;">serverlist</el-button>
    </el-row>
    <el-tabs style="margin-top: 10px" type="card" v-model="paneActiveName" @tab-click="handleClick">
      <el-tab-pane label="world" name="world"></el-tab-pane>
      <el-tab-pane label="global" name="global"></el-tab-pane>
    </el-tabs>
    <el-row style="margin-top: -16px">
        <el-table :data="tableDataList" border fit highlight-current-row style="width: 100%" >
          <el-table-column label="name" align="center" min-width="100px">
            <template slot-scope="scope"> {{ scope.row.name  }} </template>
          </el-table-column>
          <!-- <el-table-column label="cluster" align="center" min-width="200px">
            <template> {{ value }} </template>
          </el-table-column> -->
          <el-table-column label="create_time" align="center" min-width="120px">
            <template slot-scope="scope"> {{ scope.row.create_time.split(".")[0] }}</template>
          </el-table-column>
          <el-table-column label="update_time" align="center" min-width="120px">
            <template slot-scope="scope"> {{ scope.row.update_time.split(".")[0] }} </template>
          </el-table-column>
          <el-table-column label="image_tag" align="center" min-width="100px">
            <template slot-scope="scope"> {{ scope.row.image_tag }} </template>
          </el-table-column>
          <el-table-column label="healthy_check" align="center" min-width="100px">
            <template slot-scope="scope">
              <el-tag :type="scope.row.healthy === 'Healthy' ? 'success' : 'info'">
                {{ scope.row.healthy }}
              </el-tag>
              <el-tooltip class="item" effect="dark" content="get world healthy" placement="top">
                <a :class="scope.row.healthy_class" @click="GetWorldStatus(scope.row)"></a>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="port_open" align="center" min-width="100px" v-if="checkPermission(['admin','Operation']) && value=='firestrike-oregon-prod-2'">
            <template slot-scope="scope">
              <el-tag :type="scope.row.port_open === true ? 'success' : 'info'">
                {{ scope.row.port_open === true ? 'open' : 'close' }}
              </el-tag>
              <el-tooltip class="item" effect="dark" :content="scope.row.port_open === true ? 'forcing players offline and close port':'open port'" placement="top">
                <a :class="scope.row.port_open === true ? scope.row.port_open_class : scope.row.port_close_class" @click="ConfirmPortOpen(scope.row)"></a>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="400px">
            <template slot-scope="scope">
              <el-button size="small" type="primary" icon="el-icon-chat-line-square" @click="getHistory(scope.row.id)">History</el-button>
              <el-button size="small" type="warning" icon="el-icon-odometer" v-if="checkPermission(['admin','Operation'])" @click="updateDialog(scope.row)">Upgrade</el-button>
              <el-button size="small" type="warning" icon="el-icon-refresh-left" v-if="checkPermission(['admin','Operation']) && paneActiveName=='world'" @click="dialogRestartFormVisible=true;restart_world_id=scope.row.id">Restart</el-button>
              <el-button size="small" type="warning" icon="el-icon-document-copy" v-if="checkPermission(['admin','Operation']) && paneActiveName=='world'" @click="backupConfirm(scope.row)">Backup</el-button>
              <el-button size="small" type="danger" icon="el-icon-delete" v-if="checkPermission(['admin']) && paneActiveName=='world'" @click="deleteConfirm(scope.row)">Delete</el-button>
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
        <el-button @click="dialogCreateFormVisible = false; dialogDestry('创建操作')">取 消</el-button>
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
        <el-button @click="dialogUpdateFormVisible = false; dialogDestry('更新操作')">取 消</el-button>
        <el-button type="primary" @click="updateWorld()">确认</el-button>
      </div>
    </el-dialog>
    <!-- history dialog、 -->
    <el-dialog title="World History" :visible.sync="dialogHistoryFormVisible" width="40%" :closeOnClickModal=false>
      <el-table :data="HistoryList" style="width: 100%">
        <el-table-column label="revision" align="center" min-width="80px">
          <template slot-scope="scope"> {{ scope.row.revision }} </template>
        </el-table-column>
        <el-table-column label="image_tag" align="center" min-width="180px">
          <template slot-scope="scope"> {{ scope.row.image_tag }} </template>
        </el-table-column>
        <el-table-column label="update_time" align="center" min-width="180px">
          <template slot-scope="scope"> {{ scope.row.update_time }} </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- restartapp dialog、 -->
    <el-dialog title="World Restart App" :visible.sync="dialogRestartFormVisible" width="40%" :closeOnClickModal=false>
      <div style="margin: -15px 0 20px 0;font-size:15px;">请选择需要重启的应用，请不要在不确定的情况下选择重启redis</div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedApps" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="app in apps" :label="app" :key="app">{{app}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer" style="margin-top: -15px;">
        <el-button @click="dialogRestartFormVisible = false; dialogDestry('重启操作')">取 消</el-button>
        <el-button type="primary" :loading=isRestartLoading @click="RestartApp()">确认</el-button>
      </div>
    </el-dialog>
    <!-- serverlist update dialog -->
    <el-dialog title="Update ServerList" :visible.sync="dialogUploadVisible" width="40%">
      <el-upload
        class="upload-demo"
        ref="upload"
        action=""
        :before-upload="beforePicUpload"
        :auto-upload="false"
        :file-list="fileList">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip" style="font-size:16px;margin-top:10px;">只能上传文件，且不超过1mb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer"  style="margin-top: -15px;">
        <router-link style="margin-right:15px" :to="{path:'/deploy/world/serverlist/',query:{cluster_name:this.value}}"><el-button type="primary">在线编辑</el-button></router-link>
        <el-button type="primary" :loading=isUploadLoading @click="submitUpload">Update</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import { getCluster,getWorld,createWorld,getImages,updateWorld,deleteWorld,GetRealLog,DeleteRealLog,GetWorldStatus,getHistory,RestartApp,BackupRedis,UpdateSecurityGroup,UpdateServerList } from '@/api/cd/world.js'
import store from '@/store'
import checkPermission from '@/utils/permission'
export default {
  data() {
    return {
      fileList: [],
      checkedApps: ['map', 'stateless', 'center', 'gate', 'logic'],
      apps: ['map', 'stateless', 'center', 'gate', 'logic', 'redis'],
      isIndeterminate: true,
      checkAll: false,
      restart_world_id: "",
      paneActiveName: "world",
      create_Value: "New world",
      ClusterList: "",
      HistoryList: "",
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
      dialogUpdateFormVisible: false,
      dialogHistoryFormVisible: false,
      dialogRestartFormVisible: false,
      isRestartLoading: false,
      dialogUploadVisible: false,
      isUploadLoading: false,
      isSecurityGroupLoading: false,
    }
  },
  mounted: function () {
    this.getCluster()
  },
  methods: {
    //check permission to tab
    checkPermission(roles){
      if ( this.value.indexOf("dev") == -1 ){
        return checkPermission(roles)
      }else{
        return true
      }
    },

    //get cluster prod/dev
    getCluster(){
      getCluster()
        .then(response => {
            this.ClusterList = response
        }, response => {
            console.log(response);
        }) 
    },

    //switch world type world/global
    handleClick(tab, event) {
      this.getWorld()
      this.create_Value = "New "+this.paneActiveName
      this.createForm.label_name = this.paneActiveName+"_id"
      this.updateForm.label_name = this.paneActiveName+"_name"
    },

    //get world  and set init value 
    getWorld(){
      getWorld(this.value,this.paneActiveName)
        .then(response => {
            this.tableDataList = response.map(v =>{
              this.$set(v,"healthy", "NoData")
              this.$set(v,"healthy_class", "el-icon-refresh-left healthy_stsyle")
              this.$set(v,"port_open_class", "el-icon-open healthy_stsyle" )
              this.$set(v,"port_close_class", "el-icon-turn-off healthy_stsyle")
              return v
            })
        }, response => {
            console.log(response);
        }) 
    },

    //get world status healthy
    GetWorldStatus(row){
      this.$set(row, "healthy_class", "el-icon-loading healthy_stsyle")
      GetWorldStatus(row.id)
        .then(response => {
          this.$set(row,"healthy",response)
          this.$set(row, "healthy_class", "el-icon-refresh-left healthy_stsyle")
        }, response => {
          console.log(response);
          this.$set(row, "healthy_class", "el-icon-refresh-left healthy_stsyle")
      })
    },
     
    //create world
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

    //get images to update 
    getImages(){
      getImages(this.value)
        .then(response => {
          this.ImageList=response 
        }, response => {
          console.log(response);
        }) 
    },
    //update world 
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

    //get world update history
    getHistory(pk){
      this.dialogHistoryFormVisible = true
      getHistory(pk)
        .then(response => {
            this.HistoryList = response
        }, response => {
            console.log(response);
        }) 
    },

    //delete world
    deleteConfirm(row) {
      this.$prompt('请确认你要删除的world_id,例如要删除firestrike-world1请输入1', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValidator: (value) => {
          if (row.name.split("firestrike-world")[1] == value){
            return true
          }else{
            return "world_id不匹配"
          }
        },
      }).then(({value}) => {
        this.deleteWorld(row.id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除操作'
        });
      });
    },
    deleteWorld(pk){
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


    //backup redis data and mkdir bak dir
    backupConfirm(row) {
      this.$prompt('请确认服务器已经对外停止工作！备份操作将关闭所有应用并暂停数据库！ 请输入需要更新的服务器名称确认备份。 ', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValidator: (value) => {
          if (row.name == value){
            return true
          }else{
            return "world_name不匹配"
          }
        },
      }).then(() => {
        this.BackupRedis(row.id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消备份操作',
        });
      });
    },
    BackupRedis(pk){
      this.dialogRealLogVisible = true,
      this.path = '/tmp/world_bakcup.log',
      BackupRedis(pk)
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

    //check restart app select checkbox 
    handleCheckAllChange(val) {
      this.checkedApps = val ? this.apps : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.apps.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.apps.length;
    },
    //restart world app
    RestartApp(){
      this.isRestartLoading = true,
      RestartApp(this.restart_world_id,{"apps": this.checkedApps})
      .then(response => {
          this.isRestartLoading = false,
          this.dialogRestartFormVisible = false,
          this.$message({
            type: 'success',
            message: '重启成功'
          });
          console.log(response);
      }, response => {
          console.log(response);
      }) 
    },

    /// update serverlist
    beforePicUpload (file) {
      console.log("3333333333333333333333333")
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 1MB!')
        return false
      }
      console.log("4444444444444444444444444")
      var data = new FormData();
      data.append('file', file);
      data.append('cluster', this.value);
      //这里是我将file作为参数传给了我的接口
      UpdateServerList(data)
        .then(response => {
          if (response.data.status == 500){
            this.$message({
              type: 'error',
              message: response.data.message
            });
          }else{
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          }
          this.isUploadLoading=false
          this.dialogUploadVisible=false
          console.log(response);
      }, response => {
        this.isUploadLoading=false
        this.dialogUploadVisible=false
        console.log(response);
      });
      return false
    },
    submitUpload() {
      console.log(this.fileList)
      if (this.fileList == 0){
        this.$message({
          type: 'error',
          message: '请选择文件'
        });
        return false
      }
      this.isUploadLoading = true
      this.$refs.upload.submit();
    },
    
    //open/close security group
    ConfirmPortOpen(row){
      this.$prompt('请确认服务器需要'+ (row.port_open=== true ?'关闭':'开启')+'此服务器的aws对外映射端口！ 请输入需要更新的服务器名称确认关闭。 ', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValidator: (value) => {
          if (row.name == value){
            return true
          }else{
            return "world_name不匹配"
          }
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {    
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            this.Update_security_group(row,instance,done)
          } else {
            this.$message({
            type: 'info',
            message: '已取消更新'
            });
            done();
          }
        }
      })
    },
    Update_security_group(row,instance,done){
      UpdateSecurityGroup(row.id,{"port_open": !row.port_open})
      .then(response => {
          if (response.status == 500){
            this.$message({
              type: 'error',
              message: response.message
            });
          }else{
            this.$set(row,"port_open",!row.port_open)
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          }
          instance.confirmButtonLoading = false;
          done();
          console.log(response);
      }, response => {
          console.log(response);
      }) 
    },

    //get reallog data from logfile
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
    //destry RealLog dialog
    destry() { 
      this.dialogRealLogVisible = false,
      DeleteRealLog({ path: this.path })
      this.dialog_data="loading..."
      clearInterval(this.timer)
      this.getWorld()
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
.healthy_stsyle{
  font-size: 20px;
  /* color:blue; */
  position: relative;
  top:3px;
  left: 10px;
}
</style>>
