<template>
  <v-card class="pa-2">
    <v-form ref="theForm">
      <v-text-field
        v-model="theContact.fullName"
        :rules="rules.fullName"
        label="Full name"
        outlined
      />
      <v-text-field
        v-model="theContact.cellPhone"
        label="Cell Phone"
        :rules="rules.cellPhone"
        outlined
      >
      </v-text-field>
      <v-text-field
        outlined
        v-model="theContact.email"
        label="E-mail"
        :rules="rules.email"
      />
      <v-divider></v-divider>
      <v-textarea
        outlined
        clearable
        rows="2"
        v-model="theContact.schoolInformation"
        label="School Information"
      />
      <v-textarea
        outlined
        clearable
        rows="2"
        v-model="theContact.workInformation"
        label="Work Information"
      />
      <v-textarea
        outlined
        clearable
        rows="2"
        v-model="theContact.medicalInformation"
        label="Medical Information Information"
      />
      <v-checkbox
        v-model="theContact.notifyLastLocation"
        label="Notify this person of last location?"
      />
      <v-checkbox
        v-model="theContact.sharePlanWith"
        label="Share Plan with this Person?"
      />
      <v-checkbox
        v-model="theContact.distant"
        v-if="distant"
        label="Out of area?"
        disabled=true
      />
      <v-divider></v-divider>
      <v-card-actions class="">
        <v-btn text @click="$emit(`cancel`)">Cancel</v-btn>
        <v-btn text color="green" @click="save">Save</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { minLength, required, phoneNumber, email } from "@/rules";
import { defineComponent, reactive } from "@vue/composition-api";
import _ from "lodash";

export default defineComponent({
  props: {
    contact: { required: true },
    distant: { required: true }
  },
  setup(props, { emit, refs }) {
    const theContact = reactive(_.cloneDeep(props.contact));

    const rules = {
      fullName: [
        required(),
        minLength(5, "Name must be 5 characters or longer."),
      ],
      cellPhone: [phoneNumber()],
      email: [email()],
    };

    function save() {
      if (refs.theForm.validate()) {
        emit(`save`, theContact);
      }
    }

    return {
      theContact,
      rules,
      save
    };
  },
});
</script>
