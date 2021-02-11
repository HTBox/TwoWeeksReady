<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
    <!-- Check that the SDK client is not currently loading before accessing is methods -->
    <div>
      <!-- show login when not authenticated -->

     <div v-if="isDevVersion">
       This is the dev version
     </div>
      <!-- show logout when authenticated -->
      <v-bottom-navigation
       
        app
        fixed
        grow
        color="primary"
      >
         <v-btn v-if="!$auth.isAuthenticated" height="100%" @click="login">
           <span>login</span>
          <v-icon>mdi-login-variant</v-icon>
         </v-btn>
        <v-btn  v-if="$auth.isAuthenticated" to="/prepare" height="100%">
          <span>Prepare</span>
          <v-icon>mdi-clipboard-list-outline</v-icon>
        </v-btn>
        <v-btn  v-if="$auth.isAuthenticated" to="/recent" height="100%">
          <span>Recent Events</span>
          <v-icon>mdi-calendar-star</v-icon>
        </v-btn>
        <v-btn  v-if="$auth.isAuthenticated" to="/settings" height="100%">
          <span>Settings</span>
          <v-icon>mdi-cog</v-icon>
        </v-btn>
                <v-btn  v-if="$auth.isAuthenticated" @click="logout" height="100%">
          <span>Logout</span>
          <v-icon>mdi-logout-variant</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App",
  computed: {
    isOnline() {
      return this.$store.getters["globalStore/isOnline"];
    }
  },
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
};
</script>
