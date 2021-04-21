<template>
  <v-container>
    <v-text-field v-model="address.address1" placeholder="e.g. 123 Main Street" />
    <v-text-field v-model="address.address2" placeholder="e.g. Apt 123" />
    <v-text-field v-model="address.address3" placeholder="e.g. Portland, OR" />
  </v-container>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: "address-editor",
  props: {
    address: {
      required: true
    }
  }
})
</script>
