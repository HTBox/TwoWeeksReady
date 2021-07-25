<template>
  <v-card class="pa-2">
    <v-form ref="theForm">
      <v-text-field
        v-model="theChild.name"
        :rules="rules.name"
        label="Child's Name"
        outlined
      />
      <PhotoEditor
        :photo="theChild.image"
        @photoPicked="savePhoto"
        @clearPhoto="clearPhoto"
      ></PhotoEditor>
      <v-textarea
        v-model="theChild.relationship"
        label="Relationship to Family"
        :rules="rules.relationship"
        outlined
        rows="2"
      >
      </v-textarea>
      <DatePickerInput
        outlined
        v-model="theChild.birthday"
        :rules="rules.birthday"
        label="Birthday"
      />
      <v-text-field
        v-model="theChild.phoneNumber"
        label="Cell Phone"
        :rules="rules.phoneNumber"
        outlined
      >
      </v-text-field>
      <v-divider></v-divider>
      <v-text-field
        outlined
        label="School Name"
        v-model="theChild.schoolName"
      />
      <AddressEditor v-model="theChild.schoolAddress" ref="addressEditor" />
      <v-text-field
        v-model="theChild.schoolNumber"
        label="School Phone Number"
        :rules="rules.schoolNumber"
        outlined
      >
      </v-text-field>
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
import AddressEditor from "./address-editor.vue";
import PhotoEditor from "./photo-editor.vue";
import store from "@/store";

export default defineComponent({
  components: {
    AddressEditor,
    PhotoEditor,
  },
  props: {
    child: { required: true },
  },
  setup(props, { emit, refs }) {
    const theChild = reactive(_.cloneDeep(props.child));

    const rules = {
      name: [required()],
      phoneNumber: [phoneNumber()],
      schoolNumber: [phoneNumber()],
      relationship: [required()],
      birthday: [required()],
    };

    function save() {
      if (
        refs.theForm.validate() &&
        (theChild.schoolName ? refs.addressEditor.validate() : true)
      ) {
        emit(`save`, theChild);
      }
    }

  async function savePhoto(file) {
    await store.dispatch("familyPlansStore/addImageToChild", {
      file,
      child: theChild,
    });
  }

  async function clearPhoto() {
    // Committing a blank url, instead of actually deleting it
    await store.commit("familyPlansStore/addPhotoToChild", {
      photo: "",
      child: theChild,
    });
  }

    return {
      theChild,
      rules,
      save,
      savePhoto,
      clearPhoto
    };
  },
});
</script>
