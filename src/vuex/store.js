// 引入 vuex
import Vue from 'vue'
import Vuex from 'vuex'
// 引入 axios
import axios from 'axios'

// 注册 vue
Vue.use(Vuex)

// 状态
const state = {
  userinfo: JSON.parse(sessionStorage.getItem('userinfo')),
  userList: [],
  assetsList: [],
  statusList: [],
  departmentList: [],
  classifyList: [],
  repairList: [],
  usageList: [],
  userinfoAndDepartment: []
}

// mutations 用于操作 state
const mutations = {
  // 保存用户数据
  SAVE_USERINFO (state, userinfo) {
    // 把用户数据放到本地存储实现持久化
    sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
    state.userinfo = userinfo
    // console.log('赋值后的用户信息：' , state.userinfo)
  },

  // 获取全局的用户数据
  GET_USERLIST (state, userList) {
    state.userList = userList
  },
  // 获取全局的资产数据
  GET_ASSETSLIST (state, assetsList) {
    state.assetsList = assetsList
  },
  // 获取全局的状态列表
  GET_STATUSLIST (state, statusList) {
    state.statusList = statusList
  },
  // 获取全局的部门列表
  GET_DEPARTMENTLIST (state, departmentList) {
    state.departmentList = departmentList
  },
  // 获取全局的类别列表
  GET_CLASSIFYLIST (state, classifyList) {
    state.classifyList = classifyList
  },
  // 获取全局的维修列表
  GET_REPAIRLIST (state, repairList) {
    state.repairList = repairList
  },
  // 获取全局的使用记录列表
  GET_USAGELIST (state, usageList) {
    state.usageList = usageList
  },
  // 获取全局的人员联合部门表
  GET_USERINFOANDDEPARTMENT (state, userinfoAndDepartment) {
    state.userinfoAndDepartment = userinfoAndDepartment
  }
  
}

// 定义 actions 异步的主要是 commit mutations，由 mutations 来改变状态
const actions = {
  GET_USERLIST({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/getuserlist').then(response => {
        // console.log('获取用户数据列表', response.data)
        commit('GET_USERLIST', response.data)
        resolve()
      })
    })
  },
  GET_ASSETSLIST({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/getassetslist').then(response => {
        commit('GET_ASSETSLIST', response.data)
        resolve()
      })
    })
  },
  GET_STATUSLIST({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/getstatuslist').then(response => {
        commit('GET_STATUSLIST', response.data)
        resolve()
      })
    })
  },
  GET_DEPARTMENTLIST({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/getdepartmentlist').then(response => {
        // console.log('获取数据列表', response.data)
        commit('GET_DEPARTMENTLIST', response.data)
        resolve()
      })
    })
  },
  GET_CLASSIFYLIST({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/getclassifyList').then(response => {
        // console.log('获取数据列表', response.data)
        commit('GET_CLASSIFYLIST', response.data)
        resolve()
      })
    })
  },
  GET_REPAIRLIST({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/getrepairList').then(response => {
        commit('GET_REPAIRLIST', response.data)
        resolve()
      })
    })
  },
  GET_USAGELIST({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/getusagelist').then(response => {
        // console.log('获取用户数据列表', response.data)
        commit('GET_USAGELIST', response.data)
        resolve()
      })
    }) 
  },
  GET_USERINFOANDDEPARTMENT({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/getuserinfoanddepartment').then(response => {
        // console.log('获取用户数据列表', response.data)
        commit('GET_USERINFOANDDEPARTMENT', response.data)
        resolve()
      })
    }) 
  }
 
}

// 定义全局共享属性 getter
const getters = {
  vipUsers: state => state.userList.filter(v => v.age > 20),
}

// 创建 store 仓库暴露出去
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})