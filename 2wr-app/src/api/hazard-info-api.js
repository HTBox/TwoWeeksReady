import baseApiInstance from './base-api-instance';

export default {
    async getAll() {
        return (await baseApiInstance.getInstance()).get('hazardinfo-list');
    },
};