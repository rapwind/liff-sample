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
    <user-form
      :loading="loadingFetchUser || loadingUpdateUser"
      :disabled="disabled"
      :user="user"
      @submit="onSubmit"
    ></user-form>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import UserForm, { UserFormData } from "~/components/UserForm.vue";

@Component({
  computed: {
    ...mapState("user", {
      user: "user",
      loadingFetchUser: "loadingFetch",
      loadingUpdateUser: "loadingUpdate"
    })
  },
  layout: "signedin",
  components: {
    UserForm
  },
  head: {
    title: "Update User"
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

  private async onSubmit(form: UserFormData): Promise<void> {
    const { userId } = this.$store.state;
    this.disabled = true;
    try {
      await this.$store.dispatch("user/update", { userId, user: form });
      this.alert.type = "info";
      this.alert.message =
        "ユーザー情報を更新しました。2秒後にトップに戻ります。";
      window.setTimeout(() => {
        this.$router.push({ path: "/" });
      }, 2000);
    } catch (e) {
      this.alert.type = "error";
      this.alert.message = "ユーザー情報の更新に失敗しました。";
      this.disabled = false;
    }
  }
}
</script>
