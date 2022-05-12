<template>
    <v-container class="py-0">
        <v-app-bar app flat dense fixed  color="background">
          <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
          <v-icon class="mr-2">mdi-medical-bag</v-icon>
          <v-toolbar-title>Build your Emergency Kits</v-toolbar-title>
        </v-app-bar>
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="green"
        ></v-progress-linear>
        <v-row>
          <v-img src="/images/kits/build-a-kit.png"
               max-height="20vh"
               contain></v-img>
            
        </v-row>
<v-row>
          <p>After a disaster, you may be on your own for at least 2 weeks. After you fill out your family plan, this section will help you determine what you need to build your kits for you and your family, one step at a time.</p>            
        </v-row>
        <v-row>
        <v-col
          v-for="baseKit in baseKits"
          :key="baseKit.id"
          cols="6"
        >
          <v-card>
            <v-img
              contain
              :src="baseKit.iconUrl"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="baseKit.name"></v-card-title>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <br/>
      <br/>
      <br/>
    </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "EmergencyKitBuild",
  data: () => ({
    loading: true,
  }),
  computed: mapState({
     baseKits: (state) => state.baseKitStore.list,
  }),
  async created() {
    await this.$store.dispatch(`baseKitStore/getBaseKitListAsync`);
    this.loading = false;
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
  },
};
</script>