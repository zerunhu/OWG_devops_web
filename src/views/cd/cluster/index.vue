<template>
  <div class="app-container" >
    <el-row>
        <el-button size="medium" type="primary" icon="el-icon-download"  @click="createContainer()" style="float:left; margin: 2px;">同步代码</el-button>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <div class="dialogStyle" id="scroll">
        <span class="comment" > {{ result_data }} </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="destryTimer()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
import { testapi } from '@/api/cicontainer.js'
import store from '@/store'
export default {
  data() {
    return {
      timer: "",
      result_data: "b",
      dialogTitle: "",
      dialogVisible: false,
    }
  },

  methods: {
    getData(){
      testapi()
      .then(response => {
            this.result_data = response
            this.$nextTick(() => {   //滚动条最下
            let msg = document.getElementById('scroll') // 获取对象
            msg.scrollTop = msg.scrollHeight // 滚动高度
            })
        }, response => {
            console.log(response);
        })   
    },
    createContainer() {
      this.dialogVisible = true,
      // this.result_data = response.message,
      this.dialogTitle = "正在同步"
      this.timer = setInterval(() => {
          setTimeout(this.getData)
      }, 1000)
    },
    destryTimer() {
      this.dialogVisible = false,
      clearInterval(this.timer)
    },
  }
}
</script>
<style scoped>
.move {
  padding-left: 30px;
  padding-top: 30px;
}
.comment{
    white-space:pre-wrap;
} 
.dialogStyle{
  height: 400px;
  overflow-y:scroll;
  background:black;
  font-size: 16px;
  color: aliceblue;
}
</style>>
