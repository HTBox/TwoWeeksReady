import baseApiInstance from './base-api-instance';

const emergencyKitApi = {
    async getAll() {
        return (await baseApiInstance.getInstance()).get('basekits');
    }
}

export default emergencyKitApi;