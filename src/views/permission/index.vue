<template>
  <div class="app-container">
    <el-button type="primary" @click="dialogVisible = true">New Role</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Role Key" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="$router.push({path:'role/'+scope.row.id})">Detail</el-button>
          <el-button type="danger" size="small" @click="deleteRole(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="addRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, addRole, deleteRole } from '@/api/permission/role'

export default {
  data() {
    return {
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      role: {
        name: "",
      },
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    getRoles() {
      getRoles()
        .then(response => {
          this.rolesList = response
      }, response => {
        console.log(response);
      });
    },
    addRole() {
      addRole({"name": this.role.name})
        .then(response => {
          this.getRoles()
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

    deleteRole(row) {
        this.$confirm('此操作将永久删除该Role, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(row.id)
          .then(response => {
            this.getRoles()
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
