const state = {
  tags: [],
  availableTags: [],
  selectedTags: []
}

const getters = {
  tags (state) {
    return state.tags
  },
  availableTags (state) {
    return state.availableTags
  },
  selectedTags (state) {
    return state.selectedTags
  }
}

const mutations = {
  setTags(state, tags) {
    state.tags = tags
    state.availableTags = tags
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
