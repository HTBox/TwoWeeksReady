import baseApiInstance from './base-api-instance';

const emergencyKitApi = {
    async getAllByBaseKitId(baseKitId) {
        return (await baseApiInstance.getInstance()).get(`emergencykits/${baseKitId}`);
    },
    async getById(id) {
        return (await baseApiInstance.getInstance()).get(`emergencykit-by-id/${id}`);
    },
    async create(newKit) {
        return (await baseApiInstance.getInstance()).post('emergencykit-create', newKit);
    },
    async save(updatedKit) {
        return (await baseApiInstance.getInstance()).put('emergencykit-update', updatedKit);
    }
}

export default emergencyKitApi;