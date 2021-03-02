<template>
  <div class="app-container" >
    <el-row>
      <el-select v-model="value" placeholder="请选择应用名称" @change="GetEcrTags()">
        <el-option
          v-for="item in ImageList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <!-- <el-button type="primary" @click="GetEcrTags()" :loading=isloading style="margin-left:10px">查询版本</el-button> -->
    </el-row>

    <el-tabs style="margin-top: 10px" type="card" v-model="paneActiveName" @tab-click="GetEcrTags()">
      <el-tab-pane label="ap-southeast-1" name="ap-southeast-1"></el-tab-pane>
      <el-tab-pane label="us-west-2" name="us-west-2"></el-tab-pane>
    </el-tabs>
    <el-row style="margin-top: -16px">
        <el-table :data="TagList.slice((currentPage-1)*page_size,currentPage*page_size)" border fit highlight-current-row  style="width: 100%" >
          <el-table-column label="镜像名称" align="center" min-width="200">
            <template > {{ value }} </template>
          </el-table-column>
          <el-table-column label="tag" align="center" min-width="160">
            <template slot-scope="scope"> {{ scope.row.tag }} </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" min-width="240">
            <template slot-scope="scope"> {{ scope.row.create_time }}</template>
          </el-table-column>
          <el-table-column label="ecr_address" align="center" min-width="400">
            <template slot-scope="scope"> {{ scope.row.ecr_address }} </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="200">
            <template>
                <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-left:30%">
          <el-pagination
            :hide-on-single-page=false
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            layout="prev, pager, next"
            :page-size=page_size
            :total="TagList.length">
          </el-pagination>
        </div>
    </el-row>
  </div>
</template>
<script>
import { GetEcrImages,GetEcrTags } from '@/api/ci/ecr'
export default {
  data() {
    return {
      currentPage:1,
      page_size:10,
      paneActiveName: "ap-southeast-1",
      ImageList:[],
      TagList:[],
      value: "",
      isloading: false
    }
  },
  mounted: function () {
    this.GetEcrImages()
  },

  methods: {
    GetEcrImages() {
      GetEcrImages()
        .then(response => {
          this.ImageList = response
          console.log(this.ImageList)
      }, response => {
        console.log(response);
      });
    },
    GetEcrTags() {
      this.isloading=true
      GetEcrTags(this.value, this.paneActiveName)
        .then(response => {
          this.TagList = response
          this.isloading = false
      }, response => {
        this.$message('请求失败');
      });
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val
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
