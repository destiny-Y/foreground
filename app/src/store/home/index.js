import { reqBaseCategoryList, reqGetBannerList, reqFloorList } from "@/api";

// home模块的小仓库
const state = {
  // state中的数据默认初始值不能瞎写，服务器返回的是对象，初始值就是对象(根据服务器返回值来进行初始化的)
  categoryList: [],
  // 轮播图的数据
  bannerList: [],
  // floor的数据
  floorList: []
};
const actions = {
  // 通过API里面的接口函数调用，向服务器发请求，获取服务器的数据
  async categoryList({ commit }) {
    let result = await reqBaseCategoryList();
    // console.log(result);
    if (result.code === 200) {
      commit("CATEGORYLIST", result.data);
    }
  },
  // 获取首页轮播图的数据
  async getBannerList({ commit }) {
    let result = await reqGetBannerList();
    //   console.log(result);
    if (result.code === 200) {
      commit('GETBANNERLIST', result.data)
    }
  },
  // 获取floor的数据
  async getFloorList({ commit }) {
    let result = await reqFloorList();
    //    console.log(result);
    //    if(result.code === 200){
    commit('GETFLOORLIST', result.data);
    //    }
  }
};
const mutations = {
  CATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList;
  },
  GETBANNERLIST(state, bannerList) {
    state.bannerList = bannerList;
  },
  GETFLOORLIST(state, floorList) {
    state.floorList = floorList;
  }
};
const getters = {

};

export default {
  state,
  actions,
  mutations,
  getters
}