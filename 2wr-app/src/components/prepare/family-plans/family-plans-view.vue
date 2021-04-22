<template>
  <v-container class="py-0" v-if="plan">
    <v-app-bar app flat dense fixed>
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-toolbar-title>Family Plan</v-toolbar-title>
    </v-app-bar>
    <EditableTextBlock
      label="Plan Name"
      v-model="plan.title"
      isTitle
      @save="updatePlan"
    ></EditableTextBlock>
    <v-spacer class="my-4" />
    <v-card class="py-10">
      <v-row justify="space-around">
        <v-btn color="#222" dark>Walkthrough</v-btn>
        <v-btn color="#222" dark>Manage</v-btn>
      </v-row>
    </v-card>
    <v-spacer class="my-4" />
    <Address @save="updatePlan" v-model="plan.address"></Address>
    <v-spacer class="my-4" />
    <EditableTextBlock
      icon="mdi-phone"
      label="Phone Number"
      v-model="plan.phoneNumber"
      @save="updatePlan"
    ></EditableTextBlock>

    <!-- <v-card v-if="plan.phoneNumber">
      <v-card-subtitle><strong>Home Phone</strong></v-card-subtitle>
      <v-card-text
        ><v-icon size="sm" class="mr-2">mdi-phone</v-icon
        ><a :href="`tel:${plan.phoneNumber}`">{{
          plan.phoneNumber
        }}</a></v-card-text
      >
    </v-card> -->
    <v-spacer class="my-4" />
    <v-card to="" class="mx-2 my-2" color="#eee" ripple>
      <v-flex class="d-flex justify-space-between px-2 py-2">
        <div>Emergency Contacts</div>
        <div>
          <v-icon class="mr-2">mdi-chevron-right</v-icon>
        </div>
      </v-flex>
    </v-card>
    <v-card to="" class="mx-2 my-2" color="#eee" ripple>
      <v-flex class="d-flex justify-space-between px-2 py-2">
        <div>Routes and Locations</div>
        <div>
          <v-icon class="mr-2">mdi-chevron-right</v-icon>
        </div>
      </v-flex>
    </v-card>
    <v-card to="" class="mx-2 my-2" color="#eee" ripple>
      <v-flex class="d-flex justify-space-between px-2 py-2">
        <div>Children</div>
        <div>
          <v-icon class="mr-2">mdi-chevron-right</v-icon>
        </div>
      </v-flex>
    </v-card>
    <v-card to="" class="mx-2 my-2" color="#eee" ripple>
      <v-flex class="d-flex justify-space-between px-2 py-2">
        <div>Pets</div>
        <div>
          <v-icon class="mr-2">mdi-chevron-right</v-icon>
        </div>
      </v-flex>
    </v-card>
    <!-- <pre class="caption">{{ plan }}</pre> -->
  </v-container>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
} from "@vue/composition-api";
import store from "@/store";
import goBack from "@/functions/goBack";
import FamilyPlan from "@/components/models/family-plans/FamilyPlan";
import EditableTextBlock from "@/components/common/EditableTextBlock.vue";
import _ from "lodash";
import Address from "./address";

export default defineComponent({
  name: "family-plan-view",
  components: { EditableTextBlock, Address },
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
      await store.dispatch("familyPlansStore/updatePlanAsync", plan.value);
    }

    return {
      plan,
      updatePlan,
      goBack,
    };
  },
});
</script>

