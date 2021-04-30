<template>
  <img :src="imageSrc" />
</template>

<script>
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import photosApi from "@/api/photos-api";

export default defineComponent({
  name: "secure-img",
  props: {
    src: { required: true}
  },
  setup(props) {

    const imageSrc = ref(null);

    onMounted(async () => {
      const result = await photosApi.getPhoto(props.src);
      const url = URL.createObjectURL(result.data);
      imageSrc.value = url;
    })

    return {
      imageSrc
    }
  },
})
</script>
