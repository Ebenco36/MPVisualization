<template>
  <div class="evaluation-chart">
    <div ref="chartRoot" :id="id" class="evaluation-chart__surface" style="width: 100%;"></div>
    <div v-show="isContextMenuVisible" :style="{ top: `${rightClickPosition.y}px`, left: `${rightClickPosition.x}px` }" @mousedown="handleMouseDown" class="custom-context-menu">
      <div>
        <strong>Point Information:</strong>
      </div>
      <div v-if="selectedPoint">
        <div><strong>PDB code:</strong> {{ selectedPoint.pdb_code }}</div>
        <div><strong>Name:</strong> {{ selectedPoint.name }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { nextTick, reactive, ref, toRaw, toRefs, watchEffect } from 'vue'
import embed from 'vega-embed'

const props = defineProps({ chart: Object, id: String })

const { chart } = toRefs(props)
const chartRoot = ref(null)
const isContextMenuVisible = ref(false)
const rightClickPosition = reactive({ x: 0, y: 0 })
const selectedPoint = ref(null)

const handleRightClick = (event, item) => {
  event.preventDefault()
  rightClickPosition.x = event.clientX
  rightClickPosition.y = event.clientY
  isContextMenuVisible.value = true
  selectedPoint.value = item
}

const handleMouseDown = (event) => {
  if (!event.target.closest('.custom-context-menu')) {
    isContextMenuVisible.value = false
    selectedPoint.value = null
  }
}

const handleContextMenu = () => {
  isContextMenuVisible.value = false
  selectedPoint.value = null
}

setTimeout(() => {
  watchEffect(async () => {
    if (!chart.value || !chartRoot.value) {
      return
    }

    await nextTick()
    const result = await embed(chartRoot.value, structuredClone(toRaw(chart.value)), { actions: true })
    result?.view?.addEventListener('contextmenu', (event, item) => {
      if (item && item.datum) {
        handleRightClick(event, item.datum)
      } else {
        handleContextMenu()
      }
    })
  })
}, 100)
</script>

<style scoped>
.evaluation-chart {
  width: 100%;
}

.evaluation-chart__surface {
  width: 100%;
  min-height: 360px;
  overflow: auto;
}

.custom-context-menu {
  position: fixed;
  z-index: 1000;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.custom-context-menu div {
  margin: 5px 0;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
}
</style>
