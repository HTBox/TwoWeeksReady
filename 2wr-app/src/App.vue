<template>
  <v-app>
    <v-main>
      <v-overlay v-if="isBusy" absolute v-ripple="{ center: true }">
        <div class="text-center headline">
          <v-icon>mdi-loading mdi-spin</v-icon> Loading...
        </div>
      </v-overlay>
      <router-view></router-view>
      <v-dialog persistent :value="error">
        <v-card>
          <v-card-title class="red--text"><v-icon color="red">mdi-exclamation-thick</v-icon> Error Occurred</v-card-title>
          <v-card-text class="body-1">{{ error }}</v-card-text>
          <v-card-actions>
            <v-btn text @click="$store.commit('setError', '')">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
    <!-- Check that the SDK client is not currently loading before accessing is methods -->
    <div>
      <!-- show login when not authenticated -->

      <!-- show logout when authenticated -->
      <v-bottom-navigation app fixed grow color="primary">
        <v-btn v-if="!$auth.isAuthenticated" height="100%" @click="login">
          <span>login</span>
          <v-icon>mdi-login-variant</v-icon>
        </v-btn>
        <v-btn v-if="$auth.isAuthenticated" to="/prepare" height="100%">
          <span>Prepare</span>
          <v-icon>mdi-clipboard-list-outline</v-icon>
        </v-btn>
        <v-btn v-if="$auth.isAuthenticated" to="/recent" height="100%">
          <span>Recent Events</span>
          <v-icon>mdi-calendar-star</v-icon>
        </v-btn>
        <v-btn v-if="$auth.isAuthenticated" to="/settings" height="100%">
          <span>Settings</span>
          <v-icon>mdi-cog</v-icon>
        </v-btn>
        <v-btn v-if="$auth.isAuthenticated" @click="logout" height="100%">
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
    },
    isBusy() {
      return this.$store.state.isBusy;
    },
    error() {
      return this.$store.state.error;
    },
  },
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
  },
};
</script>

<!-- Global Styles -->
<style>
.hidden {
  display: none;
}
.img-cover {
  object-fit: cover;
}
</style>
