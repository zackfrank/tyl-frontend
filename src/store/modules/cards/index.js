const state = {
  cards: [],
  selectedTagCards: [],
  unfilteredCards: [],
  filteredCards: [],
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
  filteredCards (state) {
    return state.filteredCards
  },
  unfilteredCards (state) {
    return state.unfilteredCards
  },
  selectedTagCards(state) {
    return state.selectedTagCards
  },
  currentCard (state) {
    return state.currentCard
  },
  cardSearchQuery (state) {
    return state.cardSearchQuery
  },
  showArchived (state) {
    return state.showArchived
  },
  showActive (state) {
    return state.setShowActive
  }
}

const mutations = {
  setCards(state, cards) {
    state.cards = cards
  },
  setFilteredCards(state, cards) {
    state.filteredCards = cards
  },
  setUnfilteredCards(state, cards) {
    state.unfilteredCards = cards
  },
  setSelectedTagCards(state, cards) {
    state.selectedTagCards = cards
  },
  updateCurrentCard(state) {
    if (state.currentCard !== {}) {
      state.currentCard = state.cards.find(card => card.id === state.currentCard.id)
    }
  },
  sortCardsByCreatedAt(state) {
    state.filteredCards.sort((a, b) => a.created_at - b.created_at)
  },
  sortCardsByUpdatedAt(state) {
    state.filteredCards.sort((a, b) => a.updated_at - b.updated_at)
  },
  sortCardsByTitle(state) {
    state.filteredCards.sort((a, b) => {
      let title1 = a.title.toUpperCase()
      let title2 = b.title.toUpperCase()
      if (title1 < title2) { return -1 }
      if (title1 > title2) { return 1 }
      return 0;
    })
  },
  reverseFilteredCards(state) {
    state.filteredCards.reverse()
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
      state.filteredCards.push(cards.filter(card => card.archived))
    } else {
      state.filteredCards.push(cards.filter(card => !card.archived))
    }
  },
  runActiveFilter(state, cards) {
    if (state.showArchived && state.showActive) {
      state.filteredCards.push(cards.filter(card => !card.archived))
    }
    state.filteredCards = state.filteredCards.flat()
  },
  runSubtagFilter(state, hiddenSubtags) {
    if (hiddenSubtags.length) {
      state.filteredCards = state.filteredCards.filter(card => {
        let cardTagIds = card.tags.map(tag => tag.id)
        let subtagsInCard = cardTagIds.filter(id =>
          hiddenSubtags.map(tag => tag.id).includes(id)
        )
        return !subtagsInCard.length
      })
    }
  }
}

const actions = {
  setCards({ commit }, cards) {
    commit('setCards', cards)
    commit('updateCurrentCard')
  },
  setFilteredCardsFromTags({ dispatch, commit, state }, selectedTags) {
    if (selectedTags.length) {
      commit('setSelectedTagCards', state.cards.filter(
        card => selectedTags.map(tag => tag.id).every(
          id => card.tags.map(tag => tag.id).includes(id)
        )
      )
    )} else {
      commit('setSelectedTagCards', [])
    }
    dispatch('filterSelectedCards', state.selectedTagCards)
  },
  sortCardsByCreatedAt({ dispatch, commit }) {
    let beforeOrder = state.filteredCards.slice(0)
    commit('sortCardsByCreatedAt')
    dispatch('reverseFilteredCardsIfSame', beforeOrder)
  },
  sortCardsByUpdatedAt({ dispatch, commit }) {
    let beforeOrder = state.filteredCards.slice(0)
    commit('sortCardsByUpdatedAt')
    dispatch('reverseFilteredCardsIfSame', beforeOrder)
  },
  sortCardsByTitle({ dispatch, commit, state }) {
    let beforeOrder = state.filteredCards.slice(0)
    commit('sortCardsByTitle')
    dispatch('reverseFilteredCardsIfSame', beforeOrder)
  },
  reverseFilteredCardsIfSame({ commit, state }, beforeOrder) {
    let analysis = []
    for (let i = 0; i < beforeOrder.length; i++) {
      analysis.push(beforeOrder[i] === state.filteredCards[i])
    }
    if(!analysis.includes(false)) { commit('reverseFilteredCards') }
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
  // call this: filterCardsFrom() ?
  filterSelectedCards({ commit, rootState }, cards) {
    commit('setUnfilteredCards', cards)
    commit('setFilteredCards', [])
    commit('runArchivedFilter', cards)
    commit('runActiveFilter', cards)
    commit('runSubtagFilter', rootState.tags.hiddenSubtags)
  },
  setShowArchived({ commit, dispatch, state }, payload) {
    commit('setShowArchived', payload.value)
    dispatch('filterSelectedCards', state.unfilteredCards)
  },
  setShowActive({ commit, dispatch, state  }, payload) {
    commit('setShowActive', payload.value)
    dispatch('filterSelectedCards', state.unfilteredCards)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
