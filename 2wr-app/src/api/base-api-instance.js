import axios from 'axios';
import { getAuthInstance } from '../auth';
const baseApiInstance = {
    async getInstance() {
        const options = {};
        options.baseURL = process.env.VUE_APP_APIROOT;
        const token = await getAuthInstance().getTokenSilently();
        options.headers = {
            Authorization: `Bearer ${token}`
        };
        return axios.create(options);
    }
}


export default baseApiInstance;