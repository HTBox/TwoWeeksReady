<template>
  <v-card class="pa-2">
    <v-form ref="theForm">
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
      <AddressEditor v-model="theRoute.address"></AddressEditor>
      <v-divider></v-divider>
      <v-card-actions class="">
        <v-btn text @click="$emit(`cancel`)">Cancel</v-btn>
        <v-btn text color="green" @click="save">Save</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { minLength, required } from "@/rules";
import { defineComponent, reactive } from "@vue/composition-api";
import _ from "lodash";
import AddressEditor from "./address-editor.vue";
import PhotosEditor from "./photos-editor.vue";

export default defineComponent({
  components: {
    AddressEditor,
    PhotosEditor,
  },
  props: {
    route: { required: true },
  },
  setup(props, { emit, refs }) {
    // Make Copy
    const theRoute = reactive(_.cloneDeep(props.route));

    const rules = {
      name: [required(), minLength(5, "Name must be 5 characters or longer.")],
    };

    function save() {
      if (refs.theForm.validate()) {
        emit(`save`, theRoute);
      }
    }

    return {
      theRoute,
      rules,
      save
    };
  },
});
</script>
