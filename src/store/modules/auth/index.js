const state = {
  user: null,
}

const getters = {
  user (state) {
    return state.user
  }
}

const mutations = {
  setUser(state, user) {
    state.user = user
  }
}

const actions = {
  setUser({ commit }) {
    commit('setUser')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
