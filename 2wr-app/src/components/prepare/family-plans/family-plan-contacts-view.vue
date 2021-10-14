<template>
  <v-container class="py-0" v-if="plan">
    <v-fab-transition>
      <v-btn
        v-if="contacts.length == 0 || !distant"
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
    <InfoBar v-if="distant" :title="`${plan.title} - Out of Area Contact`"></InfoBar>
    <InfoBar v-if="!distant" :title="`${plan.title} - Emergency Contacts`"></InfoBar>
    <v-card class="pa-2" v-if="contacts.length == 0"><em>Press <strong>'+'</strong> to add a new contact.</em></v-card>
    <v-card v-for="contact in contacts" :key="contact.fullName">
      <EmergencyContactView v-if="contact.distant === distant" :contact="contact" :distant="distant" @launchEditor="launchEditor"></EmergencyContactView>
    </v-card>
    <v-dialog v-model="showEditor" persistent>
      <EmergencyContactEditor
        v-if="showEditor"
        :contact="editorContact"
        :distant="distant"
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
import EmergencyContactEditor from "./editors/emergency-contact-editor.vue";
import EmergencyContact from "@/models/family-plans/EmergencyContact";

export default defineComponent({
  name: "family-plan-contacts",
  components: {
    EmergencyContactView,
    EmergencyContactEditor
  },
  props: { planId: { required: true }, distant: { required: true } },
  setup(props) {
    const contacts = ref(null);
    const plan = ref(null);
    const editorContact = ref(null);
    const showEditor = ref(false);
    const distant = ref(false);

    onMounted(() => {
      distant.value = props.distant;
      let found = store.getters["familyPlansStore/findFamilyPlan"](
        props.planId
      );
      if (found) {
        contacts.value = reactive(found.emergencyContacts ? found.emergencyContacts : []);
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
      let contact = new EmergencyContact();
      contact.distant = distant.value;
      launchEditor(contact);
    }

    return {
      distant,
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
