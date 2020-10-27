import baseApiInstance from './base-api-instance';

const emergencyKitApi = {   
    getAll() {               
        return baseApiInstance.getInstance().get('emergencykits');
    }
}

export default emergencyKitApi;