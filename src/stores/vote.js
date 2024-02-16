import { defineStore } from 'pinia'

export const useVoteStore = defineStore('metamask', {
  state: () => ({
    isVoteFinished: false,
    isWinnerAnnounced: false // Initial state: not connected
  }),
  actions: {
    // Mutation to update connection status
    setConnectionStatus(status) {
      this.isConnected = status
    }
  }
})
