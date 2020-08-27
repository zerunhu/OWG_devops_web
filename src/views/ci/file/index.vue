<template>
  <div class="components-container move">
    <textarea cols="15" rows="5" v-model="value" ></textarea>
    <div class="editor-container">
      <json-editor ref="jsonEditor" v-model="test" />
    </div>
    
  </div>
</template>

<script>
import { testapi, healapi } from '@/api/ecr'

export default {
  name: 'JsonEditorDemo',
  components: { JsonEditor },
  data() {
    return {
      value: 2,
      test: "",
    }
  },
  mounted: function () {
    this.testapi()
    this.healapi()
  },
  methods:{
    testapi() {
        testapi()
        .then(response => {
            this.value = response.message
        }, response => {
            console.log(response);
        });
    },
    healapi() {
        healapi()
        .then(response => {
            this.test = response.message
        }, response => {
            console.log(response);
        });
    },
  }
}
</script>

<style scoped>
.editor-container{
  position: relative;
  height: 100%;
  width: 50%;
}
.move {
  padding-left: 30px;
  padding-top: 30px;
}
</style>

