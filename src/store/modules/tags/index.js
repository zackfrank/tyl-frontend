const state = {
  tags: [],
  availableTags: [],
  selectedTags: [],
  subtags: [],
  hiddenSubtags: [],
  tagDeleted: false,
  tagUpdated: false
}

const getters = {
  tags (state) {
    return state.tags
  },
  // Tags that have not yet been "selected", sorted alphabetically
  availableTags (state) {
    return state.availableTags.sort((a, b) => {
      let name1 = a.name.toUpperCase()
      let name2 = b.name.toUpperCase()
      if (name1 < name2) { return -1 }
      if (name1 > name2) { return 1 }
      return 0;
    })
  },
  selectedTags (state) {
    return state.selectedTags
  },
  subtags(state) {
    return state.subtags
  },
  hiddenSubtags(state) {
    return state.hiddenSubtags
  },
  tagDeleted(state) {
    return state.tagDeleted
  },
  tagUpdated(state) {
    return state.tagUpdated
  }
}

const mutations = {
  setTags(state, tags) {
    state.tags = tags
    state.availableTags = tags.slice(0)
  },
  selectTag(state, tag) {
    state.selectedTags.unshift(tag)
    let index = state.availableTags.indexOf(tag)
    state.availableTags.splice(index, 1)
  },
  removeTag(state, tag) {
    let index = state.selectedTags.indexOf(tag)
    state.selectedTags.splice(index, 1)
    state.availableTags.push(tag)
  },
  resetSelectedTags(state) {
    state.selectedTags = []
    state.availableTags = state.tags.slice(0)
  },
  addNewTag(state, tag) {
    state.tags.push(tag)
    state.availableTags.push(tag)
  },
  setSubTags(state, unfilteredCards) {
    if (!state.selectedTags.length) {
      state.subtags = state.availableTags
    } else {
      let subtags = []
      unfilteredCards.forEach(card => {
        let tags = card.tags
        tags.forEach(tag => {
          if (!subtags.map(tag => tag.id).includes(tag.id)) {
            subtags.push(tag)
          }
        })
      })
      state.subtags = subtags.filter(tag => !state.selectedTags.map(tag => tag.id).includes(tag.id))
    }
  },
  setHiddenSubtags(state, tags) {
    state.hiddenSubtags = tags
  },
  triggerTagDeleted(state) {
    state.tagDeleted = true
    setTimeout(() => {
      state.tagDeleted = false
    }, 500)
  },
  triggerTagUpdated(state) {
    state.tagUpdated = true
    setTimeout(() => {
      state.tagUpdated = false
    }, 500)
  }
}

const actions = {
  setTags({ commit }, tags) {
    commit('setTags', tags)
  },
  selectTag({ commit }, tag) {
    commit('selectTag', tag)
  },
  removeTag({ commit }, tag) {
    commit('removeTag', tag)
  },
  resetSelectedTags({ commit }) {
    commit('resetSelectedTags')
  },
  addNewTag({ commit }, tag) {
    commit('addNewTag', tag)
  },
  setSubTags({ commit }, unfilteredCards) {
    commit('setSubTags', unfilteredCards)
  },
  setHiddenSubtags({ commit }, tags) {
    commit('setHiddenSubtags', tags.slice(0))
  },
  triggerTagDeleted({ commit }) {
    commit('triggerTagDeleted')
  },
  triggerTagUpdated({ commit }) {
    commit('triggerTagUpdated')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
