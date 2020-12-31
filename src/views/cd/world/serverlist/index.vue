<template>
  <div class="app-container" >
    <aside>
      <strong>ServerList Name: </strong>{{ file_name }}
      <br>
      You can 
      <a :href='file_url' target="_blank">click</a>
      to download the latest json file in aws
    </aside>
    <el-row>
        <el-table v-loading="tableloading" :data="serverlist" border fit highlight-current-row style="width: 100%" >
          <el-table-column label="id" align="center" min-width="120px">
            <template slot-scope="scope"> {{ scope.row.id  }} </template>
          </el-table-column>
          <el-table-column label="name" align="center" min-width="150px">
            <template slot-scope="scope"> {{ scope.row.name }} </template>
          </el-table-column>
          <el-table-column label="ip" align="center" min-width="250px">
            <template slot-scope="scope"> {{ scope.row.ip }} </template>
          </el-table-column>
          <el-table-column label="port" align="center" min-width="150px">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false; dialogDestry('编辑')">取 消</el-button>
        <el-button type="primary" :loading=isUpdateLoading @click="updateServerlistoffline()">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getServerlistoffline,updateServerlistoffline } from '@/api/cd/world'
export default {
  data() {
    return {
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
    }
  },
  mounted: function () {
    this.getServerlistoffline()
  },
  methods:{
    getServerlistoffline() {
      getServerlistoffline(this.$route.query.cluster_name)
        .then(response => {
          this.serverlist = response.serverlist
          this.host_path = response.file
          this.file_name = this.host_path.split("/")[3]
          this.file_url = "https://d3uh30nzjjnhcl.cloudfront.net/"+this.file_name
          this.tableloading = false
          console.log(response);
      }, response => {
          console.log(response);
      });
    },
    editServerlist(row){
      this.dialogEditRow = row
      this.dialogEditFormVisible = true
    },
    updateServerlistoffline() {
      this.isUpdateLoading = true
      updateServerlistoffline({"host_path":this.host_path,"cluster_name":this.$route.query.cluster_name,"serverlist":this.dialogEditRow})
        .then(response => {
          this.dialogEditFormVisible = false
          this.isUpdateLoading = false
          this.$message({
            type: 'success',
            message: '更新成功'
          });
          console.log(response);
      }, response => {
          console.log(response);
      });
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

