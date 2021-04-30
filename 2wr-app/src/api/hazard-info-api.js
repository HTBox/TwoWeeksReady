import baseApiInstance from './base-api-instance';

export default {
    async createPhoto(photo) {
        return (await baseApiInstance.getInstance()).post('photos', photo);
    },
};