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
      <v-card class="pa-2" v-if="!children"
        ><em>Press <strong>'+'</strong> to add new children.</em></v-card
      >
    <v-card class="pa-2 mb-1" v-for="child in children" :key="child.id">
      <IconTextBlock icon="mdi-pencil" :allowSelected="true"  @selected="launchEditor(child)">
        <h3>{{ child.name }}</h3>
      </IconTextBlock>
    </v-card>

     <v-dialog v-model="showEditor" persistent>
      <ChildEditor
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
      const result = store.getters["familyPlansStore/findFamilyPlan"](
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
      await store.dispatch("familyPlansStore/updateChildAsync", {
        child,
        planId: props.planId,
      });
      showEditor.value = false;
    }
    return {
      children,
      showEditor,
      addNew,
      launchEditor,
      editorChild,
      plan,
      save,
    };
  },
});
</script>
