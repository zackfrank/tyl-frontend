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
  },
  sortCardsByCreatedAt(state) {
    let startingOrder = state.selectedCards.slice(0)
    state.selectedCards.sort((a, b) => a.created_at - b.created_at)
    if (state.selectedCards[0] === startingOrder[0]) { state.selectedCards.reverse() }
  },
  sortCardsByUpdatedAt(state) {
    let startingOrder = state.selectedCards.slice(0)
    state.selectedCards.sort((a, b) => a.updated_at - b.updated_at)
    if (state.selectedCards[0] === startingOrder[0]) { state.selectedCards.reverse() }
  },
  sortCardsByTitle(state) {
    let startingOrder = state.selectedCards.slice(0)
    state.selectedCards.sort((a, b) => {
      let title1 = a.title.toUpperCase()
      let title2 = b.title.toUpperCase()
      if (title1 < title2) { return -1 }
      if (title1 > title2) { return 1 }
      return 0;
    })
    if (state.selectedCards[0] === startingOrder[0]) { state.selectedCards.reverse() }
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
  },
  sortCardsByCreatedAt({ commit }) {
    commit('sortCardsByCreatedAt')
  },
  sortCardsByUpdatedAt({ commit }) {
    commit('sortCardsByUpdatedAt')
  },
  sortCardsByTitle({ commit }) {
    commit('sortCardsByTitle')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
