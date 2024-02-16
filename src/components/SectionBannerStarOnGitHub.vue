<script setup>
import { mdiGithub, mdiNewspaper, mdiPaperclip } from '@mdi/js'
import BaseButton from '@/components/BaseButton.vue'
import SectionBanner from '@/components/SectionBanner.vue'
import { gradientBgPinkRed } from '@/colors'
import { ref } from 'vue'

</script>

<template>
  <SectionBanner :class="gradientBgPinkRed">
    <h1 class="text-3xl text-white mb-6">
      Congratulations! The winner of this vote is: <slot></slot>🥇
    </h1>
    <div>
      <BaseButton :icon="mdiNewspaper" @click="$emit('viewStats')" label="View" target="_blank" rounded-full />
    </div>
  </SectionBanner>
</template>
