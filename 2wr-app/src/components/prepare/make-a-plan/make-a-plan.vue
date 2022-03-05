<template>
    <v-container class="py-0">
      <v-app-bar app flat dense fixed  color="background">
        <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>        
        <v-toolbar-title>Make A Plan</v-toolbar-title>
      </v-app-bar>
      <v-row dense>
        <v-col cols="12">
          <p class="pa-2 headline">Placeholder</p>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn x-large to="/prepare/familyplan"  color="primary" width="80%">My Family Plan</v-btn>
        </v-col>
      </v-row>

    </v-container>
</template>

<script>


export default {
  
}
</script>

<style>

</style>