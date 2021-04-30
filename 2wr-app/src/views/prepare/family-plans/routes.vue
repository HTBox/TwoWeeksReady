<template>
  <RouteLocationList :planId="planId"></RouteLocationList>
</template>

<script>
import RouteLocationList from "@/components/prepare/family-plans/route-location-list.vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  components: { RouteLocationList },
  props: [ "planId" ]
});
</script>
