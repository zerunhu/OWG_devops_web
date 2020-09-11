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

    <el-row style="margin-top: 10px">
        <el-table :data="TagList" border fit highlight-current-row  style="width: 100%" >
          <el-table-column label="镜像名称" align="center" width="200">
            <template > {{ value }} </template>
          </el-table-column>
          <el-table-column label="tag" align="center" width="160">
            <template slot-scope="scope"> {{ scope.row.tag }} </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="240">
            <template slot-scope="scope"> {{ scope.row.create_time }}</template>
          </el-table-column>
          <el-table-column label="ecr_address" align="center" width="400">
            <template slot-scope="scope"> {{ scope.row.ecr_address }} </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template>
                <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-row>
  </div>
</template>
<script>
import { GetEcrImages,GetEcrTags } from '@/api/ci/ecr'
export default {
  data() {
    return {
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
      GetEcrTags(this.value)
        .then(response => {
          this.TagList = response
          this.isloading = false
      }, response => {
        this.$message('请求失败');
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
