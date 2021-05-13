<template>
  <div class="app-container">
    <el-button type="primary" @click="dialogVisible = true" v-if="checkPermission(['GROUPS_CREATE'])">New Group</el-button>

    <el-table :data="groupList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Group Name" width="220">
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
          <el-button type="primary" size="small" @click="beforeEdit(scope.row)" v-if="checkPermission(['GROUPS_UPDATE'])">编辑</el-button>
          <el-button type="primary" size="small" @click="$router.push({path:'group/'+scope.row.id})" v-if="checkPermission(['GROUP_USER_LIST'])">用户</el-button>
          <el-button type="primary" size="small" @click="$router.push({path:'group/permission/'+scope.row.id})" v-if="checkPermission(['GROUPS_UPDATE'])">权限</el-button>
          <el-button type="danger" size="small" @click="deleteGroup(scope.row)" v-if="checkPermission(['GROUPS_DELETE'])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="'New Group'">
      <el-form :model="group" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="group.name" placeholder="Group Name" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="addGroup">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editDialogVisible" :title="'Permission'">
      <el-form :model="permission" label-width="100px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="permission.group_name" placeholder="Group Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="permission.group_desc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="editDialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="editGroup">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGroups, addGroup, deleteGroup, editGroup } from '@/api/user/group.js'
import checkPermission from '@/utils/permission'

export default {
  data() {
    return {
      groupList: [],
      dialogVisible: false,
      editDialogVisible: false,
      dialogType: 'new',
      group: {
        name: "",
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      permission: {
        id: "",
        group_name: "",
        group_desc: "",
      },
    }
  },
  created() {
    this.getGroups()
  },
  methods: {
    checkPermission(roles){
        return checkPermission(roles)
    },
    getGroups() {
      getGroups()
        .then(response => {
          this.groupList = response
      }, response => {
        console.log(response);
      });
    },
    addGroup() {
      addGroup({"group": this.group})
        .then(response => {
          this.getGroups()
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
    beforeEdit(row){
      this.permission.id=row.id;
      this.permission.group_name=row.name
      this.permission.group_desc=row.desc
      this.editDialogVisible=true;
    },
    editGroup() {
      editGroup({"group_id":this.permission.id,"group_name": this.permission.group_name,"group_desc":this.permission.group_desc})
        .then(response => {
          this.getGroups()
          this.editDialogVisible = false
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          console.log(response);
      }, response => {
        console.log(response);
      });
    },

    deleteGroup(row) {
        this.$confirm('此操作将永久删除该Group, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGroup({"group_id":row.id})
          .then(response => {
            this.getGroups()
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
