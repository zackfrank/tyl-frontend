import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import Vuelidate from 'vuelidate'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from '@/store'

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

Vue.use(Vuelidate)

new Vue({
  created: function() {
    let token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = token
    }
  },
  router,
  store,
  render: h => h(App),
}).$mount('#app')
