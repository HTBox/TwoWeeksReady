<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <img src="/img/icons/safari-pinned-tab.svg" width="350" alt="2 Weeks Ready Backpack Logo"/>
      </v-col>

      <v-col v-if="stage === 1" cols="12" md="6" offset-md="3" class="text-left pa-6">
        <h1 class="text-center text-uppercase text-h2">Welcome to 2 weeks ready</h1>
        <p :style="{color: '#BBBBBB'}">
          <strong>2 Weeks Ready</strong> is a mobile application that makes
          emergency preparedness a <strong>simple</strong>,
          <strong>easy</strong>, <strong>sharable</strong>, and
          <strong>time-saving</strong> experience to protect you and people you
          care about.
        </p>
      </v-col>
      <v-col v-if="stage === 2" cols="12" md="6" offset-md="3" class="text-left pa-6">
        <h2 class="text-center text-uppercase">You and earthquake risk</h2>
        <p>
          The Pacific Northwest is earthquake country with the
          <strong
            >second highest risk for earthquakes in the United States!</strong
          >
          There are also a wide assortment of hazards that can impact you
          including tsunamis, volcanic eruptions, and wildfires to name a few.
        </p>
      </v-col>
      <v-col v-if="stage === 3" cols="12" md="6" offset-md="3" class="text-left pa-6">
        <h2 class="text-center text-uppercase">Let's get started!</h2>
        <p>
          There's a lot to prepare for and learn about.
          <strong>2 Weeks Ready can help!</strong> Are you ready to start your
          preparedness Journey?
          <strong
            >Let's begin by creating an account and answering some
            questions.</strong
          >
        </p>
      </v-col>
    </v-row>
    <v-fab-transition>
      <v-btn
        data-testid="welcome-next-button"
        color="green"
        dark
        absolute
        bottom
        right
        fab
        class="mb-12 welcome-next-button"
        @click="next()"
        aria-label="Next"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
export default {
  name: "WelcomeLanding",
  data: () => ({
    stage: 1,
  }),
  methods: {
    next() {
      this.stage++;

      if (this.stage > 3) {
        localStorage.setItem("welcomeCompleted", "true");
        this.$auth.loginWithRedirect("/");
      }
    },
  },
};
</script>
<style>
  .v-btn--fab.welcome-next-button {
    z-index: 10
  }
</style>
