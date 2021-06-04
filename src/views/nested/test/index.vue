<template>
  <div class="block">
    <span class="demonstration">默认</span>
    <el-date-picker
      v-model="value1"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
    <el-button type="primary" @click="updateWorld()">确认</el-button>
  </div>

</template>

<script>
import { test } from '@/api/test'
  export default {
    data() {
      return {
        value1: "2021-06-04T09:00:00.000Z"
      }
    },

    methods: {
      updateWorld() {
      test( { time: new Date( this.value1 ).getTime()/1000 }) 
        .then(response => {
          console.log(response);
      }, response => {
          console.log(response);
      }) 
    },
    }
  }
</script>