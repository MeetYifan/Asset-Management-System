<template>
  <div class="cover">
    <el-card class="box-card operate-wrapper">
      <div slot="header" class="clearfix">
        <span>操作</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="close">关闭</el-button>
      </div>
      <!-- <div v-for="(item, index) in assetInfo" :key="index" class="text item">
        <span style="display: inline-block; width: 100px" >{{ index}}</span> 
        {{item}}
      </div>-->
      <div style="position: relative">
        <div class="text item">
          <span style="display: inline-block; width: 100px">编号</span>
          {{assetInfo.id}}
        </div>
        <div class="text item">
          <span style="display: inline-block; width: 100px">分类</span>
          {{assetInfo.classify}}
        </div>
        <div class="text item">
          <span style="display: inline-block; width: 100px">创建时间</span>
          {{assetInfo.created.slice(0,9)}}
        </div>
        <div class="text item">
          <span style="display: inline-block; width: 100px">部门</span>
          {{assetInfo.department}}
        </div>
        <div class="text item">
          <span style="display: inline-block; width: 100px">状态</span>
          {{assetInfo.status}}
        </div>
        <div class="text item username">
          <span style="display: inline-block; width: 100px">使用人</span>
          <p style="display: inline-block">{{assetInfo.username || '空' }}</p>
        </div>
        <div class="text item">
          <span style="display: inline-block; width: 100px">价值</span>
          {{"￥"+assetInfo.value}}
        </div>
        <div
          class="assetImg"
          :style="'background : url('+assetInfo.picture+') center/contain no-repeat'"
        ></div>
      </div>

      <div class="operate-btn">
        <el-button
          type="success"
          :disabled="assetInfo.status_id == 2 || assetInfo.status_id == 3 ? true : false"
        >领用</el-button>
        <el-button
          type="warning"
          @click="repairAsset"
          :disabled="assetInfo.status_id == 3 ? true : false"
        >维修</el-button>
        <el-button type="danger" @click="deleteAsset">删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      assetId: "",
      assetInfo: []
    };
  },
  created() {
    // 遍历资产取对应值 修改对应数据内容
    this.assetId = sessionStorage.getItem("asset_id");

    for (var i = 0, num = this.assetsList.length; i < num; i++) {
      if (this.assetsList[i].id == this.assetId) {
        this.assetInfo = this.assetsList[i];
      }
    }

    this.getUserList().then(() => {
      for (let i in this.userList) {
        if (this.userList[i].id == this.assetInfo.users_id) {
          this.assetInfo.username = this.userList[i].realname;
          document.querySelector(
            ".username p"
          ).innerText = this.assetInfo.username;
        }
      }
    });

    switch (this.assetInfo.classify_id) {
      case 1:
        this.assetInfo.classify = "电子产品及通讯设备";
        break;
      case 2:
        this.assetInfo.classify = "交通运输";
        break;
      case 3:
        this.assetInfo.classify = "土地、房屋及构建物";
        break;
      case 4:
        this.assetInfo.classify = "图书档案";
        break;
      case 5:
        this.assetInfo.classify = "家具、用具、装具及动植物";
        break;
      case 6:
        this.assetInfo.classify = "文物和陈列品";
        break;
      case 7:
        this.assetInfo.classify = "其他";
        break;
      default:
        break;
    }

    switch (this.assetInfo.department_id) {
      case 1:
        this.assetInfo.department = "总经办";
        break;
      case 2:
        this.assetInfo.department = "人力资源部";
        break;
      case 3:
        this.assetInfo.department = "行政部";
        break;
      case 4:
        this.assetInfo.department = "财务部";
        break;
      case 5:
        this.assetInfo.department = "技术部";
        break;
      case 6:
        this.assetInfo.department = "营销部";
        break;
      case 7:
        this.assetInfo.department = "其他";
        break;
      default:
        break;
    }

    switch (this.assetInfo.status_id) {
      case 1:
        this.assetInfo.status = "闲置";
        break;
      case 2:
        this.assetInfo.status = "在用";
        break;
      case 3:
        this.assetInfo.status = "维修";
        break;
      default:
        break;
    }

    console.log(this.assetInfo);
  },
  methods: {
    ...mapActions({
      getUserList: "GET_USERLIST"
    }),
    close() {
      this.$router.push("/assetslist");
    },
    repairAsset() {
      this.$prompt("请输入预计费用", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[0-9]/,
        inputErrorMessage: "格式不正确"
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "费用为: " + value,
          });
          this.close()
        })

        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    deleteAsset() {
      this.$confirm("此操作将永久删除该资产, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.close();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },

  computed: {
    ...mapState({
      assetsList: state => state.assetsList,
      userList: state => state.userList
    })
  }
};
</script>

<style scoped>
.cover {
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.operate-wrapper {
  padding: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40rem;
  height: 30rem;
  background-color: #fff;
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
.operate-btn {
  /* background-color: #000; */
  display: flex;
  justify-content: space-around;
  margin-top: 4rem;
}
.assetImg {
  width: 250px;
  height: 238px;
  position: absolute;
  top: 0;
  right: 2rem;
  /* border: 1px solid #ccc */
}
</style>
