import baseApiInstance from './base-api-instance';

export default {
    async getDocuments() {
        return (await baseApiInstance.getInstance()).get('hazardhunt-list');
    },
};