import baseApiInstance from './base-api-instance';

export default {
  async getAll() {
    return (await baseApiInstance.getInstance()).get("familyplans-get");
  },
  async updatePlan(plan) {
      return (await baseApiInstance.getInstance()).post('familyplans-update', plan);
  }
}