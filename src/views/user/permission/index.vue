<template>
  <div class="app-container">
    <el-button type="primary" size="small"  @click="dialogVisible = true;getGroups()" v-if="checkPermission(['PERMISSION_CREATE'])">New Permission</el-button>

    <el-table :data="permissionList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Type" width="220">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Name" width="320">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Desc">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="deletePermission(scope.row)" v-if="checkPermission(['GROUPS_DELETE'])">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="'New Permission'" :closeOnClickModal=false :showClose=false>
      <el-form :model="permission" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="permission.name" placeholder="Permission Name" />
        </el-form-item>
        <el-form-item label="Type">
          <el-input v-model="permission.type" placeholder="Permission Type" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input v-model="permission.desc" placeholder="Permission Desc" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="CancelAdd">Cancel</el-button>
        <el-button type="primary" @click="addPermission">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPermission, deletePermission, addPermission } from '@/api/user/permission'
import checkPermission from '@/utils/permission'
export default {
  data() {
    return {
      permissionList: [],
      dialogVisible: false,
      permission: {
        name: "",
        desc: "",
        type: "",
      },
    }
  },
  created() {
    this.getPermission()
  },
  methods: {
    checkPermission(roles){
        return checkPermission(roles)
    },
    getPermission() {
      getPermission()
        .then(response => {
          this.permissionList = response
      }, response => {
        console.log(response);
      });
    },

    addPermission() {
      addPermission({"permission":this.permission})
        .then(response => {
          this.getPermission()
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

    deletePermission(row) {
        this.$confirm('此操作将永久删除该Permission, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePermission({"permission_id":row.id})
          .then(response => {
            this.getPermission()
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
