<template>
  <div class="app-container">
    <el-button type="primary" @click="dialogVisible = true; getAllusers()">New User</el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="User name" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="User email" width="220">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="User last_name">
        <template slot-scope="scope">
          {{ scope.row.last_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="deleteUser(scope.row)">Delete</el-button>
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
              :key="item"
              :label="item.username"
              :value="item.username">
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
import { getUser, deleteUser, addUser, getAllusers } from '@/api/permission/role'

export default {
  data() {
    return {
      userList: [],  //用户列表显示
      users: [],  //选用户时 读取的所有用户
      dialogVisible: false,
      Role_id: this.$route.params.id,
      user: {
        name: "",
      },
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getAllusers(){
      getAllusers()
        .then(response => {
          this.users = response
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
      addUser(this.Role_id,{"name":this.user.name})
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
          deleteUser(this.Role_id,{"name": row.username})
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
