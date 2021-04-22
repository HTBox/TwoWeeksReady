<template>
  <family-plans-view :planId="planId"></family-plans-view>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import FamilyPlansView from "@/components/prepare/family-plans/family-plans-view.vue";

export default defineComponent({
  components: { FamilyPlansView },
  props: {
    planId: { required: true }
  }
});
</script>

