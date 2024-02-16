import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import Web3 from 'web3'

const contractAddress = '0x4AbFbcB7A1B8c2300C721f2C751D8E93803A5aB9'
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
        internalType: 'uint256',
        name: '',
        type: 'uint256'
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

export const useVotingStore = defineStore('user', () => {
  const account = ref(null)

  return {
    account
  }
})
