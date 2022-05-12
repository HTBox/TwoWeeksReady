<template>
  <v-container class="py-0">
    <v-app-bar app flat dense fixed color="background">
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-toolbar-title>Build a Kit</v-toolbar-title>
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="green"
      ></v-progress-linear>
    </v-app-bar>
    
    <v-card
      class="mx-auto"
      max-width="344"
      outlined
    >
      <v-list-item>
         <v-list-item-avatar
               tile
            size="80"
        >
          <v-img contain :src="baseKit.iconUrl" alt="" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1" v-text="baseKit.name">
            
          </v-list-item-title>
        </v-list-item-content>
  

      </v-list-item>
      <v-card-text>
        {{ baseKit.description }}
      </v-card-text>
      <v-card-actions>
        <v-btn
          outlined
          text
          :to="{ name: 'emergencykitcreate'} "
        >
        <v-icon left>
          mdi-plus
        </v-icon>
          Add Kit
        </v-btn>
      </v-card-actions>

    </v-card>
    <v-list>
      <v-list-item 
         v-for="kit in kits"
        :key="kit.id" :to="{ name: 'emergencykitedit',
                             params: { id: kit.id} }">
          <v-list-item-content>
            <v-list-item-title v-text="kit.name"></v-list-item-title>
          </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="!loading && kits.length === 0">
          <v-list-item-content>
            <v-list-item-title>No Kits Defined</v-list-item-title>
          </v-list-item-content>
      </v-list-item>
    </v-list>

    </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "EmergencyKitList",
  data: () => ({
    search: "",
    baseKitId: "",
    loading: true,
  }),
  computed: mapState({
    kits: (state) => state.emergencyKitStore.list,
    baseKit(state){
      return state.baseKitStore.list.find((kit) => kit.id === this.baseKitId);
    } 
  }),
  async created() {
    this.baseKitId = this.$route.params.baseKitId;
    const baseKitPromise = this.$store.dispatch(`baseKitStore/getBaseKitListAsync`);
    const kitsPromise = this.$store.dispatch(`emergencyKitStore/getEmergencyKitListAsync`,
      this.baseKitId);

    await Promise.all([baseKitPromise, kitsPromise]);
    
    this.loading = false;
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    deleteKit(id) {
      var elementIndex = this.listing
        .map((e) => {
          return e.id;
        })
        .indexOf(id);
      if (elementIndex != -1) {
        this.listing.splice(elementIndex, 1);
      }
    },
    editKit(id){
      this.$router.push(`/prepare/emergencykits/edit/${id}`);
    }
  },
};
</script>