import { MutationTree, ActionTree } from "vuex";

interface State {
  loadingCreate: boolean;
  loadingList: boolean;
  messages: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const state = (): State => ({
  loadingCreate: false,
  loadingList: false,
  messages: []
});

export const mutations: MutationTree<State> = {
  setLoadingCreate(state, isLoading): void {
    state.loadingCreate = isLoading;
  },
  setLoadingList(state, isLoading): void {
    state.loadingList = isLoading;
  },
  setMessages(state, messages): void {
    state.messages = messages;
  }
};

export const actions: ActionTree<State, State> = {
  async list({ commit }, { userId }: { userId: string }): Promise<void> {
    commit("setMessages", []);
    commit("setLoadingList", true);
    await this.$axios
      .$get(`/api/users/${userId}/messages`)
      .then(res => {
        commit("setMessages", res.reverse());
      })
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingList", false);
      });
  },
  async create(
    { commit },
    params: { userId?: string; groupName?: string; text: string }
  ): Promise<void> {
    commit("setLoadingCreate", true);
    await this.$axios
      .$post("/api/messages", params)
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingCreate", false);
      });
  }
};
