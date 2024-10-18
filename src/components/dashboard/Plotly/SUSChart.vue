<template>
    <div>
      <div v-for="(chartConfig, index) in chartConfigs" :key="index" :ref="setChartRef(index)"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import Plotly from 'plotly.js-dist-min';
  
  const props = defineProps({
    chartConfigs: {
      type: Array,
      required: true
    }
  });
  
  const chartRefs = ref([]);
  
  const setChartRef = (index) => (el) => {
    if (el) {
      chartRefs.value[index] = el;
    }
  };
  
  const loadCharts = (chartConfigs) => {
    chartConfigs.forEach((config, index) => {
      const chartDiv = chartRefs.value[index];
      if (chartDiv) {
        Plotly.newPlot(chartDiv, config.data, config.layout);
      }
    });
  };
  
  onMounted(() => {
    if (props.chartConfigs.length) {
      loadCharts(props.chartConfigs);
    }
  });
  
  watch(() => props.chartConfigs, (newChartConfigs) => {
    if (newChartConfigs.length) {
      loadCharts(newChartConfigs);
    }
  }, { deep: true });
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  </style>
  