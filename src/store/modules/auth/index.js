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
  setUser(state, user) {
    state.user = user
  },
  setToken(state, token) {
    state.token = token
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
    await axios.post('http://localhost:3000/api/users/login', params)
    .then(
      response => {
        let responseData = response.data.user
        let token = responseData.token
        commit('setUser', responseData.email)
        commit('setToken', token)
        localStorage.setItem('token', token)
        axios.defaults.headers.common["Authorization"] =
            "Bearer " + token;
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
