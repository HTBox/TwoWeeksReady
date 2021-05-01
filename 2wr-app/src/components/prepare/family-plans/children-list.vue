<template>
  <v-container class="py-0">
    <v-fab-transition>
      <v-btn
        color="green"
        dark
        absolute
        bottom
        right
        fab
        class="mb-12"
        @click="addNew()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <InfoBar :title="`Children`" />
    <div v-if="children">
      <v-card class="pa-2" v-if="children.length == 0"
        ><em>Press <strong>'+'</strong> to add new contacts.</em></v-card
      >
      <IconTextBlock
        allowSelected="true"
        icon="mdi-chevron-right"
        v-for="child in children"
        :key="child.id"
      >
        <v-card>
          <v-card-title>{{ child.name }}</v-card-title>
        </v-card>
      </IconTextBlock>
    </div>
     <v-dialog v-model="showEditor" persistent>
      <ChildEditor
        v-if="showEditor"
        :child="editorChild"
        @cancel="showEditor = false"
        @save="save"
      ></ChildEditor>
    </v-dialog>
  </v-container>
</template>

<script>
import { defineComponent, onMounted, ref } from "@vue/composition-api";

import ChildEditor from "./editors/child-editor.vue";
import goBack from "@/functions/goBack";
import Child from "@/models/family-plans/Child";
import store from "@/store";
import _ from "lodash";

export default defineComponent({
  components: { ChildEditor },
  props: { planId: { required: true } },
  setup(props) {
    
    const plan = ref(null);
    const children = ref(null);
    const showEditor = ref(false);
    const editorChild = ref(null);

    onMounted(() => {
      const result = store.getters[
        "familyPlansStore/findFamilyPlan"](
        props.planId
      );
      if (result) {
        children.value = _.cloneDeep(result.children);
        plan.value = result;
      } else {
        goBack();
      }
    });

    function launchEditor(child) {
      editorChild.value = child;
      showEditor.value = true;
    }

    function addNew() {
      launchEditor(new Child());
    }

    async function save(child) {
      await store.dispatch("familyPlansStore/updateChildAsync", { child, planId: props.planId});
      showEditor.value = false;
    }
    return {
      children,
      showEditor,
      addNew,
      launchEditor, 
      editorChild,
      plan
    };
  },
});
</script>
