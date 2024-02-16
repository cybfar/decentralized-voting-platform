import { defineStore } from 'pinia'

export const useMetaMaskStore = defineStore('metamask', {
  state: () => ({
    isConnected: false,
    isAdmin: false,
    userAccount: '',
    userAlreadyVote: false,
    remaining_vote_time: 0 // Initial state: not connected
  }),
  actions: {
    // Mutation to update connection status
    setConnectionStatus(status) {
      this.isConnected = status
    },
    setUserAccount(account) {
      this.userAccount = account
    },
    setRemainingVoteTime(status) {
      this.remaining_vote_time = status
    },
    setIsAdmin(status) {
      this.isAdmin = status
    }
  }
})
