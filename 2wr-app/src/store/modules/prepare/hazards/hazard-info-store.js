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
            if (rootState.globalStore.online) {
                let response = await api.getDocuments();
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
        }
    }
};