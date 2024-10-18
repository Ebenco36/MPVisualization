<template>
    <div>
      <h2>Feature Selection</h2>
      <p>Original Features: {{ originalFeatures }}</p>
      <p>Selected Features: {{ selectedFeatures }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const originalFeatures = ref(['feature1', 'feature2', 'feature3']);
  const selectedFeatures = ref([]);
  
  const selectFeatures = (features) => {
    // Simple logic: Select the first two features
    return features.slice(0, 2);
  };
  
  onMounted(() => {
    selectedFeatures.value = selectFeatures(originalFeatures.value);
  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  