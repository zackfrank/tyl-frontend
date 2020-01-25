const state = {
  cards: [],
  selectedCards: [],
  currentCard: {},
  cardSearchQuery: '',
  showArchived: false,
  showActive: true
}

const getters = {
  cards (state) {
    return state.cards
  },
  activeCards (state) {
    return state.cards.filter(card => !card.archived)
  },
  archivedCards (state) {
    return state.cards.filter(card => card.archived)
  },
  selectedCards (state) {
    return state.selectedCards
  },
  currentCard (state) {
    return state.currentCard
  },
  cardSearchQuery (state) {
    return state.cardSearchQuery
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
  },
  setCardSearchQuery(state, query) {
    state.cardSearchQuery = query
  },
  setShowArchived(state, value) {
    state.showArchived = value
  },
  setShowActive(state, value) {
    state.showActive = value
  },
  //  =======================
  //  ======= FILTERS =======
  //  =======================
  //   TO BE RUN IN SEQUENCE
  //  =======================
  runArchivedFilter(state, cards) {
    if (state.showArchived) {
      state.selectedCards = cards.filter(card => card.archived)
    } else {
      state.selectedCards = cards.filter(card => !card.archived)
    }
    console.log(state.selectedCards)
  },
  runActiveFilter(state, cards) {
    if (state.showArchived && state.showActive) {
      state.selectedCards.push(
        cards.filter(card => !card.archived)
      )
    }
    state.selectedCards = state.selectedCards.flat()
  }
}

const actions = {
  setCards({ commit }, cards) {
    commit('setCards', cards)
    commit('updateCurrentCard')
  },
  setSelectedCardsFromTags({ dispatch, state }, selectedTags) {
    if (selectedTags.length) {
      dispatch('filterSelectedCards', state.cards.filter(
        card => selectedTags.map(tag => tag.id).every(
          id => card.tags.map(tag => tag.id).includes(id)
        )
      )
    )} else {
      dispatch('filterSelectedCards', [])
    }
  },
  setSelectedCardsTo({ dispatch }, cards) {
    dispatch('filterSelectedCards', cards)
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
  },
  setCardSearchQuery({ commit }, query) {
    commit('setCardSearchQuery', query)
  },
  filterSelectedCards({ commit }, cards) {
    commit('selectCards', [])
    commit('runArchivedFilter', cards)
    commit('runActiveFilter', cards)
  },
  setShowArchived({ commit, dispatch, state }, value) {
    commit('setShowArchived', value)
    dispatch('filterSelectedCards', state.cards.slice(0))
  },
  setShowActive({ commit, dispatch, state  }, value) {
    commit('setShowActive', value)
    dispatch('filterSelectedCards', state.cards.slice(0))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
