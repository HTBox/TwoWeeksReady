<template>
  <v-container class="py-0" v-if="plan">
    <v-fab-transition>
      <v-btn
        v-if="routes.length < 2"
        color="green"
        dark
        absolute
        bottom
        right
        fab
        class="mb-12"
        @click="addNew"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <InfoBar :title="`${ plan.title } - Reunification`"></InfoBar>
    <v-app-bar app flat dense fixed  color="background">
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-toolbar-title>{{ plan.title }} - Reunification</v-toolbar-title>
    </v-app-bar>
    <v-card class="pa-2">
      An emergency has happened at your home.  Where do you plan to meet others and how will you get there?
      Add up to two reunification plans containing important information, including addresses and photos as needed.
    </v-card>
    <v-card class="pa-2" v-if="routes.length == 0">
      <em>Press <strong>'+'</strong> to add a new reunification plan.</em>
    </v-card>
    <v-card class="pa-2" v-for="route in routes" :key="route.id">
      <IconTextBlock icon="mdi-pencil" :allowSelected="true"  @selected="launchEditor(route)">
        <h3>{{ route.name }}</h3>
      </IconTextBlock>
    </v-card>

    <v-dialog v-model="showEditor" persistent>
      <RouteLocationEditor
        v-if="showEditor"
        :route="editorRoute"
        @cancel="showEditor = false"
        @save="save"
      ></RouteLocationEditor>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ref
} from "@vue/composition-api";
import goBack from "@/functions/goBack.js";
import store from "@/store";
import RouteLocation from "@/models/family-plans/RouteLocation";
import RouteLocationEditor from "./editors/route-location-editor.vue";

export default defineComponent({
  components: {
    RouteLocationEditor
  },
  props: { planId: { required: true } },
  setup(props) {
    const plan = ref(null);
    const routes = ref(null);
    const showEditor = ref(false);
    const editorRoute = ref(null);

    onMounted(() => {
      let found = store.getters["familyPlansStore/findFamilyPlan"](props.planId);
      if (found) {
        routes.value = reactive(found.routeLocations);
        plan.value = reactive(found);
      } else {
        goBack();
      }
    });

    function launchEditor(route) {
      editorRoute.value = route;
      showEditor.value = true;
    }

    async function save(route) {
      await store.dispatch("familyPlansStore/updateRouteAsync", {
        route,
        planId: plan.value.id
      });
      showEditor.value = false;
    }

    function addNew() {
      let routeLocation = new RouteLocation();
      routeLocation.name = "Reunification Plan " + String.fromCharCode("A".charCodeAt(0) + routes.value.length);
      launchEditor(routeLocation);
    }

    return {
      plan,
      routes,
      goBack,
      addNew,
      launchEditor,
      save,
      showEditor,
      editorRoute
    };
  }
});
</script>
