const emergencyKitStore = {
    namespaced: true,
    state: {
        list: [
            {
              id: 1,
              name: 'Emergency Kit 1',
              color: 'cyan darken-3'
            },
            {
              id: 2,
              name: 'Emergency Kit 2',
              color: 'teal darken-3'
            },
    
            {
              id: 3,
              name: 'Emergency Kit 3',
              color: 'cyan darken-3'
            },
    
            {
              id: 4,
              name: 'Emergency Kit 4',
              color: 'teal darken-3'
            },
    
            {
              id: 5,
              name: 'Emergency Kit 5',
              color: 'blue-grey darken-1'
            }
          ]
    }
    //mutations: {
        // SET_LIST(state, payload) {
        //     state.list = payload;
        // }
    //},
    //actions: {
        // async getEmergencyKitListAsync({commit}){
        //     let response = await myapicall();
        //     commit('SET_LIST', response.data);
        // }
    //}
}

export default emergencyKitStore;