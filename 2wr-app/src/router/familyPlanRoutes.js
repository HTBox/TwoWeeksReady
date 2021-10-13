import FamilyPlanLanding from '../views/prepare/family-plans/landing.vue';
import FamilyPlanView from '../views/prepare/family-plans/view.vue';
import FamilyPlanContacts from "../views/prepare/family-plans/contacts.vue"
import FamilyPlanDistantContacts from "../views/prepare/family-plans/distant-contacts.vue"
import FamilyPlanRoutes from "../views/prepare/family-plans/routes.vue";
import FamilyPlanChildren from '@/views/prepare/family-plans/children.vue';
import FamilyPlanPets from '@/views/prepare/family-plans/pets.vue';

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
    path: '/prepare/familyplan/:planId/distantcontacts',
    name: "familyplan-distantcontacts",
    component: FamilyPlanDistantContacts,
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
  },
  {
    path: '/prepare/familyplan/:planId/children',
    name: "familyplay-children",
    component: FamilyPlanChildren,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/familyplan/:planId/pets',
    name: "familyplay-pets",
    component: FamilyPlanPets,
    props: true,
    meta: {
      requiresAuth: true
    }
  }
];
