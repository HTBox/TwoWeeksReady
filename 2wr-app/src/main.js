import Vue from 'vue';
import App from './App.vue';
import './register-service-worker';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

Vue.config.productionTip = false

new Vue({
  vuetify,  
  router,
  store, 
  render: h => h(App),
  methods: {
    isOnlineChanged(){      
      this.$store.commit('globalStore/SET_ONLINE_STATUS', navigator.onLine);
    }
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
