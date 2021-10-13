<template>
    <v-container class="py-0">
        <v-app-bar app flat dense fixed  color="background">
          <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
          <v-icon class="mr-2">mdi-shield-alert-outline</v-icon>
          <v-toolbar-title>Hazard Information</v-toolbar-title>
        </v-app-bar>
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="green"
        ></v-progress-linear>
          <v-row dense>
        <v-col
          v-for="item in items"
          :key="item.id"
          cols="6"
        >
          <v-card
            @click="viewItem(item.id)">
            <v-img
              :src="item.iconUrl"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="item.name"></v-card-title>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data: () => {
    return {
      search: '',
      loading: true,
    };
  },
  computed:  mapState({
      items: state => state.hazardInfoStore.list
  }),
  async created() {
    await this.$store.dispatch(`hazardInfoStore/getHazardInfosAsync`);
    this.loading = false;
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },
    viewItem(id){
      this.$router.push(`/prepare/hazardinfo/${id}`);
    }
  }
}
</script>

<style>

</style>