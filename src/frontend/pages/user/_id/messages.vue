<template>
  <v-container fill-height>
    <v-layout wrap column>
      <ul class="message-list">
        <li v-for="(message, index) in messages" :key="message.id">
          <span
            v-if="
              !messages[index - 1] ||
                ymd(messages[index - 1].timestamp) !== ymd(message.timestamp)
            "
            class="message-day-divider"
          >
            <span class="message-day-chips">{{ ymd(message.timestamp) }}</span>
          </span>
          <span class="message" :class="message.side">
            <v-avatar
              v-if="message.side === 'receiver'"
              size="36"
              color="grey"
              class="message-avater"
            >
              <v-img :src="user.profilePictureUrl"></v-img>
            </v-avatar>
            <span class="message-box">{{
              message.message.altText || message.message.text
            }}</span>
            <span class="message-ts">{{ message.timestamp | momentHm }}</span>
          </span>
        </li>
      </ul>
      <admin-toolbar class="message-header-toolbar"></admin-toolbar>
      <v-card class="message-form-toolbar">
        <v-row>
          <v-col>
            <v-textarea
              v-model="sendMessage"
              outlined
              rows="2"
              no-resize
              dense
              counter
              :disabled="loadingCreateMessages"
            ></v-textarea>
          </v-col>
          <v-col cols="auto">
            <v-btn
              class="message-send-button"
              icon
              :loading="loadingCreateMessages"
              @click="onClick"
              ><v-icon large color="primary">mdi-send</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";
import * as moment from "moment";
import AdminToolbar from "~/components/AdminToolbar.vue";

/* eslint-disable class-methods-use-this */
@Component({
  computed: {
    ...mapState("user", {
      user: "user",
      loadingFetchUser: "loadingFetch"
    }),
    ...mapState("message", {
      messages: "messages",
      loadingCreateMessages: "loadingCreate",
      loadingListMessages: "loadingList"
    })
  },
  layout: "signedin",
  components: {
    AdminToolbar
  },
  head: {
    title: "Messages"
  }
})
export default class extends Vue {
  sendMessage = "";

  ymd(date: number): string {
    if (moment(date).year() !== moment().year()) {
      return moment(date).format("YYYY/MM/DD");
    }
    return moment(date).format("MM/DD");
  }

  scrollToLast(): void {
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
  }

  async fetchUser(): Promise<void> {
    const userId = this.$route.params.id;
    await this.$store.dispatch("user/fetch", { userId });
  }

  async listMessages(): Promise<void> {
    const userId = this.$route.params.id;
    await this.$store.dispatch("message/list", { userId });
    this.scrollToLast();
  }

  async mounted(): Promise<void> {
    await Promise.all([this.fetchUser(), this.listMessages()]);
  }

  async onClick(): Promise<void> {
    const userId = this.$route.params.id;
    await this.$store.dispatch("message/create", {
      userId,
      text: this.sendMessage
    });
    this.sendMessage = "";
    await this.listMessages();
  }
}
</script>

<style scoped>
.message-header-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.message-form-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  padding: 0 8px;
}
.message-send-button {
  margin: 10px 0;
}
.message-list {
  width: 100%;
  height: 100%;
  margin: 60px 0 100px;
  padding: 0;
  list-style: none;
}
.message-day-divider {
  display: inline-block;
  width: 100%;
  text-align: center;
}
.message-day-divider .message-day-chips {
  padding: 4px 8px;
  height: 1em;
  background: #fafafa;
  color: #9e9e9e;
  font-size: 10px;
  border-radius: 9px;
}
.message {
  display: flex;
  margin: 8px 0;
  width: 100%;
  flex-wrap: nowrap;
}
.message.receiver {
  flex-direction: row;
}
.message.sender {
  flex-direction: row-reverse;
}
.message-avater-box {
  display: flex;
  flex-wrap: nowrap;
}
.message-box {
  display: inline-block;
  margin: 4px;
  padding: 8px;
  border-radius: 16px;
  font-size: 12px;
  white-space: pre-wrap;
  text-align: left;
}
.message.receiver .message-box {
  background-color: #eceff1;
}
.message.sender .message-box {
  background-color: #ccff90;
}
.message-ts {
  margin: 4px;
  border-radius: 4px;
  font-size: 11px;
  align-self: flex-end;
}
</style>
