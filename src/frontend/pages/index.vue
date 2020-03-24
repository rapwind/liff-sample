<template>
  <v-container>
    <v-card v-if="isMounted" :loading="loadingFetch">
      <v-card-actions>
        <v-btn to="/user/update">プロフィールの変更</v-btn>
        <v-btn to="/payment">決済</v-btn>
        <v-btn to="/signout">ログアウト</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="isAdmin()" class="mt-4">
      <v-card-subtitle>管理ツール</v-card-subtitle>
      <v-card-actions>
        <v-btn to="/message">メッセージ</v-btn>
        <v-btn to="/user">ユーザー</v-btn>
        <v-btn to="/group">グループ</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  computed: mapState("user", ["loadingFetch", "user", "groups"]),
  layout: "signedin",
  head: {
    title: "TOP"
  }
})
export default class extends Vue {
  private signoutUrl = `https://${process.env.CognitoDomain}/logout?client_id=${
    process.env.CognitoClientId
  }&logout_uri=${encodeURIComponent(`${process.env.FrontUrl}/signout`)}`;

  private isMounted = false;

  private isAdmin = (): boolean =>
    this.$store.state.groups && this.$store.state.groups.includes("Admin");

  async mounted(): Promise<void> {
    this.isMounted = true;
    const { userId } = this.$store.state;
    await this.$store.dispatch("user/fetch", { userId });
    const { user } = this.$store.state.user;
    if (!user.firstName) {
      this.$router.push("/user/update");
    }
  }
}
</script>
