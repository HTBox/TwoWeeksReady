import axios from 'redaxios';

const baseApiInstance = {
    getInstance() {
        const options = {};        
        options.baseURL = process.env.VUE_APP_APIROOT;     
        console.log(options);
        //options.headers.Authorization = "Bearer asdfjljaslfkjasldf";
        return axios.create(options);
    }
}


export default baseApiInstance;