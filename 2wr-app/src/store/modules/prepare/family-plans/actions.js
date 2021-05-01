import familyPlansApi from "@/api/family-plans-api.js";
import photosApi from "@/api/photos-api.js";
import localForage from "localforage";
import { v4 } from "uuid";

export default {
  async updatePlanAsync({ commit }, plan) {
    try {
      commit("setBusy", true, { root: true });
      commit("setError", "", { root: true });

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
        commit("setError", "Failed to update changes.", { root: true });
      }
    } catch {
      commit("setError", "Failed to update plan.", { root: true });
    } finally {
      commit("clearBusy", null, { root: true });
    }
  },
  async getAllAsync({ commit, rootState }) {
    try {
      commit("setBusy", null, { root: true });
      commit("setError", "", { root: true });

      if (rootState.globalStore.online) {
        let response = await familyPlansApi.getAll();
        commit("setFamilyPlans", response.data);
        await localForage.setItem("getFamilyPlans", response.data);
      } else {
        var data = await localForage.getItem("getFamilyPlans");
        if (data) {
          console.log("Serving from cache");
          commit("setFamilyPlans", data);
        } else {
          console.log("Offline without data");
        }
      }
    } catch {
      commit("setError", "Could not load plans.", { root: true });
    } finally {
      commit("clearBusy", null, { root: true });
    }
  },
  async updateContactAsync(ctx, { contact, planId }) {
    // Find Plan
    const plan = ctx.getters.findFamilyPlan(planId);
    if (contact.id) {
      // Replace the contact
      ctx.commit("replaceContact", { contact, plan });
    } else {
      contact.id = v4();
      ctx.commit("addContact", { contact, plan });
    }
    // Save it
    await ctx.dispatch("updatePlanAsync", plan);
  },
  async updateRouteAsync(ctx, { route, planId }) {
    // Find Plan
    const plan = ctx.getters.findFamilyPlan(planId);
    if (route.id) {
      // Existing
      // Replace the contact
      ctx.commit("replaceRoute", { route, plan });
    } else {
      route.id = v4();
      ctx.commit("addRoute", { route, plan });
    }
    // Save it
    await ctx.dispatch("updatePlanAsync", plan);
  },
  async updateChildAsync(ctx, { child, planId }) {
    // Find Plan
    const plan = ctx.getters.findFamilyPlan(planId);
    if (child.id) {
      // Existing
      // Replace the contact
      ctx.commit("replaceChild", { child, plan });
    } else {
      child.id = v4();
      ctx.commit("addChild", { child, plan });
    }
    // Save it
    await ctx.dispatch("updatePlanAsync", plan);
  },
  async updatePetAsync(ctx, { pet, planId }) {
    // Find Plan
    const plan = ctx.getters.findFamilyPlan(planId);
    if (pet.id) {
      // Existing
      // Replace the contact
      ctx.commit("replacePet", { pet, plan });
    } else {
      pet.id = v4();
      ctx.commit("addPet", { pet, plan });
    }
    // Save it
    await ctx.dispatch("updatePlanAsync", plan);
  },
  async addImageFile({ commit }, { file, route }) {
    try {
      commit("setBusy", null, { root: true });
      commit("setError", "", { root: true });
      var result = await photosApi.uploadPhoto(file);
      if (result.status === 201) {
        commit("addPhoto", { photo: result.data, route });
      }      
    } catch (e) {
      commit("setError", `Failed to upload photo`, { root: true });
      console.error(e);
    } finally {
      commit("clearBusy", null, { root: true });
    }   
  }
};
