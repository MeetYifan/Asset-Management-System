<template>
  <div>
    <div slot="header" class="clearfix">
      <span>使用记录表</span>
    </div>
    <el-table
      ref="multipleTable"
      :data="usageData"
      style="width: 100%"
      :default-sort="{prop: 'startdate', order: 'descending'}"
    >
      <!-- @selection-change="handleSelectionChange" -->
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="assets_name" label="资产名称" sortable min-width="120"></el-table-column>
      <el-table-column prop="assets_id" label="资产编号" sortable min-width="120"></el-table-column>
      <el-table-column prop="user_name" label="领用人" min-width="100" sortable></el-table-column>
      <el-table-column prop="startdate" label="领用日期" sortable min-width="120"></el-table-column>
      <el-table-column prop="enddate" label="归还日期" sortable min-width="120"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="80">
        <template slot-scope="scope">
          <!-- :style="`display: ${scope.row.enddate} === undefined ? none:block`" -->
          <el-button
            v-if="scope.row.enddate === undefined"
            size="mini"
            type="success"
            @click="handleEdit(scope.$index, scope.row)"
          >归还</el-button>
          <el-button
            v-if="scope.row.enddate !== undefined"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
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
      usageData: [],
      multipleSelection: []
    };
  },
  created() {

    this.getUsageList().then(() => {
      this.timeFor();
      this.usageData = this.usageList;
    });
    this.getUserList().then(() => {
      // this.userData = this.userList;
      this.userIdFilter();
    });
    this.getAssetsList().then(() => {
      // this.assetsData = this.assetsList;
      this.assetsIdFilter();
    });
  },
  methods: {
    show(obj) {
      console.log("---", obj);
    },
    timeNow() {
      return this.dateFormat(new Date());
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },

    handleEdit(index, row) {
      var _this = this;
      this.$prompt("请确认/修改归还日期", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: _this.timeNow(),
        inputPattern: /^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/,
        inputErrorMessage: "日期格式不正确"
      })
        .then(({ value }) => {
          var _row = row;
          if (value) {
            let _this = this;
            this.axios
              .post("/api/updateusage", {
                enddate: value,
                id: _row.id,
              })
              .then(response => {
                if (response.data) {
                  // console.log(response.data)
                  _row.enddate = value;
                } else {
                  console.log("err");
                }
              });
            this.axios
              .post("/api/updateassetsbyusage", {
                id: _row.assets_id,
              })
              .then(response => {
                if (response.data) {
                  // console.log(response.data)
                  _row.enddate = value;
                } else {
                  console.log("err");
                }
              });
            this.$message({
              type: "success",
              message: "修改成功"
            });
          } else {
            return false;
          }
        })
        .catch(() => {});
    },

    handleDelete(index, row) {
      // console.log(index, row);
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var _row = row;
          var _index = index;
          let _this = this;

          this.axios
            .post("/api/deleteusage", {
              id: _row.id
            })
            .then(response => {
              if (response.data) {
                for (let i in _this.usageData) {
                  if (_row.id != _this.usageData[i].id) continue;
                  index = i;
                }
                _this.usageData.splice(index, 1);
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
      getUsageList: "GET_USAGELIST",
      getUserList: "GET_USERLIST",
      getAssetsList: "GET_ASSETSLIST"
    }),
    timeFor() {
      for (var i = 0; i < this.usageList.length; i++) {
        this.usageList[i].startdate = this.dateFormat(
          this.usageList[i].startdate
        );
        this.usageList[i].enddate = this.dateFormat(this.usageList[i].enddate);
      }
    },
    dateFormat: function(time) {
      if (!time) return;
      var date = new Date(time);
      var year = date.getFullYear();
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      time = year + "-" + month + "-" + day;
      return time;
    },
    assetsIdFilter() {
      var _this = this;
      for (var i = 0; i < _this.usageData.length; i++) {
        for (var j = 0; j < _this.assetsList.length; j++) {
          if (_this.assetsList[j].id != _this.usageData[i].assets_id) {
            continue;
          } else {
            _this.usageData[i].assets_name = _this.assetsList[j].name;
          }
        }
      }
    },
    userIdFilter() {
      var _this = this;
      // console.log(this.userList.length)
      for (var i = 0; i < _this.usageData.length; i++) {
        for (var j = 0; j < _this.userList.length; j++) {
          if (_this.userList[j].id != _this.usageData[i].user_id) {
            continue;
          } else {
            _this.usageData[i].user_name = _this.userList[j].realname;
          }
        }
      }
    }
  },

  computed: {
    ...mapGetters(["vipUsers"]),
    ...mapState({
      // repairList: state => state.repairList,
      usageList: state => state.usageList,
      userList: state => state.userList,
      assetsList: state => state.assetsList
    })
  }
};
</script>

<style scoped>
</style>
