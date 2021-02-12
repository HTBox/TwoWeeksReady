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
      <v-select label="Icon" v-model="icon" :items="icons" required>
        <template v-slot:item="{ item }">
          <v-divider class="mb-2"></v-divider>
          <v-list-item disabled>
            <v-list-item-avatar :color="color">
              <v-icon
                color="white"
              >
                {{item.value}}
              </v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </template>
        <template v-slot:selection="{ item }">
          <v-list-item-avatar :color="color">
            <v-icon
              color="white"
            >
              {{item.value}}
            </v-icon>
          </v-list-item-avatar>
        </template>
      </v-select>
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
    icon: "",
    items: ""
  }),
  computed: mapState({
    isSaving: (state) => state.emergencyKitStore.isSaving,
    saveErrorMessage: (state) => state.emergencyKitStore.saveErrorMessage,
    icons: () => {

      const materialIcons = [
        'mdi-alarm-light',
        'mdi-allergy',
        'mdi-ambulance',
        'mdi-bacteria',
        'mdi-bandage',
        'mdi-biohazard',
        'mdi-bottle-tonic-skull',
        'mdi-beehive-outline',
        'mdi-car-emergency',
        'mdi-campfire',
        'mdi-flash',
        'mdi-fire-extinguisher',
        'mdi-hospital-building',
        'mdi-skull-crossbones',
        'mdi-tank'
      ]

      return materialIcons.map(i => {
        return {
          value: i,
          text: i
        }
      })
    }
  }),
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    async createKit() {
      const success = await this.$store.dispatch(`emergencyKitStore/createEmergencyKitAsync`, {
        name: this.name,
        color: this.color,
        icon: this.icon
      });
      if (success) { 
        this.goBack();
      }
    },
  },
};
</script>