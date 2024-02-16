<script setup>
import { computed, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiEye, mdiTrashCan, mdiVote } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { getAllCandidates } from '@/web3config.js'

defineProps({
  checkable: Boolean
})

var candidates
var candidates_id

var isModalActive = ref(false)
var currentName = ref()
// var isModalDangerActive = ref(false)

getAllCandidates().then(function (result) {
  candidates = result[0]
  candidates_id = result[1]
})

function hello() {
  alert('Hello')
}

function handleModal(id) {
  isModalActive.value = true
  currentName.value = id
}
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Confirm vote" has-cancel>
    <p>
      Confirm your vote to <b>{{ currentName ?? '' }}</b>
    </p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(candidate, index) in candidates" :key="index">
        <td data-label="Name">
          {{ candidate }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              label="Vote this candidate"
              color="success"
              :icon="mdiVote"
              small
              @click="hello"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
</template>
