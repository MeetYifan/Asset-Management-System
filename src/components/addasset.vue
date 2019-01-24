<template>
  <div>
    <!-- <form action="/api/addpicture" method="post" enctype="multipart/form-data">
      <input type="file" name="image" size="50" />
      <br />
      <input type="submit" value="上传文件" />
    </form>-->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="资产名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>

      <el-form-item label="金额/￥" prop="value">
        <el-input type="value" v-model.number="ruleForm.value" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="计量单位" prop="units">
        <el-input v-model="ruleForm.units"></el-input>
      </el-form-item>

      <el-form-item label="类别" prop="classify_id">
        <el-select v-model="ruleForm.classify_id" placeholder="请选择类别">
          <el-option
            v-for="(item, index) in classify"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属部门" prop="department_id">
        <el-select v-model="ruleForm.department_id" placeholder="请选择部门">
          <el-option
            v-for="(item, index) in department"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="购买时间" required>
        <el-col :span="9">
          <el-form-item prop="date">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.date"
              value-format="yyyy-MM-dd"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="上传图片" prop="picture">
        <el-upload
          accept="image/jpeg, image/png"
          class="upload-demo"
          action="/api/addpicture"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-success="pictureRes"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="管理员" prop="admin_id">
        <el-select v-model="ruleForm.admin_id" clearable placeholder="请选择管理员">
          <el-option
            v-for="(item, index) in person"
            :key="index"
            :label="item.realname"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="使用人" prop="user_id">
        <el-select v-model="ruleForm.user_id" clearable placeholder="请选择使用人">
          <el-option
            v-for="(item, index) in person"
            :key="index"
            :label="item.realname"
            :value="item.id"
            @click.native="changeStatus()"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status_id">
        <el-radio-group v-model="ruleForm.status_id">
          <el-radio :disabled="ruleForm.user_id ? true : false" label="1">闲置</el-radio>
          <el-radio :disabled="!ruleForm.user_id? true : false" label="2">在用</el-radio>
          <el-radio :disabled="ruleForm.user_id ? true : false" label="3">维修</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注" prop="notes">
        <el-input type="textarea" v-model="ruleForm.notes"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      fileList: [
        //   {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        //   {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
      ],

      classify: [],
      department: [],
      person: [],
      status: [],
      ruleForm: {
        id: "",
        name: "",
        value: "",
        units: "",
        classify_id: "",
        department_id: "",
        date: "",
        picture: "",
        admin_id: "",
        users_id: "",
        status_id: "1",
        notes: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入资产名称", trigger: "blur" },
          { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" }
        ],
        units: [
          { min: 1, max: 6, message: "长度在 1 到 6 个字符", trigger: "change" }
        ],
        value: [
          { required: true, message: "金额不能为空" },
          { type: "number", message: "金额必须为数字值" }
        ],
        classify_id: [
          { required: true, message: "请选择类别", trigger: "change" }
        ],
        department_id: [
          { required: true, message: "请选择所属部门", trigger: "change" }
        ],
        date: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        notes: [
          {
            min: 1,
            max: 120,
            message: "长度在 1 到 120 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getStatusList().then(() => {
      this.status = this.statusList;
    });
    this.getDepartmentList().then(() => {
      this.department = this.departmentList;
    });
    this.getClassifyList().then(() => {
      this.classify = this.classifyList;
    });
    this.getUserList().then(() => {
      this.person = this.userList;
    });
  },
  methods: {
    changeStatus() {
      // console.log(this.ruleForm.user_id)
      this.ruleForm.status_id = this.ruleForm.users_id ? "1" : "2";
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`限制选择 1 个文件`);
      // 本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    pictureRes(response, file, fileList) {
      // console.log(response, file, fileList);
      this.ruleForm.picture = response.data
    },

    ...mapActions({
      getAssetsList: "GET_ASSETSLIST",
      getStatusList: "GET_STATUSLIST",
      getClassifyList: "GET_CLASSIFYLIST",
      getUserList: "GET_USERLIST",
      getDepartmentList: "GET_DEPARTMENTLIST"
    }),

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _this = this;
          this.axios
            .post("/api/addassets", {
              id: _this.ruleForm.id,
              name: _this.ruleForm.name,
              classify_id: _this.ruleForm.classify_id,
              department_id: _this.ruleForm.department_id,
              value: _this.ruleForm.value,
              units: _this.ruleForm.units,
              admin_id: _this.ruleForm.admin_id,
              created: _this.ruleForm.date,
              picture: _this.ruleForm.picture,
              status_id: _this.ruleForm.status_id,
              notes: _this.ruleForm.notes,
              user_id: _this.ruleForm.user_id
            })
            .then(response => {
              if (response.data) {
                console.log(response.data);
              } else {
                console.log("err");
              }
            });

          this.$confirm("上传成功!");
          this.$refs[formName].resetFields();
        } else {
          this.$confirm("上传失败!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    dateFormat: function(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

      return (time =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds);
    }
  },
  computed: {
    ...mapState({
      assetsList: state => state.assetsList,
      statusList: state => state.statusList,
      departmentList: state => state.departmentList,
      classifyList: state => state.classifyList,
      userList: state => state.userList
    })
  }
};
</script>

<style scoped>
</style>
