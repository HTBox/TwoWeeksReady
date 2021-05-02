<template>
  <v-card class="pa-2">
    <v-form ref="theForm">
      <v-text-field
        v-model="thePet.name"
        :rules="rules.name"
        label="Pet's Name"
        outlined
      />
      <v-text-field
        outlined
        v-model="thePet.type"
        :rules="rules.type"
        label="Pet Type"
        placeholder="e.g. Cat, Dog, Fish"
      />
      <v-text-field
        v-model="thePet.microchipId"
        label="Microchip ID"
        :rules="rules.microchipId"
        outlined
      >
      </v-text-field>
      <v-textarea outlined v-model="thePet.description" label="Description">
      </v-textarea>
      <v-divider></v-divider>
      <v-card-actions class="">
        <v-btn text @click="$emit(`cancel`)">Cancel</v-btn>
        <v-btn text color="green" @click="save">Save</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { phoneNumber, required } from "@/rules";
import { defineComponent, reactive } from "@vue/composition-api";
import _ from "lodash";

export default defineComponent({
  props: {
    pet: { required: true },
  },
  setup(props, { emit, refs }) {
    const thePet = reactive(_.cloneDeep(props.pet));

    const rules = {
      name: [required()],
      phoneNumber: [phoneNumber()],
      schoolNumber: [phoneNumber()],
      relationship: [required()],
      birthday: [required()],
    };

    function save() {
      if (refs.theForm.validate()) {
        emit(`save`, thePet);
      }
    }

    return {
      thePet,
      rules,
      save,
    };
  },
});
</script>
