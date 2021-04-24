<template>
  <v-flex class="d-flex justify-space-between px-2 pt-2">
    <slot></slot>
    <div>
      <v-icon class="mr-2" v-if="allowSelected" @click="$emit(`selected`)">{{ icon }}</v-icon>
      <v-icon class="mr-2" v-if="!allowSelected">{{ icon }}</v-icon>
    </div>
  </v-flex>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    icon: { required: true },
    allowSelected: { type: Boolean, default: false }
  }
})
</script>
