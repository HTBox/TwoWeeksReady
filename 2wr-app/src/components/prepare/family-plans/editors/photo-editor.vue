<template>
  <v-flex border rounded class="mb-3 mt-n4 d-flex justify-center">
    <SecureImg
      v-if="photo"
      :src="photo"
      alt="Photo"
      height="150"
      width="150"
      class="img-cover grey lighten-4"
    />
    <v-icon large right="2" top="2" v-if="photo" @click="$emit('clearPhoto')">mdi-delete</v-icon>
    <v-card
      height="150"
      width="150"
      class="img-contain grey lighten-4 d-flex justify-center"
      v-if="!photo"
      @click="pickPhoto"
    >
      <v-icon x-large>mdi-camera</v-icon>
    </v-card>
    <input
      type="file"
      @change="photoPicked($event.target.files[0])"
      ref="filePicker"
      accept="image/*"
      class="hidden"
    />
  </v-flex>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import SecureImg from "@/components/common/SecureImg.vue";

export default defineComponent({
  components: {
    SecureImg,
  },
  props: {
    photo: {},
  },
  setup(props, { emit, refs }) {
    function pickPhoto() {
      refs.filePicker.click();
    }

    async function photoPicked(file) {
      emit("photoPicked", file);
    }

    return {
      pickPhoto,
      photoPicked
    };
  },
});
</script>

