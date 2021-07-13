<template>
  <div class="app-container" >
    <aside>
      <strong>ServerList Name: </strong>{{ file_name }}
      <br>
      You can click
      <a :href='file_url' target="_blank">here</a>
      to download the serverlist file in aws
    </aside>
    <!-- <p style="float:left;margin-left:15px">所有修改和添加操作只保存在网页中，只有<b style="color:red">提交后</b>才会更新到aws上 </p> -->
    <p style="float:left;margin-left:15px">All modifications and additions are only saved in the web page, and will be updated to aws only after <b style="color:red">commit</b></p>
    <el-row style="float:right;margin:5px 25px 10px 0;z-index:1000">
      <el-button type="primary" size="medium" icon="el-icon-finished" style="height:40px;" @click="commitConfirm()">Commit</el-button>
      <el-button size="medium" type="primary" icon="el-icon-copy-document" style="height:40px;" @click="dialogCreateFormVisible=true">New Line</el-button>
    </el-row>
    <el-row>
        <el-table v-loading="tableloading" :data="serverlist" border fit highlight-current-row style="width: 100%" :default-sort="{prop: 'id'}">
          <el-table-column label="id" align="center" min-width="80px" sortable prop="id">
            <template slot-scope="scope"> {{ scope.row.id  }} </template>
          </el-table-column>
          <el-table-column label="name" align="center" min-width="150px">
            <template slot-scope="scope"> {{ scope.row.name }} </template>
          </el-table-column>
          <el-table-column label="ip" align="center" min-width="180px">
            <template slot-scope="scope"> {{ scope.row.ip }} </template>
          </el-table-column>
          <el-table-column label="sort" align="center" min-width="120px">
            <template slot-scope="scope"> {{ scope.row.sort }} </template>
          </el-table-column>
          <el-table-column label="port" align="center" min-width="120px">
            <template slot-scope="scope"> {{ scope.row.port }} </template>
          </el-table-column>
          <el-table-column label="realstate" align="center" min-width="100px">
            <template slot-scope="scope"> {{ scope.row.realstate }}</template>
          </el-table-column>
          <el-table-column label="state" align="center" min-width="100px">
            <template slot-scope="scope"> {{ scope.row.state }}</template>
          </el-table-column>
          <el-table-column label="property" align="center" min-width="100px">
            <template slot-scope="scope"> {{ scope.row.property }}</template>
          </el-table-column>
          <el-table-column label="操作"  align="center" min-width="200px">
            <template slot-scope="scope">
                <el-button type="primary" size="small" icon="el-icon-edit" @click="editServerlist(scope.row)">
                  Edit
                </el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-row>
    <!-- edit dialog、 -->
    <el-dialog title="Edit ServerList" :visible.sync="dialogEditFormVisible" width="40%" :closeOnClickModal=false :showClose=false>
      <el-form>
        <el-form-item label="Id" label-width="110px">
          <el-input v-model="dialogEditRow.id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Name" label-width="110px">
          <el-input v-model="dialogEditRow.name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Realstate" label-width="110px">
          <el-input v-model="dialogEditRow.realstate" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="State" label-width="110px">
          <el-select v-model="dialogEditRow.state" placeholder="请选择">
            <el-option
              v-for="item in serverStates"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Property" label-width="110px">
          <el-select v-model="dialogEditRow.property" placeholder="请选择">
            <el-option
              v-for="item in serverProperty"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="overTime" label-width="110px">
          <el-date-picker
            v-model="dialogEditRow.overTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false; dialogDestry('编辑')">取 消</el-button>
        <el-button type="primary" :loading=isUpdateLoading @click="updateServerlist()">更新</el-button>
      </div>
    </el-dialog>
    <!-- add dialog、 -->
    <el-dialog title="New ServerList" :visible.sync="dialogCreateFormVisible" width="40%" :closeOnClickModal=false :showClose=false>
      <el-form :model="createForm">
        <el-form-item label="Id" label-width="110px">
          <el-input v-model="createForm.id" autocomplete="off" @change="createIdchange"></el-input>
        </el-form-item>
        <el-form-item label="Name" label-width="110px">
          <el-input v-model="createForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Port" label-width="110px">
          <el-input v-model="createForm.port" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Ip" label-width="110px">
          <el-input v-model="createForm.ip" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Sort" label-width="110px">
          <el-input v-model="createForm.sort" autocomplete="off" @change="valueIntSort"></el-input>
        </el-form-item>
        <el-form-item label="Realstate" label-width="110px">
          <el-input v-model="createForm.realstate" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="State" label-width="110px">
          <el-select v-model="createForm.state" placeholder="请选择">
            <el-option
              v-for="item in serverStates"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Property" label-width="110px">
          <el-select v-model="createForm.property" placeholder="请选择">
            <el-option
              v-for="item in serverProperty"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateFormVisible = false; dialogDestry('编辑')">取 消</el-button>
        <el-button type="primary" :loading=isCreateLoading @click="addServerlistonline">新 增</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getServerlistonline,updateServerlistonline,getWorldUrl } from '@/api/cd/world'
export default {
  data() {
    return {
      time: '',
      serverlist: [],
      host_path: "",
      file_name: "",
      file_url: "",
      tableloading: true,
      dialogEditFormVisible: false,
      dialogEditRow: "",
      serverStates: [{label: "空闲",value:1},{label: "维护",value:5},{label: "维护(内网可进入)",value:7},{label: "火爆",value:8}],
      serverProperty: [{label: "新服",value:1},{label: "推荐",value:2},{label: "一般",value:3}],
      isUpdateLoading: false,

      //createForm
      dialogCreateFormVisible: false,
      isCreateLoading: false,
      tmpRow: '',
      createForm: {
        id: "",
        sort: "",
        state: "",
        name: "Planet #",
        ip: "填写Id字段后会自动从后台获取ip填充此字段",
        port: 10009,
        property: "",
        realstate: 1,
        overTime: 0,
      },
    }
  },
  mounted: function () {
    this.getServerlistonline()
  },
  methods:{
    getServerlistonline() {
      getServerlistonline(this.$route.query.cluster_name,this.$route.query.serverlist_version)
        .then(response => {
          // if(response.status != 500){
            this.serverlist = response.serverlist
            this.host_path = response.file
            this.file_name = this.host_path.split("/")[3]
            this.file_url = "https://d3uh30nzjjnhcl.cloudfront.net/"+this.file_name
          // }else{
          //   this.$message({
          //     type: 'error',
          //     message: response.message
          //   });
          // }
          this.tableloading = false
          console.log(response);
      }, response => {
          console.log(response);
      });
    },
    clone(obj) {
        var result = Array.isArray(obj) ? [] : {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                    result[key] = this.clone(obj[key]);   //递归复制
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    },
    toLocaleString( time ) {
      if( time ) {
        time = typeof time == 'string' ? time : time.toString();
        if( time.length == 10 ) {
          time = Number( time ) * 1000;
        }
        var cur_time = time ? new Date( time ) : new Date();
        return new Date(cur_time).toISOString()
      }
      return null
    },
    editServerlist(row){
      this.tmpRow = row
      if (!row["overTime"]) {
        row["overTime"] = ''
      }else{
        row["overTime"] = this.toLocaleString(row["overTime"])
      }
      this.dialogEditRow = this.clone(row)
      this.dialogEditFormVisible = true
    },
    updateServerlist() {
      this.dialogEditRow.overTime = new Date( this.dialogEditRow.overTime ).getTime()/1000
      Object.assign( this.tmpRow, this.dialogEditRow)
      this.dialogEditFormVisible = false
    },
    addServerlistonline(){
      this.serverlist.push(this.createForm)
      console.log(this.createForm)
      this.dialogCreateFormVisible = false
    },

    commitConfirm() {
      this.$confirm('此操作将提交到aws, 是否继续?', '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {    
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            updateServerlistonline({"host_path":this.host_path,"cluster":this.$route.query.cluster_name,"serverlist":this.serverlist})
            .then(response => {
              instance.confirmButtonLoading = false;
              done()
              this.$message({
                type: 'success',
                message: '提交成功'
              });
            }, response => {
              instance.confirmButtonLoading = false;
              console.log(response);
            });
          } else {
            this.$message({
            type: 'info',
            message: '已取消提交'
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

    getWorldUrl(pk) {
      console.log(pk)
      getWorldUrl(pk)
        .then(response => {
          if (response.status == 200){
            this.createForm.ip = response.msg
          }else{
            this.createForm.ip = ""
            this.$message({
              type: 'error',
              message: response.msg
            });
          }
      }, response => {
          console.log(response);
      });
    },
    createIdchange(){
      this.createForm.id =  parseInt(this.createForm.id)
      this.getWorldUrl(this.createForm.id)
    },
    valueIntSort(){
      this.createForm.sort =  parseInt(this.createForm.sort)
    },
  }
}
</script>

