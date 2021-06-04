<template>
  <div class="app-container">
    <el-row style="float:right;margin-bottom: 5px;margin-right:25px;">
      <el-button size="medium" type="primary" icon="el-icon-copy-document" @click="updateGroupPermission()" style="height:40px;" >Update</el-button>
    <!-- v-if="checkPermission(['GROUP_PERMISSION_UPDATE'])" -->
    </el-row>  
    <el-table :data="permissionList" style="width: 100%;margin-top:30px;" border stripe>

      <el-table-column align="center"  label="Model name" width="220">
        <template slot-scope="scope">
          {{ scope.row.model }}
          <el-checkbox v-model="scope.row.checkAll" @change="handleCheckAllChange($event,scope.row.permission)" style="float:right"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column header-align="center" label="Permission name">
        <template slot-scope="scope">
          <el-checkbox-group v-model="checkedbox">
            <el-checkbox style="width:300px" v-for="p in scope.row.permission" :label="p.id" :key="p.id" @change="handleCheckedChange(scope.row)">{{p.name}}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { updateGroupPermission, getGroupPermission } from '@/api/user/group'
import checkPermission from '@/utils/permission'
export default {
  data() {
    return {
      permissionList: [], 
      group_id: this.$route.params.id,
      checkedbox: [1, 2],
      isIndeterminate: true,
      // checkAll: true,
    }
  },
  created() {
    this.getGroupPermission()
  },
  methods: {
    checkPermission(roles){
        return checkPermission(roles)
    },
    handleCheckAllChange(val,permission) {
      if (val == true){
          permission.forEach(element => {
              if (this.checkedbox.indexOf(element.id) == -1){
                  this.checkedbox.push(element.id)
              }
          });
      }else {
          permission.forEach(element => {
              if (this.checkedbox.indexOf(element.id) != -1){
                  const index = this.checkedbox.indexOf(element.id)
                  this.checkedbox.splice(index, 1)
              }
          });
      }
    },
    handleCheckedChange(row) {
        row.checkAll = this.checkisAll(row)
    },
    checkisAll(v){
      for(var i=0;i<v.permission.length;i++ ){
        if (this.checkedbox.indexOf(v.permission[i].id) == -1) {
          return false
        }
      }
      return true
    },
    getGroupPermission() {
      getGroupPermission(this.group_id)
        .then(response => {
          this.checkedbox = response.has_permission
          this.permissionList = response.all_permission.map(v =>{
              if (this.checkisAll(v)){
                this.$set(v,"checkAll", true)
              }else{
                this.$set(v,"checkAll", false)
              }
              return v
            })
      }, response => {
        console.log(response);
      });
    },
    updateGroupPermission() {
      updateGroupPermission({"group_id":this.group_id, "permission": this.checkedbox})
        .then(response => {
          this.getGroupPermission()
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          console.log(response);
      }, response => {
        console.log(response);
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
