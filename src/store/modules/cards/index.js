const state = {
  cards: [],
  selectedCards: []
}

const getters = {
  cards (state) {
    return state.cards
  },
  selectedCards (state) {
    return state.selectedCards
  }
}

const mutations = {
  setCards(state, cards) {
    state.cards = cards
  },
  selectCards(state, cards) {
    state.selectedCards = cards
  }
}

const actions = {
  setCards({ commit }, cards) {
    commit('setCards', cards)
  },
  setSelectedCards({ commit, state }, selectedTags) {
    if (selectedTags.length) {
      commit('selectCards', state.cards.filter(
        card => selectedTags.every(
          tag => card.tags.includes(tag.name)
        )
      )
    )} else {
      commit('selectCards', [])
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
