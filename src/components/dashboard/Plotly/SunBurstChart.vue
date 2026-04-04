<template>
  <section class="chart-page">
    <div class="chart-card">
      <div class="chart-header">
        <div>
          <p class="eyebrow">Membrane Protein Analytics</p>
          <h2 class="title">Classification Overview</h2>
          <p class="subtitle">
            Explore membrane protein structure entries by major groups and sub-groups.
            Switch between chart types and adjust the canvas size for a better view.
          </p>
        </div>

        <div class="header-badge">
          <span class="badge-dot"></span>
          Interactive Chart
        </div>
      </div>

      <div class="controls-card">
        <div class="controls-grid">
          <div class="field">
            <label for="chartType">Chart type</label>
            <select id="chartType" class="input" v-model="chart">
              <option value="sunburst">Sunburst Chart</option>
              <option value="treemap">Treemap Chart</option>
            </select>
          </div>

          <div class="field">
            <label for="chartWidth">Chart width</label>
            <input
              id="chartWidth"
              class="input"
              type="number"
              min="300"
              step="50"
              v-model.number="chart_width"
            />
          </div>

          <div class="field">
            <label for="chartHeight">Chart height</label>
            <input
              id="chartHeight"
              class="input"
              type="number"
              min="300"
              step="50"
              v-model.number="chart_height"
            />
          </div>

          <div class="actions">
            <AppButton
              label="Update Chart"
              class="btn-primary modern-btn"
              style="color: white; font-weight: 800;"
              :handleClick="handleFilter"
            />
          </div>
        </div>
      </div>

      <div class="chart-panel">
        <div class="chart-panel-header">
          <div>
            <h3>Visualization</h3>
            <p>{{ selectedChartLabel }} · {{ chart_width }} × {{ chart_height }}</p>
          </div>
        </div>

        <div v-if="loading" class="empty-state">
          <div class="empty-icon">⏳</div>
          <h4>Loading chart...</h4>
          <p>Please wait while the visualization is being prepared.</p>
        </div>

        <div v-else-if="hasChartData" class="chart-div">
          <PlotlyChart :chartData="chartData" :layout="layout" />
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📊</div>
          <h4>No chart data available</h4>
          <p>Try changing the chart type or reloading the visualization.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PlotlyChart from '../PlotlyView.vue'
import { useExtraStore } from '@/stores/extraChart'
import AppButton from '@/components/common/AppButton.vue'

const extraStore = useExtraStore()

const chartData = ref([])
const loading = ref(false)

const chart = ref('sunburst')
const chart_width = ref(900)
const chart_height = ref(560)

const layout = computed(() => ({
  margin: { l: 0, r: 0, b: 0, t: 0 },
  width: chart_width.value,
  height: chart_height.value,
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
}))

const selectedChartLabel = computed(() => {
  return chart.value === 'treemap' ? 'Treemap Chart' : 'Sunburst Chart'
})

const hasChartData = computed(() => {
  if (Array.isArray(chartData.value)) return chartData.value.length > 0
  return !!chartData.value
})

function handleFilter() {
  getChart()
}

async function getChart() {
  loading.value = true

  try {
    const param = {
      chart_width: chart_width.value,
      chart_height: chart_height.value,
      chart_type: chart.value,
    }

    await extraStore.loadExtraData(param)
    chartData.value = extraStore?.extra?.dataList || []
    console.log('chartData:', chartData.value)
  } catch (error) {
    console.error('Failed to load chart:', error)
    chartData.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getChart()
})
</script>

<style scoped>
.chart-page {
  /* padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.08), transparent 30%),
    radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 28%),
    #f8fafc; */
  min-height: 100%;
}

.chart-card {
  /* max-width: 1280px; */
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 24px;
  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.06),
    0 2px 8px rgba(15, 23, 42, 0.04);
  padding: 28px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #2563eb;
}

.title {
  margin: 0;
  font-size: 2rem;
  line-height: 1.1;
  font-weight: 800;
  color: #005EB8;
}

.subtitle {
  margin: 12px 0 0;
  max-width: 760px;
  font-size: 0.98rem;
  line-height: 1.7;
  color: #475569;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563eb;
}

.controls-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 18px;
  margin-bottom: 24px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  align-items: end;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  margin-bottom: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  color: #334155;
}

.input {
  width: 100%;
  height: 46px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 0 14px;
  font-size: 0.96rem;
  color: #0f172a;
  background: #fff;
  transition: all 0.2s ease;
  outline: none;
}

.input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}

.actions {
  display: flex;
  align-items: end;
  justify-content: flex-end;
}

.modern-btn {
  min-width: 160px;
  height: 46px;
  border-radius: 14px !important;
  font-weight: 700;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.18);
}

.chart-panel {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  overflow: hidden;
}

.chart-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: rgba(248, 250, 252, 0.9);
}

.chart-panel-header h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.chart-panel-header p {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: #64748b;
}

.chart-div {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  min-height: 420px;
}

.empty-state {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px;
  color: #64748b;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.empty-state h4 {
  margin: 0 0 8px;
  color: #0f172a;
  font-weight: 700;
}

.empty-state p {
  margin: 0;
  max-width: 420px;
  line-height: 1.6;
}

.js-plotly-plot {
  width: max-content !important;
  height: max-content !important;
}

@media (max-width: 992px) {
  .controls-grid {
    grid-template-columns: 1fr 1fr;
  }

  .actions {
    grid-column: span 2;
    justify-content: stretch;
  }
}

@media (max-width: 640px) {
  .chart-page {
    padding: 16px;
  }

  .chart-card {
    padding: 20px;
    border-radius: 20px;
  }

  .title {
    font-size: 1.6rem;
  }

  .controls-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    grid-column: auto;
  }
}
</style>