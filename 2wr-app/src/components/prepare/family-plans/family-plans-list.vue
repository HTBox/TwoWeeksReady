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
        to="/prepare/familyplan/new"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <InfoBar title="My Family Plan"></InfoBar>
    <v-tabs background-color="transparent" grow v-model="currentTab">
      <v-tab> My Family Plan </v-tab>
      <v-tab>
        Plans Shared<br />
        With Me
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="currentTab">
      <v-tab-item>
        <v-card color="background">
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
                ripple
                :to="`/prepare/familyplan/${item.id}`"
              >
                <v-card-title class="d-flex justify-space-between px-2 py-2">
                    <div>
                    <v-icon v-if="item.allowAlerts">mdi-alarm-light</v-icon>
                    <v-icon v-if="!item.allowAlerts">mdi-alarm-light-off</v-icon>

                      {{ item.title }}
                    </div>
                  <v-icon class="mr-2">mdi-chevron-right</v-icon>
                </v-card-title>
              </v-card>
            </div>
          </template>
        </v-data-iterator>
        </v-card>
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
  ref
} from "@vue/composition-api";
import store from "@/store";

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

    onMounted(() => store.dispatch(`familyPlansStore/getAllAsync`));

    return {
      currentTab,
      familyPlans,
      sharedPlans
    };
  }
});
</script>
