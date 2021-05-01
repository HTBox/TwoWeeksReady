<template>
  <FamilyPlansContacts :planId="planId"></FamilyPlansContacts>
</template>

<script>
import FamilyPlansContacts from "@/components/prepare/family-plans/family-plan-contacts-view.vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  components: { FamilyPlansContacts },
  props: [ "planId" ]
});
</script>
