<template>
  <div class="home move" >
    <el-row>
        <el-table :data="svnInfo" style="width: 100%" >
          <el-table-column label="编号" min-width="40">
            <template slot-scope="scope"> {{ scope.row.num  }} </template>
          </el-table-column>
          <el-table-column label="提交人" min-width="40">
            <template slot-scope="scope"> {{ scope.row.commiter }} </template>
          </el-table-column>
          <el-table-column label="时间" min-width="120">
            <template slot-scope="scope"> {{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column label="行数" min-width="30">
            <template slot-scope="scope"> {{ scope.row.line }}</template>
          </el-table-column>
          <el-table-column label="提交信息" min-width="100">
            <template slot-scope="scope"> {{ scope.row.commit_message }}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="80" fixed="right">
            <template>
                <el-button size="medium" type="primary">编辑</el-button>
                <el-button size="medium" type="primary">详情</el-button>
                <!-- <el-button size="medium" type="danger">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
    </el-row>
  </div>
</template>
<script>
import { getSvnInfo } from '@/api/svn'
export default {
  data() {
    return {
      svnInfo:[],
    }
  },
  mounted: function () {
    this.getSvnInfo()
  },
  methods:{
          // getCookie (name) {
          //   var value = '; ' + document.cookie
          //   var parts = value.split('; ' + name + '=')
          //   if (parts.length === 2) return parts.pop().split(';').shift()
          // },
          getSvnInfo() {
              getSvnInfo()
                .then(response => {
                  this.svnInfo = response
                  // console.log(this.bookList);
              }, response => {
                  console.log(response);
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
</style>>
