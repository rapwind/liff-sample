<template>
  <v-card
    width="400"
    class="mx-auto"
    :loading="loading"
    :disabled="loading || disabled"
  >
    <v-card-title>
      <v-row>
        <v-col>
          ユーザー情報
        </v-col>
        <v-col class="text-right">
          <v-btn
            :disabled="!isValid"
            color="primary"
            depressed
            @click="onClick"
          >
            更新する
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-form v-model="isValid">
      <v-card-text>氏名</v-card-text>
      <v-row class="px-4">
        <v-col>
          <v-text-field
            v-model="form.lastName"
            :rules="[validation.lastName]"
            placeholder="田中"
            label="姓"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.firstName"
            :rules="[validation.firstName]"
            placeholder="太郎"
            label="名"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-text-field
        v-model="form.nickName"
        :rules="[validation.nickName]"
        label="ニックネーム"
        class="px-4 pt-6"
      ></v-text-field>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import User from "~/models/User";

export interface UserFormData {
  lastName?: string;
  firstName?: string;
  nickName?: string;
}

/* eslint-disable class-methods-use-this */
@Component
export default class UserForm extends Vue {
  @Prop({ type: Boolean, required: true }) loading!: boolean;
  @Prop({ type: Boolean, required: true }) disabled!: boolean;

  @Prop({ type: Object, required: true }) user!: User;
  @Watch("user", { immediate: true, deep: true })
  onChangeCompany(newValue): void {
    this.form = UserForm.formFromUser(newValue);
  }

  private form = UserForm.formFromUser(this.user);

  private isValid = false;

  private static formFromUser(user: User): UserFormData {
    return {
      lastName: user.lastName,
      firstName: user.firstName,
      nickName: user.nickName
    };
  }

  get validation(): { [key: string]: (v: string) => string | boolean } {
    return {
      lastName: (v): string | boolean => !!v || "名前は必須です",
      firstName: (v): string | boolean => !!v || "苗字は必須です",
      nickName: (v): string | boolean => !!v || "ニックネームは必須です"
    };
  }

  @Emit("submit")
  public submit(_: UserFormData): void {} // eslint-disable-line @typescript-eslint/no-empty-function

  public onClick(): void {
    this.submit(this.form);
  }
}
</script>
