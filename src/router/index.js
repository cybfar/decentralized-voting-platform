import { createRouter, createWebHashHistory } from 'vue-router'
import Style from '@/views/StyleView.vue'
import Home from '@/views/HomeView.vue'
import { isMetaMaskInstalled } from '@/web3config'
import { userAccount } from '@/web3config'
import { useMetaMaskStore } from '@/stores/account'

const routes = [
  {
    meta: {
      title: 'Select style'
    },
    path: '/welcome',
    name: 'welcome',
    component: Style
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    },
    path: '/dashboard',
    name: 'dashboard',
    component: Home
  },
  {
    meta: {
      title: 'Tables'
    },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue')
  },
  {
    meta: {
      title: 'ManageVote',
      requiresAuth: true,
      requiresAdminAccount: true
    },
    path: '/managevote',
    name: 'managevote',
    component: () => import('@/views/FormsView.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Ui'
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue')
  },
  {
    meta: {
      title: 'Responsive layout'
    },
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: {
      title: 'Error'
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const account_store = useMetaMaskStore()

  // console.log(account_store.userAccount === '')
  if (to.meta.requiresAuth && account_store.userAccount == '') next({ name: 'welcome' })
  else next()
})
router.beforeEach((to, from, next) => {
  const account_store = useMetaMaskStore()

  if (to.meta.requiresAdminAccount && !account_store.isAdmin) next({ name: 'dashboard' })
  else next()
})

export default router
