import baseApiInstance from './base-api-instance';

export default {
  async getFamilyPlans() {
    return (await baseApiInstance.getInstance()).get("familyplans-get");
  },
  async create(plan) {
      return (await baseApiInstance.getInstance()).post('familyplans-create', plan);
  }
}