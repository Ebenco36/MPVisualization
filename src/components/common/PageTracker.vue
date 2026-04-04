<template>
  <div></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, toRefs } from 'vue'
import { logEvent } from '../../services/logger'

const props = defineProps({
  pageTitle: String
})

const { pageTitle } = toRefs(props)
const pageStartTime = ref(0)

onMounted(() => {
  pageStartTime.value = Date.now()
  logEvent('page_view', { page: pageTitle.value })
})

onBeforeUnmount(() => {
  const pageDuration = Date.now() - pageStartTime.value
  logEvent('page_leave', { page: pageTitle.value, duration: pageDuration })
})
</script>
