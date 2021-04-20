import familyPlansApi from "@/api/family-plans-api.js";
import localForage from 'localforage';

export default {
  namespaced: true,
  state: {
    familyPlans: [],
    sharedPlans: []
  },
  mutations: {
    setFamilyPlans: (state, plans) => state.familyPlans = plans,
    setSharedPlans: (state, plans) => state.sharedPlans = plans,
    addToFamilyPlans: (state, newPlan) => state.familyPlans.splice(state.familyPlans.length, 0, newPlan)
  },
  actions: {
    async addToFamilyPlanAsync({commit}, plan) {
      await familyPlansApi.create(plan);
      commit("addToFamilyPlans", plan);
    },
    async getFamilyPlansAsync({commit, rootState}) {
      if (rootState.globalStore.online) {
        let response = await familyPlansApi.getFamilyPlans();
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
      console.log(state);
      console.log(id);
      let found = state.familyPlans.find(item => item.id === id);
      console.log(found);
      return found;
    }  
  }
}