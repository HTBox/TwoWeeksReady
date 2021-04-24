import familyPlansApi from "@/api/family-plans-api.js";
import localForage from 'localforage';
import { v4 } from "uuid";

export default {
  namespaced: true,
  state: {
    familyPlans: [],
    sharedPlans: []
  },
  mutations: {
    setFamilyPlans: (state, plans) => state.familyPlans = plans,
    setSharedPlans: (state, plans) => state.sharedPlans = plans,
    addToFamilyPlans: (state, newPlan) => state.familyPlans.splice(state.familyPlans.length, 0, newPlan),
    replaceContact: (state, { contact, plan}) => {
      const index = plan.emergencyContacts.findIndex(i => i.id == contact.id);
      plan.emergencyContacts.splice(index, 1, contact);
    },
    addContact: (state, { contact, plan}) => {
      plan.emergencyContacts.splice(plan.emergencyContacts.length, 0, contact);
    } 
  },
  actions: {
    async updatePlanAsync({
      commit
    }, plan) {

      try {
        commit("setBusy", null, {
          root: true
        });
        commit("setError", "", {
          root: true
        });

        var response = await familyPlansApi.upsertPlan(plan);

        if (response.status === 200) {
          // Existing Plan - nothing to do
          return response.data;
        } else if (response.status === 201) {
          // New Plan
          commit("addToFamilyPlans", response.data);
          return response.data;
        } else {
          // Show Error
          commit("setError", "Failed to update changes.", {
            root: true
          });
        }
      } catch {
        commit("setError", "Failed to update plan.", {
          root: true
        })
      } finally {
        commit("clearBusy", null, {
          root: true
        });
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
        try {
          commit("setBusy", null, {
            root: true
          });
          commit("setError", "", {
            root: true
          });
          var data = await localForage.getItem('getFamilyPlans')
          if (data) {
            console.log("Serving from cache");
            commit('setFamilyPlans', data);
          } else {
            console.log("Offline without data");
          }
        } catch {
          commit("setError", "Could not load plans.", {
            root: true
          });
        } finally {
          commit("clearBusy", null, {
            root: true
          });
        }
      }
    },
    async updateContactAsync(ctx, { contact, planId }) {

      // Find Plan
      const plan = ctx.getters.findFamilyPlan(planId);
      if (contact.id) { // Existing
        // Replace the contact
        ctx.commit("replaceContact", { contact, plan});
      } else {
        contact.id = v4();
        ctx.commit("addContact", {contact, plan});
      }
      // Save it
      await ctx.dispatch("updatePlanAsync", plan);     
    }
  },
  getters: {
    findFamilyPlan: (state) => (id) => {
      let found = state.familyPlans.find(item => item.id === id);
      return found;
    }
  }
}