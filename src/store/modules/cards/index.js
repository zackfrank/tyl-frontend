const state = {
  cards: []
}

const getters = {
  cards (state) {
    return state.cards
  }
}

const mutations = {
  setCards(state, cards) {
    state.cards = cards
  }
}

const actions = {
  setCards({ commit }, cards) {
    commit('setCards', cards)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
