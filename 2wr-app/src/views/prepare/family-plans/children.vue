<template>
  <ChildrenList :planId="planId"></ChildrenList>
</template>

<script>
import ChildrenList from "@/components/prepare/family-plans/children-list.vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  components: { ChildrenList },
  props: { planId: { required: true } }
});
</script>