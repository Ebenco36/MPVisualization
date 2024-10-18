<script setup>
import { ref } from 'vue'

const isHovered = ref(false)

function handleMouseEnter() {
  isHovered.value = true
}

function handleMouseLeave() {
  isHovered.value = false
}
</script>

<template>
  <div
    class="scrollable-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Content here -->
    <p v-for="i in 50" :key="i">Item {{ i }}</p>
  </div>
</template>

<style scoped>
/* Base style for the scrollable div */
.scrollable-container {
  max-height: 200px; /* Adjust as needed */
  overflow-y: auto;
  padding-right: 15px; /* Space for the scrollbar */
  scrollbar-width: thin; /* Firefox: always show thin scrollbar */
}

/* Default scrollbar style */
.scrollable-container::-webkit-scrollbar {
  width: 8px;
  background-color: transparent;
}

/* Scrollbar thumb (scroll handle) */
.scrollable-container::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

/* Scrollbar track */
.scrollable-container::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Scrollbar thumb style on hover */
.scrollable-container:hover::-webkit-scrollbar-thumb {
  background-color: #888; /* Darker on hover */
}

/* Scrollbar track style on hover */
.scrollable-container:hover::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
</style>
