import api from '../../../../api/hazard-info-api';
import localForage from 'localforage';

const CACHE_KEY = 'HazardInfos';
const SET_LIST = 'SET_LIST';

export default {
    namespaced: true,
    state: {
        list: []
    },
    mutations: {
        [SET_LIST](state, payload) {
            state.list = payload;
        },
    },
    actions: {
        async getHazardInfosAsync({ commit, rootState }) {

            try {
                commit("setBusy", null, { root: true });
                commit("setError", "", { root: true });
          
                if (rootState.globalStore.online) {
                    let response = await api.getAll();
                    commit(SET_LIST, response.data);
                    await localForage.setItem(CACHE_KEY, response.data);
                } else {
                    var data = await localForage.getItem(CACHE_KEY)
                    if (data) {
                        console.log("Serving from cache");
                        commit(SET_LIST, data);
                    } else {
                        console.log("Offline without data");
                    }
                }
              } catch {
                commit("setError", "Could not load harzard information.", { root: true });
              } finally {
                commit("clearBusy", null, { root: true });
              } 
        }
    }
};