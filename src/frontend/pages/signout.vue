<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  async fetch({ store, redirect }) {
    const signoutUrl = `https://${
      process.env.CognitoDomain
    }/logout?client_id=${
      process.env.CognitoClientId
    }&logout_uri=${encodeURIComponent(
      `${process.env.FrontUrl}/`
    )}`;
    await store.dispatch("signout");
    redirect(301, signoutUrl);
  }
})
export default class extends Vue {
}
</script>
