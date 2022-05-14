import Vue from 'vue';
import VueRouter from 'vue-router';

import Prepare from '../views/prepare/prepare.vue';
import Welcome from '../views/welcome/welcome.vue';
import MakeAPlan from '../views/prepare/make-a-plan/make-a-plan.vue';
import EmergencyKitBuildPage from '../views/prepare/emergency-kits/emergency-kit-build.vue';
import EmergencyKitListing from '../views/prepare/emergency-kits/emergency-kit-listing.vue';
import EmergencyKitDetailsPage from '../views/prepare/emergency-kits/emergency-kit-details.vue';
import HazardHuntListing from '../views/prepare/hazards/hazard-hunt-list-view.vue';
import HazardInfoListing from '../views/prepare/hazards/hazard-info-list-view.vue';
import HazardInfo from '../views/prepare/hazards/hazard-info-view.vue';
import HazardHunt from '../views/prepare/hazards/hazard-hunt-view.vue';
import Recent from '../views/recent/recent.vue';
import Settings from '../views/settings/settings.vue';

import {
  getAuthInstance
} from '../auth';

import FamilyPlanRoutes from "./familyPlanRoutes";

Vue.use(VueRouter);

const routes = [{
    path: '/',
    redirect: '/prepare'
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: Welcome
  },
  {
    path: '/prepare',
    name: 'prepare',
    component: Prepare
  },
  {
    path: '/prepare/makeaplan',
    name: 'makeaplan',
    component: MakeAPlan,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/emergencykits/build',
    name: 'emergencykitsbuild',
    component: EmergencyKitBuildPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/emergencykits/:baseKitId/create',
    name: 'emergencykitcreate',
    component: EmergencyKitDetailsPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/emergencykits/:baseKitId',
    name: 'emergencykits',
    component: EmergencyKitListing,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/emergencykits/:baseKitId/edit/:id',
    name: 'emergencykitedit',
    component: EmergencyKitDetailsPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/hazardhunt',
    name: 'hazardhunt',
    component: HazardHuntListing,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/hazardhunt/:id',
    name: 'hazardhuntdetails',
    component: HazardHunt,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/prepare/hazardinfo',
    name: 'hazardinfolist',
    component: HazardInfoListing,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/prepare/hazardinfo/:id',
    name: 'hazardinfodetails',
    component: HazardInfo,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/recent',
    name: 'recent',
    component: Recent
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      requiresAuth: true
    } 
  },
  {
    path: '*',
    redirect: '/prepare'
  },
  ...FamilyPlanRoutes
];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach(async (to, from, next) => {
  if(!localStorage.getItem('welcomeCompleted') && to.name !== 'welcome') {
    router.push('welcome');
  }

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