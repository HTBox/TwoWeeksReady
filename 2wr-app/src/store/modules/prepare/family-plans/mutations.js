export default {
  setFamilyPlans: (state, plans) => (state.familyPlans = plans),
  setSharedPlans: (state, plans) => (state.sharedPlans = plans),
  addToFamilyPlans: (state, newPlan) =>
    state.familyPlans.splice(state.familyPlans.length, 0, newPlan),
  replaceContact: (state, { contact, plan }) => {
    const index = plan.emergencyContacts.findIndex(i => i.id == contact.id);
    plan.emergencyContacts.splice(index, 1, contact);
  },
  addContact: (state, { contact, plan }) => {
    plan.emergencyContacts.splice(plan.emergencyContacts.length, 0, contact);
  },
  replaceRoute: (state, { route, plan }) => {
    const index = plan.routeLocations.findIndex(i => i.id == route.id);
    plan.routeLocations.splice(index, 1, route);
  },
  addRoute: (state, { route, plan }) => {
    plan.routeLocations.splice(plan.routeLocations.length, 0, route);
  },
  addPhoto: (state, { photo, route }) => {
    route.images.splice(route.images.length, 0, photo);
  }
};
