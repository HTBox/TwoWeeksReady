import axios from "axios";
import { getAuthInstance } from "../auth";
const baseApiInstance = {
  async getInstance(customOptions) {
    // Allows options to be added by specific APIs
    const options = { ...customOptions };
    options.baseURL = process.env.VUE_APP_APIROOT;
    const token = await getAuthInstance().getTokenSilently();
    
    // Allows headers to be set by client
    if (options.headers) {
      options.headers.Authorization = `Bearer ${token}`;
    } else {
      options.headers = {
        Authorization: `Bearer ${token}`
      };
    }
    return axios.create(options);
  }
};

export default baseApiInstance;
