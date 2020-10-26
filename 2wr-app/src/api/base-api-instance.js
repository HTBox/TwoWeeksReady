import axios from 'axios';

const baseApiInstance = {
    getInstance() {
        const options = {};        
        options.baseURL = process.env.VUE_APP_APIROOT;        
        //options.headers.Authorization = "Bearer asdfjljaslfkjasldf";
        return axios.create(options);
    }
}


export default baseApiInstance;