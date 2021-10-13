<template>
  <v-container>
    <v-row class="text-left">
      <v-col cols="10">
        <img src="/img/icons/safari-pinned-tab.svg" width="350" />
        <div v-if="stage === 1">
          <h2>Welcome to 2 weeks ready</h2>
          <p>
            <strong>2 Weeks Ready</strong> is a mobile application that makes
            emergency preparedness a <strong>simple</strong>,
            <strong>easy</strong>, <strong>sharable</strong>, and
            <strong>time-saving</strong> experience to protect you and people
            you care about.
          </p>
        </div>
        <div v-if="stage === 2">
          <h2>You and earthquake risk</h2>
          <p>
            The Pacific Northwest is earthquake country with the
            <strong
              >second highest risk for earthquakes in the United States!</strong
            >
            There are also a wide assortment of hazards that can impact you
            including tsunamis, volcanic eruptions, and wildfires to name a few.
          </p>
        </div>
        <div v-if="stage === 3">
          <h2>Let's get started!</h2>
          <p>
            There's a lot to prepare for and learn about. <strong>2 Weeks Ready can
            help!</strong> Are you ready to start your preparedness Journey? <strong>Let's begin
            by creating an account and answering some questions.</strong>
          </p>
        </div>
      </v-col>
    </v-row>
    <v-fab-transition>
      <v-btn
        color="green"
        dark
        absolute
        bottom
        right
        fab
        class="mb-12"
        @click="next()"
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

      if(this.stage > 3){
        this.$auth.loginWithRedirect("/")
      }
    },
  },
};
</script>
