<template>
  <div class="app-container" >
    <el-row>
        <el-table :data="svnInfo" border fit highlight-current-row style="width: 100%" >
          <el-table-column label="编号" align="center" min-width="100px">
            <template slot-scope="scope"> {{ scope.row.num  }} </template>
          </el-table-column>
          <el-table-column label="提交人" align="center" min-width="120px">
            <template slot-scope="scope"> {{ scope.row.commiter }} </template>
          </el-table-column>
          <el-table-column label="时间" align="center" min-width="360px">
            <template slot-scope="scope"> {{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column label="行数" align="center" min-width="100px">
            <template slot-scope="scope"> {{ scope.row.line }}</template>
          </el-table-column>
          <el-table-column label="提交信息" align="center" min-width="400px">
            <template slot-scope="scope"> {{ scope.row.commit_message }}</template>
          </el-table-column>
          <el-table-column label="操作"  align="center" min-width="200px">
            <template>
                <el-button type="primary" size="small" icon="el-icon-edit">
                  Edit
                </el-button>
                <!-- <el-button type="danger" size="small" icon="el-icon-delete">
                  Delete
                </el-button> -->
            </template>
          </el-table-column>
        </el-table>
    </el-row>
    <!-- <el-pagination style="margin-top:20px;margin-left:10px"
      background
      layout="total, prev, pager, next"
      :hide-on-single-page="pageVisible"
      :current-page.sync="listQuery.page"
      :total="pageTotal"
      @current-change="test()"
      >
    </el-pagination> -->
  </div>
</template>
<script>
import { getSvnInfo } from '@/api/ci/svn'
import Pagination from '@/components/Pagination'
export default {
  data() {
    return {
      // pageVisible: false,
      svnInfo:[],
      // pageTotal: 50,
      // listQuery: {
        // page: 2,
        // limit: 10,
      // },
    }
  },
  mounted: function () {
    this.getSvnInfo()
  },
  methods:{
    // test(){
    //   console.log(this.listQuery.page)
    // },
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

