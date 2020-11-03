import Vue from 'vue';
import App from './App.vue';
import './register-service-worker';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import { Auth0Plugin } from "./auth";

Vue.config.productionTip = false

Vue.use(Auth0Plugin, {
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientId: process.env.VUE_APP_AUTH0_CLIENTID,  
  audience: process.env.VUE_APP_AUTH0_AUDIENCE,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

new Vue({
  vuetify,  
  router,
  store, 
  render: h => h(App),
  methods: {
    isOnlineChanged(){      
      this.$store.commit('globalStore/SET_ONLINE_STATUS', navigator.onLine);
    },
  },
  mounted() {
    this.$store.commit('globalStore/SET_ONLINE_STATUS', navigator.onLine);
    window.addEventListener('online', this.isOnlineChanged);
    window.addEventListener('offline', this.isOnlineChanged);
  },
  beforeDestroy() {
    window.removeEventListener('online', this.isOnlineChanged);
    window.removeEventListener('offline', this.isOnlineChanged);
  }
}).$mount('#app');
