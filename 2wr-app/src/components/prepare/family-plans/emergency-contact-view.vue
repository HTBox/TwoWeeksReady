<template>
  <div>
    <div class="pa-2">
      <IconTextBlock icon="mdi-pencil" :allowSelected="true" @selected="$emit('launchEditor', contact)">
        <h3>{{ contact.fullName }}</h3>
      </IconTextBlock>
      <v-card-text class="text-subtitle-1">
        <div>
          <v-icon>mdi-phone</v-icon>
          <a :href="`tel=${contact.cellphone}`" class="ml-2">{{
            contact.cellPhone
          }}</a>
        </div>
        <div>
          <v-icon>mdi-email</v-icon>
          <a :href="`mailto=${contact.email}`" class="ml-2">{{
            contact.email
          }}</a>
        </div>
      </v-card-text>
      <IconTextBlock
        :icon="showSchoolInfo ? 'mdi-minus' :'mdi-plus' "
        :allowSelected="true"
        @selected="showSchoolInfo = !showSchoolInfo"
      >
        <div>School Information</div>
      </IconTextBlock>
      <v-card v-if="showSchoolInfo" min-height="20px" class="mx-2 my-2 pa-2">
        <div v-if="!contact.schoolInformation"><em>None</em></div>
        {{ contact.schoolInformation }}
      </v-card>

      <IconTextBlock
        :icon="showWorkInfo ? 'mdi-minus' :'mdi-plus' "
        :allowSelected="true"
        @selected="showWorkInfo = !showWorkInfo"
      >
        <div>Work Information</div>
      </IconTextBlock>
      <v-card v-if="showWorkInfo" min-height="20px" class="mx-2 my-2  pa-2">
        <div v-if="!contact.workInformation"><em>None</em></div>
        {{ contact.workInformation }}
      </v-card>

      <IconTextBlock
        :icon="showMedicalInfo ? 'mdi-minus' :'mdi-plus' "
        :allowSelected="true"
        @selected="showMedicalInfo = !showMedicalInfo"
      >
        <div>Medical Information</div>
      </IconTextBlock>
      <v-card v-if="showMedicalInfo" min-height="20px" class="mx-2 my-2 pa-2">
        <div v-if="!contact.medicalInformation"><em>None</em></div>
        {{ contact.medicalInformation }}
      </v-card>

      <v-divider class="my-2"></v-divider>
      <IconTextBlock :icon="contact.notifyLastLocation ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline'">
        <div>Notify this person of last known location</div>
      </IconTextBlock>
      <IconTextBlock :icon="contact.sharePlanWith ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline'">
        <div>Share Plan?</div>
      </IconTextBlock>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  props: {
    contact: { required: true },
  },
  setup() {
    const showSchoolInfo = ref(false);
    const showWorkInfo = ref(false);
    const showMedicalInfo = ref(false);

    return {
      showSchoolInfo,
      showWorkInfo,
      showMedicalInfo
    };
  },
});
</script>
