import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

Vue.config.productionTip = false

new Vue({
  name:'main',
  router, //封装了 router-view router-link $router $route
  render: h => h(App)
}).$mount('#app')
