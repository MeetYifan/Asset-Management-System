<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="资产 ID">
            <span>{{ props.row.id }}</span>
          </el-form-item>
          <el-form-item label="资产名称">
            <span>{{ props.row.name }}</span>
          </el-form-item>
          <el-form-item label="预计净残值率/%"> 
          <!-- onkeyup="value=value.replace(/[^\d]/g,'')" -->
            <el-input 
            type="text" 
            maxlength="3" 
            v-model="props.row.residual" 
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="预计使用寿命/年">
            <el-input v-model="props.row.durable" maxlength="2" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="月折旧率/%">
            <span>{{ monthlyDepreciation(props.row.residual, props.row.durable) }}</span>
          </el-form-item>
          <el-form-item label="月折旧额/￥">
            <span>{{ monthlyDepMoney(props.row.residual, props.row.durable, props.row.value) }}</span>
          </el-form-item>
          <el-form-item label="当前价值/￥">
            <span>{{ nowValue(props.row.residual, props.row.durable, props.row.value, props.row.created) }}</span>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="submit(props)">添加更改<i class="el-icon-upload el-icon--right"></i></el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="资产 ID" prop="id"></el-table-column>
    <el-table-column label="资产名称" prop="name"></el-table-column>
    <el-table-column label="预计净残值率/%" prop="residual"></el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      tableData: [],
      valueRes: "",
      durableDate: "",
    };
  },
  computed: {
    ...mapState({
      assetsList: state => state.assetsList
    })
  },
  created() {
    this.getAssetsList().then(() => {
      // console.log(this.assetsList);
      this.tableData = this.assetsList;
      // console.log(this.tableData);
    });
  },
  methods: {
    ...mapActions({
      getAssetsList: "GET_ASSETSLIST"
    }),
    monthlyDepreciation(a, b) {
      var conditionA = a == null || a == undefined || a == ''
      var conditionB = b == null || b == undefined || b == ''
      if (conditionA || conditionB) {
        return '-'
      }else{
        var result = Math.round(((1 - a / 100) / b / 12) * 100 * 100);
        return result / 100;
      }
    },
    monthlyDepMoney(a, b, c) {
      var monthlyDepreciation = this.monthlyDepreciation(a, b)
      if(monthlyDepreciation == '-') {
        return '-'
      }else{
        return Math.round(monthlyDepreciation * c) / 100;
      }
    },
    nowValue(a, b, c, d) {
      // monthlyDepMoney(a, b, c)
      var monthlyDepMoney = this.monthlyDepMoney(a, b, c)
      if(monthlyDepMoney == '-') {
        return '-'
      }else{
        var date = new Date()
        var mon = this.subTime(this.dateFormat(date), this.dateFormat(d))
        return c - mon * monthlyDepMoney > c * 0.02 ? c - mon * monthlyDepMoney : '已清算'
      }
    },
    dateFormat: function(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return (time = year + "-" + month + "-" + day);
    },
    subTime(nowTime, createdTime) {
      var createdTime = createdTime.split('-')
      var nowTime = nowTime.split('-')
      if (nowTime[0] - createdTime[0] < 0) return
      else{
        var mon = (nowTime[0] - createdTime[0]) * 12
        if (nowTime[1] - createdTime[1] <= 0) {
          mon -= createdTime[1] - nowTime[1]
        }
        else{
          mon += nowTime[1] - createdTime[1]
        }
        return mon
      }
    },
    submit(info) {
        if (info) {
          this.axios.post('/api/updateassetsbydep', {
            id       : info.row.id,
            durable  : info.row.durable,
            residual : info.row.residual
          })
          .then(response => {
            if(response.data) {
              // console.log(response.data)
            }else {
              console.log('err')
            }
          })
          this.$confirm("更新成功!");
        } else {
          this.$confirm("更新失败!!");
          return false;
        }
    }
  }
};
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
