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
    <message-form
      :loading="loadingCreateMessage || loadingListGroup"
      :disabled="disabled"
      :groups="groups"
      @submit="onSubmit"
    ></message-form>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import AdminToolbar from "~/components/AdminToolbar.vue";
import MessageForm, { MessageFormData } from "~/components/MessageForm.vue";

@Component({
  computed: {
    ...mapState("message", {
      loadingCreateMessage: "loadingCreate"
    }),
    ...mapState("group", {
      groups: "groups",
      loadingListGroup: "loadingList"
    })
  },
  layout: "signedin",
  components: {
    AdminToolbar,
    MessageForm
  },
  head: {
    title: "Message"
  }
})
export default class extends Vue {
  private alert = {
    message: "",
    type: "info"
  };

  private disabled = false;

  async mounted(): Promise<void> {
    await this.$store.dispatch("group/list");
  }

  private async onSubmit(form: MessageFormData): Promise<void> {
    this.disabled = true;
    try {
      await this.$store.dispatch("message/create", {
        groupName: form.groupName,
        text: form.text
      });
      this.alert.type = "info";
      this.alert.message =
        "メッセージを送信しました。2秒後にトップに戻ります。";
      window.setTimeout(() => {
        this.$router.push({ path: "/" });
      }, 2000);
    } catch (e) {
      this.alert.type = "error";
      this.alert.message = "メッセージの送信に失敗しました。";
      this.disabled = false;
    }
  }
}
</script>
