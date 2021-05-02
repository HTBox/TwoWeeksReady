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
    <v-card class="pa-2" v-if="!pets"
      ><em>Press <strong>'+'</strong> to add new pets.</em></v-card
    >
    <v-card class="pa-2 mb-1" v-for="pet in pets" :key="pet.id">
      <IconTextBlock
        icon="mdi-pencil"
        :allowSelected="true"
        @selected="launchEditor(pet)"
      >
        <v-row>
          <v-col class="flex-grow-0 flex-shrink-0">
            <v-layout v-if="!pet.image" class="mr-n3" style="width: 50px; height: 50px;">&nbsp;</v-layout> 
            <SecureImg
              v-if="pet.image"
              :src="pet.image"
              :alt="pet.name"
              class="img-cover mr-n3"
              max-width="100%"
              width="50" height="50"
            />
          </v-col>
          <v-col>
            <h3>{{ pet.name }}</h3>
          </v-col>
        </v-row>
      </IconTextBlock>
    </v-card>
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

export default defineComponent({
  components: { PetEditor },
  props: { planId: { required: true } },
  setup(props) {
    
    const pets = ref(null);
    const showEditor = ref(false);
    const editorPet = ref(null);

    onMounted(() => {
      const result = store.getters[
        "familyPlansStore/findFamilyPlan"](
        props.planId
      );
      if (result) {
        pets.value = result.pets;
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
      save
    };
  },
});
</script>
