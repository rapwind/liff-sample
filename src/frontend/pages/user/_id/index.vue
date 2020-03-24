<template>
  <v-container>
    <admin-toolbar></admin-toolbar>
    <v-card
      :loading="loadingFetchUser || loadingListGroup || loadingUpdateUserGroups"
    >
      <v-card-title>
        <v-list-item class="text-truncate">
          <v-list-item-avatar color="grey">
            <v-img :src="user.profilePictureUrl"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              >{{ user.lastName }} {{ user.firstName }}</v-list-item-title
            >
            <v-list-item-subtitle>ID: {{ user.id }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            ニックネーム: {{ user.nickName }}
            <v-col> </v-col>
            LINE表示名: {{ user.lineName }}
            <v-col> </v-col>
            LINE ID: {{ user.lineId }}
            <v-col> </v-col>
            Stripe ID: {{ user.stripeId }}
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="primary" :to="toMessageLink()"
          >過去のメッセージを見る</v-btn
        >
      </v-card-actions>
      <v-divider></v-divider>
      <v-card-subtitle>
        <v-row>
          <v-col cols="auto" class="mr-auto">所属グループ</v-col>
          <v-col cols="auto">
            <v-btn icon>
              <v-icon color="grey" @click="openAddGroupDialog()"
                >mdi-plus</v-icon
              >
            </v-btn>
          </v-col>
        </v-row>
      </v-card-subtitle>
      <v-list-item v-for="group in user.groups" :key="group">
        <v-list-item-content>{{ group }}</v-list-item-content>
        <v-list-item-action>
          <v-btn icon :disabled="loadingFetchUser || loadingUpdateUserGroups">
            <v-icon color="grey" @click="removeGroup(group)">mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-card>
    <v-dialog v-model="createDialog" max-width="500px">
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon text @click="createDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-container grid-list-md>
            <v-form v-model="valid">
              <v-select
                v-model="editedGroupName"
                :items="notBelongGroups()"
                :rules="[validation.groupName]"
                label="グループ名"
                required
              ></v-select>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="createDialog = false">
            キャンセル
          </v-btn>
          <v-btn
            :disabled="!valid"
            text
            :loading="loadingUpdateUserGroups"
            @click="addGroup"
          >
            追加
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import AdminToolbar from "~/components/AdminToolbar.vue";

@Component({
  computed: {
    ...mapState("group", {
      groups: "groups",
      loadingListGroup: "loadingList"
    }),
    ...mapState("user", {
      user: "user",
      loadingFetchUser: "loadingFetch",
      loadingUpdateUserGroups: "loadingUpdateGroups"
    })
  },
  layout: "signedin",
  components: {
    AdminToolbar
  },
  head: {
    title: "User"
  }
})
export default class extends Vue {
  private disabled = false;

  private createDialog = false;

  private valid = false;

  private validation: { [key: string]: (v: string) => string | boolean } = {
    groupName: (value): string | boolean => !!value || "グループ名は必須です"
  };

  private editedGroupName = "";

  private notBelongGroups = (): string[] => {
    const userGroups: string[] = this.$store.state.user.user.groups;
    const { groups } = this.$store.state.group;
    return groups.filter(group => userGroups && !userGroups.includes(group));
  };

  async fetchUser(): Promise<void> {
    const userId = this.$route.params.id;
    await this.$store.dispatch("user/fetch", { userId });
  }

  async updateGroups(groups: string[]): Promise<void> {
    const userId = this.$route.params.id;
    await this.$store.dispatch("user/updateGroups", { userId, groups });
  }

  openAddGroupDialog(): void {
    this.editedGroupName = "";
    this.createDialog = true;
  }

  async addGroup(): Promise<void> {
    await this.updateGroups([
      ...this.$store.state.user.user.groups,
      this.editedGroupName
    ]);
    this.createDialog = false;
    await this.fetchUser();
  }

  async removeGroup(removeGroup): Promise<void> {
    const userGroups: string[] = this.$store.state.user.user.groups;
    await this.updateGroups(userGroups.filter(group => group !== removeGroup));
    await this.fetchUser();
  }

  async mounted(): Promise<void> {
    await Promise.all([this.$store.dispatch("group/list"), this.fetchUser()]);
  }

  toMessageLink(): string {
    return `/user/${this.$route.params.id}/messages`;
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
