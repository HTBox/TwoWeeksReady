<template>
  <v-container class="py-0" v-if="plan">
    <v-fab-transition>
      <v-btn color="red"
             dark
             absolute
             bottom
             right
             fab
             class="mb-12"
             @click="deletePlan">
        <v-icon>mdi-delete-forever</v-icon>
      </v-btn>
    </v-fab-transition>

    <InfoBar title="Family Plan"></InfoBar>
    <v-flex>
      <v-row justify="end" class="py-6 cursor-pointer" @click="toggleAlerts">
        <div class="text-button px-6">{{ plan.allowAlerts ? 'Alerts Enabled' : 'Alerts Disabled'}}</div>
        <v-icon plain
                large
                class="mr-6"
                :class="{ 'red--text': plan.allowAlerts }">{{ plan.allowAlerts ? 'mdi-alarm-light' : 'mdi-alarm-light-off'}}</v-icon>
      </v-row>
    </v-flex>
    <EditableTextBlock label="Plan Name"
                       v-model="plan.title"
                       isTitle
                       :rules="rules.title"
                       @save="updatePlan"
                       class="mt-2"></EditableTextBlock>
    <v-spacer class="my-4" />
    <AddressView @save="updatePlan"
                 v-model="plan.address"
                 title="Home Address"></AddressView>
    <v-spacer class="my-4" />
    <EditableTextBlock icon="mdi-phone"
                       label="Phone Number"
                       v-model="plan.phoneNumber"
                       @save="updatePlan"
                       :rules="rules.phone"></EditableTextBlock>
    <v-spacer class="my-4" />

    <div class="my-family">
      <v-row>

        <v-col cols="6" v-for="child in plan.children" :key="child.id">
          <v-card class="pa-2 mb-1">
            <IconTextBlock icon="mdi-pencil"
                           :allowSelected="true"
                           @selected="launchChildEditor(child)">
              <v-row>
                <v-col class="flex-grow-0 flex-shrink-0">
                  <v-layout v-if="!child.image" class="mr-n3" style="width: 50px; height: 50px;">&nbsp;</v-layout>
                  <SecureImg v-if="child.image"
                             :src="child.image"
                             :alt="child.name"
                             class="img-cover mr-n3"
                             max-width="100%"
                             width="50" height="50" />
                </v-col>
                <v-col>
                  <h3>{{ child.name }}</h3>
                </v-col>
              </v-row>
            </IconTextBlock>
          </v-card>
        </v-col>

        <v-col cols="6" v-for="pet in plan.pets" :key="pet.id">
          <v-card class="pa-2 mb-1">
            <IconTextBlock icon="mdi-pencil"
                           :allowSelected="true"
                           @selected="launchPetEditor(pet)">
              <v-row>
                <v-col class="flex-grow-0 flex-shrink-0">
                  <v-layout v-if="!pet.image" class="mr-n3" style="width: 50px; height: 50px;">&nbsp;</v-layout>
                  <SecureImg v-if="pet.image"
                             :src="pet.image"
                             :alt="pet.name"
                             class="img-cover mr-n3"
                             max-width="100%"
                             width="50" height="50" />
                </v-col>
                <v-col>
                  <h3>{{ pet.name }}</h3>
                </v-col>
              </v-row>
            </IconTextBlock>
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card class="pa-2 mb-1"
                  ripple
                  @click="ensureNamed('Add Family Member', 'addfamilymember')">
            <v-flex class="d-flex justify-space-between px-2 py-2">
              <div>Add</div>
              <div>
                <v-icon class="mr-2">mdi-plus</v-icon>
              </div>
            </v-flex>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-spacer class="my-4" />

    <div class="info-table">
      <v-card class="mx-2 my-2"
              color="primary"
              ripple
              @click="ensureNamed('Emergency Contacts', 'emergencycontacts')">
        <v-flex class="d-flex justify-space-between px-2 py-2">
          <div>Emergency Contacts</div>
          <div>
            <v-icon class="mr-2">mdi-chevron-right</v-icon>
          </div>
        </v-flex>
      </v-card>
      <v-card class="mx-2 my-2"
              color="primary"
              ripple
              @click="ensureNamed('Out of Area Contact', 'distantcontacts')">
        <v-flex class="d-flex justify-space-between px-2 py-2">
          <div>Out of Area Contact</div>
          <div>
            <v-icon class="mr-2">mdi-chevron-right</v-icon>
          </div>
        </v-flex>
      </v-card>
      <v-card class="mx-2 my-2"
              color="primary"
              ripple
              @click="ensureNamed('Routes and Locations', 'routes')">
        <v-flex class="d-flex justify-space-between px-2 py-2">
          <div>Reunification</div>
          <div>
            <v-icon class="mr-2">mdi-chevron-right</v-icon>
          </div>
        </v-flex>
      </v-card>
    </div>
    <ConfirmDialog ref="theDialog"></ConfirmDialog>

    <!-- <pre class="caption">{{ plan }}</pre> -->

    <v-dialog v-model="showPetEditor" persistent>
      <PetEditor v-if="showPetEditor"
                 :pet="editorPet"
                 @cancel="showPetEditor = false"
                 @save="savePet"></PetEditor>
    </v-dialog>

    <v-dialog v-model="showChildEditor" persistent>
      <ChildEditor :child="editorChild"
                   @cancel="showChildEditor = false"
                   @save="saveChild"></ChildEditor>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ref
} from "@vue/composition-api";
import store from "@/store";
import FamilyPlan from "@/models/family-plans/FamilyPlan";
import _ from "lodash";
import goBack from "@/functions/goBack";
import { phoneNumber, required, minLength } from "@/rules";
import PetEditor from "./editors/pet-editor.vue";
import ChildEditor from "./editors/child-editor.vue";

import AddressView from "./address-view.vue";
import router from "@/router";

export default defineComponent({
  name: "family-plan-view",
  components: { AddressView, PetEditor, ChildEditor },
  props: { planId: { required: true } },
  setup(props, { refs }) {

    const plan = ref(null);
    const showPetEditor = ref(false);
    const editorPet = ref(null);
    const showChildEditor = ref(false);
    const editorChild = ref(null);

    onMounted(() => {
      // Determine which plan to use
      if (props.planId === "new") {
        plan.value = reactive(new FamilyPlan());
      } else {
        let found = store.getters["familyPlansStore/findFamilyPlan"](
          props.planId
        );
        if (found) {
          plan.value = found;
        } else {
          goBack();
        }
      }
    });

    async function updatePlan() {
      const updated = await store.dispatch(
        "familyPlansStore/updatePlanAsync",
        plan.value
      );
      if (updated.id !== plan.value.id) {
        // Replace it
        plan.value = _.cloneDeep(updated);
      }
    }

    const rules = {
      title: [
        required("Title is required."),
        minLength(3, "Title must be more than three characters.")
      ],
      phone: [required("Phone is required."), phoneNumber()]
    };

    function ensureNamed(intent, subcomponent) {
      if (store.state.error) store.commit("clearError");
      if (!isPlanSaved()) {
        store.commit("setError", `Must name a plan before setting ${intent}`);
      } else {
        router.push(`/prepare/familyplan/${plan.value.id}/${subcomponent}/`);
      }
    }

    function isPlanSaved() {
      return plan.value && plan.value.id;
    }

    async function toggleAlerts() {
      plan.value.allowAlerts = plan.value.allowAlerts ? false : true;
      if (isPlanSaved()) {
        await updatePlan();
      }
    }

    async function deletePlan() {
      if (await refs.theDialog.open()) {
        if (!(await store.dispatch(
          "familyPlansStore/deletePlanAsync",
          plan.value
        ))) {
          store.commit("setError", "Failed to delete plan");
        } else {
          goBack();
        }
      }
    }

    function launchPetEditor(pet) {
      editorPet.value = pet;
      showPetEditor.value = true;
    }

    async function savePet(pet) {
      await store.dispatch("familyPlansStore/updatePetAsync", { pet, planId: props.planId });
      showPetEditor.value = false;
    }

    function launchChildEditor(child) {
      editorChild.value = child;
      showChildEditor.value = true;
    }

    async function saveChild(child) {
      await store.dispatch("familyPlansStore/updateChildAsync", {
        child,
        planId: props.planId,
      });
      showChildEditor.value = false;
    }

    return {
      launchPetEditor,
      showPetEditor,
      editorPet,
      savePet,

      launchChildEditor,
      showChildEditor,
      editorChild,
      saveChild,

      deletePlan,
      toggleAlerts,
      ensureNamed,
      plan,
      updatePlan,
      goBack,
      rules
    };
  }
});
</script>

<style scoped>
.v-icon {
  transition: none !important;
}
</style>
