<template>
<div>
    <el-row>
        <el-table :data="bookdetail" style="width: 100%" >
          <el-table-column label="编号" min-width="100">
            <template slot-scope="scope"> {{ scope.row.id  }} </template>
          </el-table-column>
          <el-table-column label="书名" min-width="100">
            <template slot-scope="scope"> {{ scope.row.name }} </template>
          </el-table-column>
          <el-table-column label="作者" min-width="100">
            <template slot-scope="scope"> {{ scope.row.auther }}</template>
          </el-table-column>
          </el-table>
    </el-row>
</div>
</template>
<script>
import { detailBook } from '@/api/book'
    export default {
      data(){
        return{
          bookdetail:[], 
        }
      },
      mounted: function () {
        this.getDetail(this.$route.params.id)
      },
      methods: {
      getDetail(id){
          detailBook(id)
        // this.$axios.get(
        //     '/api/books/'+id+'/')
            .then(response => {
              this.bookdetail=response.book
              console.log(response);
              console.log(this.bookdetail);
          }, response => {
              console.log(response);
          });
      },
    },
    }

</script>

<style scoped>

</style>
