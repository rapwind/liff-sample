<template>
  <v-app>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "Signedin",
  middleware: ["auth"]
})
export default class Loggedin extends Vue {}
</script>
