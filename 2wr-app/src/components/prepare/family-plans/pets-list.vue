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
    <InfoBar :title="`Pets`" />
    <div v-if="pets">
      <v-card class="pa-2" v-if="pets.length == 0"
        ><em>Press <strong>'+'</strong> to add new pets.</em></v-card
      >
      <IconTextBlock
        allowSelected="true"
        icon="mdi-chevron-right"
        v-for="pet in pets"
        :key="pet.id"
      >
        <v-card>
          <v-card-title>{{ pet.name }}</v-card-title>
        </v-card>
      </IconTextBlock>
    </div>
     <v-dialog v-model="showEditor" persistent>
      <PetEditor
        v-if="showEditor"
        :pet="editorPet"
        @cancel="showEditor = false"
        @save="save"
      ></PetEditor>
    </v-dialog>
  </v-container>
</template>

<script>
import { defineComponent, onMounted, ref } from "@vue/composition-api";

import PetEditor from "./editors/pet-editor.vue";
import goBack from "@/functions/goBack";
import Pet from "@/models/family-plans/Pet";
import store from "@/store";
import _ from "lodash";

export default defineComponent({
  components: { PetEditor },
  props: { planId: { required: true } },
  setup(props) {
    
    const plan = ref(null);
    const pets = ref(null);
    const showEditor = ref(false);
    const editorPet = ref(null);

    onMounted(() => {
      const result = store.getters[
        "familyPlansStore/findFamilyPlan"](
        props.planId
      );
      if (result) {
        pets.value = _.cloneDeep(result.pets);
        plan.value = result;
      } else {
        goBack();
      }
    });

    function launchEditor(pet) {
      editorPet.value = pet;
      showEditor.value = true;
    }

    function addNew() {
      launchEditor(new Pet());
    }

    async function save(pet) {
      await store.dispatch("familyPlansStore/updatePetAsync", { pet, planId: props.planId});
      showEditor.value = false;
    }
    return {
      pets,
      showEditor,
      addNew,
      launchEditor, 
      editorPet,
      save,
      plan
    };
  },
});
</script>
