<!-- src/components/ExpandableText.vue -->
<template>
    <p class="expandable-text">
      <span v-html="displayText"></span>
      <a
        v-if="isTruncated"
        href="#"
        @click.prevent="toggle"
        class="expand-toggle"
      >
        {{ expanded ? 'Show less' : 'Read more' }}
      </a>
    </p>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  
  const props = defineProps({
    /**
     * The raw text or HTML content to display
     */
    text: {
      type: String,
      default: ''
    },
    /**
     * Word limit before truncation
     */
    limit: {
      type: Number,
      default: 100
    }
  });
  
  const expanded = ref(false);
  

  // Utility to capitalize the first alphabetical character in a string
function capitalizeFirstLetter(str) {
  const idx = str.search(/[A-Za-z]/);
  if (idx === -1) return str;
  return str.slice(0, idx) + str[idx].toUpperCase() + str.slice(idx + 1);
}

  // Split into words for counting and truncation
  const words = computed(() => {
    // Remove HTML tags for accurate word count
    const tmp = document.createElement('div');
    tmp.innerHTML = props.text;
    return tmp.textContent.trim().split(/\s+/);
  });
  
  const isTruncated = computed(() => words.value.length > props.limit);
  
  const truncatedText = computed(() => {
    // Join first N words and preserve HTML by truncating textContent
    const tmp = document.createElement('div');
    tmp.textContent = words.value.slice(0, props.limit).join(' ');
    return tmp.innerHTML + '...';
  });
  
  // Choose between full and truncated content
  const displayText = computed(() => {
    let content;
    if (!isTruncated.value) {
        content = props.text;
    } else {
        content = expanded.value ? props.text : truncatedText.value;
    }
    return capitalizeFirstLetter(content);
});
  
  function toggle() {
    expanded.value = !expanded.value;
  }
  
  // Reset expansion if text prop changes
  watch(() => props.text, () => {
    expanded.value = false;
  });
  </script>
  
  <style scoped>
  .expandable-text .expand-toggle {
    margin-left: 0.25rem;
    color: #007bff;
    cursor: pointer;
    text-decoration: none;
  }
  .expandable-text .expand-toggle:hover {
    text-decoration: underline;
  }
  </style>
  