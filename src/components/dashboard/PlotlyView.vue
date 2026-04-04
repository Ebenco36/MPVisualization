<template>
  <div ref="chart" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getPlotly } from '@/utils/heavyLoaders'

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
  },
  layout: {
    type: Object,
    default: () => ({}),
  },
  config: {
    type: Object,
    default: () => ({ responsive: true, displaylogo: false }),
  },
})

const chart = ref(null)

async function renderChart(data, layout, config) {
  if (!chart.value) return

  const Plotly = await getPlotly()
  await Plotly.react(chart.value, data, layout, config)
}

onMounted(async () => {
  await renderChart(props.chartData, props.layout, props.config)
})

watch(
  () => [props.chartData, props.layout, props.config],
  async ([newData, newLayout, newConfig]) => {
    await renderChart(newData, newLayout, newConfig)
  },
  { deep: true }
)
</script>
