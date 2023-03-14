<template>
  <v-container class="py-0">
    <v-app-bar app flat dense fixed color="background">
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-toolbar-title>Make A Plan</v-toolbar-title>
    </v-app-bar>
    <v-row dense>
      <v-col cols="12">
        <p class="pa-2 headline">Add A Person</p>
      </v-col>
    </v-row>

    <v-fab-transition>
      <v-card class="mx-2 my-2"
              color="primary"
              ripple
              @click="addNewChild()">
        <v-flex class="d-flex justify-space-between px-2 py-2">
          <div>Manual Entry</div>
          <div>
            <v-icon class="mr-2">mdi-plus</v-icon>
          </div>
        </v-flex>
      </v-card>
    </v-fab-transition>

    <v-row dense>
      <v-col cols="12">
        <p class="pa-2 headline">Add A Pet</p>
      </v-col>
    </v-row>

    <v-fab-transition>
      <v-card class="mx-2 my-2"
              color="primary"
              ripple
              @click="addNewPet()">
        <v-flex class="d-flex justify-space-between px-2 py-2">
          <div>Manual Entry</div>
          <div>
            <v-icon class="mr-2">mdi-plus</v-icon>
          </div>
        </v-flex>
      </v-card>
    </v-fab-transition>

    <v-dialog v-model="showPetEditor" persistent>
      <PetEditor v-if="showPetEditor"
                 :pet="editorPet"
                 @cancel="showPetEditor = false"
                 @save="savePet"></PetEditor>
    </v-dialog>

    <v-dialog v-model="showChildEditor" persistent>
      <ChildEditor :child="editorChild"
                   @cancel="showChildEditor = false"
                   @save="saveChild"></ChildEditor>
    </v-dialog>
  </v-container>
</template>

<script>
import { defineComponent, ref } from "@vue/composition-api";
import goBack from "@/functions/goBack";
import Pet from "@/models/family-plans/Pet";
import Child from "@/models/family-plans/Child";
import PetEditor from "../../../components/prepare/family-plans/editors/pet-editor.vue";  
import ChildEditor from "../../../components/prepare/family-plans/editors/child-editor.vue";
import store from "@/store";

export default defineComponent({
  components: { PetEditor, ChildEditor },
  props: { planId: { required: true } },

  setup(props) {
    const showPetEditor = ref(false);
    const editorPet = ref(null);
    const showChildEditor = ref(false);
    const editorChild = ref(null);

    function launchPetEditor(pet) {
      editorPet.value = pet;
      showPetEditor.value = true;
    }

    function addNewPet() {
      launchPetEditor(new Pet());
    }

    async function savePet(pet) {
      await store.dispatch("familyPlansStore/updatePetAsync", { pet, planId: props.planId });
      showPetEditor.value = false;
    }

    function launchChildEditor(child) {
      editorChild.value = child;
      showChildEditor.value = true;
    }

    function addNewChild() {
      launchChildEditor(new Child());
    }

    async function saveChild(child) {
      await store.dispatch("familyPlansStore/updateChildAsync", {
        child,
        planId: props.planId,
      });
      showChildEditor.value = false;
    }

    return { 
      goBack,

      editorPet,
      savePet,
      showPetEditor,
      addNewPet,
      launchPetEditor, 

      addNewChild,
      launchChildEditor,
      showChildEditor,
      editorChild,
      saveChild,
    };
  },
});
</script>

<style>
</style>