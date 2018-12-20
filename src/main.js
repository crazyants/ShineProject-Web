import Vue from 'vue'
import App from './App.vue'

import router from '@/startup/routes-manifest.js'
import store from '@/startup/setup-store.js'
import '@/startup/axios-setup.js'
import '@/startup/plugins-setup.js'
import '@/startup/common-components.js'

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App),
	store: store,
}).$mount('#app')
