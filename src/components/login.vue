<template>
    <div class="login">
      <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
        <h1 class="title">
          vuems-登录
        </h1>
        <el-input type="text" v-model="loginForm.username" autocomplete="off">
          <el-button slot="prepend">账号</el-button>
        </el-input>
        <el-input type="password" v-model="loginForm.password" autocomplete="off">
          <el-button slot="prepend">密码</el-button>
        </el-input>
        <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
      </el-form>
    </div>
</template>

<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } 
        callback();
      };
      return {
        // 登录表单的数据
        loginForm: {
          username: '',
          password: '',
        },
        // 验证规则
        rules: {
          username: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }, ],
          password: [{
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 保留this
            let _this = this
            // console.log(this.loginForm.username, this.loginForm.password)
            // console.log(this.axios)
            // 收集到数据后发送给后台
            this.axios.post('/api/checklogin', {
              username: _this.loginForm.username,
              password: _this.loginForm.password
            })
            .then(response => {
              if(response.data.length) {
                console.log('接收后端响应的数据', response.data[0].username)
                
                // 把当前用户数据存入 state
                _this.$store.commit('SAVE_USERINFO', response.data[0])

                _this.$message({
                  message: '恭喜你，登录成功！',
                  type: 'success'
                })

                // 跳转到首页
                _this.$router.push('/')
              }else {
                _this.$message.error('请检查用户名或密码')
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  html,
  body{
    height: 100%;
  }

  .login {
    width: 100%;
    background: url(../assets/img/login-bg.jpg) no-repeat;
    background-size: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .el-form .title {
    font-size: 22px;
    color: #fff;
    padding-bottom: 50px;
  }

  .el-form {
    display: block;
    margin: 100px auto 0;
    width: 400px;
    height: 260px;
    padding: 50px  20px 50px 20px;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .el-form .el-input {
    margin-bottom: 20px;
  }

  .el-form > .el-button{
    display: block;
    margin: 10px auto;
    width: 80%;
  }
  

  .el-message {
    top: 15%;
  }
</style>
