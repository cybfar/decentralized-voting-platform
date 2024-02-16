<script setup>
import { useRouter } from 'vue-router'
import { useDarkModeStore } from '@/stores/darkMode.js'
import { gradientBgDark } from '@/colors.js'
import SectionMain from '@/components/SectionMain.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faSignIn, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { ref, watchEffect } from 'vue'
import { connectToMetaMask, getOwner, userAccount } from '@/web3config.js'
import { useMetaMaskStore } from '@/stores/account'

library.add(faUserSecret, faSignIn, faInfoCircle)

const darkModeStore = useDarkModeStore()

darkModeStore.set(false)

const router = useRouter()
const store = useMetaMaskStore()

const handleClickLogin = () => {
  connectToMetaMask()
}

const handleClickDashboard = () => {
  router.push('/dashboard')
}

const isConnected = ref(store.isConnected)

watchEffect(() => {
  isConnected.value = store.isConnected
})

</script>

<template>
  <LayoutGuest>
    <div :class="gradientBgDark" class="flex min-h-screen items-center justify-center">
      <SectionMain>
        <div v-if="isConnected"
          class="flex justify-center w-auto bg-green-600 text-white rounded-sm border-0 text-center mb-3 top-1 right-0 left-0 w-1/3 mx-auto absolute">
          <p class="p-3">
            <font-awesome-icon icon="fa-solid fa-info-circle" /> You are connected to your wallet <code
              class="px-1.5 py-0.5 rounded bg-white bg-opacity-30">{{ userAccount }}</code>
          </p>
        </div>

        <div v-if="!isConnected"
          class="flex justify-center w-auto bg-red-600 text-white rounded-sm border-0 text-center mb-3 top-1 right-0 left-0 w-1/3 mx-auto absolute">
          <p class="p-3">
            <font-awesome-icon icon="fa-solid fa-info-circle" /> You are not connected to your
            wallet
          </p>
        </div>

        <h1 class="text-4xl md:text-5xl text-center text-white font-bold mt-12 mb-3 lg:mt-0">
          Welcome to the decentralized voting platform
        </h1>
        <h2 class="text-xl md:text-xl text-center text-white mb-">
          Express your voice and participate in our ongoing democratic process.
          <code class="px-1.5 py-0.5 rounded bg-white bg-opacity-30">Every vote counts !</code>
        </h2>
        <div class="text-center mb-10 mt-5">
          <button v-if="!isConnected"
            class="bg-red-600 border-solid border-white text-white border-1 py-3 px-5 rounded-md hover:bg-white hover:text-black transition ease-in-out duration-500"
            @click="handleClickLogin">
            Sign in to vote <font-awesome-icon icon="fa-solid fa-sign-in" />
          </button>

          <button v-if="isConnected"
            class="bg-green-600 border-solid border-white text-white border-2 py-3 px-5 rounded-md hover:bg-white hover:text-black transition ease-in-out duration-500"
            @click="handleClickDashboard">
            Go to dashboard <font-awesome-icon icon="fa-solid fa-sign-in" />
          </button>
          <!--
          <button
            v-if="isConnected"
            class="bg-green-600 border-solid border-white text-white border-2 py-3 px-5 rounded-md hover:bg-white hover:text-black transition ease-in-out duration-500"
            @click="getOwnerAddress"
          >
            Product count <font-awesome-icon icon="fa-solid fa-sign-in" />
          </button> -->
        </div>
      </SectionMain>
    </div>
  </LayoutGuest>
</template>
