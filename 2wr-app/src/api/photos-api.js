import baseApiInstance from "./base-api-instance";
import { getAuthInstance } from "../auth";

export default {
  async uploadPhoto(photo) {

    const token = await getAuthInstance().getTokenSilently();

    // Can't use redaxios (bug dealing with blobs, so use fetch)
    return fetch(`${process.env.VUE_APP_APIROOT}photo`,{
      method: "POST",
      body: photo,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": photo.type
      }
    });
  },

  async getPhoto(photo) {
    return (await baseApiInstance.getInstance({ responseType: "blob", headers: { Accept: "image/*"}})).get(`photo/${photo}`);  
  }
};
