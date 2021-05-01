<template>
  <PetsList :planId="planId"></PetsList>
</template>

<script>
import PetsList from "@/components/prepare/family-plans/pets-list.vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  components: { PetsList },
  props: { planId: { required: true } },
});
</script>