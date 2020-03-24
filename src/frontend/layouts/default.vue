<template>
  <v-app>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "Default"
})
export default class Default extends Vue {}
</script>
