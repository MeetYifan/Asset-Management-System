<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户列表</span>
        <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
      </div>
      <div class="text item">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column fixed prop="username" label="昵称"></el-table-column>
          <el-table-column prop="age" label="年龄/岁"></el-table-column>
          <el-table-column prop="realname" label="实名"></el-table-column>
          <el-table-column prop="idType" label="证件编号"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100" class="operation">
            <template slot-scope="scope">
              <el-button @click="handleEidt(scope.row.id)" type="text" size="small">编辑</el-button>
              <el-button @click="handleDel(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>目标用户</span>
        <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
      </div>
      <div class="text item">
        <el-table :data="newtableData" style="width: 100%">
          <el-table-column fixed prop="username" label="昵称"></el-table-column>
          <el-table-column prop="age" label="年龄/岁"></el-table-column>
          <el-table-column prop="realname" label="实名"></el-table-column>
          <el-table-column prop="idType" label="证件编号"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100" class="operation">
            <template slot-scope="scope">
              <el-button @click="handleEidt(scope.row.id)" type="text" size="small">编辑</el-button>
              <el-button @click="handleDel(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入辅助函数
import { mapState, mapActions, mapGetters} from "vuex";

export default {
  data() {
    return {
      tableData: [],
      newtableData: []
    };
  },
  created() {
    // this.$store.dispatch('GET_USERLIST').then(() => {
    //   // console.log(this.$store.state.userList)
    //   // 把全局的 userlist 赋值给 tableData
    //   // this.tableData = this.$store.state.userList
    //   this.tableData = this.userList
    // })
    this.getUserList().then(() => {
      this.tableData = this.userList;

      // 这样可以删选出来年龄大于 20 的，此外还可以用 vuex 中的 getter
      // this.newtableData = this.userList.filter(v => v.age > 20)

      // 这样虽然可以全局获取，但是数据多的话写起来太麻烦，可以利用 mapGetters 辅助函数
      // this.newtableData = this.$store.getters.vipUsers

      this.newtableData = this.vipUsers
    });
  },
  methods: {
    ...mapActions({
      getUserList: "GET_USERLIST"
    }),
    handleEidt(id) {
      console.log("修改" + id);
    },
    handleDel(id) {
      console.log("删除" + id);
    }
  },
  computed: {
    ...mapGetters(['vipUsers']),
    ...mapState({
      userList: state => state.userList
    })
  }
};
</script>

<style scoped>
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

.el-table {
  border-left: 0px solid #ebeef5;
}
</style>
