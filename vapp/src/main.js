import Vue from 'vue'
import App from './App.vue'

//https://dappsdev.org/blog/2020-10-05-how-to-init-a-dapp-with-web3-js-using-metamask-8/


import store from './store'

import vuetify from './plugins/vuetify'

// store.commit('saveContract', {
//   contract: contract
// })

Vue.config.productionTip = false

//Vue.prototype.$get = lodashGet

//Vue.use(contract);

const obj = {
    test:{heelo:'kiwi'}
  };

new Vue({
  data : obj,
  store:store,
  el:"#app",
  vuetify,
  render: h => h(App)
})

//     .$mount('#app')
//
//
// new Vue({
//   router:router,
//   vuetify: vuetify,
//   store:store,
//   el:"#app",
//   render: h => h(Navig),
//   data: {
//
//   }
// });
