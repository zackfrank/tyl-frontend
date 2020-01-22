const state = {
  cards: [],
  selectedCards: [],
  currentCard: {}
}

const getters = {
  cards (state) {
    return state.cards
  },
  activeCards (state) {
    return state.cards.filter(card => !card.archived)
  },
  selectedCards (state) {
    return state.selectedCards
  },
  currentCard (state) {
    return state.currentCard
  }
}

const mutations = {
  setCards(state, cards) {
    state.cards = cards
  },
  selectCards(state, cards) {
    state.selectedCards = cards
  },
  updateCurrentCard(state) {
    if (state.currentCard !== {}) {
      state.currentCard = state.cards.find(card => card.id === state.currentCard.id)
    }
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
  },
  setCurrentCard(state, card) {
    state.currentCard = card
  },
  addNewCard(state, card) {
    state.cards.push(card)
  }
}

const actions = {
  setCards({ commit }, cards) {
    commit('setCards', cards)
    commit('updateCurrentCard')
  },
  setSelectedCardsFromTags({ commit, state }, selectedTags) {
    if (selectedTags.length) {
      commit('selectCards', state.cards.filter(
        card => selectedTags.map(tag => tag.id).every(
          id => card.tags.map(tag => tag.id).includes(id)
        )
      )
    )} else {
      commit('selectCards', [])
    }
  },
  setSelectedCardsTo({ commit }, cards) {
    commit('selectCards', cards)
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
  },
  setCurrentCard({ commit }, card) {
    commit('setCurrentCard', card)
  },
  addNewCard({ commit }, card) {
    commit('addNewCard', card)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
