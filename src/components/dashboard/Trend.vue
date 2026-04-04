<template>
  <div :class="rootClasses">
    <div :class="headerClasses">
      <div :class="titleClasses">
        <div v-if="typeof title == 'object'" :class="textClasses">{{ title ?  typeof title == "object" ? joinStringArray(title.text) : joinStringArray(title) : "Loading ..." }}</div>
        <div v-else :class="textClasses">{{ title ?  typeof title == "string" ? title : joinStringArray(title) : "Loading ..." }}</div>
      </div>
    </div>
    <div ref="chartRoot" class="trend-chart__surface"></div>
  </div>
</template>
<script setup>
import { computed, nextTick, ref, toRaw, toRefs, watchEffect } from 'vue'
import embed from 'vega-embed'
import { joinStringArray } from "@/utils/helpers"

const props = defineProps({
  trend: Object,
  title: String,
  useCard: {
    type: Boolean,
    default: true
  }
})

const { trend, title, useCard } = toRefs(props)
const chartRoot = ref(null)

const rootClasses = computed(() => (
  useCard.value ? 'card card-chart-bottom o-hidden mb-4' : 'trend-chart--embedded'
))

const headerClasses = computed(() => (
  useCard.value ? 'card-body' : 'trend-chart__header'
))

const titleClasses = computed(() => (
  useCard.value ? 'card-title' : 'trend-chart__title'
))

const textClasses = computed(() => (
  useCard.value ? 'text-muted text-center' : 'text-muted'
))

setTimeout(() => {
  watchEffect(async () => {
    if (!trend.value || !chartRoot.value) {
      return
    }

    const clonedTrend = structuredClone(toRaw(trend.value))
    if (clonedTrend.layer) {
      clonedTrend.layer.forEach((layer) => {
        layer.title = null
      })
    } else {
      clonedTrend.title = null
    }

    await nextTick()
    await embed(chartRoot.value, clonedTrend, { actions: true })
  })
}, 100)
</script>
<style scoped>
.trend-chart--embedded {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.trend-chart__header {
  padding: 0 0 0.75rem;
}

.trend-chart__title {
  margin: 0;
}

.trend-chart__surface {
  width: 100%;
  min-height: 320px;
  overflow: auto;
}
</style>
