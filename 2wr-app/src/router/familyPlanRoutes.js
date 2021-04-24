import FamilyPlanLanding from '../views/prepare/family-plans/landing.vue';
import FamilyPlanView from '../views/prepare/family-plans/view.vue';
import FamilyPlanContacts from "../views/prepare/family-plans/contacts.vue"

export default [
  {
    path: '/prepare/familyplan',
    name: 'familyplan',
    component: FamilyPlanLanding,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/familyplan/view/:planId',
    name: 'familyplan-view',
    component: FamilyPlanView,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/familyplan/emergencycontacts/:planId',
    name: "familyplay-contacts",
    component: FamilyPlanContacts,
    props: true,
    meta: {
      requiresAuth: true
    }
  }
];