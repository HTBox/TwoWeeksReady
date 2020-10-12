<template>
  <v-app>
    <v-main>       
      <router-view></router-view>
    </v-main>
    <v-bottom-navigation app fixed grow color="primary">     
      <v-btn to="/prepare" height="100%">        
        <span>Prepare</span>
        <v-icon>mdi-clipboard-list-outline</v-icon>
      </v-btn>
      <v-btn to="/recent" height="100%">
        <span>Recent Events</span>
        <v-icon>mdi-calendar-star</v-icon>
      </v-btn>
      <v-btn to="/settings" height="100%">
        <span>Settings</span>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>
