import Vue from 'vue';
import Vuex from 'vuex';
import baseKitStore from './modules/prepare/base-kits/base-kit-store';
import emergencyKitStore from './modules/prepare/emergency-kits/emergency-kit-store';
import hazardHuntStore from './modules/prepare/hazards/hazard-hunt-store';
import hazardInfoStore from './modules/prepare/hazards/hazard-info-store';
import globalStore from './modules/global/global-store';
import familyPlansStore from './modules/prepare/family-plans';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
    state: {
      isBusy: false,
      error: ""
    },
    mutations: {
      clearBusy: (state) => state.isBusy = false,
      setBusy: (state) => state.isBusy = true,
      setError: (state, msg) => state.error = msg
    },
    // actions: {

    // },
    modules: {
        globalStore,
        baseKitStore,
        emergencyKitStore,
        hazardHuntStore,
        hazardInfoStore,
        familyPlansStore
    }
});

export default store;

