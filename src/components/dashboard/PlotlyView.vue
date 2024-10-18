<template>
  <div ref="chart" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { defineProps } from 'vue';
import Plotly from 'plotly.js-dist-min'

const props = defineProps({
  chartData: {
    type: Array,
    required: true
  },
  layout: {
    type: Object,
    default: () => ({})
  }
});

const chart = ref(null);

onMounted(() => {
  Plotly.newPlot(chart.value, props.chartData, props.layout);

  watch(
    () => [props.chartData, props.layout],
    ([newData, newLayout]) => {
      Plotly.react(chart.value, newData, newLayout);
    },
    { deep: true }
  );
});
</script>