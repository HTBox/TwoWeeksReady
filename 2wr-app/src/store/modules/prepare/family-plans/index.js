import familyPlansApi from "@/api/family-plans-api.js";
import localForage from 'localforage';

export default {
  namespaced: true,
  state: {
    familyPlans: [],
    sharedPlans: [],
    error: "",
    isBusy: false
  },
  mutations: {
    setFamilyPlans: (state, plans) => state.familyPlans = plans,
    setSharedPlans: (state, plans) => state.sharedPlans = plans,
    addToFamilyPlans: (state, newPlan) => state.familyPlans.splice(state.familyPlans.length, 0, newPlan),
    setError: (state, error) => state.error = error,
    setBusy: (state) => state.isBusy = true,
    clearBusy: (state) => state.isBusy = false

  },
  actions: {
    async updatePlanAsync({commit}, plan) {

      try {
        commit("setBusy");
        commit("setError", "");

        var response = await familyPlansApi.updatePlan(plan);

        if (response.status === 200) {
          // Existing Plan - nothing to do
          return response.data;
        } else if (response.status === 201) {
          // New Plan
          commit("addToFamilyPlans", response.data);
          return response.data;
        } else {
          // Show Error
          commit("setError", "Failed to save changes.");
        }
      } finally {
        commit("clearBusy");
      }
    },
    async getAllAsync({
      commit,
      rootState
    }) {
      if (rootState.globalStore.online) {
        let response = await familyPlansApi.getAll();
        commit('setFamilyPlans', response.data);
        await localForage.setItem('getFamilyPlans', response.data);
      } else {
        var data = await localForage.getItem('getFamilyPlans')
        if (data) {
          console.log("Serving from cache");
          commit('setFamilyPlans', data);
        } else {
          console.log("Offline without data");
        }
      }
    },
  },
  getters: {
    findFamilyPlan: (state) => (id) => {
      let found = state.familyPlans.find(item => item.id === id);
      return found;
    }
  }
}