<template>
  <div>
    <v-card v-if="address">
      <div class="pseudo-text-block-label  text-caption">{{ title }}</div>
      <v-card-text>
        <v-row class="pl-3 justify-end">
          <v-icon class="pr-2" @click="dialogOpen = true">mdi-pencil</v-icon>
        </v-row>
        <v-row class="pl-4 black--text">
          <div v-if="!formattedAddress"
            ><em>No Address: Click pencil to specify address.</em></div
          >
          <div
            v-if="formattedAddress"
            v-html="formattedAddress"
          />
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog persistent v-model="dialogOpen">
      <v-card color="#eee">
        <v-card-title>Edit Address</v-card-title>
        <v-container>
          <v-form ref="theForm">
            <AddressEditor
              v-model="address"
              ref="addressEditor"
            ></AddressEditor>
          </v-form>
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
import AddressEditor from "./editors/address-editor.vue";

export default defineComponent({
  components: {
    AddressEditor
  },
  props: {
    value: {},
    title: {}
  },
  setup(props, { emit, refs }) {
    const dialogOpen = ref(false);
    const address = ref(_.cloneDeep(props.value));

    const formattedAddress = computed(() => {
      if (!props.value) return "";
      const raw = props.value;
      let theAddress = `${raw.address1}<br/>`;
      if (raw.address2) theAddress += `${raw.address2}<br/>`;
      let lastLine = "";
      if (raw.cityTown && raw.stateProvince)
        lastLine = `${raw.cityTown}, ${raw.stateProvince}`;
      if (raw.cityTown && !raw.stateProvince) lastLine = raw.cityTown;
      if (!raw.cityTown && raw.stateProvince) lastLine = raw.stateProvince;
      if (lastLine) lastLine += `  `;
      lastLine += raw.postalCode;
      return theAddress + lastLine;
    });

    function cancel() {
      dialogOpen.value = false;
      address.value = _.cloneDeep(props.value);
    }

    function save() {
      if (refs.theForm.validate() && refs.addressEditor.validate()) {
        dialogOpen.value = false;
        emit("input", address);
        emit("save");
      }
    }

    return {
      address,
      formattedAddress,
      dialogOpen,
      save,
      cancel
    };
  }
});
</script>
