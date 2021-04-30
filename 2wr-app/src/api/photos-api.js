import baseApiInstance from "./base-api-instance";

export default {
  async uploadPhoto(photo) {
    console.log(photo);
    return (await baseApiInstance.getInstance()).post("photo", photo, {
      headers: {
        "Content-Type": photo.type
      }
    });
  }
};
