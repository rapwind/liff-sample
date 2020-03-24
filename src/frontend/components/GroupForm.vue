<template>
  <v-card :loading="loading" :disabled="loading || disabled">
    <v-card-title>グループを追加</v-card-title>
    <v-divider></v-divider>
    <v-form v-model="isValid">
      <v-text-field
        v-model="form.name"
        :rules="[validation.name, validation.possible]"
        label="グループ名"
        class="px-4 pt-6"
      ></v-text-field>
      <v-divider class="mt-4"></v-divider>
      <div class="pa-4 text-center">
        <v-btn :disabled="!isValid" color="primary" depressed @click="onClick">
          作成する
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

export interface GroupFormData {
  name?: string;
}

/* eslint-disable class-methods-use-this */
@Component
export default class GroupForm extends Vue {
  @Prop({ type: Boolean, required: true }) loading!: boolean;
  @Prop({ type: Boolean, required: true }) disabled!: boolean;

  private form: GroupFormData = { name: "" };

  private isValid = false;

  get validation(): { [key: string]: (v: string) => string | boolean } {
    return {
      name: (v): boolean | string => !!v || "名前は必須です",
      possible: (v): boolean | string =>
        !!v.match(/^[0-9a-zA-Z]*$/) || "半角英数字で入力してください"
    };
  }

  @Emit("submit")
  public submit(_: GroupFormData): void {} // eslint-disable-line @typescript-eslint/no-empty-function

  public onClick(): void {
    this.submit(this.form);
  }
}
</script>
