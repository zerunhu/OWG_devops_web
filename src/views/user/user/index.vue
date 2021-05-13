<template>
  <div class="app-container">
    <el-button type="primary" @click="beforeCreate()" v-if="checkPermission(['USERS_CREATE'])" >New User</el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="User_name" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Email" width="220">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Group">
        <template slot-scope="scope">
          {{ scope.row.groups }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Last_Login">
        <template slot-scope="scope">
          {{ scope.row.last_login }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="deleteUser(scope.row)" v-if="checkPermission(['USERS_DELETE'])" >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="'New User'" :closeOnClickModal=false :showClose=false>
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="user.name" placeholder="User Name" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="user.email" placeholder="User Email" />
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="user.phone" placeholder="User Email" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input show-password v-model="user.password" placeholder="Password" />
        </el-form-item>
        <el-form-item label="Group" label-width="80px">
          <el-select style="width:220px;" multiple filterable  v-model="user.groups" placeholder="请选择组">
            <el-option
              v-for="item in groups"
              :key="item"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="CancelAdd">Cancel</el-button>
        <el-button type="primary" @click="addUser">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, deleteUser, addUser, getGroups } from '@/api/user/user'
import checkPermission from '@/utils/permission'
export default {
  data() {
    return {
      userList: [],
      groups: [],
      dialogVisible: false,
      user: {
        name: "",
        email: "",
        password: "",
        groups: "",
        phone: "",
      },
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    checkPermission(roles){
        return checkPermission(roles)
    },
    getUser() {
      getUser()
        .then(response => {
          this.userList = response
      }, response => {
        console.log(response);
      });
    },
    getGroups(){
      getGroups()
        .then(response => {
          this.groups = response
      }, response => {
        console.log(response);
      });
    },
    beforeCreate(){
      this.dialogVisible = true;
      this.getGroups();
      this.generatePassword(12)
    },
    addUser() {
      addUser({"user":this.user})
        .then(response => {
          this.getUser()
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          console.log(response);
      }, response => {
        console.log(response);
      });
    },

    deleteUser(row) {
        this.$confirm('此操作将永久删除该User, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser({"pk":row.id})
          .then(response => {
            this.getUser()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            console.log(response);
          }, response => {
            console.log(response);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    CancelAdd(){
        this.dialogVisible=false;
        this.$message({
            type: 'info',
            message: '已取消'
        }); 
    },
    generatePassword(pasLen) {
      var pasArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','_','-','$','%','&','@','+','!'];
      var password = '';
      var pasArrLen = pasArr.length;
      for (var i=0; i<pasLen; i++){
      var x = Math.floor(Math.random()*pasArrLen);
      password += pasArr[x];
      }
      this.user.password = password
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
