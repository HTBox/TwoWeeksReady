<template>
  <v-container class="py-0">
    <v-fab-transition>
      <v-btn
        color="green"
        dark
        absolute
        bottom
        right
        fab
        class="mb-12"
        to="/prepare/familyplan/create"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-app-bar app flat dense fixed>
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-toolbar-title>My Family Plan</v-toolbar-title>
    </v-app-bar>
    <v-tabs background-color="blue" dark grow v-model="currentTab">
      <v-tab> My Family Plan </v-tab>
      <v-tab>
        Plans Shared<br />
        With Me
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="currentTab">
      <v-tab-item>
        <v-data-iterator
          :items="familyPlans"
          disable-pagination
          disable-sort
          hide-default-footer
          no-data-text="No plans...please click + to create a new plan"
        >
          <template v-slot:default="props">
            <div class="info-table">
              <v-card
                v-for="item in props.items"
                :key="item.id"
                class="mx-2 my-2"
                color="#eee"
                ripple
                :to="`/prepare/familyplan/view/${item.id}`"
              >
                <v-flex class="d-flex justify-space-between px-2 py-2">
                  <div>
                    {{ item.title }}
                  </div>
                  <div>
                    <v-icon class="mr-2">mdi-pencil</v-icon>
                  </div>
                </v-flex>
              </v-card>
            </div>
          </template>
        </v-data-iterator>
      </v-tab-item>
      <v-tab-item>
        <p>Shared Plans</p>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import {
  computed,
  defineComponent,
  onMounted,
  ref,
} from "@vue/composition-api";
import store from "@/store";
import goBack from "@/functions/goBack.js";

export default defineComponent({
  name: "family-plan-landing",
  setup() {
    const currentTab = ref(null);
    const familyPlans = computed(
      () => store.state.familyPlansStore.familyPlans
    );
    const sharedPlans = computed(
      () => store.state.familyPlansStore.sharedPlans
    );

    onMounted(() => store.dispatch(`familyPlansStore/getFamilyPlansAsync`));

    return {
      currentTab,
      familyPlans,
      sharedPlans,
      goBack,
    };
  },
});
</script>