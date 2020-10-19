import Vue from 'vue';
import VueRouter from 'vue-router';

import Prepare from '../views/prepare/prepare.vue';
import EmergencyKitListing from '../views/prepare/emergency-kits/emergency-kit-listing.vue';
import Recent from '../views/recent/recent.vue';
import Settings from '../views/settings/settings.vue';

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
      component: EmergencyKitListing
    },
    {
      path: '/recent',
      name: 'recent',
      component: Recent
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '*',
      redirect: '/prepare'
    }
];

const router = new VueRouter({
  routes
});

export default router;
