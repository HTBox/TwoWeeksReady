<template>
  <v-container class="py-0">
    <v-app-bar app flat dense fixed>
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-icon class="mr-2">mdi-medical-bag</v-icon>
      <v-toolbar-title>Emergency Kit List</v-toolbar-title>
      <v-fab-transition>
        <v-btn
          color="green"
          dark
          absolute
          bottom
          right
          fab
          to="/prepare/emergencykits/create"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-app-bar>
    <v-overlay :value="isLoading">
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
    </v-overlay>
    <v-data-iterator
      :items="listing"
      disable-pagination
      disable-sort
      hide-default-footer
      :search="search"
      :loading="isLoading"
      :loading-text="'Data is loading..'"
    >
      <template v-slot:header>
        <v-text-field
          v-model="search"
          clearable
          label="Search"
          append-icon="mdi-magnify"
        >
        </v-text-field>
      </template>      
      <template v-slot:default="props">
        <v-card
          v-for="item in props.items"
          :key="item.id"
          :color="item.color"
          class="my-4"
          ripple
          @click="editKit(item.id)"
        >
          <v-card-title class="white--text">
            <v-col class="col-9">
              <v-icon class="mr-2 white--text">{{ item.icon }}</v-icon>
              {{ item.name }}
            </v-col>
            <v-col class="text-right">
              <v-icon class="mr-2 white--text" @click="deleteKit(item.id)"
                >mdi-trash-can-outline</v-icon
              >
            </v-col>
          </v-card-title>
        </v-card>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "EmergencyKitList",
  data: () => ({
    search: "",
    headers: [
      {
        text: "Kit name",
        value: "name",
      },
    ]
  }),
  computed: mapState({
    listing: (state) => state.emergencyKitStore.list,
    isLoading: (state) => state.emergencyKitStore.isLoading,
  }),
  created() {
    this.$store.dispatch(`emergencyKitStore/getEmergencyKitListAsync`);
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