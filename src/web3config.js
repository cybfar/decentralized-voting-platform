import Web3 from 'web3'
import { useMetaMaskStore } from './stores/account'
import router from './router'
import Swal from 'sweetalert2'

const contractAddress = '0xb44A73E317216FdC3eE0962fce957b5f882dE388'
const abi = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'listAdressVoters',
        type: 'address[]'
      },
      {
        internalType: 'string[]',
        name: 'codes',
        type: 'string[]'
      }
    ],
    name: 'addBulkVoter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'voter',
        type: 'address'
      },
      {
        internalType: 'string',
        name: 'code',
        type: 'string'
      }
    ],
    name: 'addVoter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'message',
        type: 'string'
      }
    ],
    name: 'DebugEvent',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string[]',
        name: 'candidates',
        type: 'string[]'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'votingStart',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'votingEnd',
        type: 'uint256'
      }
    ],
    name: 'ElectionStarted',
    type: 'event'
  },
  {
    inputs: [],
    name: 'restartAllData',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string[]',
        name: '_candidates',
        type: 'string[]'
      }
    ],
    name: 'startElection',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'voter',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'candidateId',
        type: 'uint256'
      }
    ],
    name: 'Voted',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_code',
        type: 'uint256'
      }
    ],
    name: 'voteTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'candidates',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'numberOfVotes',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256'
      }
    ],
    name: 'checkCandidat',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'checkIfVoted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'voter',
        type: 'address'
      }
    ],
    name: 'checkVoter',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_code',
        type: 'uint256'
      }
    ],
    name: 'checkVoterEligibility',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'codeForVoters',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'electionStarted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'electionTimer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'generalVoterStatus',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getAllVoters',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      },
      {
        internalType: 'string[]',
        name: '',
        type: 'string[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'listCandidates',
    outputs: [
      {
        internalType: 'string[]',
        name: '',
        type: 'string[]'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_voter',
        type: 'address'
      }
    ],
    name: 'retrieveInfoVote',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'candidat',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'code',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'voter',
            type: 'address'
          }
        ],
        internalType: 'struct Voting.Voter',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'retrieveVotes',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'numberOfVotes',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          }
        ],
        internalType: 'struct Voting.Candidate[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'voters',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'candidat',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'code',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'voter',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'votingEnd',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'votingStart',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'winnerRetrieve',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'numberOfVotes',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          }
        ],
        internalType: 'struct Voting.Candidate',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
const provider = window.ethereum // Update with your provider URL
const web3 = new Web3(provider)
let accounts = await web3.eth.getAccounts()
var userAccount = accounts[0]

// Instantiate contract object
const contract = new web3.eth.Contract(abi, contractAddress)

// Function to interact with contract method

function isMetaMaskInstalled() {
  return !!window.ethereum && window.ethereum.isConnected()
}

function checkIfMetamaskIsDisconnected() {
  if (window.ethereum) {
    window.ethereum.on('disconnect', (error) => {
      if (error) {
        console.error('Disconnected from MetaMask:', error)
      } else {
        console.log('Disconnected from MetaMask')
        useMetaMaskStore().setConnectionStatus(true)
      }
    })
  }
}

window.ethereum.on('accountsChanged', (error) => {
  if (error) {
    console.error('Disconnected from MetaMask:', error)
    useMetaMaskStore().setConnectionStatus(false)
    useMetaMaskStore().setUserAccount('')
    router.push({ path: '/welcome' })
    // Handle disconnection error
  }
})

function logout() {
  useMetaMaskStore().setConnectionStatus(false)
  useMetaMaskStore().setUserAccount('')
  router.push({ path: '/welcome' })
}

function getOwner() {
  return contract.methods.owner().call()
}

async function getAllCandidates() {
  return await contract.methods.listCandidates().call()
}

async function getVoterStatus() {
  return await contract.methods.generalVoterStatus().call()
}

async function getElectionTimer() {
  return await contract.methods.electionTimer().call()
}

async function checkElection() {
  return await contract.methods.electionStarted().call()
}

async function getVotantCode() {
  return await contract.methods.codeForVoters(userAccount).call()
}

async function checkIfVoted() {
  return await contract.methods.checkIfVoted(userAccount).call()
}

async function getAllVoters() {
  return await contract.methods.getAllVoters().call()
}

async function retrieveVotes() {
  return await contract.methods.retrieveVotes().call()
}

async function retrieveWinner() {
  return await contract.methods.winnerRetrieve().call()
}

async function startElection(candidates) {
  return contract.methods
    .startElection(candidates)
    .send({ from: userAccount })
    .on('receipt', function (receipt) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'New election started successfully',
        showConfirmButton: false,
        timer: 1500
      })
    })
    .on('error', function (error) {
      Swal.fire({
        title: 'Error !',
        text: error,
        icon: 'error',
        confirmButtonText: 'Back'
      })
    })
}

async function vote(candidate_id, voter_code) {
  return contract.methods
    .voteTo(candidate_id, voter_code)
    .send({ from: userAccount })
    .on('receipt', function (receipt) {})
}

async function addVoters(voters, codes) {
  return contract.methods
    .addBulkVoter(voters, codes)
    .send({ from: userAccount })
    .on('receipt', function (receipt) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Voters added successfully',
        showConfirmButton: false,
        timer: 1500
      })
    })
    .on('error', function (error) {
      Swal.fire({
        title: 'Error !',
        text: error,
        icon: 'error',
        confirmButtonText: 'Back'
      })
    })
}

async function addVoter(voter, code) {
  return contract.methods
    .addVoter(voter, code)
    .send({ from: userAccount })
    .on('receipt', function (receipt) {
      alert('Voter added successfully')
    })
    .on('error', function (error) {
      alert(error)
    })
}

async function connectToMetaMask() {
  if (!isMetaMaskInstalled()) {
    console.log('MetaMask is not installed.')
    return
  }

  try {
    // Request account access from MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    userAccount = accounts[0]

    console.log('Connected to MetaMask:', userAccount)
    useMetaMaskStore().setConnectionStatus(true)
    useMetaMaskStore().setUserAccount(userAccount)

    getOwner().then(function (result) {
      if (result.toLowerCase() === useMetaMaskStore().userAccount) {
        useMetaMaskStore().setIsAdmin(true)
        console.log('Is owner')
      } else {
        console.log('Is not owner')
        useMetaMaskStore().setIsAdmin(false)
      }
    })
  } catch (error) {
    console.error('Error connecting to MetaMask:', error)
  }
}

async function getUserAccount() {
  web3.eth
    .getAccounts()
    .then((accs) => {
      if (accounts.length > 0) {
        accounts = accs
        userAccount = accs[0]
        console.log('Connected account:', userAccount)
      } else {
        console.warn('No accounts available')
      }
    })
    .catch((error) => {
      console.error('Error getting accounts:', error)
    })
}

function formatSecondsToHours(input) {
  if (input == 0) {
    return '00:00:00'
  }

  const seconds = parseInt(input, 10)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const formattedHours = hours.toString().padStart(2, '0')
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

export {
  connectToMetaMask,
  isMetaMaskInstalled,
  getOwner,
  startElection,
  getAllCandidates,
  getVoterStatus,
  getElectionTimer,
  formatSecondsToHours,
  checkElection,
  addVoters,
  getVotantCode,
  userAccount,
  vote,
  addVoter,
  getAllVoters,
  checkIfVoted,
  logout,
  retrieveVotes,
  retrieveWinner
}
