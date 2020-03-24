<template>
  <v-container>
    <admin-toolbar></admin-toolbar>
    <v-card :loading="loadingListGroup || loadingDeleteGroup">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Group</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="group in groups" :key="group">
              <td>{{ group }}</td>
              <td class="text-right">
                <v-btn icon text @click="selectItem(group)">
                  <v-icon>mdi-account-multiple</v-icon>
                </v-btn>
                <v-btn icon text @click="openDeleteDialog(group)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-btn to="/group/create">グループを追加</v-btn>
    </v-card>
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon text @click="deleteDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          「{{ selectedGroup }}」グループを削除します、よろしいですか？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">
            キャンセル
          </v-btn>
          <v-btn text @click="deleteGroup">
            削除
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
      loadingListGroup: "loadingList",
      loadingDeleteGroup: "loadingDelete"
    })
  },
  layout: "signedin",
  components: {
    AdminToolbar
  },
  head: {
    title: "Groups"
  }
})
export default class extends Vue {
  private disabled = false;

  private deleteDialog = false;

  private selectedGroup = "";

  async mounted(): Promise<void> {
    await this.$store.dispatch("group/list");
  }

  selectItem(group: string): void {
    this.$router.push(`/group/${group}`);
  }

  openDeleteDialog(group): void {
    this.selectedGroup = group;
    this.deleteDialog = true;
  }

  async deleteGroup(): Promise<void> {
    this.deleteDialog = false;
    await this.$store.dispatch("group/delete", {
      groupName: this.selectedGroup
    });
    await this.$store.dispatch("group/list");
  }
}
</script>
