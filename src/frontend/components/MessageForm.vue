<template>
  <v-card :loading="loading" :disabled="loading || disabled">
    <v-card-title>メッセージ送信</v-card-title>
    <v-divider></v-divider>
    <v-form v-model="isValid" class="pa-4">
      <v-select
        v-model="form.groupName"
        :items="groups"
        :rules="[validation.groupName]"
        label="グループ名"
        required
      ></v-select>
      <v-textarea
        v-model="form.text"
        :rules="[validation.text]"
        label="メッセージ"
        class="mt-4"
        outlined
        required
      ></v-textarea>
      <v-divider class="mt-4"></v-divider>
      <div class="pt-4 text-center">
        <v-btn :disabled="!isValid" color="primary" depressed @click="onClick">
          送信する
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

export interface MessageFormData {
  text?: string;
  groupName?: string;
}

/* eslint-disable class-methods-use-this */
@Component
export default class MessageForm extends Vue {
  @Prop({ type: Boolean, required: true }) loading!: boolean;
  @Prop({ type: Boolean, required: true }) disabled!: boolean;
  @Prop({ type: Array, required: true }) groups!: string[];

  private form: MessageFormData = {
    text: "",
    groupName: ""
  };

  private isValid = false;

  get validation(): { [key: string]: (v: string) => string | boolean } {
    return {
      text: (v): string | boolean => !!v || "メッセージは必須です",
      groupName: (v): string | boolean => !!v || "グループ名は必須です"
    };
  }

  @Emit("submit")
  public submit(value: MessageFormData): void {} // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars

  public onClick(): void {
    this.submit(this.form);
  }
}
</script>
