<script setup>
import { reactive, ref } from 'vue'
import { mdiBallotOutline, mdiAccount, mdiMail, mdiGithub, mdiHandBackLeft } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'
import { startElection, addVoters, addVoter } from '@/web3config.js'
import { useMetaMaskStore } from '@/stores/account'
import { useVoteStore } from '@/stores/vote'
import generator from 'generate-password-ts'
import Swal from 'sweetalert2'

const form = reactive({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '',
  subject: '',
  question: ''
})

const election_form = reactive({
  candidatesnames: [],
  numbersofvoters: 0
})
const voters_form = reactive({
  votersaddress: []
})

const voter_form = reactive({
  voteraddress: []
})

const startelection = () => {
  const candidates = election_form.candidatesnames.split(',').map((candidate) => candidate.trim())
  Swal.fire({
    title: "Do you want to start the election ?",
    icon: 'question',
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `Back`
  }).then((result) => {
    if (result.isConfirmed) {
      startElection(candidates)
    } else if (result.isDenied) {
      Swal.fire("Election canceled !", "", "info");
    }
  });


}

const addvoters = () => {
  const codes = []
  const voters = voters_form.votersaddress.split(',').map((voter) => voter.trim())
  for (let i = 0; i < voters.length; i++) {
    const code = generateCode()
    codes.push(code)
  }
  Swal.fire({
    title: "Do you want to add the multiple voters ?",
    icon: 'question',
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `Back`
  }).then((result) => {
    if (result.isConfirmed) {
      addVoters(voters, codes)
    } else if (result.isDenied) {
      Swal.fire("Voters are not saved", "", "info");
    }
  });

}

const addvoter = () => {
  const voter = voter_form.voteraddress

  const code = generator.generate({
    length: 12,
    numbers: true
  })

  Swal.fire({
    title: "Do you want to add a single voter ?",
    icon: 'question',
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `Back`
  }).then((result) => {
    if (result.isConfirmed) {
      addVoter(voter, code)
    } else if (result.isDenied) {
      Swal.fire("Voter are not saved", "", "info");
    }
  });
}

function generateCode() {
  return generator.generate({
    length: 12,
    numbers: true
  })
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Manage Vote" main>
        <BaseButton href="#" target="_blank" :icon="mdiHandBackLeft" label="Proceed to vote" color="contrast" rounded-full
          small />
      </SectionTitleLineWithButton>

      <form @submit.prevent="addvoters">
        <CardBox>
          <h1 class="my-3 font-bold text-lg text-red-600">Add voters before start an election</h1>
          <FormField label="Voters public address" help="Must me separate by comma">
            <FormControl v-model="voters_form.votersaddress" type="textarea" placeholder="" :required="true" />
          </FormField>

          <BaseButtons>
            <BaseButton type="submit" color="info" label="Add multiple voters" />
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </CardBox>
      </form>

      <form @submit.prevent="addvoter">
        <CardBox>
          <FormField label="Voter public address" help="On address only">
            <FormControl v-model="voter_form.voteraddress" type="textarea" placeholder="" :required="true" />
          </FormField>

          <BaseButtons>
            <BaseButton type="submit" color="info" label="Add voter" />
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </CardBox>
      </form>

      <form @submit.prevent="startelection">
        <CardBox>
          <FormField label="Candidates names" help="Must me separate by comma">
            <FormControl v-model="election_form.candidatesnames" type="textarea" placeholder="" :required="true" />
          </FormField>

          <BaseButtons>
            <BaseButton type="submit" color="info" label="Start Election" />
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </CardBox>
      </form>
    </SectionMain>
  </LayoutAuthenticated>
</template>
