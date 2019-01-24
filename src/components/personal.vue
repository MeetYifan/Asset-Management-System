<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="show()">保存</el-button> -->
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        width="88%"
      >
        <el-form-item label="昵称" prop="username">
          <el-input
            error
            :class="username ? 'check-error': ''"
            placeholder="请输入昵称"
            v-model="ruleForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input placeholder="请输入真实姓名" v-model="ruleForm.realname"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input
            placeholder="请输入年龄"
            type="age"
            v-model.number="ruleForm.age"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input placeholder="请输入邮箱地址" v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            placeholder="请输入手机号码"
            v-model="ruleForm.phonenumber"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="证件编号" prop="id">
          <el-input disabled v-model="ruleForm.id"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="departments_name">
          <el-input disabled v-model="ruleForm.departments_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
          <el-button @click="resetForm('ruleForm')">还原</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <br>

    <el-card class="box-card" top="20">
      <div slot="header" class="clearfix">
        <span>修改密码</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="show()">保存</el-button> -->
      </div>
      <el-form
        :model="ruleForm_pwd"
        :rules="rules_pwd"
        ref="ruleForm_pwd"
        label-width="100px"
        class="demo-ruleForm_pwd"
        width="88%"
      >
        <el-form-item label="原始密码" prop="password">
          <el-input placeholder="请输入当前密码" type="password" v-model="ruleForm_pwd.password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input placeholder="请输入新密码" type="password" v-model="ruleForm_pwd.newPass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input placeholder="请再次输入新密码" type="password" v-model="ruleForm_pwd.checkPass"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm_pwd('ruleForm_pwd')">更新</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入 mapState
// import {mapState} from 'vuex'
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    var checkAge = (rule, value, callback) => {
      // if (!Number.isInteger(value)) {
      if (value) {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18 || value > 60) {
            callback(new Error("必须在 18-60 岁之间"));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value === this.ruleForm_pwd.password) {
        callback(new Error("新密码不能与之前的密码相同"));
      } else {
        if (this.ruleForm_pwd.checkPass !== "") {
          this.$refs.ruleForm_pwd.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm_pwd.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var checkuep = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入"));
      } else {
        var info = rule.field + ":" + value;
        info = info.split(":");
        // console.log(info);
        if (info[1] == "") return;
        switch (info[0]) {
          case "username":
            info.username = info[1];
            break;
          case "email":
            info.email = info[1];
            break;
          case "phonenumber":
            info.phonenumber = info[1];
            break;
          default:
            break;
        }
        var _this = this;
        this.axios
          .post("/api/checkinfo", {
            username: info.username,
            email: info.email,
            phonenumber: info.phonenumber,
            id: _this.ruleForm.id
          })
          .then(response => {
            if (response.data) {
              response.data = response.data.split(",");
              // console.log(response.data)
              if (response.data[1]) {
                switch (info[0]) {
                  case "username":
                    return callback(new Error("该昵称已被使用"));
                    break;
                  case "email":
                    return callback(new Error("该邮箱已被使用"));
                    break;
                  case "phonenumber":
                    return callback(new Error("该手机号已被使用"));
                    break;
                  default:
                    break;
                }
              } else {
                callback();
              }
            }
          });
      }
    };
    return {
      ruleForm: {},
      ruleForm_pwd: {},
      // startData: {},
      original: {},
      username: false,
      email: false,
      phonenumber: false,
      rules: {
        // username realname age email phonenumber id departments_name
        username: [
          { required: true, message: "请输入您的昵称", trigger: "blur" },
          {
            min: 2,
            max: 14,
            message: "长度在 2 到 14 个字符",
            trigger: "blur"
          },
          { validator: checkuep, trigger: "blur" }
        ],
        realname: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" }
        ],
        age: [{ validator: checkAge, trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          },
          { validator: checkuep, trigger: "blur" }
        ],
        phonenumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "长度为 11 位", trigger: "blur" },
          { validator: checkuep, trigger: "blur" }
        ]
      },
      rules_pwd: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        newPass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          },
          { validator: validatePass, trigger: "blur" }
        ],

        checkPass: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          },
          { validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    // 辅助函数 获取 state 数据
    ...mapState({
      userinfo: state => state.userinfo,
      departmentList: state => state.departmentList
    })
  },
  created() {
    for (let key in this.userinfo) {
      var value = this.userinfo[key];
      this.original[key] = value;
    }
    this.getdepartmentList().then(() => {
      this.ruleForm = this.userinfo;
      for (let i in this.departmentList) {
        if (this.userinfo.departments_id == this.departmentList[i].id) {
          // this.ruleForm.departments_id = this.departmentList[i].name;
          this.ruleForm.departments_name = this.departmentList[i].name;
        }
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _this = this;
          this.axios
            .post("/api/updateusers", {
              age: _this.ruleForm.age,
              username: _this.ruleForm.username,
              realname: _this.ruleForm.realname,
              email: _this.ruleForm.email,
              phonenumber: _this.ruleForm.phonenumber,
              id: _this.ruleForm.id
            })
            .then(response => {
              if (response.data) {
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                return;
              } else {
                this.$message({
                  message: '更新失败',
                  type: 'error'
                })
              }
            });
          return;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitForm_pwd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _this = this;
          this.axios
            .post("/api/updateuserspwd", {
              password: _this.ruleForm_pwd.password,
              checkPass: _this.ruleForm_pwd.checkPass,
              id: _this.ruleForm.id
            })
            .then(response => {
              if (response.data) {
                if (response.data == "当前密码错误") {
                  alert(response.data);
                } else {
                  alert(response.data);
                  sessionStorage.removeItem("userinfo");
                  window.location.reload();
                }
              } else {
                console.log("err");
              }
            });
          return;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      for (let key in this.original) {
        var value = this.original[key];
        this.ruleForm[key] = value;
      }
    },
    ...mapActions({
      getdepartmentList: "GET_DEPARTMENTLIST"
    })
  }
};
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
  clear: both;
}

.box-card {
  width: 100%;
}

.editBox {
  position: relative;
  top: 80px;
  width: 100%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
