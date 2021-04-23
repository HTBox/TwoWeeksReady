import baseApiInstance from './base-api-instance';

export default {
  async getAll() {
    return (await baseApiInstance.getInstance()).get("familyplans-getall");
  },
  async upsertPlan(plan) {
      return (await baseApiInstance.getInstance()).post('familyplans-upsert', plan);
  },
  async deletePlan(plan) {
    return (await baseApiInstance.getInstance()).delete('familyplans-delete', plan);
}
}