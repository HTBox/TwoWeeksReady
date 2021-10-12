<template>
  <v-container>
    <v-row class="text-left">
      <v-col cols="10">
        <img src="/img/icons/safari-pinned-tab.svg" width="350" />

        <h2>Welcome to 2 weeks ready</h2>
        <p>
          <strong>2 Weeks Ready</strong> is a mobile application that makes
          emergency preparedness a <strong>simple</strong>,
          <strong>easy</strong>, <strong>sharable</strong>, and
          <strong>time-saving</strong> experience to protect you and people you
          care about.
        </p>
      </v-col>
    </v-row>
    <v-fab-transition>
      <v-btn
        color="green"
        dark
        absolute
        bottom
        right
        fab
        class="mb-12"
        to="/earthquake"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
export default {
  name: "WelcomeLanding",
  data: () => ({}),
};
</script>
