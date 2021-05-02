<template>
  <v-card class="pa-2">
    <v-form ref="theForm">
      <v-text-field
        v-model="thePet.name"
        :rules="rules.name"
        label="Pet's Name"
        outlined
      />
      <PhotoEditor
        :photo="thePet.image"
        @photoPicked="savePhoto"
        @clearPhoto="clearPhoto"
      ></PhotoEditor>

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
import PhotoEditor from "./photo-editor.vue";
import store from "@/store";

export default defineComponent({
  components: {
    PhotoEditor,
  },
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

    async function savePhoto(file) {
      await store.dispatch("familyPlansStore/addImageToPet", {
        file,
        pet: thePet,
      });
    }

    async function clearPhoto() {
      // Committing a blank url, instead of actually deleting it
      await store.commit("familyPlansStore/addPhotoToPet", {
        photo: "",
        pet: thePet,
      });
    }

    return {
      thePet,
      rules,
      save,
      savePhoto,
      clearPhoto
    };
  },
});
</script>
