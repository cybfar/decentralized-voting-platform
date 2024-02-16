<script setup>
import { computed, ref, onMounted, watchEffect } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiAccountMultiple,
  mdiChartTimelineVariant,
  mdiHandBackLeft,
  mdiCloseBox,
  mdiCheck
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import CardBox from '@/components/CardBox.vue'
import TableSampleCandidates from '@/components/TableSampleCandidates.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxTransaction from '@/components/CardBoxTransaction.vue'
import CardBoxClient from '@/components/CardBoxClient.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import SectionBannerStarOnGitHub from '@/components/SectionBannerStarOnGitHub.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { Chart } from 'chart.js/auto';
import {
  getAllCandidates,
  getVoterStatus,
  getElectionTimer,
  formatSecondsToHours,
  checkElection,
  getVotantCode,
  userAccount,
  vote,
  getAllVoters,
  checkIfVoted,
  getOwner,
  retrieveVotes,
  retrieveWinner
} from '@/web3config.js'
import { useMetaMaskStore } from '@/stores/account'
import { useVoteStore } from '@/stores/vote'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

library.add(faCopy)
// Chart.register(PieController, ArcElement)

const chartData = ref(null)
const account_store = useMetaMaskStore()
const vote_store = useVoteStore()

var candidates = ref()
var userVoted = ref()
const voters_ids = ref()
const voters_address = ref()
const voters_candidates_id = ref()
var candidates_id = ref()
var voting_progress = ref('Loading...')
var remaining_time = ref('Loading...')
var storedTimer = ref()
var election_ongoing = ref(null)
const votant_code = ref(null)
const account = userAccount
const store_account = account_store.userAccount
const isOwner = account_store.isAdmin
const voteRetrievedInfos = ref()
const winnerRetrievedInfos = ref()
const showWinnerBanner = ref(false)
const myChart = ref(null)

const yValues = [60, 40];

const handleVote = async (id) => {

  if (userVoted.value) {
    Swal.fire({
      title: 'Error !',
      text: 'You have already voted, please wait for results',
      icon: 'error',
      confirmButtonText: 'Back'
    })

    return
  }

  const candidate = candidates_id.value[id]


  const { value: code } = await Swal.fire({
    title: "You are about to vote for " + candidates.value[candidate] + ". \nEnter your code to continue",
    input: "password",
    inputLabel: "Password",
    inputPlaceholder: "Enter your code",
    inputAttributes: {
      maxlength: "20",
      autocapitalize: "off",
      autocorrect: "off"
    },
    confirmButtonText: 'Vote',
    showCancelButton: true,
    allowOutsideClick: false
  });

  if (code) {
    vote(candidate, code)
      .then((receipt) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You voted successfully ' + candidates.value[candidate],
          showConfirmButton: false,
          timer: 1500
        })
        userVoted.value = true
        getVoterStatus().then(function (result) {
          voting_progress.value = result.toString()
        })
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error !',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Back'
        })
      })
  }



  // const code = prompt(
  //   'You are about to vote for the candidate ' +
  //   candidates.value[candidate] +
  //   '. Please enter your voting code to continue!'
  // )
  // console.log(code)
  // vote(candidate, code)
  //   .then((receipt) => {
  //     console.log('Transaction successful:', receipt)
  //   })
  //   .catch((error) => {
  //     console.error('Transaction reverted:', error.message)
  //   })
}

const userAlreadyVote = ref(account_store.userAlreadyVote)
const isVoteFinished = ref(vote_store.isVoteFinished)
const isWinnerAnnounced = ref(vote_store.isWinnerAnnounced)



onMounted(() => {
  checkElection().then(function (result) {
    election_ongoing.value = result
    if (election_ongoing.value) {
      console.log("Election ongoing ? : " + election_ongoing.value)

      getVotantCode(account).then(function (result) {
        votant_code.value = result
        console.log(votant_code.value)
      })

      getAllCandidates().then(function (result) {
        candidates.value = result[0]
        console.log(result);
        candidates_id.value = result[1]
      })

      getVoterStatus().then(function (result) {
        voting_progress.value = result.toString()
      })

      checkIfVoted()
        .then(function (result) {
          userVoted.value = result
          console.log('Voted : ' + userVoted.value)
        })
        .catch((error) => {
          userVoted.value = false
          console.error('Transaction reverted:', error.message)
        })


      getElectionTimer().then(function (result) {
        if (result == 0) {
          remaining_time.value = formatSecondsToHours(result)
        } else {
          remaining_time.value = formatSecondsToHours(result)
        }

        storedTimer.value = result
      })

      getAllVoters().then(function (result) {
        voters_ids.value = result[0]
        voters_candidates_id.value = result[1]
        voters_address.value = result[2]

        console.log(voters_candidates_id.value)
      })

      // setInterval(() => {
      //   getVoterStatus().then(function (result) {
      //     voting_progress.value = result.toString()
      //   })

      //   // checkIfVoted()
      //   //   .then(function (result) {
      //   //     userVoted.value = result
      //   //     console.log('Voted : ' + userVoted.value)
      //   //   })
      //   //   .catch((error) => {
      //   //     userVoted.value = false
      //   //     console.error('Transaction reverted:', error.message)
      //   //   })

      // }, 1000)

      var interval = setInterval(async () => {
        if (storedTimer.value == 0) {
          if (voting_progress.value == 100) {
            retrieveVotes().then(function (result) {
              voteRetrievedInfos.value = result
            })
            retrieveWinner().then(function (result) {
              winnerRetrievedInfos.value = result[2]
              showWinnerBanner.value = true
            })

            await displayChartStats()

          }
          remaining_time.value == '00:00:00'
          clearInterval(interval)
          return
        }
        storedTimer.value--
        remaining_time.value = formatSecondsToHours(storedTimer.value)
      }, 1000)
    } else {
      // console.log(election_ongoing)

      remaining_time.value = 'No election'
      voting_progress.value = 'No election'
    }
  })


})

if (election_ongoing.value) {
  setInterval(() => {
    getVoterStatus().then(function (result) {
      voting_progress.value = result.toString()
    })

    // checkIfVoted()
    //   .then(function (result) {
    //     userVoted.value = result
    //     console.log('Voted : ' + userVoted.value)
    //   })
    //   .catch((error) => {
    //     userVoted.value = false
    //     console.error('Transaction reverted:', error.message)
    //   })

  }, 1000)
}

const mainStore = useMainStore()

const clientBarItems = computed(() => mainStore.clients.slice(0, 4))

function copyCode() {
  navigator.clipboard.writeText(votant_code.value).then(
    () => {
      Swal.fire({
        title: 'Done !',
        text: "Code copied to clipboard",
        icon: 'success',
        confirmButtonText: 'Back'
      })
    },
    () => {
      Swal.fire({
        title: 'Error !',
        text: "Failed to copy the code",
        icon: 'error',
        confirmButtonText: 'Back'
      })
    }
  )
}

function calculatePercent(_partial, _total) {
  const partial = _partial.toString()
  const total = _total.toString()
  return (partial / total) * 100 + "%"
}

function showStats() {
  Swal.fire({
    title: "<strong>" + winnerRetrievedInfos.value + "</strong> win the election",
    icon: "info",
    allowOutsideClick: false,
    html: `
    The majority of voters voted for him. Congratulations 🎉🎉🎉
  `,
    showConfirmButton: false,
    showCancelButton: true,
    focusConfirm: false,
    cancelButtonText: 'Close'
  });
}

function displayChartStats() {
  return new Chart(myChart.value, {
    type: 'pie',
    data: {
      labels: candidates.value,
      datasets: [{
        data: yValues
      }]
    },
    options: {
      title: {
        display: true,
        text: "Election details"
      }
    }
  });
}

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Welcome" main>
        <!-- <BaseButton label="Proceed to vote" color="contrast" rounded-full small /> -->
        <div>
          <code v-if="isOwner" class="px-4 py-0.5 rounded bg-green-500 mr-1 text-white">{{ 'Admin' }}</code>

          <code class="px-4 py-0.5 rounded bg-black bg-opacity-10">{{ store_account }}</code>
        </div>
      </SectionTitleLineWithButton>

      <NotificationBar v-if="userVoted && !showWinnerBanner" color="success" :icon="mdiCheck">
        <b>You have already voted.</b> Please wait for the results
      </NotificationBar>

      <button v-if="election_ongoing && !userVoted" @click="copyCode()"
        class="bg-green-600 border-solid border-white text-white border-2 py-1 px-10 rounded-md hover:bg-green-900 transition ease-in-out duration-500">
        <font-awesome-icon icon="fa-solid fa-copy" /> Copy my vote code
      </button>

      <NotificationBar v-if="!userVoted" color="danger" :icon="mdiCloseBox">
        <b>You have not already voted.</b> Please
        <span v-if="!election_ongoing">wait for an election and</span> proceed to vote
        <br />
      </NotificationBar>

      <!-- Pour annoncer le vainqueur -->
      <!-- <SectionBannerStarOnGitHub v-if="isVoteFinished && isWinnerAnnounced" class="mt-6 mb-6" /> -->
      <SectionBannerStarOnGitHub @view-stats="showStats" v-if="showWinnerBanner" class="mt-6 mb-6">
        {{ winnerRetrievedInfos }}
      </SectionBannerStarOnGitHub>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <CardBoxWidget trend-type="up" color="text-emerald-500" :icon="mdiAccountMultiple" :content="remaining_time"
          label="Remaining time" />
        <CardBoxWidget trend-type="down" color="text-blue-500" :icon="mdiAccountMultiple"
          :content="election_ongoing ? voting_progress + '%' : 'No ongoing election'" suffix=" %"
          label="Voting progress" />
      </div>
      <div v-if="election_ongoing" class="w-full h-4 bg-gray-200 rounded-md">
        <div class="h-full bg-blue-500 rounded-md" :style="{ width: voting_progress + '%' }"></div>
      </div>

      <SectionTitleLineWithButton v-if="election_ongoing && !showWinnerBanner" :icon="mdiAccountMultiple"
        title="All candidates" />

      <CardBox v-if="election_ongoing && !showWinnerBanner">
        <table>
          <thead>
            <tr class="font-semibold">
              <td>Candidate name</td>
              <td class="text-right">Vote</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="( candidate, index ) in  candidates " :key="index">
              <td>{{ candidate }}</td>
              <td class="text-right">
                <button v-if="!userVoted" @click="handleVote(index)"
                  class="bg-green-600 border-solid border-white text-white border-2 py-1 px-10 rounded-md hover:bg-green-900 transition ease-in-out duration-500">
                  Vote
                </button>

                <button v-if="userVoted" @click="handleVote(index)"
                  class="bg-gray-600 border-solid border-white text-white border-2 py-1 px-10 rounded-md hover:bg-gray-900 transition ease-in-out duration-500 cursor-not-allowed">
                  Cannot vote
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </CardBox>

      <SectionTitleLineWithButton v-if="election_ongoing &&
        storedTimer == 0" :icon="mdiAccountMultiple" title="All votes" />

      <CardBox v-if="election_ongoing && storedTimer == 0">
        <table>
          <thead>
            <tr class="font-semibold">
              <td>Candidate name</td>
              <td class="text-right">Percentage</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(candidate, index) in  voteRetrievedInfos " :key="index">
              <td>{{ candidate[2] }}</td>
              <td class="text-right">
                {{ calculatePercent(candidate[1], voters_ids.length) }}
              </td>
            </tr>
          </tbody>
        </table>
      </CardBox>

      <div style="height: 300px; width: 300px;">
        <canvas id="myChart" ref="myChart"></canvas>
      </div>

      <CardBox v-if="election_ongoing && isOwner && storedTimer == 0" class="mt-5">
        <table>
          <thead>
            <tr class="font-semibold">
              <td>Voter</td>
              <td class="text-right">Candidate</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="( voter, index ) in  voters_ids " :key="index">
              <td>{{ voters_address[index] }}</td>
              <td class="text-right">
                {{ voters_candidates_id[index] == 0 ? 'No vote' : candidates[voters_candidates_id[index] - 1n] }}
              </td>
            </tr>
          </tbody>
        </table>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

