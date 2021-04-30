<template>
  <v-card class="pa-1 my-2">
    <v-btn
      color="green"
      dark
      absolute
      bottom
      right
      fab
      class="mb-9"
      @click="addNew"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-card-title>{{ title }}</v-card-title>
    <div v-for="photo in route.images" :key="photo">
      <img :src="photo" alt="Photo" />
    </div>
      <input type="file" @change="imagePicked($event.target.files[0])" ref="filePicker" accept="image/*" class="hidden"/>
  </v-card>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import store from "@/store";

export default defineComponent({
  props: {
    route: { required: true },
    title: { required: true }
  },
  setup(props, { refs }) {

    function addNew() {
      refs.filePicker.click();
    }

    async function imagePicked(file) {
      store.dispatch("familyPlansStore/addImageFile", { file, route: props.route });
    }

    return {
      addNew,
      imagePicked
    };
  },
});
</script>

<style scoped>
  .hidden {
    display: none;
  }
</style>