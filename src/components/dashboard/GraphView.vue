<template>
  <div :class="rootClasses">
    <div :class="headerClasses">
      <div :class="titleClasses">
        <div :class="textClasses">{{ displayTitle }}</div>
      </div>
    </div>
    <div v-if="summary?.config" ref="chartRoot" class="graph-view__chart"></div>
    <div v-else class="watermark">Charts are shown here.</div>
  </div>
</template>
<script setup>
import { computed, nextTick, ref, toRaw, toRefs, watchEffect } from 'vue'
import embed from 'vega-embed'
import { joinStringArray } from "@/utils/helpers"

const props = defineProps({
  id: String,
  label: String,
  summary: Object,
  use_card: {
    type: Boolean,
    default: true
  },
  show_loading: {
    type: Boolean,
    default: true
  }
})

const title = ref("")
const chartRoot = ref(null)
const { summary, label, show_loading, use_card } = toRefs(props)

const displayTitle = computed(() => {
  if (title.value || label.value) {
    return joinStringArray(title.value ? title.value : label.value)
  }
  return show_loading.value ? "Loading ..." : ""
})

const rootClasses = computed(() => (
  use_card.value ? 'card card-chart-bottom o-hidden mb-4 col-12' : 'graph-view graph-view--plain'
))

const headerClasses = computed(() => (
  use_card.value ? 'card-body' : 'graph-view__header--plain'
))

const titleClasses = computed(() => (
  use_card.value ? 'card-title' : 'graph-view__title--plain'
))

const textClasses = computed(() => (
  use_card.value ? 'text-muted text-center' : 'text-muted'
))

function getChartTitle(nextSummary) {
  let detectedTitle = nextSummary.title

  if (nextSummary.layer) {
    detectedTitle = nextSummary.layer[0]?.title
  } else if (nextSummary.vconcat) {
    detectedTitle = nextSummary.vconcat[0]?.title
  } else if (typeof nextSummary.title === "object") {
    detectedTitle = nextSummary.title?.text
  } else if (nextSummary.marks) {
    detectedTitle = nextSummary.marks[0]?.title?.text
  }

  return detectedTitle || ""
}

function stripChartTitles(nextSummary) {
  const clonedObject = structuredClone(toRaw(nextSummary))

  if (clonedObject.layer) {
    clonedObject.layer.forEach((layer) => {
      layer.title = null
    })
  } else if (clonedObject.vconcat) {
    clonedObject.vconcat.forEach((panel) => {
      panel.title = null
    })
  } else if (clonedObject?.marks) {
    clonedObject.marks.forEach((mark) => {
      mark.title = null
    })
  } else {
    clonedObject.title = null
  }

  return clonedObject
}

setTimeout(() => {
  watchEffect(async () => {
    if (!summary.value?.config || !chartRoot.value) {
      return
    }

    title.value = getChartTitle(summary.value)
    await nextTick()
    await embed(chartRoot.value, stripChartTitles(summary.value), { actions: true })
  })
}, 100)
</script>
<style scoped>
.graph-view--plain {
  display: flex;
  flex-direction: column;
}

.graph-view__header--plain {
  padding: 0 0 0.75rem;
}

.graph-view__title--plain {
  color: #61747b;
  font-size: 0.95rem;
}

.graph-view__chart {
  width: 100%;
  overflow: auto;
  min-height: 280px;
}

.watermark {
  font-size: 4vw;
  color: rgba(0, 0, 0, 0.1);
  z-index: 1;
  pointer-events: none;
  white-space: pre-wrap;
  text-align: center;
}
</style>
