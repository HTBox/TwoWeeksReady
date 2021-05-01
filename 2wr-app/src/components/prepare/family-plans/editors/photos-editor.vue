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
    <v-row class="flex-wrap">
      <v-col
        v-for="photo in route.images"
        :key="photo"
        class="flex-grow-0 flex-shrink-0"
      >
        <v-card rounded class="elevation-2 pa-1" width="125">
          <SecureImg :src="photo" alt="Photo" />
        </v-card>
      </v-col>
    </v-row>
    <input
      type="file"
      @change="imagePicked($event.target.files[0])"
      ref="filePicker"
      accept="image/*"
      class="hidden"
    />
  </v-card>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import store from "@/store";
import SecureImg from "@/components/common/SecureImg.vue";

export default defineComponent({
  components: {
    SecureImg,
  },
  props: {
    route: { required: true },
    title: { required: true },
  },
  setup(props, { refs }) {
    function addNew() {
      refs.filePicker.click();
    }

    async function imagePicked(file) {
      store.dispatch("familyPlansStore/addImageFile", {
        file,
        route: props.route,
      });
    }

    return {
      addNew,
      imagePicked,
    };
  },
});
</script>

<style scoped>
.hidden {
  display: none;
}

img {
  max-width: 100%;
}
</style>