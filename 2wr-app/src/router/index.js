import Vue from 'vue';
import VueRouter from 'vue-router';

import Prepare from '../views/prepare/prepare.vue';
import EmergencyKitListing from '../views/prepare/emergency-kits/emergency-kit-listing.vue';
import EmergencyKitCreatePage from '../views/prepare/emergency-kits/emergency-kit-create.vue';
import HazardHuntListing from '../views/prepare/hazards/hazard-hunt-list-view.vue';
import HazardInfoListing from '../views/prepare/hazards/hazard-info-list-view.vue';
import Recent from '../views/recent/recent.vue';
import Settings from '../views/settings/settings.vue';
import { getAuthInstance } from '../auth';

Vue.use(VueRouter);

const routes = [
    {
      path: '/',
      redirect: '/prepare'
    },
    {
      path: '/prepare',
      name: 'prepare',
      component: Prepare
    },
    {
      path: '/prepare/emergencykits',
      name: 'emergencykits',
      component: EmergencyKitListing,
      meta: { requiresAuth: true }
    },
    {
      path: '/prepare/emergencykits/create',
      name: 'emergencykitcreate',
      component: EmergencyKitCreatePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/prepare/hazardhunt',
      name: 'hazardhunt',
      component: HazardHuntListing,
      meta: { requiresAuth: false }
    },    {
    path: '/prepare/hazardinfo',
      name: 'hazardinfo',
      component: HazardInfoListing,
      meta: { requiresAuth: false }
    },
    {
      path: '/recent',
      name: 'recent',
      component: Recent
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      redirect: '/prepare'
    }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    const auth = getAuthInstance();
    if (!await auth.getIsAuthenticated()) {
      auth.loginWithRedirect(to.path);
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router;
