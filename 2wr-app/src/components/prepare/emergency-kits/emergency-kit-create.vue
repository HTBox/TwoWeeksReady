<template>
  <v-container class="py-0">
    <v-app-bar app flat dense fixed>
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-icon class="mr-2">mdi-medical-bag</v-icon>
      <v-toolbar-title>Emergency Kit Create</v-toolbar-title>
    </v-app-bar>
    <v-form>      
      <v-text-field label="Kit name" v-model="name" required/>
      Color:
      <v-color-picker v-model="color" flat></v-color-picker>
      <v-alert v-if="saveErrorMessage"
      type="error"
      >{{saveErrorMessage}}</v-alert>
      <v-btn :disabled="isSaving" :loading="isSaving" class="mr-4" @click="createKit"> create </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "EmergencyKitCreate",
  data: () => ({
    name: "",
    color: "#0000FF",
    items: ""
  }),
  computed: mapState({
    isSaving: (state) => state.emergencyKitStore.isSaving,
    saveErrorMessage: (state) => state.emergencyKitStore.saveErrorMessage
  }),
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    async createKit() {
      const success = await this.$store.dispatch("emergencyKitStore/createEmergencyKitAsync", {
        name: this.name,
        color: this.color,
        icon: 'mdi-medical-bag'
      });
      if (success) { 
        this. goBack();
      }
    },
  },
};
</script>