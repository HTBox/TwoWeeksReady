<template>
  <v-menu
    v-model="showDate"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        outlined
        append-icon="mdi-calendar"
        readonly
        v-model="theDate"
        :label="label"
        :rules="rules"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="theDate"
      ref="picker"
      no-title
      :max="new Date().toISOString().substr(0, 10)"
      min="1900-01-01"
      value="mm-dd-YYYY"
      @change="save"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { computed, defineComponent, ref, watch } from "@vue/composition-api";

export default defineComponent({
  props: {
    value: { required: true },
    label: {},
    rules: {},
  },
  setup(props, { emit, refs }) {
    const showDate = ref(false);

    const theDate = computed({
      // Name "value" is changed in #vue3 so we'll need to change this if we upgrade
      get: () => {
        return props.value;
      },
      // Name "input" is changed in #vue3 so we'll need to change this if we upgrade
      set: (val) => {
        emit("input", val);
      },
    });

    // Show Year first
    watch(showDate, () => {
      if (showDate) setTimeout(() => (refs.picker.activePicker = "YEAR"));
    });

    function save(date) {
      showDate.value = false;
      theDate.value = date;
    }

    return {
      showDate,
      theDate,
      save,
    };
  },
});
</script>
