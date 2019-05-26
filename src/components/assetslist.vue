<template>
  <div>
    <el-row>
      <el-col :span="4" v-for="(item, index) in tableData" :key="index" :offset=1>
        <el-card :body-style="{ padding: '0px' }" shadow="hover" @click.native="show()" >
          <div class="imagediv" :ind='item.id' :style="{backgroundImage:`url(${item.picture || '/static/assetsImg/default-as-picture.jpg'} )`}"></div>
          <div class="ascontent" style="padding: 14px;">
            <span>{{ item.name }}</span>
            <div class="bottom clearfix">
              <span class="number">编号：{{ item.id }}</span>
              <span type="text" :class="values[item.status_id - 1].ename + ' status'" >{{ values[item.status_id-1].name }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="right-sild">
      <div class="as-query">
        <h3>排序方式</h3>
        <div class="condition" style="margin-top: 10px">
          <ul >
            <li><el-radio v-model="radio" label="1" border size="small" @click.native="sortAs(id)">按编号</el-radio></li>
            <li><el-radio v-model="radio" label="2" border size="small" @click.native="sortAs(name)">按名称</el-radio></li>
            <li><el-radio v-model="radio" label="3" border size="small" @click.native="sortAs(status)">按状态</el-radio></li>
            <!-- <li><button class="as_button" @click="orderBy(4)">按状态</button></li> -->
          </ul>
        </div>
      </div>

    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters} from "vuex";

export default {
  data() {
    return {
      values: [],
      tableData:[],
      radio: 1,
    };
  },
  created() {
    this.getStatusList().then(() => {
      this.values = this.statusList;
    })
    this.getAssetsList().then(() => {
      this.tableData = this.assetsList;
    })
  },
  methods: {
    ...mapActions({
      getStatusList: "GET_STATUSLIST",
      getAssetsList: "GET_ASSETSLIST",
    }),
    orderBy(val){
      // console.log(val)
      // console.log(this.tableData)
      console.log(this.values)
    },
    sortAs(val){
      function compare(a, b) {
        return a.val - b.val
      }
      this.tableData.sort(compare)
    },
    show(){
      this.$router.push('/assetslist/operate')
      if(!e){
        var e = window.event;
      }
      //获取事件点击元素
      var targNo = e.target.getAttribute('ind');
      // console.log(targNo)

      // 存入 sessionStorage
      sessionStorage.setItem('asset_id', targNo);
      // console.log(sessionStorage.getItem("asset_id"))
    }
  },
  computed: {
    ...mapState({
      statusList: state => state.statusList,
      assetsList: state => state.assetsList
    })
  }
}
</script>

<style scoped>
  .number {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-bottom: 13px;
    line-height: 12px;
  }

  .status {
    font-size: 12px;
    color: #fff;
    padding: 2px;
    float: right;
  }
  .using {
    background-color: rgb(240, 95, 95);
  }
  .unused {
    background-color: rgb(95, 240, 167);
  }
  .repair{
    background-color: rgb(245, 168, 26);
  }

  @media (max-width: 1800px) {
    .el-card,.el-card-body{
      height: 280px;
    }

    .imagediv{
      height: 210px;
      background: no-repeat center / cover;
    }

    .el-col {
      margin-bottom: 20px;
    }
  }
  @media (max-width: 1400px) {
    .el-card,.el-card-body{
      height: 260px;
    }

    .imagediv{
      height: 180px;
    }
  }
  @media (max-width: 1200px) {
    .el-card,.el-card-body{
      height: 220px;
    }

    .imagediv{
      height: 155px;
    }
  }
  @media (max-width: 1000px) {
    .el-card,.el-card-body{
      height: 200px;
    }

    .imagediv{
      height: 120px;
    }

    .el-col {
      margin-bottom: 10px;
    }
  }
  @media (max-width: 800px) {
    .imagediv{
      height: 80px;
    }
  }
  @media (max-width: 500px) {
    .imagediv{
      height: 50px;
    }
  }

  .image {
    display: flex;
    justify-content: center;
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

  .as-query {
    position: absolute;
    right: 0;
    top: 60px;
    width: 12%;
    border-left: 1px solid rgb(238, 238, 238);
  }

  .as-query h3 {
    text-align: center;
    margin-top: 20px;
  }

  .condition {
    text-align: center;
  }

  .condition ul li {
    margin-bottom: 5px;
  }

  .condition .el-radio :first-child {
    display: none;
  }

</style>
