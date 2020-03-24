<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {
  mounted(): void {
    this.$store.dispatch("signout");
    this.$router.push("/");
  }
}
</script>
