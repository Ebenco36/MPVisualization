<template>
  <div class="card">
    <div>
      <div class="card-title">
        <div class="text-muted text-center">{{ (title || label) ? joinStringArray((title != null && title != "") ?
          getTitle(title) : label) : show_loading
          ? "Loading ..." : "" }}</div>
      </div>
    </div>
    <div v-if="summary?.config" :id="id" style="overflow: auto;"></div>
    <div v-else class="watermark">Charts are shown here. Probably loading ...</div>
  </div>
</template>
<script setup>
import { ref, toRaw, toRefs, watchEffect } from 'vue'
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
const { summary, id, label } = toRefs(props)

const getTitle = (textObj) => {
  if (typeof textObj === 'object' && textObj !== null) {
    return textObj.text
  } else {
    return textObj
  }
}
setTimeout(() => {
  watchEffect(async () => {
    if (summary.value && summary.value.config) {
      let clonedObject = { ...summary.value };
      title.value = clonedObject.title
      if (clonedObject.layer) {
        title.value = clonedObject.layer[0].title
      } else if (clonedObject.vconcat) {
        title.value = clonedObject.vconcat[0].title
      } else {
        title.value = clonedObject.title
      }

      if (summary.value) {
        if (summary.value.layer) {
          summary.value.layer.title = null
          summary.value.layer.forEach((layer) => {
            layer.title = null
          })
        } else if (summary.value.vconcat) {
          summary.value.vconcat.forEach((vconcat) => {
            vconcat.title = null
          })
        } else {
          summary.value.title = null
        }
        await embed("#" + id.value, structuredClone(toRaw(summary.value)), { actions: true })

      }
    }
  })
}, 100)
</script>
<style scoped>
.watermark {
  font-size: 4vw;
  color: rgba(0, 0, 0, 0.1);
  z-index: 1;
  /* Ensure it stays in the background */
  pointer-events: none;
  /* So it doesn't interfere with any content above it */
  white-space: pre-wrap;
  /* Allow the text to wrap */
  text-align: center;
  /* Center align the text */
}
</style>
