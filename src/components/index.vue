<template>
  <div class="index">
    <el-container style="border: 1px solid #eee">
      <el-aside style="width: 201px;">
        <el-menu :default-active="onRoutes" active-text-color="#20a0ff" unique-opened router>
          <el-menu-item index="/home" class="home">
            <span>主 页</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>资产管理</template>
              <el-menu-item index="assetslist">资产列表</el-menu-item>
              <el-menu-item index="addasset">资产入库</el-menu-item>
              <el-submenu index="1-3" >
                <template slot="title">记录</template>
                <el-menu-item index="repair">维修记录</el-menu-item>
                <el-menu-item index="usage">领用归还记录</el-menu-item>
              </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>分析报表</template>
                <el-menu-item index="assetsinfo">资产信息</el-menu-item>
              <el-menu-item index="depreciation">折旧信息</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>员工管理</template>
            <el-menu-item index="personal">个人信息</el-menu-item>
            <el-menu-item index="staff">员工信息</el-menu-item>
            <el-menu-item index="addstaff">添加员工</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      
      <el-container>
        <el-header style="text-align: right; font-size: 12px; height: 40px;">
          <el-dropdown>
            <div style="cursor: pointer; color: #fff;">
              <i class="el-icon-setting" style="margin-right: 5px"></i>
              <span >{{ username }}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="commond('personal')">个人信息</el-dropdown-item>
              <el-dropdown-item @click.native="commond('logout')">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>  
</template>

<script>
  import bus from './common/bus';
  var echarts = require('echarts');

  export default {
    data(){
      return{
      }
    },
    computed: {
      username() {
        return this.$store.state.userinfo.username
      },
      nowhref() {
        return window.location.origin
      },
      onRoutes(){
          return this.$route.path.replace('/','');
      }
    },
    methods: {
      commond(com) {
        if(com == 'logout') {
          sessionStorage.removeItem('userinfo')
          // window.location.href = this.nowhref+'/#/login'
          this.$router.push('/login')
        } else if(com == 'personal') {
          this.$router.push('/personal')
        }
      }
    }
  };
</script>

<style>
    .el-container header.el-header {
    background-color: rgba(117, 175, 250, 0.5); 
    color: #fff;
    line-height: 40px;
  }

  body,
  #app,
  .index {
    height: 100%;
  }

  .el-container {
    height: 100%;
  }

  .el-aside {
    color: #333;
    background-color: #fff;
    border-right: solid 1px #e6e6e6;
  }

  .el-menu {
    border-right: none;
  }

  .home {
    text-align: center;
    background-color:#fff;
    font-size: 26px;
    color:#409EFF;
    height: 80px;
  }

  .home span {
    line-height: 80px;
  }

  .home:hover{
    background-color: #ecf5ff;
  }

  .el-header {
    background-color: #ecf5ff;
  }
  
</style>
