<template>
  <div class="exploration-tab">
    <div class="workspace-card">
      <div class="workspace-grid">
        <!-- Controls -->
        <aside class="controls-panel">
          <div class="panel-head">
            <p class="eyebrow">Configuration</p>
            <h3>Chart Specifications</h3>
            <p class="panel-copy">
              Choose an experimental method, map the axes, optionally group the data,
              then render the chart.
            </p>
          </div>

          <div class="form-stack">
            <div class="field" v-if="experimentMethodFilter?.data?.options?.length">
              <label>{{ experimentMethodFilter?.data?.field_name }}</label>
              <model-list-select
                :list="experimentMethodFilter.data.options"
                v-model="methodFilter"
                option-value="value"
                option-text="name"
                placeholder="Select experimental method"
                @update:modelValue="handleMethodChange"
              />
            </div>

            <div
              class="form-grid"
              v-if="otherFilters?.quantitative?.options?.length"
            >
              <div class="field">
                <label>
                  X-Axis
                  <span class="field-meta">({{ otherFilters?.quantitative?.field_name }})</span>
                </label>
                <model-list-select
                  :list="otherFilters.quantitative.options"
                  v-model="xAxis"
                  option-value="value"
                  option-text="name"
                  placeholder="Select x-axis"
                />
              </div>

              <div class="field">
                <label>
                  Y-Axis
                  <span class="field-meta">({{ otherFilters?.quantitative?.field_name }})</span>
                </label>
                <model-list-select
                  :list="otherFilters.quantitative.options"
                  v-model="yAxis"
                  option-value="value"
                  option-text="name"
                  placeholder="Select y-axis"
                />
              </div>
            </div>

            <div class="field" v-if="otherFilters?.categorical?.options?.length">
              <label>
                Group By
                <span class="field-meta">({{ otherFilters?.categorical?.field_name }})</span>
              </label>
              <model-list-select
                :list="otherFilters.categorical.options"
                v-model="categorical"
                option-value="value"
                option-text="name"
                placeholder="Select categorical variable"
              />
            </div>

            <div class="field" v-if="otherFilters?.chart_types?.options?.length">
              <label>Chart Type</label>
              <model-list-select
                :list="otherFilters.chart_types.options"
                v-model="chartType"
                option-value="value"
                option-text="name"
                placeholder="Select chart type"
              />
            </div>

            <div class="action-row">
              <button
                class="visualize-btn"
                @click="loadData"
                :disabled="chartLoading || !canVisualize"
              >
                <span v-if="chartLoading">Rendering...</span>
                <span v-else>Visualize</span>
              </button>
            </div>

            <div v-if="filterLoading" class="info-box">
              Loading filter options...
            </div>

            <div v-if="errorMessage" class="error-box">
              {{ errorMessage }}
            </div>
          </div>
        </aside>

        <!-- Chart -->
        <section class="chart-panel">
          <div class="panel-head chart-head">
            <div>
              <p class="eyebrow">Output</p>
              <h3>Chart</h3>
              <p class="panel-copy">
                Your visualization appears here after the selected filters are applied.
              </p>
            </div>
          </div>

          <div class="chart-frame">
            <div v-if="chartLoading" class="chart-state">
              <div class="state-icon">⏳</div>
              <h4>Generating chart...</h4>
              <p>Please wait while the visualization is being prepared.</p>
            </div>

            <div v-else-if="hasChart" class="chart-wrap">
              <GraphView
                :id="`graph-tab-${tab?.id}`"
                :summary="tab.chartData.chart"
                :use_card="false"
              />
            </div>

            <div v-else class="chart-state">
              <div class="state-icon">📈</div>
              <h4>No chart yet</h4>
              <p>Choose your filters and click Visualize to render the chart.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, toRefs } from 'vue'
import GraphView from '@/components/dashboard/GraphView.vue'
import DashboardService from '@/services/dashboard.service'
import { useFilterStore } from '@/stores/filters'
import { ModelListSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'

const filters = useFilterStore()

const props = defineProps({
  tab: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update-tab-data'])

const { tab } = toRefs(props)

const experimentMethodFilter = ref({})
const filterLoading = ref(false)
const chartLoading = ref(false)
const errorMessage = ref('')

const methodFilter = computed({
  get: () => tab.value?.data?.method_filter ?? null,
  set: (value) => {
    tab.value.data.method_filter = value
  },
})

const xAxis = computed({
  get: () => tab.value?.data?.x_axis ?? null,
  set: (value) => {
    tab.value.data.x_axis = value
  },
})

const yAxis = computed({
  get: () => tab.value?.data?.y_axis ?? null,
  set: (value) => {
    tab.value.data.y_axis = value
  },
})

const categorical = computed({
  get: () => tab.value?.data?.categorical ?? null,
  set: (value) => {
    tab.value.data.categorical = value
  },
})

const chartType = computed({
  get: () => tab.value?.data?.chart_types ?? null,
  set: (value) => {
    tab.value.data.chart_types = value
  },
})

const otherFilters = computed(() => tab.value?.data?.other_filters ?? {})

const hasChart = computed(() => {
  return !!tab.value?.chartData?.chart
})

const canVisualize = computed(() => {
  return !!methodFilter.value
})

function updateParent() {
  emit('update-tab-data', tab.value)
}

function resetVisualizationFields() {
  xAxis.value = null
  yAxis.value = null
  categorical.value = null
  chartType.value = null
  tab.value.chartData = null
}

async function loadInitialFilters() {
  filterLoading.value = true
  errorMessage.value = ''

  try {
    await filters.loadFilters()
    experimentMethodFilter.value =
      filters?.filters?.data?.experimental_method_list || {}
    tab.value.data.experiment_method_filter = experimentMethodFilter.value
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Unable to load filter options.'
  } finally {
    filterLoading.value = false
  }
}

async function getOtherFilter() {
  if (!methodFilter.value) {
    tab.value.data.other_filters = {}
    resetVisualizationFields()
    updateParent()
    return
  }

  filterLoading.value = true
  errorMessage.value = ''

  try {
    const endpoint = `method-based-filter?method_type=${methodFilter.value}`
    const res = await DashboardService.fetchData(endpoint)
    const response = res?.data

    tab.value.data.other_filters = response?.data || {}
    resetVisualizationFields()
    updateParent()
  } catch (error) {
    console.error(error)
    tab.value.data.other_filters = {}
    errorMessage.value = 'Unable to load dependent chart filters.'
  } finally {
    filterLoading.value = false
  }
}

async function handleMethodChange() {
  await getOtherFilter()
}

async function loadData() {
  if (!methodFilter.value) {
    errorMessage.value = 'Please select an experimental method first.'
    return
  }

  chartLoading.value = true
  errorMessage.value = ''

  try {
    const endpoint = `method-based-filter?method_type=${methodFilter.value}`
    const payload = {
      x_axis: xAxis.value,
      y_axis: yAxis.value,
      categorical_axis: categorical.value,
      experimental_method: methodFilter.value,
      chart_type: chartType.value,
    }

    const res = await DashboardService.postData(endpoint, payload)
    const response = res?.data
    tab.value.chartData = response?.data || null

    updateParent()
  } catch (error) {
    console.error(error)
    tab.value.chartData = null
    errorMessage.value = 'Unable to generate chart with the selected configuration.'
  } finally {
    chartLoading.value = false
  }
}

onMounted(async () => {
  await loadInitialFilters()

  // If this tab already has a selected method, reload dependent filters.
  if (methodFilter.value) {
    await getOtherFilter()
  }
})
</script>

<style scoped>
.exploration-tab {
  width: 100%;
}

.workspace-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e5e7eb;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}

.workspace-grid {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  min-height: 620px;
}

.controls-panel {
  padding: 24px;
  border-right: 1px solid #eef2f7;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.chart-panel {
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.06), transparent 22%),
    #ffffff;
}

.panel-head {
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #2563eb;
}

.panel-head h3 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
}

.panel-copy {
  margin: 10px 0 0;
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  margin: 0;
  font-weight: 700;
  font-size: 0.92rem;
  color: #334155;
}

.field-meta {
  font-weight: 500;
  color: #64748b;
}

.action-row {
  padding-top: 4px;
}

.visualize-btn {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 14px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.95rem;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.22);
  transition: all 0.2s ease;
  cursor: pointer;
}

.visualize-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  opacity: 0.96;
}

.visualize-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.chart-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.chart-frame {
  min-height: 500px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  overflow: hidden;
}

.chart-wrap {
  padding: 18px;
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: stretch;
}

.chart-wrap :deep(.graph-view--plain) {
  width: 100%;
  height: 100%;
}

.chart-wrap :deep(.graph-view__body) {
  min-height: 0;
}

.chart-wrap :deep(.graph-view__chart) {
  min-height: 420px;
}

.chart-state {
  min-height: 500px;
  display: flex;
  padding: 32px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #64748b;
}

.state-icon {
  font-size: 2.4rem;
  margin-bottom: 12px;
}

.chart-state h4 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
}

.chart-state p {
  margin: 0;
  max-width: 420px;
  line-height: 1.6;
}

.info-box,
.error-box {
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 0.92rem;
  line-height: 1.5;
}

.info-box {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.error-box {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

:deep(.ui.selection.dropdown),
:deep(.ui.search.selection.dropdown),
:deep(.ui.dropdown) {
  min-height: 46px !important;
  border-radius: 14px !important;
  border: 1px solid #cbd5e1 !important;
  display: flex !important;
  align-items: center !important;
  box-shadow: none !important;
}

:deep(.ui.dropdown > .text) {
  color: #0f172a !important;
}

:deep(.ui.selection.dropdown:focus),
:deep(.ui.search.selection.dropdown:focus),
:deep(.ui.dropdown.active),
:deep(.ui.dropdown.visible) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12) !important;
}

@media (max-width: 1100px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }

  .controls-panel {
    border-right: none;
    border-bottom: 1px solid #eef2f7;
  }
}

@media (max-width: 640px) {
  .controls-panel,
  .chart-panel {
    padding: 18px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .chart-frame,
  .chart-state {
    min-height: 380px;
  }
}
</style>
