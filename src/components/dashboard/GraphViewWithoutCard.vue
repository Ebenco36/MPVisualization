<template>
  <div class="card">
    <div>
      <div class="card-title">
        <div class="text-muted text-center">{{ (title || label) ? joinStringArray((title != null && title != "") ?
          getTitle(title) : label) : show_loading
          ? "Loading ..." : "" }}</div>
      </div>
    </div>
    <div v-if="summary?.config" ref="chartRoot" style="overflow: auto; min-height: 280px;"></div>
    <div v-else class="watermark">Charts are shown here. Probably loading ...</div>
  </div>
</template>
<script setup>
import { nextTick, ref, toRaw, toRefs, watchEffect } from 'vue'
import embed from 'vega-embed'
import { joinStringArray } from "@/utils/helpers"

const props = defineProps({
  id: String,
  label: String,
  summary: Object,
  show_loading: {
    type: Boolean,
    default: true
  }
})

const title = ref("")
const chartRoot = ref(null)
const { summary, label } = toRefs(props)

const getTitle = (textObj) => {
  if (typeof textObj === 'object' && textObj !== null) {
    return textObj.text
  } else {
    return textObj
  }
}

setTimeout(() => {
  watchEffect(async () => {
    if (!summary.value?.config || !chartRoot.value) {
      return
    }

    const clonedObject = structuredClone(toRaw(summary.value))
    title.value = clonedObject.title

    if (clonedObject.layer) {
      title.value = clonedObject.layer[0]?.title
      clonedObject.layer.forEach((layer) => {
        layer.title = null
      })
    } else if (clonedObject.vconcat) {
      title.value = clonedObject.vconcat[0]?.title
      clonedObject.vconcat.forEach((panel) => {
        panel.title = null
      })
    } else {
      clonedObject.title = null
    }

    await nextTick()
    chartRoot.value.replaceChildren()
    await embed(chartRoot.value, clonedObject, {
      actions: false,
      renderer: 'svg'
    })
  })
}, 100)
</script>
<style scoped>
.card :deep(.vega-embed) {
  width: 100%;
}

.card :deep(.vega-embed > div) {
  width: 100%;
}

.card :deep(svg) {
  display: block;
  max-width: 100%;
  height: auto !important;
}

.card :deep(canvas) {
  display: block;
  max-width: 100%;
  height: auto !important;
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
