<template>
  <div class="mb-1">
    <v-app-bar app flat dense fixed color="background" >
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import goBack from "@/functions/goBack";

export default defineComponent({
  props: {
    title: { required: true },
  },
  setup() {
    return {
      goBack,
    };
  },
});
</script>
