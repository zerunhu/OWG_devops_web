<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
                <el-button size="medium" type="success" class="edit_pos" :loading=pushLoading @click="pushData()">Publish</el-button>
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                Title
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import { Fileedit,Filepush } from '@/api/file'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
}
export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput },
  data() {
    return {
      postForm: {
        title: "",
        content: "",
      },
      pushLoading: false,
      loading: false,
      userListOptions: [],
      tempRoute: {}
    }
  },
  mounted: function () {
    this.Fileedit(this.$route.params.id)
  },
  methods: {
    pushData() {
      this.pushLoading = true
      Filepush(this.$route.params.id,{'content':this.postForm.content})
        .then(response => {
          this.pushLoading = false
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          console.log(response)
      }, response => {
        console.log(response);
      });
    },
    Fileedit(pk) {
      Fileedit(pk)
        .then(response => {
          this.postForm.content = response.message.content
          this.postForm.title = response.message.title
          console.log(this.postForm.content)
      }, response => {
        console.log(response);
      });
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.edit_pos{
  position: absolute;
  right: 10px;
}
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
