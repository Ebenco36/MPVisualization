<template>
  <div class="expandable-text">
    <span class="expandable-text__content" v-html="displayText"></span>
    <button
      v-if="isTruncated"
      type="button"
      @click="toggle"
      class="expand-toggle"
    >
      {{ expanded ? 'Show less' : 'Read more' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  /**
   * The raw text or HTML content to display
   */
  text: {
    type: String,
    default: ''
  },
  /**
   * Character or word limit before truncation
   */
  limit: {
    type: Number,
    default: 100
  },
  /**
   * Truncation mode: 'words' or 'chars'
   */
  mode: {
    type: String,
    default: 'words',
    validator: (val) => ['words', 'chars'].includes(val)
  }
})

const expanded = ref(false)

// Utility to capitalize the first alphabetical character
function capitalizeFirstLetter(str) {
  const idx = str.search(/[A-Za-z]/)
  if (idx === -1) return str
  return str.slice(0, idx) + str[idx].toUpperCase() + str.slice(idx + 1)
}

// Extract plain text from HTML
function getPlainText(html) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || ''
}

const plainText = computed(() => getPlainText(props.text))
const wordArray = computed(() => plainText.value.trim().split(/\s+/))

const isTruncated = computed(() => {
  if (props.mode === 'words') {
    return wordArray.value.length > props.limit
  } else {
    return plainText.value.length > props.limit
  }
})

const truncatedText = computed(() => {
  const tmp = document.createElement('div')
  if (props.mode === 'words') {
    tmp.textContent = wordArray.value.slice(0, props.limit).join(' ')
  } else {
    tmp.textContent = plainText.value.slice(0, props.limit)
  }
  return tmp.innerHTML + '...'
})

const displayText = computed(() => {
  let content = props.text
  if (isTruncated.value) {
    content = expanded.value ? props.text : truncatedText.value
  }
  return capitalizeFirstLetter(content)
})

function toggle() {
  expanded.value = !expanded.value
}

watch([
  () => props.text,
  () => props.mode,
  () => props.limit
], () => {
  expanded.value = false
})
</script>

<style scoped>
.expandable-text {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: baseline;
  max-width: 100%;
}

.expandable-text__content {
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.expandable-text .expand-toggle {
  padding: 0;
  border: none;
  background: transparent;
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
}
.expandable-text .expand-toggle:hover {
  text-decoration: underline;
}
</style>
