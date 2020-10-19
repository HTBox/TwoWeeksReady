<template>
  <v-container class="py-0">
    <v-app-bar app flat dense fixed>
      <v-icon class="mr-2">mdi-clipboard-list-outline</v-icon>
      <v-toolbar-title>Prepare</v-toolbar-title>
    </v-app-bar>

    <v-row class="text-center">
      <v-col cols="12">
         <v-card color="cyan darken-3" class="my-4" ripple>
            <v-card-title class="white--text">
              <v-icon color="white" class="mr-2">mdi-notebook-multiple</v-icon>
              My Family Plan
            </v-card-title>
            <v-card-text class="text-left white--text">
              Make an actionable plan to share with friends and family. Know what to do in the event of a disaster.
            </v-card-text>
         </v-card>

         <v-card to="/prepare/emergencykits" color="deep-orange darken-4" class="my-4" ripple>
           <v-card-title class="white--text">
             <v-icon color="white" class="mr-2">mdi-medical-bag</v-icon>
             Emergency Kits
           </v-card-title>
           <v-card-text align="left" class="white--text">
             Create a grab-and-go kit so you have all that you need in the event of an emergency.
           </v-card-text>
         </v-card>
         
         <v-card color="yellow darken-4" class="my-4" ripple>
           <v-card-title class="white--text">
             <v-icon color="white" class="mr-2">mdi-shield-search</v-icon>
             Hazard Hunt
           </v-card-title>
           <v-card-text align="left" class="white--text">
             Observe your surroundings and identify common hazards that could mean danger in certain situations.
           </v-card-text>
         </v-card>
         
         <v-card color="teal darken-3" class="my-4" ripple>
           <v-card-title class="white--text">
             <v-icon color="white" class="mr-2">mdi-shield-alert-outline</v-icon>
             Hazard Information
           </v-card-title>
           <v-card-text class="white--text" align="left">
             Learn all about common hazards.
           </v-card-text>
         </v-card>
         
         <v-card color="blue-grey darken-1" class="my-4" ripple>
           <v-card-title class="white--text">
             <v-icon color="white" class="mr-2">mdi-human-greeting-proximity</v-icon>
             Connect with the Community
           </v-card-title>
           <v-card-text class="white--text" align="left">
             ShakeOut information
           </v-card-text>
         </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PrepareLanding',
    data: () => ({}),
  }
</script>
