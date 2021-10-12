<template>
  <v-container class="py-0">
    <v-app-bar app flat dense fixed  color="background">
      <v-icon class="mr-2">mdi-clipboard-list-outline</v-icon>
      <v-toolbar-title>Prepare</v-toolbar-title>
    </v-app-bar>
    <v-alert text v-if="showVersionBanner" dismissible type="error">
      You are using the {{versionTag}} version of 2 Weeks Ready. This version is
      for testing purposes only!
    </v-alert>

    <v-row>
      <v-col cols="12">
        <v-card
          to="/prepare/familyplan"
          color="primary"
          class="my-4"
          ripple
        >
          <v-card-title>
            <v-icon class="mr-2">mdi-notebook-multiple</v-icon>
            My Family Plan
          </v-card-title>
          <v-card-text>
            <div class="text-subtitle-1">Make an actionable plan to share with friends and family. Know what to do in the event of a disaster.</div>
          </v-card-text>
    
        </v-card>

        <v-card
          to="/prepare/emergencykits"
          color="primary"
          class="my-4"
          ripple
        >
          <v-card-title>
            <v-icon class="mr-2">mdi-medical-bag</v-icon>
            Emergency Kits
          </v-card-title>
          <v-card-text>
            <div class="text-subtitle-1">Create a grab-and-go kit so you have all that you need in the event
            of an emergency.</div>
          </v-card-text>          
        </v-card>

        <v-card
          to="prepare/hazardhunt"
          color="primary"
          class="my-4"
          ripple
        >
          <v-card-title>
            <v-icon class="mr-2">mdi-shield-search</v-icon>
            Hazard Hunt
          </v-card-title>
          <v-card-text>
            <div class="text-subtitle-1">Observe your surroundings and identify common hazards that could
            mean danger in certain situations.</div>
          </v-card-text>              
        </v-card>

        <v-card
          to="prepare/hazardinfo"
          color="primary"
          class="my-4"
          ripple
        >
          <v-card-title>
            <v-icon class="mr-2">mdi-shield-alert-outline</v-icon>
            Hazard Information
          </v-card-title>
          <v-card-text>
            <div class="text-subtitle-1">Learn all about common hazards.</div>
          </v-card-text>            
          <v-card-text align="left">

          </v-card-text>
        </v-card>

        <v-card color="primary" class="my-4" ripple>
          <v-card-title>
            <v-icon class="mr-2"
              >mdi-human-greeting-proximity</v-icon
            >
            Connect with the Community
          </v-card-title>
          <v-card-text>
            <div class="text-subtitle-1">ShakeOut information</div>
          </v-card-text>                      
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PrepareLanding",
  computed: {
    showVersionBanner() {
      return this.versionTag && this.versionTag  !== "PRODUCTION";
    },
    versionTag() {
      return process.env.VUE_APP_VERSION_TAG;
    }
  },
  data: () => ({}),
};
</script>
