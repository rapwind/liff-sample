<template>
  <v-container>
    <v-alert
      :value="alert.message !== ''"
      :type="alert.type"
      outlined
      text
      class="mb-4"
    >
      {{ alert.message }}
    </v-alert>
    <admin-toolbar></admin-toolbar>
    <group-form
      :loading="loadingCreate"
      :disabled="disabled"
      @submit="onSubmit"
    ></group-form>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import AdminToolbar from "~/components/AdminToolbar.vue";
import GroupForm, { GroupFormData } from "~/components/GroupForm.vue";

@Component({
  computed: {
    ...mapState("group", ["loadingCreate"])
  },
  layout: "signedin",
  components: {
    AdminToolbar,
    GroupForm
  },
  head: {
    title: "Create Group"
  }
})
export default class extends Vue {
  private alert = {
    message: "",
    type: "info"
  };

  private disabled = false;

  async mounted(): Promise<void> {
    const { userId } = this.$store.state;
    await this.$store.dispatch("user/fetch", { userId });
  }

  private async onSubmit(form: GroupFormData): Promise<void> {
    this.disabled = true;
    try {
      await this.$store.dispatch("group/create", { groupName: form.name });
      this.alert.type = "info";
      this.alert.message =
        "グループを作成しました。2秒後にグループ一覧に戻ります。";
      window.setTimeout(() => {
        this.$router.push({ path: "/group" });
      }, 2000);
    } catch (e) {
      this.alert.type = "error";
      this.alert.message = "グループの作成に失敗しました。";
      this.disabled = false;
    }
  }
}
</script>
