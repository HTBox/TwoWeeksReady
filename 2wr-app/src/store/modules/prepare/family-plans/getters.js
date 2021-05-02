export default {
  findFamilyPlan: (state) => (id) => {
    let found = state.familyPlans.find(item => item.id === id);
    return found;
  }
}