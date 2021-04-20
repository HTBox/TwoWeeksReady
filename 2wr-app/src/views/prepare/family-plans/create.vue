<template>
  <v-container class="py-0">
    <v-app-bar app flat dense fixed>
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-spacer></v-spacer>
      <v-btn color="green" dark right @click="save()">Save</v-btn>
    </v-app-bar>
    <v-form lazy-validation ref="form">
      <v-text-field
        label="Plan Name"
        placeholder="My Family's Plan"
        v-model="plan.title"
      />
      <AddressEditor :address="plan.address" />
      <v-text-field
        label="Phone"
        placeholder="(503) 555-1212"
        v-model="plan.phoneNumber"
      />
    </v-form>
    <div>{{ plan }}</div>
  </v-container>
</template>

<script>
import { reactive, defineComponent } from "@vue/composition-api";
import AddressEditor from "@/components/address-editor";
import store from "@/store";
import goBack from "@/functions/goBack";

export default defineComponent({
  name: "family-plan-create",
  components: {
    AddressEditor,
  },
  setup() {
    const plan = reactive({
      title: "My first plan",
      address: {
        address1: "123 Main Street",
        address2: "",
        address3: "Atlanta, GA 30307",
      },
      phoneNumber: "404-227-3030",
    });

    async function save() {
      try {
        await store.dispatch("familyPlansStore/addToFamilyPlanAsync", plan);
        goBack();
      } catch {
        // todo
      }
    }

    return {
      plan,
      save,
      goBack,
    };
  },
});
</script>

