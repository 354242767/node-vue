import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    token:false
  },
  getters: {
    getUserName(state) {
        return state.username;
    }
  },
  mutations: {
    // 登录
    login (state, username) {
      state.username = username;
      state.token=true;
    },
    // 退出
    logout (state) {
        state.username = '';
        state.token=false;
    }
  },
  actions:{
    login(context,param){//这里的context和我们使用的$store拥有相同的对象和方法
        context.commit('login',param);
    },
    logout(context){//这里的context和我们使用的$store拥有相同的对象和方法
        context.commit('logout');
        //你还可以在这里触发其他的mutations方法
    }
  }
})