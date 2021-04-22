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
            v-model="address.address1"
          />
          <v-text-field
            outlined
            label="Address Line 2"
            v-model="address.address2"
          />
          <v-text-field
            outlined
            label="Address Line 3"
            v-model="address.address3"
          />
        </v-container>
        <v-card-actions>
          <v-btn @click="cancel">Cancel</v-btn>
          <v-btn color="green" dark @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from "@vue/composition-api";
import _ from "lodash";

export default defineComponent({
  props: {
    value: {},
  },
  setup(props, { emit }) {
    const dialogOpen = ref(false);
    const address = ref(_.cloneDeep(props.value));

    const formattedAddress = computed(() => {
      if (!props.value) return "";
      return [props.value.address1, props.value.address2, props.value.address3]
        .filter(Boolean)
        .join("<br/>");
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

    return {
      address,
      formattedAddress,
      dialogOpen,
      save,
      cancel,
    };
  },
});
</script>
