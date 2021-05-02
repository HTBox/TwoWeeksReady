<template>
  <v-form ref="theForm">
    <v-text-field
      outlined
      ref="address1"
      label="Address Line 1"
      :rules="rules.address1"
      v-model="address.address1"
      placeholder="e.g. 123 Main Street"
    />
    <v-text-field
      outlined
      ref="address2"
      label="Address Line 2"
      v-model="address.address2"
      placeholder="e.g. Suite 400"
    />
    <v-text-field
      outlined
      label="City"
      ref="cityTown"
      :rules="rules.cityTown"
      v-model="address.cityTown"
      placeholder="e.g. Portland"
    />
    <v-select
      v-model="address.stateProvince"
      ref="stateProvince"
      label="State"
      :rules="rules.stateProvince"
      :items="states"
      outlined
    >
    </v-select>
    <v-text-field
      outlined
      ref="postalCode"
      :rules="rules.postalCode"
      label="Zipcode"
      v-model="address.postalCode"
      placeholder="e.g. 97001"
    />
  </v-form>
</template>

<script>
import { defineComponent, computed } from "@vue/composition-api";
import states from "@/lookups/states";
import { minLength, required, zipCode } from "@/rules";

export default defineComponent({
  props: {
    value: { required: true }
  },
  setup(props, { emit, refs }) {
    const address = computed({
      // Name "value" is changed in #vue3 so we'll need to change this if we upgrade
      get: () => {
        return props.value;
      },
      // Name "input" is changed in #vue3 so we'll need to change this if we upgrade
      set: (val) => {
        emit("input", val);
      },
    });

    const rules = {
      address1: [required(), minLength(10)],
      cityTown: [required()],
      stateProvince: [required()],
      postalCode: [required(), zipCode()],
    };

    function validate() {
      return refs.theForm.validate();
    }

    return {
      address,
      states,
      rules,
      validate,
    };
  },
});
</script>
