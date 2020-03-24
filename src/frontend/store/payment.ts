import { MutationTree, ActionTree } from "vuex";

interface State {
  loadingFetchCard: boolean;
  loadingUpdateCard: boolean;
  loadingCreate: boolean;
  card: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const state = (): State => ({
  loadingFetchCard: false,
  loadingUpdateCard: false,
  loadingCreate: false,
  card: null
});

export const mutations: MutationTree<State> = {
  setLoadingFetchCard(state, isLoading): void {
    state.loadingFetchCard = isLoading;
  },
  setLoadingUpdateCard(state, isLoading): void {
    state.loadingUpdateCard = isLoading;
  },
  setLoadingCreate(state, isLoading): void {
    state.loadingCreate = isLoading;
  },
  setCard(state, card): void {
    state.card = card;
  },
  deleteCard(state): void {
    state.card = null;
  }
};

export const actions: ActionTree<State, State> = {
  async fetchCard({ commit }, { userId }): Promise<void> {
    commit("setLoadingFetchCard", true);
    await this.$axios
      .$get(`/api/users/${userId}/payment/card`)
      .then(res => {
        if (Object.keys(res).length === 0) {
          commit("deleteCard");
        } else {
          commit("setCard", res);
        }
      })
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingFetchCard", false);
      });
  },
  async updateCard({ commit }, { userId, token }): Promise<void> {
    commit("setLoadingUpdateCard", true);
    await this.$axios
      .$post(`/api/users/${userId}/payment/card`, { token })
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingUpdateCard", false);
      });
  },
  async deleteCard({ commit }, { userId }): Promise<void> {
    commit("setLoadingUpdateCard", true);
    await this.$axios
      .$delete(`/api/users/${userId}/payment/card`)
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingUpdateCard", false);
      });
  },
  async create({ commit }, { userId }): Promise<void> {
    commit("setLoadingCreate", true);
    await this.$axios
      .$post(`/api/users/${userId}/payment`)
      .catch((error): void => {
        throw error;
      })
      .finally(() => {
        commit("setLoadingCreate", false);
      });
  }
};
