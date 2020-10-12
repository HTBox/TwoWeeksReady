import Vue from 'vue';
import VueRouter from 'vue-router';

import Prepare from '../views/prepare/Prepare.vue';
import EmergencyKitListing from '../views/prepare/EmergencyKits/List.vue';

import Recent from '../views/recent/Recent.vue';
import Settings from '../views/settings/Settings.vue';

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
