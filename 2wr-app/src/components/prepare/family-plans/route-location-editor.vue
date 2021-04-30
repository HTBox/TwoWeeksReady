<template>
  <v-card class="pa-2">
    <v-text-field
      v-model="theRoute.name"
      :rules="rules.name"
      label="Route Name"
      outlined
    />
    <photos-editor title="Photos" :route="theRoute" />
    <v-textarea 
      v-model="theRoute.instructions"
      label="Instructions"
      rows="2"
      outlined
    />
    <Address v-model="theRoute.address" title="Address"></Address>
    <v-divider></v-divider>
    <v-card-actions class="">
      <v-btn text @click="$emit(`cancel`)">Cancel</v-btn>
      <v-btn text color="green" @click="$emit(`save`, theRoute)">Save</v-btn>
    </v-card-actions>
    <pre>{{ theRoute }}</pre>
  </v-card>
</template>

<script>
import { minLength, required } from "@/rules";
import { defineComponent, reactive } from "@vue/composition-api";
import _ from "lodash";
import Address from "./address.vue";
import PhotosEditor from "./photos-editor.vue";

export default defineComponent({
  components: {
    Address,
    PhotosEditor 
  },
  props: {
    route: { required: true },
  },
  setup(props) {
    // Make Copy
    const theRoute = reactive(_.cloneDeep(props.route));

    const rules = {
      name: [required(), minLength(5, "Name must be 5 characters or longer.")],
    };

    return {
      theRoute,
      rules
    };
  },
});
</script>
