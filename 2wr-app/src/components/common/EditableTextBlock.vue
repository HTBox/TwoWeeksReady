<template>
  <div>
    <v-card v-if="!isEditing">
      <div class="pseudo-text-block-label">{{ label }}</div>
      <v-flex class="d-flex justify-space-between px-2 py-2">
        <v-card-title v-if="isTitle">{{ theText }}</v-card-title>
        <v-card-text v-if="!isTitle">{{ theText }}</v-card-text>
        <div class="d-flex flex-col">
          <v-icon class="mr-2" @click="switchToEditing">mdi-pencil</v-icon>
        </div>
      </v-flex>
    </v-card>
    <v-text-field
      ref="textEdit"
      class="mt-3"
      v-if="isEditing"
      :label="label"
      v-model="theText"
      :rules="rules"
      outlined
    >
      <template v-slot:append>
        <v-col class="pa-0 editable-text-block-buttons">
          <v-btn plain v-ripple="false" class="pr-2" color="red" @click="cancel">cancel</v-btn>
          <v-btn plain v-ripple="false" class="pr-2" color="blue" @click="save">save</v-btn>
        </v-col>
      </template>
    </v-text-field>
  </div>
</template>

<script>
import setFocusVuetify from "@/functions/setFocusVuetify";
import {
  computed,
  defineComponent,
  onMounted,
  ref,
} from "@vue/composition-api";

export default defineComponent({
  name: "editable-text-block",
  props: {
    // Value is used as name for v-model of parent, in #vue3 this changes
    value: { type: String, required: true },
    label: {},
    isTitle: { type: Boolean },
    rules: {}
  },
  setup(props, { emit, refs }) {
    const isEditing = ref(false);
    const oldText = props.value;

    const theText = computed({
      // Name "value" is changed in #vue3 so we'll need to change this if we upgrade
      get: () => {
        return props.value;
      },
      // Name "input" is changed in #vue3 so we'll need to change this if we upgrade
      set: (val) => emit("input", val),
    });

    onMounted(() => {});

    function save() {
      isEditing.value = false;
      emit("save");
    }

    function cancel() {
      isEditing.value = false;
      theText.value = oldText;
    }


    function switchToEditing() {
      isEditing.value = true;
      setFocusVuetify(refs, "textEdit");
    }

    return {
      switchToEditing,
      isEditing,
      theText,
      save,
      cancel
    };
  },
});
</script>

<style scoped>
.editable-text-block-buttons {
  margin-top: -7px;
}
</style>