import { MutationTree, ActionTree } from "vuex";
import User, { emptyUser } from "~/models/User";

interface State {
  loadingList: boolean;
  loadingFetch: boolean;
  loadingUpdate: boolean;
  loadingUpdateGroups: boolean;
  user: User;
  users: User[];
}

// TODO: gettersちゃんとつくる

export const state = (): State => ({
  loadingList: false,
  loadingFetch: false,
  loadingUpdate: false,
  loadingUpdateGroups: false,
  user: emptyUser,
  users: []
});

export const mutations: MutationTree<State> = {
  setLoadingFetch(state, isLoading): void {
    state.loadingFetch = isLoading;
  },
  setLoadingList(state, isLoading): void {
    state.loadingList = isLoading;
  },
  setLoadingUpdate(state, isLoading): void {
    state.loadingUpdate = isLoading;
  },
  setLoadingUpdateGroups(state, isLoading): void {
    state.loadingUpdateGroups = isLoading;
  },
  setList(state, users): void {
    state.users = users;
  },
  set(state, user): void {
    state.user = user;
  }
};

export const actions: ActionTree<State, State> = {
  async list({ commit }): Promise<void> {
    commit("setLoadingFetch", true);
    await this.$axios
      .$get("/api/users")
      .then((res): void => {
        commit("setList", res);
      })
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingFetch", false);
      });
  },
  async fetch(
    { commit, state },
    { userId }: { userId: string }
  ): Promise<void> {
    if (state.user.id !== userId) {
      commit("set", emptyUser);
    }
    commit("setLoadingFetch", true);
    await this.$axios
      .$get(`/api/users/${userId}`)
      .then((res): void => {
        commit("set", res);
      })
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingFetch", false);
      });
  },
  async update(
    { commit },
    { userId, user }: { userId: string; user: User }
  ): Promise<void> {
    commit("setLoadingUpdate", true);
    await this.$axios
      .$put(`/api/users/${userId}`, user)
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingUpdate", false);
      });
  },
  async updateGroups(
    { commit },
    { userId, groups }: { userId: string; groups: string[] }
  ): Promise<void> {
    commit("setLoadingUpdateGroups", true);
    await this.$axios
      .$put(`/api/users/${userId}/groups`, groups)
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingUpdateGroups", false);
      });
  }
};
