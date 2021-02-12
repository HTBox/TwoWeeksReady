import baseApiInstance from './base-api-instance';

const emergencyKitApi = {
    async getAll() {
        return (await baseApiInstance.getInstance()).get('emergencykits');
    },
    async create(newKit) {
        return (await baseApiInstance.getInstance()).post('emergencykit-create', newKit);
    }
}

export default emergencyKitApi;