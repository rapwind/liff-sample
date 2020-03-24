<template>
  <v-toolbar class="mb-4" flat>
    <v-spacer></v-spacer>
    <v-btn text to="/message">メッセージ</v-btn>
    <v-btn text to="/user">ユーザー</v-btn>
    <v-btn text to="/group">グループ</v-btn>
  </v-toolbar>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AdminToolbar extends Vue {}
</script>
