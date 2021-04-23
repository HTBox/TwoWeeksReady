<template>
  <v-container class="py-0" v-if="plan">
    <v-fab-transition>
      <v-btn color="green" dark absolute bottom right fab class="mb-12">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-app-bar app flat dense fixed>
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-toolbar-title>{{ plan.title }} - Emergency Contacts</v-toolbar-title>
    </v-app-bar>
    <v-card v-for="contact in contacts" :key="contact.fullName">
      <EmergencyContact :contact="contact"></EmergencyContact>
    </v-card>
  </v-container>
</template>

<script>
import {
  ref,
  reactive,
  onMounted,
  defineComponent,
} from "@vue/composition-api";
import goBack from "@/functions/goBack.js";
import _ from "lodash";
import store from "@/store";
import EmergencyContact from "./emergencyContact.vue";

export default defineComponent({
  name: "family-plan-contacts",
  components: {
    EmergencyContact,
  },
  props: { planId: { required: true } },
  setup(props) {
    const contacts = ref(null);
    const plan = ref(null);

    onMounted(() => {
      let found = store.getters["familyPlansStore/findFamilyPlan"](
        props.planId
      );
      if (found) {
        contacts.value = reactive(_.cloneDeep(found.emergencyContacts));
        plan.value = reactive(found);
      } else {
        goBack();
      }
    });


    return {
      contacts,
      goBack,
      plan
    };
  },
});
</script>
