import { MutationTree, ActionTree } from "vuex";
import User from "~/models/User";

interface State {
  loadingList: boolean;
  loadingCreate: boolean;
  loadingDelete: boolean;
  loadingListUser: boolean;
  groups: string[];
  users: User[];
}

export const state = (): State => ({
  loadingList: false,
  loadingCreate: false,
  loadingDelete: false,
  loadingListUser: false,
  groups: [],
  users: []
});

// TODO: gettersちゃんとつくる

export const mutations: MutationTree<State> = {
  setLoadingList(state, isLoading): void {
    state.loadingList = isLoading;
  },
  setLoadingCreate(state, isLoading): void {
    state.loadingCreate = isLoading;
  },
  setLoadingDelete(state, isLoading): void {
    state.loadingDelete = isLoading;
  },
  setLoadingListUser(state, isLoading): void {
    state.loadingListUser = isLoading;
  },
  setList(state, groups): void {
    state.groups = groups;
  },
  setUserList(state, users): void {
    state.users = users;
  }
};

export const actions: ActionTree<State, State> = {
  async list({ commit }): Promise<void> {
    commit("setList", []);
    commit("setLoadingList", true);
    await this.$axios
      .$get("/api/groups")
      .then((res): void => {
        commit("setList", res);
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
    { groupName }: { groupName: string }
  ): Promise<void> {
    commit("setLoadingCreate", true);
    await this.$axios
      .$post("/api/groups", { name: groupName })
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingCreate", false);
      });
  },
  async delete(
    { commit },
    { groupName }: { groupName: string }
  ): Promise<void> {
    commit("setLoadingDelete", true);
    await this.$axios
      .$delete(`/api/groups/${groupName}`)
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingDelete", false);
      });
  },
  async listUser({ commit }, { groupName }): Promise<void> {
    commit("setLoadingListUser", true);
    await this.$axios
      .$get(`/api/groups/${groupName}/users`)
      .then((res): void => {
        commit("setUserList", res);
      })
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingListUser", false);
      });
  }
};
