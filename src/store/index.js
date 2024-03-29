import Vue from 'vue'
import Vuex from 'vuex'
import tags from '@/store/modules/tags'
import cards from '@/store/modules/cards'
import auth from '@/store/modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tags,
    cards,
    auth
  }
})
