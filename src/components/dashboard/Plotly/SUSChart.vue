<template>
  <div>
    <div v-for="(chartConfig, index) in chartConfigs" :key="index" :ref="setChartRef(index)"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPlotly } from '@/utils/heavyLoaders'

const props = defineProps({
  chartConfigs: {
    type: Array,
    required: true,
  },
})

const chartRefs = ref([])

const setChartRef = (index) => (el) => {
  if (el) {
    chartRefs.value[index] = el
  }
}

const loadCharts = async (chartConfigs) => {
  const Plotly = await getPlotly()

  chartConfigs.forEach((config, index) => {
    const chartDiv = chartRefs.value[index]
    if (chartDiv) {
      Plotly.react(chartDiv, config.data, config.layout)
    }
  })
}

onMounted(async () => {
  if (props.chartConfigs.length) {
    await loadCharts(props.chartConfigs)
  }
})

watch(
  () => props.chartConfigs,
  async (newChartConfigs) => {
    if (newChartConfigs.length) {
      await loadCharts(newChartConfigs)
    }
  },
  { deep: true }
)
</script>
