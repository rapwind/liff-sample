import { MutationTree, ActionTree } from "vuex";
import createPersistedState from "vuex-persistedstate";
import jwt from "jwt-decode";

interface State {
  token?: string;
  userId?: string;
  groups?: string[];
}

export const state = (): State => ({});

export const mutations: MutationTree<State> = {
  setAuthorizationToken(state, accessToken): void {
    state.token = accessToken;
    const data: { sub: string; ["cognito:groups"]: string[] } = jwt(
      accessToken
    );
    state.userId = data.sub;
    state.groups = data["cognito:groups"];
  },
  removeToken(state): void {
    delete state.token;
    delete state.userId;
    delete state.groups;
  }
};

export const actions: ActionTree<State, State> = {
  nuxtClientInit() {
    createPersistedState({
      key: "sample-liff-app",
      paths: ["token", "userId", "groups"]
    })(this);
  },
  setAuthorizationToken(
    { commit },
    { accessToken }: { accessToken: string }
  ): void {
    commit("setAuthorizationToken", accessToken);
  },
  signout({ commit }): void {
    commit("removeToken");
  }
};
