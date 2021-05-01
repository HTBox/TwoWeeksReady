<template>
  <v-card class="pa-2">
    <v-text-field
      v-model="theChild.name"
      :rules="rules.name"
      label="Child's Name"
      outlined
    />
    <v-textarea
      v-model="theChild.relationship"
      label="Relationship to Family"
      :rules="rules.relationship"
      outlined
      rows="2">
    </v-textarea>
    <v-text-field
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
    />
    <AddressEditor title="School Address" v-model="theChild.schoolAddress" />
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
      <v-btn text color="green" @click="$emit(`save`, theChild)">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { phoneNumber, required } from '@/rules';
import { defineComponent, reactive } from '@vue/composition-api'
import _ from 'lodash';
import AddressEditor from "./address-editor.vue";

export default defineComponent({
  components: {
    AddressEditor
  },
  props: {
    child: { required: true }
  },
  setup(props) {
        const theChild = reactive(_.cloneDeep(props.child));

    const rules = {
      name: [
        required()
      ],
      phoneNumber: [phoneNumber()],
      schoolNumber: [phoneNumber()],
      relationship: [required()],
      birthday: [required()],

    };

    return {
      theChild,
      rules
    }
  },
})
</script>
