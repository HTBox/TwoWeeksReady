<template>
  <v-container class="py-0" v-if="plan">
    <InfoBar title="Family Plan"></InfoBar>
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
        color="#eee"
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
        color="#eee"
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
        color="#eee"
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
        color="#eee"
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
  setup(props) {
    const plan = ref(null);

    onMounted(() => {
      // Determine which plan to use
      if (props.planId === "new") {
        plan.value = reactive(new FamilyPlan());
      } else {
        console.log(props.planId);
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
      if (!plan.value || !plan.value.id || !plan.value.title) {
        store.commit("setError", `Must name a plan before setting ${intent}`);
      } else {
        router.push(`/prepare/familyplan/${plan.value.id}/${subcomponent}/`);
      }
    }

    return {
      ensureNamed,
      plan,
      updatePlan,
      goBack,
      rules
    };
  }
});
</script>
