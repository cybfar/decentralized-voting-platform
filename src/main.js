import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMainStore } from '@/stores/main.js'
import { useMetaMaskStore } from './stores/account'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './css/main.css'

// Init Pinia
const pinia = createPinia()

import { isMetaMaskInstalled } from './web3config.js'

window.addEventListener('load', function () {
  if (isMetaMaskInstalled()) {
    console.log('MetaMask is installed.')
  } else {
    alert('MetaMask is not installed.')
  }
})

// Create Vue app
createApp(App).use(router).use(pinia).component('font-awesome-icon', FontAwesomeIcon).mount('#app')

// Init main store
const mainStore = useMainStore(pinia)

// Fetch sample data
mainStore.fetchSampleClients()
mainStore.fetchSampleHistory()

// Dark mode
// Uncomment, if you'd like to restore persisted darkMode setting, or use `prefers-color-scheme: dark`. Make sure to uncomment localStorage block in src/stores/darkMode.js
// import { useDarkModeStore } from './stores/darkMode'

// const darkModeStore = useDarkModeStore(pinia)

// if (
//   (!localStorage['darkMode'] && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
//   localStorage['darkMode'] === '1'
// ) {
//   darkModeStore.set(true)
// }

// Default title tag
const defaultDocumentTitle = 'Decentralized Voting Platform'

// Set document title from route meta
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle
})
