<template>
  <v-app :style="{background: $vuetify.theme.themes[theme].background}">
    <div v-if="isBusy" class="loading-line" role="progressbar"></div>
    <v-main id="theMain">
      <router-view></router-view>
      <v-dialog persistent :value="error">
        <v-card>
          <v-card-title class="red--text"
            ><v-icon color="red">mdi-exclamation-thick</v-icon> Error
            Occurred</v-card-title
          >
          <v-card-text class="body-1">{{ error }}</v-card-text>
          <v-card-actions>
            <v-btn text @click="$store.commit('setError', '')">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
    <!-- Check that the SDK client is not currently loading before accessing is methods -->
      <!-- show login when not authenticated -->

    <!-- show logout when authenticated -->
    <v-bottom-navigation background-color="secondary" dark role="navigation" fixed>
      <v-btn v-if="!$auth.isAuthenticated" height="100%" @click="login" color="secondary">
        <span>Login</span>
        <v-icon>mdi-login-variant</v-icon>
      </v-btn>
      <v-btn v-if="$auth.isAuthenticated" to="/prepare" height="100%" color="secondary">
        <span>Prepare</span>
        <v-icon>mdi-clipboard-list-outline</v-icon>
      </v-btn>
      <v-btn v-if="$auth.isAuthenticated" to="/recent" height="100%" color="secondary">
        <span>Recent Events</span>
        <v-icon>mdi-calendar-star</v-icon>
      </v-btn>
      <v-btn v-if="$auth.isAuthenticated" to="/settings" height="100%" color="secondary">
        <span>Settings</span>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn v-if="$auth.isAuthenticated" @click="logout" height="100%" color="secondary">
        <span>Logout</span>
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </v-bottom-navigation>
  
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
     theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
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

<style scoped>

#theMain {
  margin-bottom: 3rem;
}

.theme--dark.v-bottom-navigation .v-btn:not(.v-btn--active)
{
  color: rgba(255, 255, 255, .95) !important;
}

.loading-line {
  height: 3px;
  position: absolute;
  top: 0;
  background-color: #eeffff;
  animation: loading-animate 5s linear infinite;
  z-index: 50;
}

@keyframes loading-animate {
  0% {
    width: 0%;
    background-color: #dff;
  }
  10% {
    width: 5%;
    background-color: #cff;
  }
  20% {
    width: 10%;
    background-color: #bff;
  }
  30% {
    width: 15%;
    background-color: #aef;
  }
  40% {
    width: 25%;
    background-color: #8cf;
  }
  50% {
    width: 35%;
    background-color: #7af;
  }
  60% {
    width: 50%;
    background-color: #69f;
  }
  70% {
    width: 65%;
    background-color: #57f;
  }
  80% {
    width: 80%;
    background-color: #38f;
  }
  90% {
    width: 90%;
    background-color: #03f;
  }
  100% {
    width: 100%;
    background-color: #00f;
  }

  0% {
    width: 0%;
    background-color: #eff;
  }
}
</style>
