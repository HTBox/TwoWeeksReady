import emergencyKitApi from '../../../../api/emergency-kit-api';
import localForage from 'localforage';

const emergencyKitStore = {
    namespaced: true,
    state: {
        list: []
    },
    mutations: {
        SET_LIST(state, payload) {
            state.list = payload;
        }
    },
    actions: {
        async getEmergencyKitListAsync({commit, rootState}){
            if(rootState.globalStore.online){
                let response = await emergencyKitApi.getAll();
                commit('SET_LIST', response.data);
                await localForage.setItem('getEmergencyKitListAsync', response.data);
            } else {
                var data = await localForage.getItem('getEmergencyKitListAsync')
                if(data){
                    console.log("Serving from cache");
                    commit('SET_LIST', data);
                } else {
                    console.log("Offline without data");
                }
                
            }
            
        }
    }
}

export default emergencyKitStore;