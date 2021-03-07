<template>
    <v-container class="py-0">
        <v-app-bar app flat dense fixed>
          <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
          <v-icon class="mr-2">mdi-shield-search</v-icon>
          <v-toolbar-title>Hazard Hunt</v-toolbar-title>
        </v-app-bar>
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="green"
        ></v-progress-linear>
        <v-data-iterator v-if="!loading" :items="hunts" disable-pagination disable-sort hide-default-footer
          :search="search">
          <template v-slot:header>
            <v-text-field
              v-model="search"
              clearable             
              label="Search"
              append-icon="mdi-magnify">
            </v-text-field>
          </template>
          <template v-slot:default="props">
            <v-card v-for="item in props.items" :key="item.id" class="my-4" ripple dark>
              <v-card-title class="white--text">
                <v-col class="col-9">
                  <!-- <v-icon class="mr-2 white--text">{{item.icon}}</v-icon> -->{{ item.name }}
                </v-col>
              </v-card-title>
              <v-card-text>{{ item.description }}</v-card-text>
            </v-card>
          </template>
        </v-data-iterator>
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
      hunts: state => state.hazardHuntStore.list
  }),
  async created() {
    await this.$store.dispatch(`hazardHuntStore/getHazardHuntsAsync`);
    this.loading = false;
  },
  methods: {
    goBack() {
        window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    }
  }
}
</script>

<style>

</style>