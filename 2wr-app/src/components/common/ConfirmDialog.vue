<template>
  <v-dialog v-model="showDialog">
    <v-card>
      <v-toolbar v-if="title">
      <v-toolbar-title class="text-body-2 font-weight-bold grey--text">
        {{ title }}
      </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-4">
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn plain text color="grey" @click.native='deny'>{{ denyButtonText }}</v-btn>
        <v-btn plain text color="primary" @click.native="confirm">{{ confirmButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "ConfirmationDialog",
  setup() {

    const showDialog = ref(false);
    const titleText = ref("Confirmation");
    const messageText = ref("Are you sure?");
    const denyButtonText = ref("cancel");
    const confirmButtonText = ref("ok");
    let resolveCallback = null;

    function open(title, message, options) {
      showDialog.value = true;
      if (title) titleText.value = title;
      if (message) messageText.value = message;
      if (options?.denyText) denyButtonText.value = options.denyText;
      if (options?.confirmText) confirmButtonText.value = options.confirmText;
      return new Promise((resolve) => {
        resolveCallback = resolve;
      });
    }

    function closeDialog(result) {
      showDialog.value = false;
      resolveCallback(result);
    }

    return {
      open,
      title: titleText,
      message: messageText,
      denyButtonText,
      confirmButtonText,
      showDialog,
      confirm:() => closeDialog(true),
      deny: () => closeDialog(false)
    }
  }
})
</script>