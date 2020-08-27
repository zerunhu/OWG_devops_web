<template>
  <div class="home move" >
    <el-row display="margin-top:10px">
      <el-select v-model="value" placeholder="请选择镜像名称">
        <el-option
          v-for="item in ImageList"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" @click="GetEcrTags()" :loading=isloading style="margin-left:10px">查询版本</el-button>
    </el-row>

    <el-row>
        <el-table :data="TagList" style="width: 100%" >
          <el-table-column label="镜像名称" min-width="50">
            <template > {{ value }} </template>
          </el-table-column>
          <el-table-column label="tag" min-width="50">
            <template slot-scope="scope"> {{ scope.row.tag }} </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="50">
            <template slot-scope="scope"> {{ scope.row.create_time }}</template>
          </el-table-column>
          <el-table-column label="作者" min-width="50">
            <template slot-scope="scope"> {{ scope.row.auther }}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" fixed="right">
            <template>
                <el-button size="medium" type="primary">编辑</el-button>
                <el-button size="medium" type="primary">详情</el-button>
                <el-button size="medium" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-row>
  </div>
</template>
<script>
import { GetEcrImages,GetEcrTags } from '@/api/ecr'
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
    getCookie (name) {
      var value = '; ' + document.cookie
      var parts = value.split('; ' + name + '=')
      if (parts.length === 2) return parts.pop().split(';').shift()
    },
    GetEcrImages() {
      GetEcrImages()
        .then(response => {
          this.ImageList = response
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
