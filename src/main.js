import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import Vuelidate from 'vuelidate'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from '@/store'
 
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

Vue.use(Vuelidate)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
