<template>
  <v-container class="py-0">
    <v-app-bar app flat dense fixed color="background">
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-toolbar-title>Make A Plan</v-toolbar-title>
    </v-app-bar>
    <v-row dense>
      <v-col cols="12">
        <p class="pa-2">
          Having a family disaster plan gives you peace of mind when disaster
          strikes - everyone knows what to do, where to go, and how to
          communicate. Add people and pets to your plan, establish an out of
          area contact, discuss reunification, and your action steps during a
          disaster below!
        </p>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-btn
          v-if="thePlan"
          x-large
          to="/prepare/familyplan"
          color="primary"
          width="80%"
          >My Family Plan</v-btn
        >
        <v-btn
          v-if="!thePlan"
          x-large
          to="/prepare/familyplan"
          color="primary"
          width="80%"
          >Create a Plan</v-btn
        >
      </v-col>
      <v-col cols="12" v-if="thePlan">
        <v-card class="my-1" color="secondary">
          <v-card-title class="white--text">Action Steps</v-card-title>
        </v-card>
        <v-card class="my-1" color="secondary">
          <v-card-title class="white--text">My Contacts</v-card-title>
        </v-card>
        <v-row dense>
          <v-col v-for="contact in thePlan.emergencyContacts" :key="contact.id">
            <v-card class="pa-1" outline>
              <v-card-subtitle>{{ contact.fullName }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <v-row dense>
          <v-btn width="50%">Share My Plan</v-btn>
          <v-btn width="50%">Edit</v-btn>
        </v-row>
        <v-row>
          <p class="pa-2">
            Share your plan with others you trust so they have access to
            important information in your emergency plan. They can share them
            with you as well.
          </p>
        </v-row>
      </v-col>
      <v-card class="my-1" color="secondary" width="100%">
        <v-card-title class="white--text">Plans Shared With Me</v-card-title>
      </v-card>
      <h2>Coming soon...</h2>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import store from "@/store";
export default defineComponent({
  setup() {
    const thePlan = ref(null);
    // TODO: Add shared plans once implemented
    //const sharedPlans = ref([]);

    onMounted(async () => {
      await store.dispatch("familyPlansStore/getAllAsync");
      const plans = store.state.familyPlansStore.familyPlans;
      if (plans && plans.length > 0) {
        thePlan.value = plans[0];
      }
      await store.dispatch("familyPlansStore/getAllAsync");
    });

    return {
      thePlan
    };
  }
});
</script>

<style></style>
