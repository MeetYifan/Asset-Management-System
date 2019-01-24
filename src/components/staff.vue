<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'name', order: 'descending'}"
    >
      <el-table-column prop="name" label="所属部门" min-width="120" sortable>
        <template slot-scope="scope">
          <span :style=" changeSelect==scope.row.id ? 'display:none' : 'display:block'">{{ scope.row.name }}</span>
          <el-select :style=" changeSelect==scope.row.id ? 'display:block' : 'display:none'" v-model="scope.row.name" >
            <el-option
            v-for="(item, index) in departmentList"
            :key="index"
            :value="item.name"
          ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="realname" label="姓名" sortable>
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>昵称: {{ scope.row.username }}</p>
            <p>邮箱: {{ scope.row.email }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.realname }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="phonenumber" label="手机号码" min-width="120" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.phonenumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{changeSelect==scope.row.id ? '确认':'调动'}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      tableData: [],
      changeSelect: '',
      flag: true
    };
  },
  created() {
    this.getUserinfoAndDepartment().then(() => {
      // console.log(this.userinfoAndDepartment);
      this.tableData = this.userinfoAndDepartment;
    });
  },
  methods: {
    handleEdit(index, row) {
      // 通过 flag 判断当前状态
      // console.log(index, row);
      if(this.flag) {
        this.changeSelect = row.id
        this.flag = false
      }else {
        this.changeSelect = ''
        // console.log(row.name, row.id)
        var dataId = ''
        for(let i in this.departmentList) {
          if(row.name == this.departmentList[i].name) {
            dataId = this.departmentList[i].id 
          }
        }
        // console.log(dataId)
        this.axios
            .post("/api/changestaffdepartment", {
              id            : row.id,
              departments_id: dataId
            })
            .then(response => {
              if (response.data) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '修改失败',
                  type: 'error'
                })
              }
            });
        this.flag = true
      }
    },
    handleDelete(index, row) {
      // console.log(index, row);
      this.$confirm("此操作将永久删除" + row.realname + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var _row = row;
          var _index = index;

          let _this = this;
          this.axios
            .post("/api/deletestaff", {
              id: _row.id
            })
            .then(response => {
              if (response.data) {
                for (let i in _this.tableData) {
                  if (_row.id != _this.tableData[i].id) continue;
                  index = i;
                }
                _this.tableData.splice(index, 1);
              } else {
                console.log("err");
              }
            });

          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    ...mapActions({
      getdepartmentList: "GET_DEPARTMENTLIST",
      getUserinfoAndDepartment: "GET_USERINFOANDDEPARTMENT"
    })
  },
  computed: {
    // 辅助函数 获取 state 数据
    ...mapState({
      userinfo: state => state.userinfo,
      departmentList: state => state.departmentList,
      userinfoAndDepartment: state => state.userinfoAndDepartment
    })
  }
};
</script>
