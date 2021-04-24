<template>
  <v-container class="py-0" v-if="plan">
    <v-fab-transition>
      <v-btn
        color="green"
        dark
        absolute
        bottom
        right
        fab
        class="mb-12"
        @click="addNew"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-app-bar app flat dense fixed>
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-toolbar-title>{{ plan.title }} - Emergency Contacts</v-toolbar-title>
    </v-app-bar>
    <v-card v-for="contact in contacts" :key="contact.fullName">
      <EmergencyContactView :contact="contact" @launchEditor="launchEditor"></EmergencyContactView>
    </v-card>
    <v-dialog v-model="showEditor" persistent>
      <EmergencyContactEditor
        v-if="showEditor"
        :contact="editorContact"
        @cancel="showEditor = false"
        @save="save"
      ></EmergencyContactEditor>
    </v-dialog>
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
import store from "@/store";
import EmergencyContactView from "./emergency-contact-view.vue";
import EmergencyContactEditor from "./emergency-contact-editor.vue";
import EmergencyContact from "@/models/family-plans/EmergencyContact";

export default defineComponent({
  name: "family-plan-contacts",
  components: {
    EmergencyContactView,
    EmergencyContactEditor
  },
  props: { planId: { required: true } },
  setup(props) {
    const contacts = ref(null);
    const plan = ref(null);

    const editorContact = ref(null);
    const showEditor = ref(false);

    onMounted(() => {
      let found = store.getters["familyPlansStore/findFamilyPlan"](
        props.planId
      );
      if (found) {
        contacts.value = reactive(found.emergencyContacts);
        plan.value = reactive(found);
      } else {
        goBack();
      }
    });

    function launchEditor(contact) {
      editorContact.value = contact;
      showEditor.value = true;
    }

    async function save(contact) {
      await store.dispatch("familyPlansStore/updateContactAsync", { contact, planId: plan.value.id});
      showEditor.value = false;
    }

    function addNew() {
      launchEditor(new EmergencyContact());
    }

    return {
      contacts,
      goBack,
      plan,
      editorContact,
      showEditor,
      save,
      launchEditor,
      addNew
    };
  },
});
</script>
