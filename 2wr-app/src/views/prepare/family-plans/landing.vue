<template>
  <family-plans-list></family-plans-list>
</template>

<script>
import FamilyPlansList from "@/components/prepare/family-plans/family-plans-list.vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  components: {
    FamilyPlansList
  }
});
</script>