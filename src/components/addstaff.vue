<template>
  <div>
    <el-card class="box-card">
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
        <el-form-item label="所属部门" prop="departments_name">
          <el-select placeholder="选择所属部门" v-model="ruleForm.departments_name">
            <el-option v-for="(item, index) in departmentList" :key="index" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" type="text" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
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
    var checkuep = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入"));
      } else {
        var info = rule.field + ":" + value;
        info = info.split(":");
        console.log(info);
        console.log(this.ruleForm);
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
            phonenumber: info.phonenumber
          })
          .then(response => {
            if (response.data) {
              response.data = response.data.split(",");
              // console.log(response.data)
              if (response.data[1]) {
                // .el-form-item.is-error
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
        ],
        departments_name: [
          { required: true, message: "请选择所属部门", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    // 辅助函数 获取 state 数据
    ...mapState({
      userinfo: state => state.userinfo,
      departmentList: state => state.departmentList
      // userinfoAndDepartment: state => state.userinfoAndDepartment
    })
  },
  created() {
    this.getdepartmentList().then(() => {});
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 通过用户选择的 部门名 转成对应的 部门id 方便查询
          for (let i in this.departmentList) {
            if (this.ruleForm.departments_name == this.departmentList[i].name) {
              this.ruleForm.departments_id = this.departmentList[i].id;
            }
          }
          let _this = this;
          this.axios
            .post("/api/addusers", {
              username: _this.ruleForm.username,
              realname: _this.ruleForm.realname,
              age: _this.ruleForm.age || null,
              email: _this.ruleForm.email,
              phonenumber: _this.ruleForm.phonenumber,
              departments_id: _this.ruleForm.departments_id,
              password: _this.ruleForm.password
            })
            .then(response => {
              if (response.data) {
                this.$message({
                  message: '上传成功',
                  type: 'success'
                })
                return;
              } else {
                this.$message({
                  message: '上传失败',
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
