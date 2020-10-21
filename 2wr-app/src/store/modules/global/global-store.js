const globalStore = {
    namespaced: true,
    state: {
        online: navigator.onLine
    },
    mutations: {
         SET_ONLINE_STATUS(state, payload) {
             state.online = payload;
         }
    },
    getters: {
        isOnline: state => state.online
    }
};

export default globalStore;