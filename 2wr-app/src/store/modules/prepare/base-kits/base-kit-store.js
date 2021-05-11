import baseKitApi from "../../../../api/base-kit-api";
import localForage from "localforage";

const baseKitStore = {
  namespaced: true,
  state: {
    list: [],
    isLoading: false,
    loadErrorMessage: null,
    selectedKit: null,
  },
  mutations: {
    SET_LIST(state, payload) {
      state.list = payload;
    },
    LOAD_START(state) {
      state.isLoading = true;
    },
    LOAD_SUCCESS(state, payload) {
      state.isLoading = false;
      state.item = payload;
    },
    LOAD_ERROR(state, payload) {
      state.isLoading = false;
      state.loadErrorMessage = payload;
    }
  },
  actions: {
    async getBaseKitListAsync({ commit, rootState }) {
      if (rootState.globalStore.online) {
        let response = await baseKitApi.getAll();
        commit("SET_LIST", response.data);
        await localForage.setItem("getBaseKitListAsync", response.data);
      } else {
        var data = await localForage.getItem("getBaseKitListAsync");
        if (data) {
          console.log("Serving from cache");
          commit("SET_LIST", data);
        } else {
          console.log("Offline without data");
        }
      }
    },
  },
};

export default baseKitStore;
