<template>
  <div class="main-content metamp-about-page">
    <div class="about-shell">
      <section class="card border-0 shadow-sm about-hero">
        <div class="card-body p-4 p-lg-5">
          <p class="section-eyebrow mb-2">About MetaMP</p>
          <h1 class="about-title mb-3">A membrane-protein reconciliation platform</h1>
          <p class="hero-copy mb-0">
            MetaMP integrates MPstruc, PDB, OPM, and UniProt into a single membrane-protein review workflow. It is designed to preserve provenance, surface disagreement, and support expert interpretation rather than silently merge everything into one hidden label.
          </p>
        </div>
      </section>

      <section class="content-section">
        <div class="row g-4 align-items-stretch">
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="section-heading section-heading--compact">
                  <p class="section-eyebrow mb-1">Coverage</p>
                  <!-- <h2 class="section-title">Dataset summary</h2> -->
                </div>
                <div class="table-responsive">
                  <table class="table about-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Database</th>
                        <th>Observations</th>
                        <th>Attributes</th>
                        <th>Nominal</th>
                        <th>Quantitative</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="row in summaryRows"
                        :key="row.table_name || row.database"
                        :class="{ 'table-row-highlight': row.highlight }"
                      >
                        <td>
                          <strong v-if="row.highlight">{{ row.database }}</strong>
                          <span v-else>{{ row.database }}</span>
                        </td>
                        <td>{{ numeral(row.observations || 0).format('0,0') }}</td>
                        <td>{{ numeral(row.attributes || 0).format('0,0') }}</td>
                        <td>{{ numeral(row.nominal || 0).format('0,0') }}</td>
                        <td>{{ numeral(row.quantitative || 0).format('0,0') }}</td>
                      </tr>
                      <tr v-if="!summaryRows.length">
                        <td colspan="5" class="text-center text-muted py-4">No live summary is available yet.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="section-heading section-heading--compact">
                  <p class="section-eyebrow mb-1">Growth</p>
                  <!-- <h2 class="section-title">Update trend</h2> -->
                </div>
                
                <div v-if="aboutStore?.about_data?.loader_status" class="about-chart-state text-muted">
                  Loading chart...
                </div>
                <div v-else-if="hasTrendChart" ref="trendChartRoot" class="about-chart-surface"></div>
                <div v-else class="about-chart-state text-muted">
                  No chart data is available yet.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
import { useRoute } from 'vue-router'
import embed from 'vega-embed'
import { useAboutStore } from '@/stores/about.js'
import numeral from 'numeral'

const aboutStore = useAboutStore()
const route = useRoute()
const trendChartRoot = ref(null)

const aboutPayload = computed(() => aboutStore?.about_data?.data || {})
const summaryRows = computed(() => aboutStore?.about_data?.summary?.rows || [])
const trendChartSpec = computed(() => aboutPayload.value?.trends_by_database_year || null)
const hasTrendChart = computed(() => {
  const chart = trendChartSpec.value
  return Boolean(chart && typeof chart === 'object' && Object.keys(chart).length)
})

function cloneSerializableChartSpec(spec) {
  return JSON.parse(JSON.stringify(toRaw(spec)))
}

async function renderTrendChart(chartSpec) {
  if (!chartSpec || !trendChartRoot.value) {
    return
  }

  const renderedSpec = cloneSerializableChartSpec(chartSpec)
  if (renderedSpec.layer) {
    renderedSpec.layer.forEach((layer) => {
      layer.title = null
    })
  } else if (renderedSpec.vconcat) {
    renderedSpec.vconcat.forEach((panel) => {
      panel.title = null
    })
  } else if (renderedSpec.marks) {
    renderedSpec.marks.forEach((mark) => {
      if (mark && typeof mark === 'object') {
        mark.title = null
      }
    })
  } else {
    renderedSpec.title = null
  }

  await nextTick()
  if (!trendChartRoot.value) {
    return
  }
  trendChartRoot.value.innerHTML = ''
  await embed(trendChartRoot.value, renderedSpec, { actions: true })
}

async function loadPage() {
  await aboutStore?.loadAboutPage()
}

watch(
  () => route.fullPath,
  async (path) => {
    if (path === '/metamp-about') {
      await loadPage()
    }
  },
  { immediate: true }
)

watch(
  [trendChartSpec, trendChartRoot, hasTrendChart],
  async ([chartSpec, chartRoot, shouldRender]) => {
    if (!chartSpec || !chartRoot || !shouldRender) {
      return
    }
    try {
      await renderTrendChart(chartSpec)
    } catch (error) {
      console.error('Failed to render About MetaMP trend chart', error)
    }
  },
  { deep: true, immediate: true, flush: 'post' }
)

onMounted(async () => {
  if (route.fullPath === '/metamp-about' && !summaryRows.value.length && !hasTrendChart.value) {
    await loadPage()
  }
  if (trendChartSpec.value && trendChartRoot.value) {
    try {
      await renderTrendChart(trendChartSpec.value)
    } catch (error) {
      console.error('Failed to render About MetaMP trend chart on mount', error)
    }
  }
})
</script>

<style scoped>
.metamp-about-page {
  padding-bottom: 2rem;
}

.about-shell {
  display: grid;
  gap: 1.5rem;
}

.content-section {
  display: grid;
  gap: 1rem;
}

.about-hero {
  background: linear-gradient(135deg, #f7fbff, #ebf5ff);
  border-radius: 22px;
}

.about-title {
  font-size: 2.1rem;
  line-height: 1.1;
  color: #12395b;
}

.hero-copy {
  font-size: 1rem;
  line-height: 1.7;
  color: #1f3142;
}

.section-heading {
  display: grid;
  gap: 0.35rem;
}

.section-heading--compact {
  margin-bottom: 0.75rem;
}

.section-eyebrow {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #5f6f7f;
  text-transform: uppercase;
}

.section-title {
  color: #12395b;
  margin: 0;
}

.about-table th {
  color: #587089;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.table-row-highlight {
  --bs-table-bg: rgba(18, 57, 91, 0.05);
}

.about-chart-surface {
  min-height: 320px;
  width: 100%;
}

.about-chart-state {
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
