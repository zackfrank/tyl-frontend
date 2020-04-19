import axios from 'axios'

const state = {
  user: null,
  token: null
}

const getters = {
  user (state) {
    return state.user
  },
  token (state) {
    return state.token
  }
}

const mutations = {
  logInUser(state, payload) {
    let token = payload.token
    state.user = payload.email
    state.token = token
    localStorage.setItem('token', token)
    axios.defaults.headers.common["Authorization"] =
        "Bearer " + token;
  },
  logOut(state) {
    state.user = null
    state.token = null
    localStorage.removeItem('token')
    axios.defaults.headers.common["Authorization"] = undefined
  },
  resetToken(state) {
    state.token = localStorage.getItem('token')
  }
}

const actions = {
  async login({ commit }, params) {
    await axios.post('/api/users/login', params)
    .then(
      response => {
        commit('logInUser', response.data.user)
      })
    .catch(
      error => {
        throw error
      }
    )
  },
  logOut({ commit }) {
    commit('logOut')
  },
  resetToken({ commit }) {
    commit('resetToken')
  },
  logInUser({ commit }, payload) {
    commit('logInUser', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
