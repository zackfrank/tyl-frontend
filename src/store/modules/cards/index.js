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
    state.selectedCards.sort((a, b) => a.created_at - b.created_at)
  },
  sortCardsByUpdatedAt(state) {
    state.selectedCards.sort((a, b) => a.updated_at - b.updated_at)
  },
  sortCardsByTitle(state) {
    state.selectedCards.sort((a, b) => {
      let title1 = a.title.toUpperCase()
      let title2 = b.title.toUpperCase()
      if (title1 < title2) { return -1 }
      if (title1 > title2) { return 1 }
      return 0;
    })
  },
  reverseSelectedCards(state) {
    state.selectedCards.reverse()
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
  sortCardsByCreatedAt({ dispatch, commit }) {
    let beforeOrder = state.selectedCards.slice(0)
    commit('sortCardsByCreatedAt')
    dispatch('reverseSelectedCardsIfSame', beforeOrder)
  },
  sortCardsByUpdatedAt({ dispatch, commit }) {
    let beforeOrder = state.selectedCards.slice(0)
    commit('sortCardsByUpdatedAt')
    dispatch('reverseSelectedCardsIfSame', beforeOrder)
  },
  sortCardsByTitle({ dispatch, commit, state }) {
    let beforeOrder = state.selectedCards.slice(0)
    commit('sortCardsByTitle')
    dispatch('reverseSelectedCardsIfSame', beforeOrder)
  },
  reverseSelectedCardsIfSame({ commit, state }, beforeOrder) {
    let analysis = []
    for (let i = 0; i < beforeOrder.length; i++) {
      analysis.push(beforeOrder[i] === state.selectedCards[i])
    }
    if(!analysis.includes(false)) { commit('reverseSelectedCards') }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
