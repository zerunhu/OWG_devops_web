<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Publish
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          Draft
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
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
    <el-button size="medium" type="primary" @click="pushData()">编辑</el-button>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import { Fileedit,Filepush } from '@/api/file'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  id: undefined,
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
      // console.log(this.postForm.content)
      Filepush(this.$route.params.id,{'content':this.postForm.content})
        .then(response => {
          console.log(response)
      }, response => {
        console.log(response);
      });
    },
    Fileedit(pk) {
      Fileedit(pk)
        .then(response => {
          this.postForm.content = response.message
          console.log(this.postForm.content)
      }, response => {
        console.log(response);
      });
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.p-hh p{
  margin:0px;
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
