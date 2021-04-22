<template>
  <div>
    <v-card v-if="!isEditing" @click="switchToEditing">
      <v-card-title>{{ theText }}</v-card-title>
    </v-card>
    <v-text-field
      ref="textEdit"
      class="mt-3"
      v-if="isEditing"
      :label="label"
      v-model="theText"
      outlined
      append-outer-icon="mdi-content-save"
      @click:append-outer="save()"
    ></v-text-field>
  </div>
</template>

<script>
import setFocusVuetify from '@/functions/setFocusVuetify';
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'

export default defineComponent({
  name: "editable-text-block",
  props: {
    // Value is used as name for v-model of parent, in #vue3 this changes
    value: { type: String, required: true},
    label: {}
  },
  setup(props, { emit, refs }) {

    const isEditing = ref(false);

    const theText = computed({
      // Name "value" is changed in #vue3 so we'll need to change this if we upgrade
      get: () => {
        return props.value;
      },
      // Name "input" is changed in #vue3 so we'll need to change this if we upgrade
      set: (val) => emit("input", val)
    });

    onMounted(() => {
    });

    function save() {
      isEditing.value = false;
      emit("save");
    }

    function switchToEditing() {
      isEditing.value = true;
      setFocusVuetify(refs, "textEdit");
    }

    return {
      switchToEditing,
      isEditing,
      theText,
      save
    };
  },
})
</script>
