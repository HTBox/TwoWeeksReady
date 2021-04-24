<template>
  <div>
    <v-card v-if="address">
      <v-card-subtitle>
        <v-row class="pl-3 justify-space-between">
          <strong>Home Address</strong>
          <v-icon class="pr-2" @click="dialogOpen = true">mdi-pencil</v-icon>
        </v-row>
      </v-card-subtitle>
      <v-card-text v-html="formattedAddress" />
    </v-card>
    <v-dialog persistent v-model="dialogOpen">
      <v-card color="#eee">
        <v-card-title>Edit Address</v-card-title>
        <v-container>
          <v-text-field
            autofocus
            outlined
            label="Address Line 1"
            :rules="rules.address1"
            v-model="address.address1"
            placeholder="e.g. 123 Main Street"
          />
          <v-text-field
            outlined
            label="Address Line 2"
            v-model="address.address2"
            placeholder="e.g. Suite 400"
          />
          <v-text-field
            outlined
            label="City"
            :rules="rules.cityTown"
            v-model="address.cityTown"
            placeholder="e.g. Portland"
          />
          <v-select 
            v-model="address.stateProvince"
            label="State"
            :items="states"
            outlined
          >
          </v-select>
          <v-text-field
            outlined
            :rules="rules.postalCode"
            label="Zipcode"
            v-model="address.postalCode"
            placeholder="e.g. 97001"
          />
        </v-container>
        <v-card-actions>
          <v-btn text @click="cancel">Cancel</v-btn>
          <v-btn text color="green" dark @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from "@vue/composition-api";
import _ from "lodash";
import states from "@/lookups/states";

export default defineComponent({
  props: {
    value: {},
  },
  setup(props, { emit }) {
    const dialogOpen = ref(false);
    const address = ref(_.cloneDeep(props.value));

    const formattedAddress = computed(() => {
      if (!props.value) return "";
      let theAddress = `${props.value.address1}<br/>`;
      if (props.value.address2) theAddress += `${props.value.address2}<br/>`;
      return theAddress + `${props.value.cityTown}, ${props.value.stateProvince}  ${props.value.postalCode}`;
});

    function cancel() {
      dialogOpen.value = false;
      address.value = _.cloneDeep(props.value); 
    }

    function save() {
      dialogOpen.value = false;
      emit("input", address);
      emit("save");
    }

    const rules = {
      address1: [
        v => !!v || "Address is required.",
        v => v.length >= 10 || "Address must be more than 10 characters."
      ],
      cityTown: [
        v => !!v || "City is required.",
      ],
      stateProvince: [
        v => !!v || "State is required.",
      ],
      postalCode: [
        v => !!v || "Zipcode is required.",
        v => /^[0-9]{5}(?:-[0-9]{4})?$$/.test(v) || "Must be a valid zipcode."
      ]
    }

    return {
      address,
      formattedAddress,
      dialogOpen,
      save,
      cancel,
      rules,
      states
    };
  },
});
</script>
