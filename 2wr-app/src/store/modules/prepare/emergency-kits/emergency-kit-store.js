import emergencyKitApi from "../../../../api/emergency-kit-api";
import localForage from "localforage";

const emergencyKitStore = {
  namespaced: true,
  state: {
    list: [],
    item: null,
    isSaving: false,
    isLoading: false,
    saveErrorMessage: null,
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
    },
    ADD_START(state) {
      state.isSaving = true;
      state.saveErrorMessage = null;
    },
    ADD_SUCCESS(state, payload) {
      state.isSaving = false;
      state.saveErrorMessage = null;
      state.selectedKit = payload;
    },
    ADD_ERROR(state, payload) {
      state.isSaving = false;
      state.saveErrorMessage = payload;
    },
    SAVE_START(state) {
      state.isSaving = true;
      state.saveErrorMessage = null;
    },
    SAVE_SUCCESS(state, payload) {
      state.isSaving = false;
      state.saveErrorMessage = null;
      state.selectedKit = payload;
    },
    SAVE_ERROR(state, payload) {
      state.isSaving = false;
      state.saveErrorMessage = payload;
    },
  },
  actions: {
    async getEmergencyKitListAsync({ commit, rootState }, baseKitId) {
      commit("setBusy", null, { root: true });
      commit("setError", "", { root: true });
      
      try {
        if (rootState.globalStore.online) {
          let response = await emergencyKitApi.getAllByBaseKitId(baseKitId);
          commit("SET_LIST", response.data);
          await localForage.setItem("getEmergencyKitListAsync", response.data);
        } else {
          var data = await localForage.getItem("getEmergencyKitListAsync");
          if (data) {
            console.log("Serving from cache");
            commit("SET_LIST", data);
          } else {
            console.log("Offline without data");
          }
        }        
      } catch {
        commit("setError", "Could not load emergency kits.", { root: true });
      } finally {
        commit("clearBusy", null, { root: true });
      }      
    },
    async getEmergencyKitAsync({ commit, rootState }, id) {
      commit("LOAD_START");
      try {
        if (rootState.globalStore.online) {
          let response = await emergencyKitApi.getById(id);
          commit("LOAD_SUCCESS", response.data);
          await localForage.setItem(
            `getEmergencyKitAsync/${id}`,
            response.data
          );
        } else {
          var data = await localForage.getItem(`getEmergencyKitAsync/${id}`);
          if (data) {
            console.log("Serving from cache");
            commit("LOAD_SUCCESS", data);
          } else {
            console.log("Offline without data");
          }
        }
      } catch (e) {
        commit("LOAD_ERROR", "Kit could not be loaded");
      }
    },
    async createEmergencyKitAsync({ commit, rootState }, newKit) {
      if (rootState.globalStore.online) {
        try {
          commit("ADD_START");
          let response = await emergencyKitApi.create(newKit);
          commit("ADD_SUCCESS", response.data);
          return true;
        } catch (err) {
          console.error(err);
          commit("ADD_ERROR", "Error creating emergency kit");
        }
      } else {
        commit(
          "ADD_ERROR",
          "Kit could not be created because you are currently offline"
        );
      }
      return false;
    },
    async saveEmergencyKitAsync({ commit, rootState }, updatedKit) {
      if (rootState.globalStore.online) {
        try {
          commit("SAVE_START");
          let response = await emergencyKitApi.save(updatedKit);
          commit("SAVE_SUCCESS", response.data);
          return true;
        } catch (err) {
          console.error(err);
          commit("SAVE_ERROR", "Error saving emergency kit");
        }
      } else {
        commit(
          "SAVE_ERROR",
          "Kit could not be saved because you are currently offline"
        );
      }
      return false;
    },
  },
};

export default emergencyKitStore;
