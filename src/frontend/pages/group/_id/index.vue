<template>
  <v-container>
    <admin-toolbar></admin-toolbar>
    <v-card :loading="loadingListUser">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">Nick name</th>
              <th class="text-left">Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="clickable"
              @click="selectItem(user)"
            >
              <td>{{ user.id }}</td>
              <td>{{ user.nickName }}</td>
              <td>{{ user.lastName }} {{ user.firstName }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import AdminToolbar from "~/components/AdminToolbar.vue";
import User from "~/models/User";

@Component({
  computed: {
    ...mapState("group", ["users", "loadingListUser"])
  },
  layout: "signedin",
  components: {
    AdminToolbar
  },
  head: {
    title: "Users by group"
  }
})
export default class extends Vue {
  private disabled = false;

  async mounted(): Promise<void> {
    const groupName = this.$route.params.id;
    await this.$store.dispatch("group/listUser", { groupName });
  }

  selectItem(user: User): void {
    this.$router.push(`/user/${user.id}`);
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
