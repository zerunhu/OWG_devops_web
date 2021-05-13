<template>
  <div class="app-container">
    <el-button type="primary" @click="dialogVisible = true; getAllusers()" v-if="checkPermission(['GROUP_USER_CREATE'])">New User</el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="User name" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="User email" width="220">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="User phone">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="deleteUser(scope.row)" v-if="checkPermission(['GROUPS_DELETE'])">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="'New User'">
      <el-form :model="user" label-width="80px" label-position="left">
        <!-- <el-form-item label="Name">
          <el-input v-model="user.name" placeholder="User Name" />
        </el-form-item> -->

        <el-form-item label="Name" label-width="80px">
          <el-select style="width:220px;" filterable  v-model="user.name" placeholder="请选择用户">
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="addUser">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, deleteUser, addUser, getAllusers } from '@/api/user/group'
import checkPermission from '@/utils/permission'
export default {
  data() {
    return {
      userList: [],  //用户列表显示
      users: [],  //选用户时 读取的所有用户
      dialogVisible: false,
      Role_id: this.$route.params.id,
      user: {
        name: "",
        id: "",
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
    getAllusers(){
      getAllusers()
        .then(response => {
          this.users = response
          console.log(this.users)
      }, response => {
        console.log(response);
      });
    },
    getUser() {
      getUser(this.Role_id)
        .then(response => {
          this.userList = response
      }, response => {
        console.log(response);
      });
    },
    addUser() {
      addUser({"user_name":this.user.name,"group_id":this.Role_id})
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
        this.$confirm('此操作将把该用户从这个组移除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser({"user_name":row.name,"group_id":this.Role_id})
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
          console.log(555)
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
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
