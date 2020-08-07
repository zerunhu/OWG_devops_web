<template>
  <div class="home move" >
    <el-row display="margin-top:10px">
        <el-input v-model="bookname" placeholder="请输入书名" style="display:inline-table; width: 30%; float:left"></el-input>
        <el-input v-model="bookauther" placeholder="请输入作者" style="display:inline-table; width: 30%; float:left"></el-input>
        <el-button type="primary" @click="addBook()" style="float:left; margin: 2px;">新增</el-button>
    </el-row>
    <el-row>
        <el-table :data="bookList" style="width: 100%" >
          <el-table-column label="编号" min-width="100">
            <template slot-scope="scope"> {{ scope.row.id  }} </template>
          </el-table-column>
          <el-table-column label="书名" min-width="100">
            <template slot-scope="scope"> {{ scope.row.name }} </template>
          </el-table-column>
          <el-table-column label="作者" min-width="100">
            <template slot-scope="scope"> {{ scope.row.auther }}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
                <el-button size="medium" type="primary" @click="dialogFormVisible = true; putConfirm(scope.row)">编辑</el-button>
                <el-button size="medium" type="primary" @click="detailRoute(scope.row.id)">详情</el-button>
                <el-button size="medium" type="danger" @click="deleteConfirm(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-row>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="form">
        <el-form-item label="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="auther" :label-width="formLabelWidth">
          <el-input v-model="form.auther" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="putbook(); isLoading=true">{{isLoading?"提交中...":"确定"}}</el-button>
      </div>

      </el-dialog>
  </div>
</template>
<script>
import { getBook,addBook,putBook,deleteBook } from '@/api/book'
export default {
  data() {
    return {
      bookname:'',
      bookauther:'',
      bookList:[],
      dialogFormVisible: false,
      form: {
        name: '1',
        auther: '2',
        id:'',
      },
      formLabelWidth: '80px',
      isLoading: false,
    }
  },
  mounted: function () {
    this.getBook()
  },

   methods: {
    detailRoute(id){
      return this.$router.push({
          path:'/nested/menu/'+id,
        })
    },
          putConfirm(row){
            this.form.auther=row.auther,
            this.form.name=row.name,
            this.form.id=row.id
          },
          putbook(){
            putBook(this.form.id,{ name: this.form.name, auther: this.form.auther })
            // this.$axios.put(
            //     '/api/books/'+this.form.id+'/',
            //     "name="+this.form.name+"&auther="+this.form.auther,
            //     {headers: {'X-CSRFToken': this.getCookie('csrftoken')}})
                .then(response => {
                this.dialogFormVisible=false;
                  if(response.res==0){
                    var title = "成功"
                    var data = "更新成功"
                  } else {
                    var title = "失败"
                    var data = response.msg
                  }
                  this.$alert(data, title, {
                  confirmButtonText: '确定',
                  })
                  console.log(response);
                  this.isLoading=false,
                  this.getBook()
              }, response => {
                  this.putRes(response)
                  console.log(response);
              });
          },
          deleteConfirm(pk) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.deleteBook(pk);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },

          getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
          },
          addBook() {
            addBook({ name: this.bookname, auther: this.bookauther })
              // this.$axios.post(
              //   '/api/books/',
              //   "name="+this.bookname+"&auther="+this.bookauther,
              //   // {"name":10,"auther":10},
              //   {headers: {'X-CSRFToken': this.getCookie('csrftoken')}})
                .then(response => {
                  this.createRes(response)
                  console.log(response);
                  this.getBook()
              }, response => {
                  this.createRes(response)
                  console.log(response);
              });
          },
          createRes(data){
            if (data.res==0){
              var title = "成功"
              var data = "创建成功"
            }else {
              var title = "失败"
              var data = data.msg
            }
            this.$alert(data, title, {
            confirmButtonText: '确定',
            callback: action => {
              this.getBook()
            }
            })
          },
          getBook() {
              getBook()
                .then(response => {
                  this.bookList = response
                  this.bookname='',
                  this.bookauther='';
                  // console.log(this.bookList);
              }, response => {
                  console.log(response);
              });
          },
          deleteBook(index){
            deleteBook(index)
            // this.$axios.delete(
            //     '/api/books/'+index+'/')
                .then(response => {
                  this.deleteRes(response)
                  // this.getBook()
                  console.log(response.msg);
              }, response => {
                  console.log(response);
              });
          },
          deleteRes(data){
            if (data.res==0){
              var title = "成功"
              var data = "删除成功"
            }else {
              var title = "失败"
              var data = data.msg
            }
            this.$alert(data, title, {
            confirmButtonText: '确定',
            callback: action => {
              this.getBook()
            }
            })
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
