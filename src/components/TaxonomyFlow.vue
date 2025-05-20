<template>
  <div class="taxonomy-flow-container" :style="{ width: width, height: height }">
    <VueFlow
      class="taxonomy-flow"
      :nodes="nodes"
      :edges="edges"
      fit-view
    >
      <Controls position="top-right" />
      <Background :gap="16" />
    </VueFlow>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Vue Flow core and styles
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

// Vue Flow addons
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/controls/dist/style.css'

// Props definition: taxonomy + container dimensions
const props = defineProps({
  taxonomy: {
    type: Array,
    required: true,
    default: () => []
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '180px'
  }
})

// Compute nodes positioned horizontally
const nodes = computed(() =>
  props.taxonomy.map((label, index) => ({
    id: `${index}`,
    data: { label },
    position: { x: index * 200, y: props.height.replace(/px$/, '') / 2 },
    style: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #888',
      backgroundColor: '#fff',
      textAlign: 'center'
    }
  }))
)

// Compute edges connecting nodes sequentially
const edges = computed(() =>
  props.taxonomy.slice(1).map((_, index) => ({
    id: `edge-${index}-${index + 1}`,
    source: `${index}`,
    target: `${index + 1}`,
    animated: true,
    markerEnd: { type: 'arrow', width: 8, height: 8 }
  }))
)
</script>

<style scoped>
.taxonomy-flow-container {
  /* overflow hidden ensures no scrollbars */
  overflow: hidden;
}

.taxonomy-flow {
  width: 100%;
  height: 100%;
}
</style>
