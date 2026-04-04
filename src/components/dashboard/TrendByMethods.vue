<template>
  <div :class="rootClasses">
    <div :class="headerClasses">
      <div :class="titleClasses">
        <div :class="textClasses">{{ title ? joinStringArray(title) : "Loading ..." }}</div>
      </div>
    </div>
    <div ref="chartRoot" class="trend-methods__surface"></div>
  </div>
</template>
<script setup>
import { computed, nextTick, ref, toRaw, toRefs, watchEffect } from 'vue'
import embed from 'vega-embed'
import { joinStringArray } from "@/utils/helpers"

const props = defineProps({
  trendByMethods: Object,
  useCard: {
    type: Boolean,
    default: true
  }
})

const { trendByMethods, useCard } = toRefs(props)
const title = ref("")
const chartRoot = ref(null)

const rootClasses = computed(() => (
  useCard.value ? 'card card-chart-bottom o-hidden mb-4 d-flex align-items-stretch' : 'trend-methods--embedded'
))

const headerClasses = computed(() => (
  useCard.value ? 'card-body' : 'trend-methods__header'
))

const titleClasses = computed(() => (
  useCard.value ? 'card-title' : 'trend-methods__title'
))

const textClasses = computed(() => (
  useCard.value ? 'text-muted text-center' : 'text-muted'
))

setTimeout(() => {
  watchEffect(async () => {
    if (!trendByMethods.value || !chartRoot.value) {
      return
    }

    const clonedTrend = structuredClone(toRaw(trendByMethods.value))
    title.value = clonedTrend.title
    clonedTrend.title = null

    await nextTick()
    await embed(chartRoot.value, clonedTrend, { actions: true })
  })
}, 100)
</script>
<style scoped>
.trend-methods--embedded {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.trend-methods__header {
  padding: 0 0 0.75rem;
}

.trend-methods__title {
  margin: 0;
}

.trend-methods__surface {
  width: 100%;
  min-height: 320px;
  overflow: auto;
}
</style>
