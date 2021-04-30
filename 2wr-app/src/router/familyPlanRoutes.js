import FamilyPlanLanding from '../views/prepare/family-plans/landing.vue';
import FamilyPlanView from '../views/prepare/family-plans/view.vue';
import FamilyPlanContacts from "../views/prepare/family-plans/contacts.vue"
import FamilyPlanRoutes from "../views/prepare/family-plans/routes.vue";

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
    path: '/prepare/familyplan/:planId',
    name: 'familyplan-view',
    component: FamilyPlanView,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/familyplan/:planId/emergencycontacts',
    name: "familyplay-contacts",
    component: FamilyPlanContacts,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/familyplan/:planId/routes',
    name: "familyplay-routes",
    component: FamilyPlanRoutes,
    props: true,
    meta: {
      requiresAuth: true
    }
  }
];