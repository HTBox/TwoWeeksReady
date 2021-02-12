import emergencyKitApi from '../../../../api/emergency-kit-api';
import localForage from 'localforage';

const emergencyKitStore = {
    namespaced: true,
    state: {
        list: [],
        isSaving: false,
        saveErrorMessage: null,
        selectedKit: null
    },
    mutations: {
        SET_LIST(state, payload) {
            state.list = payload;
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
        }
    },
    actions: {
        async getEmergencyKitListAsync({ commit, rootState }) {
            if (rootState.globalStore.online) {
                let response = await emergencyKitApi.getAll();
                commit('SET_LIST', response.data);
                await localForage.setItem('getEmergencyKitListAsync', response.data);
            } else {
                var data = await localForage.getItem('getEmergencyKitListAsync')
                if (data) {
                    console.log("Serving from cache");
                    commit('SET_LIST', data);
                } else {
                    console.log("Offline without data");
                }

            }

        },
        async createEmergencyKitAsync({ commit, rootState }, newKit) {
            if (rootState.globalStore.online) {
                try {
                    commit('ADD_START');
                    let response = await emergencyKitApi.create(newKit);
                    commit('ADD_SUCCESS', response.data);
                    return true;
                } catch (err) {
                    console.error(err);
                    commit('ADD_ERROR', 'Error creating emergency kit');
                }

            }
            else {
                commit('ADD_ERROR', 'Kit could not be created because you are currently offline');
            }
            return false;
        }
    }
}

export default emergencyKitStore;