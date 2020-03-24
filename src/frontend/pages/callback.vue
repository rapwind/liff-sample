<template>
  <v-container> </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import querystring from "querystring";

@Component
export default class extends Vue {
  mounted(): void {
    const accessToken = querystring.parse(this.$route.hash.slice(1)).id_token;
    if (accessToken) {
      this.$store
        .dispatch("setAuthorizationToken", { accessToken })
        .then(() => {
          this.$router.replace("/");
        });
    } else {
      this.$router.replace("/");
    }
  }
}
</script>
