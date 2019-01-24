<template>
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item title="BY STATUS" name="1">
      <div id="zczt" :style="'height:'+chartHeight+'px;margin:auto;'"></div>
    </el-collapse-item>
    <el-collapse-item title="BY CLASSIFY" name="2">
      <div id="zcfl" :style="'height:'+chartHeight+'px;margin:auto;'"></div>
    </el-collapse-item>
    <el-collapse-item title="BY DEPARTMENT" name="3">
      <div id="ssbm" :style="'height:'+chartHeight+'px;margin:auto;'"></div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
var echarts = require("echarts");

// 使用刚指定的配置项和数据显示图表。

export default {
  data() {
    return {
      chartHeight: window.innerHeight - 300,
      activeNames: ["1"]
    };
  },
  computed: {
    ...mapState({
      assetsList: state => state.assetsList,
      departmentList: state => state.departmentList,
      classifyList: state => state.classifyList,
      statusList: state => state.statusList
    })
  },
  created() {
    this.getAssetsList().then(() => {});
    this.getDepartmentList().then(() => {});
    this.getClassifyList().then(() => {});
    this.getStatusList().then(() => {
      this.resizeCharts();
    });
  },

  mounted() {
    const that = this;
    window.addEventListener("resize", function() {
      that.chartHeight = window.innerHeight - 160;
    });
  },

  methods: {
    ...mapActions({
      getAssetsList: "GET_ASSETSLIST",
      getDepartmentList: "GET_DEPARTMENTLIST",
      getClassifyList: "GET_CLASSIFYLIST",
      getStatusList: "GET_STATUSLIST"
    }),
    handleChange(val) {
      //   console.log(val);
      var _this = this;
      //   setTimeout(function() {
      //     if (val.length > 0) {
      //       console.log(val[0]);
      //       switch (val[0]) {
      //         case 1:
      //           _this.echarts_fir();
      //           break;
      //         case 2:
      //           _this.echarts_sec();
      //           break;
      //         case 3:
      //           _this.echarts_thr();
      //           break;
      //       }
      //     }
      //   }, 1);
      setTimeout(function() {
        _this.resizeCharts();
      }, 1);
    },
    resizeCharts() {
      this.echarts_fir();
      this.echarts_sec();
      this.echarts_thr();
    },
    echarts_fir() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("zczt"), "default");
      // 重置窗口时更改图表大小
      myChart.resize();
      window.addEventListener("resize", () => {
        // myChart.resize();
        var t = setTimeout(() => {
          myChart.resize();
        }, 1);
      });

      var _this = this;
      // 绘制图表
      myChart.setOption({
        title: {
          text: "资产状态分布图",
          subtext: "资产总数：" + _this.assetsList.length,
          top: 20,
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          top: 20
          //   data: (function() {
          //     var res = [];
          //     for (let i in _this.statusList) {
          //       res.push(_this.statusList[i].name);
          //     }
          //     // console.log("---", res);
          //     //   return (res)
          //   })()
        },
        series: [
          {
            name: "状态",
            type: "pie",
            radius: "60%",
            center: ["50%", "60%"],

            data: (function() {
              var res = [];
              for (let j in _this.statusList) {
                res.push({ value: 0, name: _this.statusList[j].name });
                // console.log(_this.statusList[j].id, _this.statusList[j].name);
                // console.log(res);
                for (let i in _this.assetsList) {
                  // console.log(_this.assetsList[i].status_id)
                  if (_this.assetsList[i].status_id == _this.statusList[j].id) {
                    // var statusName = _this.statusList[j].name;
                    for (let k in res) {
                      if (res[k].name == _this.statusList[j].name) {
                        res[k].value++;
                      }
                    }
                  }
                }
              }
              res.sort(function(a, b) {
                return a.value - b.value;
              });
              return res;
            })(),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
      // myChart.setOption(option);
    },
    echarts_sec() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("zcfl"), "dark");
      // 重置窗口时更改图表大小
      myChart.resize();
      window.addEventListener("resize", () => {
        // myChart.resize();
        var t = setTimeout(() => {
          myChart.resize();
        }, 1);
      });

      var _this = this;
      // 绘制图表
      myChart.setOption({
        title: {
          text: "资产分类",
          top: 20,
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          top: 20
        },
        series: [
          {
            name: "属性",
            type: "pie",
            radius: "60%",
            center: ["50%", "60%"],

            data: (function() {
              var res = [];
              for (let j in _this.classifyList) {
                res.push({ value: 0, name: _this.classifyList[j].name });
                for (let i in _this.assetsList) {
                  if (
                    _this.assetsList[i].classify_id == _this.classifyList[j].id
                  ) {
                    for (let k in res) {
                      if (res[k].name == _this.classifyList[j].name) {
                        res[k].value++;
                      }
                    }
                  }
                }
              }
              res.sort(function(a, b) {
                return a.value - b.value;
              });
              return res;
            })(),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
      // myChart.setOption(option);
    },
    echarts_thr() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("ssbm"), "light");
      // 重置窗口时更改图表大小
      myChart.resize();
      window.addEventListener("resize", () => {
        // myChart.resize();
        var t = setTimeout(() => {
          myChart.resize();
        }, 1);
      });

      var _this = this;
      // 绘制图表
      myChart.setOption({
        title: {
          text: "所属部门",
          top: 20,
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          top: 20
        },
        series: [
          {
            name: "部门",
            type: "pie",
            radius: "60%",
            center: ["50%", "60%"],

            data: (function() {
              var res = [];
              for (let j in _this.departmentList) {
                res.push({ value: 0, name: _this.departmentList[j].name });
                for (let i in _this.assetsList) {
                  if (
                    _this.assetsList[i].department_id ==
                    _this.departmentList[j].id
                  ) {
                    for (let k in res) {
                      if (res[k].name == _this.departmentList[j].name) {
                        res[k].value++;
                      }
                    }
                  }
                }
              }
              res.sort(function(a, b) {
                return a.value - b.value;
              });
              return res;
            })(),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
</style>
