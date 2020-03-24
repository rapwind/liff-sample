<template>
  <v-container v-if="isMounted">
    <v-alert
      :value="alert.message !== ''"
      :type="alert.type"
      outlined
      text
      class="mb-4"
    >
      {{ alert.message }}
    </v-alert>
    <v-card
      v-show="card && !updateCardDialog"
      :loading="loadingFetch || loadingFetchCard || loadingUpdateCard"
    >
      <v-card width="400" class="mx-auto">
        <v-card-text>{{ card }}</v-card-text>
        <v-card-actions>
          <v-btn :disabled="disabled" @click="updateCardDialog = true"
            >カードを更新する</v-btn
          >
          <v-btn :disabled="disabled" color="error" text @click="onDelete()"
            >カードを削除する</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-card-actions>
        <v-btn
          :loading="loadingCreate"
          :disabled="updateCardDialog || disabled"
          @click="onPayment()"
          >100円課金する</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card
      v-show="card === null || updateCardDialog"
      :loading="loadingFetch || loadingFetchCard || loadingUpdateCard"
    >
      <payment-form
        :stripe="stripePublicKey"
        :submit-text="submitText"
        :disabled="loadingFetchCard || loadingUpdateCard || disabled"
        @submit="onSubmit"
      ></payment-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import PaymentForm, { PaymentFormResponse } from "~/components/PaymentForm.vue";

/* eslint-disable class-methods-use-this */
@Component({
  computed: {
    ...mapState("user", ["loadingFetch", "user"]),
    ...mapState("payment", [
      "loadingFetchCard",
      "loadingUpdateCard",
      "loadingCreate",
      "card"
    ])
  },
  layout: "signedin",
  components: {
    PaymentForm
  },
  head: {
    title: "Payment"
  }
})
export default class extends Vue {
  private alert = {
    message: "",
    type: "info"
  };

  private isMounted = false;

  private disabled = false;

  private updateCardDialog = false;

  private submitText = "カードを追加する";

  private stripePublicKey = process.env.StripePublicKey;

  async mounted(): Promise<void> {
    const { userId } = this.$store.state;
    await this.$store.dispatch("user/fetch", { userId });
    await this.$store.dispatch("payment/fetchCard", { userId });
    const { card } = this.$store.state.payment;
    if (card) {
      this.submitText = "カードを更新する";
    }
    this.isMounted = true;
  }

  async onSubmit(res: PaymentFormResponse): Promise<void> {
    this.disabled = true;
    try {
      const { userId } = this.$store.state;
      await this.$store.dispatch("payment/updateCard", {
        userId,
        token: res.token.id
      });
      this.alert.type = "info";
      this.alert.message = "支払情報を更新しました。";
      window.setTimeout(async () => {
        this.alert.message = "";
        this.updateCardDialog = false;
        this.disabled = false;
        await this.$store.dispatch("payment/fetchCard", { userId });
      }, 2000);
    } catch (e) {
      this.alert.type = "error";
      this.alert.message = "支払情報の更新に失敗しました。";
      this.disabled = false;
    }
  }

  async onDelete(): Promise<void> {
    this.disabled = true;
    try {
      const { userId } = this.$store.state;
      await this.$store.dispatch("payment/deleteCard", { userId });
      this.alert.type = "info";
      this.alert.message = "支払情報を削除しました。";
      window.setTimeout(async () => {
        this.alert.message = "";
        this.updateCardDialog = false;
        this.disabled = false;
        await this.$store.dispatch("payment/fetchCard", { userId });
      }, 2000);
    } catch (e) {
      this.alert.type = "error";
      this.alert.message = "支払情報の削除に失敗しました。";
      this.disabled = false;
    }
  }

  async onPayment(): Promise<void> {
    this.disabled = true;
    try {
      const { userId } = this.$store.state;
      await this.$store.dispatch("payment/create", { userId });
      this.alert.type = "info";
      this.alert.message = "購入しました。2秒後にトップに戻ります。";
      window.setTimeout(() => {
        this.$router.push({ path: "/" });
      }, 2000);
    } catch (e) {
      this.alert.type = "error";
      this.alert.message = "購入に失敗しました。";
      this.disabled = false;
    }
  }
}
</script>
