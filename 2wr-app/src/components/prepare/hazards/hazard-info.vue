<template>
    <v-container class="py-0">
      <v-app-bar app flat dense fixed  color="background">
        <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
        <v-img :src="item.iconUrl" max-height="48" max-width="48" class="mr-2"></v-img>
        <v-toolbar-title>{{item ? item.name : 'Hazard Information'}}</v-toolbar-title>
      </v-app-bar>
      <v-row dense>
        <v-col cols="12">
          <p class="pa-2 headline">{{item.description}}</p>
        </v-col>
        <v-col cols="12">
          <v-img v-if="mediaUrlIsImage" :src="item.mediaUrl"></v-img>
          <!--TODO: Add option for videos once we have some sample videos -->
        </v-col>
        <v-col cols="12" class="text-center">
          <h2>{{item.name}} Safety</h2>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn x-large color="primary" width="80%" @click="beforeDialog = true">Before</v-btn>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn x-large  color="primary" width="80%" @click="duringDialog = true">During</v-btn>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn x-large  color="primary" width="80%"  @click="afterDialog = true">After</v-btn>
        </v-col>
        <v-col cols="12" class="text-center">
          <h2>{{item.name}} Resources</h2>
        </v-col>
        <v-col cols="12">
          <ul class="mb-6">
            <li v-for="link in item.externalLinks" :key={link} class="pa-1">
              <a :href="link" target="_blank">{{link}}</a><v-icon small class="ml-2">mdi-open-in-new</v-icon></li>
          </ul>
        </v-col>
      </v-row>
      <v-dialog
        v-model="beforeDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile color="background">
          <v-toolbar class="flex-grow-0 mb-3"
            flat
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="beforeDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{item.name}} Safety: Before</v-toolbar-title>
            </v-toolbar>
          <v-card-text v-html="item.beforeSafetyDetails">
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="duringDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile color="background">
          <v-toolbar class="flex-grow-0 mb-3"
            flat
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="duringDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{item.name}} Safety: During</v-toolbar-title>
            </v-toolbar>
          <v-card-text v-html="item.duringSafetyDetails">
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="afterDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile color="background">
          <v-toolbar class="flex-grow-0 mb-3"
            flat
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="afterDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{item.name}} Safety: After</v-toolbar-title>
            </v-toolbar>
          <v-card-text v-html="item.afterSafetyDetails">
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data: () => {
    return {
      beforeDialog: false,
      duringDialog: false,
      afterDialog: false
    };
  },
  computed: {
    ...mapState({
      item: (state) => state.hazardInfoStore.item,
    }),
    mediaUrlIsImage: function() {
        const mediaUrl = this.item?.mediaUrl?.toLowerCase();
        if (!mediaUrl) return false;

        return mediaUrl.endsWith(".png") ||
               mediaUrl.endsWith(".jpg") ||
               mediaUrl.endsWith(".jpeg") ||
               mediaUrl.endsWith(".webp") ||
               mediaUrl.endsWith(".pjpeg") ||
               mediaUrl.endsWith(".svg") ||
               mediaUrl.endsWith(".pjp");
      }
  },
  mounted: function () {
    // Load the thing
    this.$store.dispatch(
      `hazardInfoStore/getHazardInfoAsync`,
      this.$route.params.id
    );
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