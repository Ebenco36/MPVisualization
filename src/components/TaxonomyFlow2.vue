<template>
  <!-- Render the Mermaid flowchart using vue-mermaid-string -->
  <vue-mermaid-string
    :value="diagram"
    :style="{ width, height, overflow: 'hidden' }"
    useMaxWidth = true
    :flowchart = "{ useMaxWidth: true, htmlLabels: true, curve: 'cardinal' }"
    securityLevel = 'loose'
  />
</template>

<script setup>
import { computed, defineProps } from 'vue'
import VueMermaidString from 'vue-mermaid-string'

// Define props: accept either an array or a delimited string
const props = defineProps({
  taxonomy: {
    type: Array,
    required: false,
    default: () => []
  },
  taxonomyString: {
    type: String,
    required: false,
    default: ''
  },
  width: {
    type: String,
    default: '200px'
  },
  height: {
    type: String,
    default: '400px'
  }
})

/**
 * Parse a delimited taxonomy string into an array of trimmed items.
 * Supports semicolons, commas, or any combination.
 */
function parseTaxonomy(input = '') {
  return input
    .split(/[,;]+/)        // split on one or more commas or semicolons
    .map(item => item.trim()) // trim whitespace
    .filter(Boolean)         // remove empty strings
}

// Derive the labels array: prefer taxonomy prop, otherwise parse taxonomyString
const labels = computed(() => {
  return props.taxonomy.length > 0
    ? props.taxonomy
    : parseTaxonomy(props.taxonomyString)
})

/**
 * Wrap long labels into multiple lines for readability.
 * Splits on spaces, inserts line breaks at appropriate lengths.
 */
function wrapLabel(label, maxLen = 12) {
  const words = label.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (test.length <= maxLen) {
      current = test
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines.join('<br>')
}

// Compute the Mermaid diagram string from the labels
const diagram = computed(() => {
  const lines = ['flowchart LR']  // LEFT TO RIGHT

  const rowLength = 7
  const nodeCount = labels.value.length

  for (let i = 0; i < nodeCount; i++) {
    const wrapped = wrapLabel(labels.value[i])
    const safeLabel = wrapped.replace(/"/g, '\\"')
    lines.push(`N${i}["${safeLabel}"]`)
  }

  for (let row = 0; row * rowLength < nodeCount; row++) {
    const startIdx = row * rowLength
    const endIdx = Math.min(startIdx + rowLength, nodeCount)

    const rowNodes = []
    for (let i = startIdx; i < endIdx; i++) {
      rowNodes.push(`N${i}`)
    }

    if (rowNodes.length > 1) {
      lines.push(rowNodes.join(' --> '))
    }
  }

  return lines.join('\n')
})
</script>

<style scoped>
/* Ensure the component wrapper has no extra padding */
.vue-mermaid-string {
  display: block;
}
</style>
