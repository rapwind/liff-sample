<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  fetch({ redirect }) {
    const signinUrl = `https://${
      process.env.CognitoDomain
    }/authorize?client_id=${
      process.env.CognitoClientId
    }&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=${encodeURIComponent(
      `${process.env.FrontUrl}/callback`
    )}`;
    redirect(301, signinUrl);
  }
})
export default class extends Vue {}
</script>
