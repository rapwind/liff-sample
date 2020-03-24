<template>
  <v-card
    width="400"
    class="mx-auto credit-card-inputs"
    :class="{ complete }"
    :disabled="disabled"
  >
    <card-number
      ref="cardNumber"
      class="stripe-element card-number"
      :stripe="stripe"
      :options="options"
      @change="number = $event.complete"
    ></card-number>
    <card-expiry
      ref="cardExpiry"
      class="stripe-element card-expiry"
      :stripe="stripe"
      :options="options"
      @change="expiry = $event.complete"
    ></card-expiry>
    <card-cvc
      ref="cardCvc"
      class="stripe-element card-cvc"
      :stripe="stripe"
      :options="options"
      @change="cvc = $event.complete"
    ></card-cvc>
    <v-card-actions>
      <v-btn class="pay-with-stripe" :disabled="!complete" @click="onClick">{{
        submitText
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import {
  CardNumber,
  CardExpiry,
  CardCvc,
  createToken
} from "vue-stripe-elements-plus";

export interface PaymentFormResponse {
  error?: {
    code: string;
    type: string;
    message: string;
  };
  token?: {
    id: string;
    card: {
      id: string;
    };
  };
}

/* eslint-disable class-methods-use-this */
@Component({
  components: {
    CardNumber,
    CardExpiry,
    CardCvc
  }
})
export default class PaymentForm extends Vue {
  @Prop({ type: String, required: true }) stripe!: string;
  @Prop({ type: String, required: true }) submitText!: string;
  @Prop({ type: Boolean, required: true }) disabled!: boolean;
  @Prop({ type: Object }) options!: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  private complete = false;

  private number = false;
  @Watch("number")
  private onChangeNumber = (): void => {
    this.update();
  };

  private expiry = false;
  @Watch("expiry")
  private onChangeExpiry = (): void => {
    this.update();
  };

  private cvc = false;
  @Watch("cvc")
  private onChangeCvc = (): void => {
    this.update();
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private update(): void {
    const hasFocus = (x: any): boolean =>
      "focus" in x && typeof x.focus === "function";
    this.complete = this.number && this.expiry && this.cvc;
    const { cardNumber, cardExpiry, cardCvc } = this.$refs as {
      [key: string]: any;
    };

    if (!hasFocus(cardNumber) || !hasFocus(cardExpiry) || !hasFocus(cardCvc))
      return;

    if (this.number) {
      if (!this.expiry) {
        cardExpiry.focus();
      } else if (!this.cvc) {
        cardCvc.focus();
      }
    } else if (this.expiry) {
      if (!this.cvc) {
        cardCvc.focus();
      } else if (!this.number) {
        cardNumber.focus();
      }
    }
  }

  private clear(): void {
    const { cardNumber, cardExpiry, cardCvc } = this.$refs as {
      [key: string]: any;
    };
    cardNumber.clear();
    cardExpiry.clear();
    cardCvc.clear();
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  @Emit("submit")
  public submit(_: PaymentFormResponse): void {} // eslint-disable-line @typescript-eslint/no-empty-function

  private async onClick(): Promise<void> {
    const res = await createToken();
    this.submit(res);
    this.clear();
  }
}
</script>

<style>
.credit-card-inputs.complete {
  border: 2px solid green;
}
</style>
