<template>
<div>
  <h1>welcome to vuexms</h1>
  <!-- <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>用户信息</span>
      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div>
    <div class="text item">
      昵称：{{ userinfo.username }}
    </div>
    <div class="text item">
      真实姓名：{{ userinfo.realname }}
    </div>
    <div class="text item">
      证件编号：{{ userinfo.idType }}
    </div>
  </el-card> -->
</div>
</template>

<script>
// 引入 mapState
import {mapState} from 'vuex'

export default {
  data() {
    return {

    }
  },
  computed: {
    // 辅助函数 获取 state 数据
    ...mapState({
      // userinfo: this.$store.state.userinfo
      userinfo: state => state.userinfo
    })
  }
}
</script>

<style>
  h1 {
    display: flex;
    justify-content: center;
    font-size: 35px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
</style>
