<template>
  <v-container class="py-0" v-if="plan">
      <v-fab-transition>
      <v-btn
        color="red"
        dark
        absolute
        bottom
        right
        fab
        class="mb-12"
        @click="deletePlan"
      >
        <v-icon>mdi-delete-forever</v-icon>
      </v-btn>
    </v-fab-transition>

    <InfoBar title="Family Plan"></InfoBar>
    <v-flex>
      <v-row justify="end" class="py-6 cursor-pointer" @click="toggleAlerts" >
        <div class="text-button px-6">{{ plan.allowAlerts ? 'Alerts Enabled' : 'Alerts Disabled'}}</div>
        <v-icon
          plain
          large
          class="mr-6"
          :class="{ 'red--text': plan.allowAlerts }"
          >{{ plan.allowAlerts ? 'mdi-alarm-light' : 'mdi-alarm-light-off'}}</v-icon
        >
      </v-row>
    </v-flex>
    <EditableTextBlock
      label="Plan Name"
      v-model="plan.title"
      isTitle
      :rules="rules.title"
      @save="updatePlan"
      class="mt-2"
    ></EditableTextBlock>
    <v-spacer class="my-4" />
    <v-card class="py-10">
      <v-row justify="space-around">
        <v-btn color="#222" dark>Walkthrough</v-btn>
        <v-btn color="#222" dark>Manage</v-btn>
      </v-row>
    </v-card>
    <v-spacer class="my-4" />
    <AddressView
      @save="updatePlan"
      v-model="plan.address"
      title="Home Address"
    ></AddressView>
    <v-spacer class="my-4" />
    <EditableTextBlock
      icon="mdi-phone"
      label="Phone Number"
      v-model="plan.phoneNumber"
      @save="updatePlan"
      :rules="rules.phone"
    ></EditableTextBlock>
    <v-spacer class="my-4" />
    <div class="info-table">
      <v-card
        class="mx-2 my-2"
        color="primary"
        ripple
        @click="ensureNamed('Emergency Contacts', 'emergencycontacts')"
      >
        <v-flex class="d-flex justify-space-between px-2 py-2">
          <div>Emergency Contacts</div>
          <div>
            <v-icon class="mr-2">mdi-chevron-right</v-icon>
          </div>
        </v-flex>
      </v-card>
      <v-card
        class="mx-2 my-2"
        color="primary"
        ripple
        @click="ensureNamed('Out of Area Contact', 'distantcontacts')"
      >
        <v-flex class="d-flex justify-space-between px-2 py-2">
          <div>Out of Area Contacts</div>
          <div>
            <v-icon class="mr-2">mdi-chevron-right</v-icon>
          </div>
        </v-flex>
      </v-card>
      <v-card
        class="mx-2 my-2"
        color="primary"
        ripple
        @click="ensureNamed('Routes and Locations', 'routes')"
      >
        <v-flex class="d-flex justify-space-between px-2 py-2">
          <div>Routes and Locations</div>
          <div>
            <v-icon class="mr-2">mdi-chevron-right</v-icon>
          </div>
        </v-flex>
      </v-card>
      <v-card
        class="mx-2 my-2"
        color="primary"
        ripple
        @click="ensureNamed('Children', 'children')"
      >
        <v-flex class="d-flex justify-space-between px-2 py-2">
          <div>Children</div>
          <div>
            <v-icon class="mr-2">mdi-chevron-right</v-icon>
          </div>
        </v-flex>
      </v-card>
      <v-card
        class="mx-2 my-2"
        color="primary"
        ripple
        @click="ensureNamed('Pets', 'pets')"
      >
        <v-flex class="d-flex justify-space-between px-2 py-2">
          <div>Pets</div>
          <div>
            <v-icon class="mr-2">mdi-chevron-right</v-icon>
          </div>
        </v-flex>
      </v-card>
    </div>
    <ConfirmDialog ref="theDialog"></ConfirmDialog>
    <!-- <pre class="caption">{{ plan }}</pre> -->
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

import AddressView from "./address-view.vue";
import router from "@/router";

export default defineComponent({
  name: "family-plan-view",
  components: { AddressView },
  props: { planId: { required: true } },
  setup(props, { refs }) {
    const plan = ref(null);

    onMounted(() => {
      // Determine which plan to use
      if (props.planId === "new") {
        plan.value = reactive(new FamilyPlan());
      } else {
        let found = store.getters["familyPlansStore/findFamilyPlan"](
          props.planId
        );
        if (found) {
          plan.value = reactive(_.cloneDeep(found));
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

    return {
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
