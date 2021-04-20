<template>
  <v-container class="py-0">
    <v-app-bar app flat dense fixed>
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-toolbar-title v-if="plan">{{ plan.title }}</v-toolbar-title>
    </v-app-bar>
    <v-card v-if="plan.address">
      <v-card-text>
        {{ plan.address.address1}}
      </v-card-text>
      <v-card-text>
        {{ plan.address.address2}}
      </v-card-text>
      <v-card-text>
        {{ plan.address.address3}}
      </v-card-text>
    </v-card>

    <v-card v-if="plan">
      <v-card-text>
        {{ plan.phoneNumber }}        
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import store from "@/store";
import goBack from "@/functions/goBack";

export default defineComponent({
  name: "family-plan-create",
  props: { planId: { required: true}},
  setup(props) {
    const plan = ref({});
    
    onMounted(() => {
      let found = store.getters["familyPlansStore/findFamilyPlan"](props.planId);
      if (found) plan.value = found;
      else goBack();
    });

    return {
      plan,
      goBack,
    };
  },
});
</script>

