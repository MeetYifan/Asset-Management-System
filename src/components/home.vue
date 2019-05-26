<template>
<div>
  <h1 class="welcome">welcome to vuexms</h1>
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
  .welcome {
    display: flex;
    justify-content: center;
    font-size: 35px;
    margin-top: 16rem;
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
