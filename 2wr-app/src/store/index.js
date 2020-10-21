import Vue from 'vue';
import Vuex from 'vuex';
import emergencyKitStore from './modules/prepare/emergency-kits/emergency-kit-store';
import globalStore from './modules/global/global-store';

Vue.use(Vuex);

export default new Vuex.Store({
    // state: {

    // },
    // mutations: {

    // },
    // actions: {

    // },
    modules: {
        globalStore,
        emergencyKitStore
    }
})