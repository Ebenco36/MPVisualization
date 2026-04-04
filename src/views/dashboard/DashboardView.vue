<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, watch, nextTick, onBeforeUnmount, toRaw, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
// import VennDiagram from '@/components/VennDiagram.vue'
import { useDashboardStore } from '@/stores/dashboard'
import Trend from '@/components/dashboard/Trend.vue'
import TourComponent from '../../components/TourComponent.vue'
import TrendByMethods from '@/components/dashboard/TrendByMethods.vue'
import smallTrend from '@/components/dashboard/smallTrend.vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import { getPlotly } from '@/utils/heavyLoaders'
import embed from 'vega-embed'
// Reactive state variables
const dashboardStore = useDashboardStore()
const authStore = useAuthStore()

// Array of steps for the guided tour or onboarding experience
const steps = ref([
  {
    target: '.menu-toggle',
    header: {
      title: 'Menu'
    },
    content: `The menu icon, recognized by its three stacked horizontal lines, is a compact symbol used in digital interfaces. Tapping or clicking on it reveals a hidden menu offering various options, such as navigation, settings, and user-related functions, enhancing user experience by saving space and keeping the interface clean.`,
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#view-profile',
    content: 'Select to access and modify your profile.',
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#mpvis_dashboard',
    content:
      'A dashboard is a visual interface that presents key information, data, and metrics in a condensed and organized manner. It offers users an at-a-glance view of important insights, trends, and performance indicators, helping them make informed decisions quickly and efficiently.',
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#mpvis_about',
    content: 'Select this link to learn more about us.',
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#mpvis_contact',
    content: 'Contact information for contributors is available on this page.',
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#variables',
    content: 'Click to see a list of variables along with their corresponding interpretations.',
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#entries',
    content: 'Click to access the complete enriched MPstruc database',
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#chart_overtime',
    content: 'Cummulative sum of resolved Membrane Protein Structures overtime.',
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#goto_training',
    content:
      'Click to access our training to help improve overall system including UI/UX and correct errors within the database.',
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#goto_summary',
    content:
      'Select this link to display summary statistics for enriched membrane protein structures.',
    params: {
      placement: 'top',
      highlight: true
    }
  },

  {
    target: '#trend_by_methods',
    content:
      'Overview of Resolved Membrane Protein Structures and Their Resolution Methods, Including X-ray Crystallography, Cryo-Electron Microscopy, Nuclear Magnetic Resonance, and Other Techniques',
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#MPdatatable',
    content: 'Summary Data Page for Enriched Membrane Protein Structures',
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#basic_vis',
    content: 'Other visuals from the database.',
    params: {
      placement: 'top',
      highlight: true
    }
  }
])

const trendCard = ref(null)
const trend_width = ref(null)

const chartCard = ref(null)
const meanResolutionChart = ref(null)

const search = ref('')
const headers = [
  { title: 'Country', key: 'country' },
  { title: 'No. of resolved structures', key: 'count' },
  { title: 'Trend', key: 'trend' }
]

const width = ref(0)
const filter_country_data = ref([])

const boxWidthInPercentage = 40
const tableContainer = ref(null)
const boxWidthInPx = ref(0)
const hasMapRows = computed(() => Array.isArray(dashboardStore?.dashboardMap?.map_data))

function cloneChartSpec(spec) {
  const rawSpec = toRaw(spec)
  return JSON.parse(JSON.stringify(rawSpec, (_key, value) => {
    if (typeof value === 'function') {
      return undefined
    }

    if (typeof window !== 'undefined' && value === window) {
      return undefined
    }

    if (typeof document !== 'undefined' && value === document) {
      return undefined
    }

    return value
  }))
}

const router = useRouter()

function gotoVariables() {
  router.push('/variables')
}

function gotoDataBase() {
  router.push('/databaseTable')
}

// Reference array to store Plotly chart containers
const plotlyRefs = ref([])

// Function to set Plotly refs
function setPlotlyRef(el, index) {
  plotlyRefs.value[index] = el
}

// Watch for changes to the data and update the charts accordingly
watch(
  () => dashboardStore?.dashboardMap?.map_data,
  async (newData) => {
    await nextTick() // Wait for the DOM to be updated
    createPlotlyCharts(newData)
  },
  { immediate: true }
)

watch(
  () => search.value,
  async () => {
    await nextTick()
    createPlotlyCharts(dashboardStore?.dashboardMap?.map_data)
  }
)

watch(
  () => dashboardStore?.dashboardOthers?.mean_resolution_by_year,
  async (nextChart) => {
    if (!nextChart || !meanResolutionChart.value) {
      return
    }

    await nextTick()

    try {
      const clonedChart = cloneChartSpec(nextChart)
      if (clonedChart.layer) {
        clonedChart.layer.forEach((layer) => {
          layer.title = null
        })
      } else if (clonedChart.vconcat) {
        clonedChart.vconcat.forEach((panel) => {
          panel.title = null
        })
      } else {
        clonedChart.title = null
      }
      await embed(meanResolutionChart.value, clonedChart, { actions: true })
    } catch (error) {
      console.error('Failed to render mean resolution chart', error, nextChart)
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const handlePageChange = async (newPage) => {
  console.log('Page changed to:', newPage)
  await nextTick()
  createPlotlyCharts(dashboardStore?.dashboardMap?.map_data)
}

// Function to create Plotly charts with common x-axis range
async function createPlotlyCharts(data) {
  // Calculate the maximum value for the x-axis range
  if (data) {
    const Plotly = await getPlotly()
    const maxCount = Math.max(...data.map((item) => item.count))
    const totalSum = data.reduce((acc, item) => acc + item.count, 0)

    data.forEach((item, index) => {
      let country_count = (item.count / totalSum) * 100
      const element = plotlyRefs.value[item.country_number]
      if (element) {
        const backgroundTrace = {
          y: [item.country],
          x: [100],
          type: 'bar',
          marker: { color: 'lightgrey' },
          orientation: 'h',
          showlegend: false,
          hoverinfo: 'none'
        }

        const dataTrace = {
          y: [item.country],
          x: [country_count],
          type: 'bar',
          name: 'Count',
          marker: {
            color: '#15607a',
            line: {
              color: '#15607a',
              width: 2 // Set the thickness of the bar border
            }
          },
          orientation: 'h',
          showlegend: false, // Ensure the legend is not shown
          text: [country_count.toFixed(0) + ' %'], // Display the value on the bar
          textposition: 'inside', // Position the text inside the bar
          textfont: {
            color: 'white', // Font color for the text
            size: 12 // Font size for the text
          },
          hoverinfo: 'none' // Hide hover info
        }

        const layout = {
          barmode: 'overlay',
          template: 'plotly_white',
          yaxis: {
            autorange: 'reversed',
            showticklabels: false,
            automargin: true // Remove unnecessary padding/margins on the y-axis
          },
          xaxis: {
            title: '', // Remove the x-axis title
            range: [0, 100],
            showticklabels: false, // Remove x-axis tick labels
            showgrid: false, // Remove x-axis grid lines
            showline: false, // Remove x-axis line
            automargin: true // Remove unnecessary padding/margins on the x-axis
          },
          margin: {
            l: 0, // Remove left margin
            r: 0, // Remove right margin
            t: 0, // Remove top margin
            b: 0 // Remove bottom margin
          },
          bargap: 0.1, // Reduce the gap between bars to increase their size
          bargroupgap: 0 // Reduce the gap between groups of bars
        }

        const config = {
          displayModeBar: false // Disable the mode bar
        }

        Plotly.newPlot(element, [backgroundTrace, dataTrace], layout, config)
      }
    })
  }
}

function groupDataByIsoCode(data, isoCode) {
  if (!Array.isArray(data) || !isoCode) {
    return []
  }

  // Filter data based on iso_code_2
  const filteredData = data.filter((item) => item.iso_code_2 === isoCode)

  // Group by year and sum counts
  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.year]) {
      acc[item.year] = 0
    }
    acc[item.year] += item.count
    return acc
  }, {})

  // Transform the grouped data into the desired format
  return Object.keys(groupedData).map((year) => ({
    year: year,
    count: groupedData[year]
  }))
}

const updateBoxWidth = () => {
  if (!tableContainer.value) {
    return
  }

  const containerWidth =
    tableContainer.value.getBoundingClientRect().width -
    0.2 * tableContainer.value.getBoundingClientRect().width
  boxWidthInPx.value = (boxWidthInPercentage / 100) * containerWidth
}

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', updateBoxWidth)
})

onMounted(() => {
  // Calculate the initial width in pixels
  updateBoxWidth()

  // Add the resize event listener to update the width on window resize
  window.addEventListener('resize', updateBoxWidth)

  if (chartCard.value) {
    width.value = chartCard.value.clientWidth
  }
  if (chartCard.value) {
    trend_width.value = trendCard.value.clientWidth
  }
  console.log(trendCard.value)
  window.addEventListener('resize', () => {
    if (chartCard.value) {
      width.value = chartCard.value.clientWidth
    }
    if (trendCard.value) {
      trend_width.value = trendCard.value.clientWidth
    }
    console.log(trend_width.value)
  })
  dashboardStore?.loadDashboardStat('none', trend_width.value)
  dashboardStore?.dashBoardStatsMap()
  dashboardStore?.loadDashboardStatOthers()
  dashboardStore?.loadDashboardInconsistencies(width.value)
})
</script>
<style lang="scss">
hr.v-divider.v-theme--light {
  display: none !important;
}

.v-text-field input {
  height: 25px !important;
}

.dashboard-overview {
  padding-bottom: 2rem;
}

.dashboard-section {
  margin-bottom: 1.5rem;
}

.dashboard-grid-row {
  display: flex;
  flex-wrap: wrap;
}

.dashboard-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 16px 36px rgba(15, 76, 92, 0.08);
}

.dashboard-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.dashboard-panel__eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6d7b80;
}

.dashboard-panel__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #14323c;
}

.dashboard-panel__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.92rem;
  color: #61747b;
}

.dashboard-panel__body {
  min-height: 0;
  flex: 1 1 auto;
}

.dashboard-panel__body--chart {
  min-height: 360px;
}

.dashboard-panel__chart-surface {
  width: 100%;
  min-height: 320px;
  overflow: auto;
}

.dashboard-search {
  margin-top: 0.75rem;
}

.dashboard-search__input {
  border-radius: 999px;
  border: 1px solid #d7e2e6;
}

.dashboard-empty-state {
  padding: 1.25rem 0.25rem 0.5rem;
  color: #61747b;
  text-align: center;
}

@media (max-width: 767px) {
  .dashboard-panel {
    padding: 0.9rem;
    border-radius: 20px;
  }

  .dashboard-panel__body--chart {
    min-height: 300px;
  }
}
</style>

<template>
  <div class="main-content dashboard-overview">
    <HeaderCrumbs label="MetaMP Overview" title="" />
    <div class="row dashboard-section" id="chart_overtime">
      <div class="col-md-12" ref="chartCard">
        <div class="dashboard-panel" ref="trendCard">
          <div class="dashboard-panel__header">
            <div>
              <p class="dashboard-panel__eyebrow">Timeline</p>
              <h3 class="dashboard-panel__title">Resolved Membrane Protein Structures Over Time</h3>
              <p class="dashboard-panel__subtitle">
                Cumulative growth of resolved membrane-protein structures across the curated dataset.
              </p>
            </div>
          </div>
          <div class="dashboard-panel__body dashboard-panel__body--chart" style="overflow: auto">
            <Trend
              :trend="dashboardStore?.dashboard?.trend"
              title="Membrane Protein Structures (MPs) Interactive Visualization."
              :use-card="false"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row dashboard-grid-row dashboard-section">
      <div class="col-lg-6 col-md-6 d-flex align-items-stretch" id="trend_by_methods">
        <div class="dashboard-panel w-100">
          <div class="dashboard-panel__header">
            <div>
              <p class="dashboard-panel__eyebrow">Methods</p>
              <h3 class="dashboard-panel__title">Experimental Method Trends</h3>
              <p class="dashboard-panel__subtitle">
                Compare how X-ray, cryo-EM, NMR, and other methods contribute to structural growth.
              </p>
            </div>
          </div>
          <div class="dashboard-panel__body dashboard-panel__body--chart">
            <TrendByMethods
              :trendByMethods="dashboardStore?.dashboard?.trendByMethods"
              :use-card="false"
            />
          </div>
        </div>
      </div>

      <div class="col-lg-6 col-md-6 d-flex align-items-stretch" id="mean_resolution_by_year">
        <div class="dashboard-panel w-100">
          <div class="dashboard-panel__header">
            <div>
              <p class="dashboard-panel__eyebrow">Resolution</p>
              <h3 class="dashboard-panel__title">Mean Resolution by Year</h3>
              <p class="dashboard-panel__subtitle">
                See how structural resolution quality shifts across the historical record.
              </p>
            </div>
          </div>
          <div class="dashboard-panel__body dashboard-panel__body--chart">
            <div ref="meanResolutionChart" class="dashboard-panel__chart-surface"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="row dashboard-section">
      <div class="col-lg-12 col-md-12" id="release_structure_by_">
        <div class="dashboard-panel">
          <div class="dashboard-panel__header">
            <div>
              <p class="dashboard-panel__eyebrow">Geography</p>
              <h3 class="dashboard-panel__title">Structures Released by Country</h3>
              <p class="dashboard-panel__subtitle">
                Search country activity, compare relative contributions, and inspect country-level trends in one table.
              </p>
            </div>
          </div>
          <div class="dashboard-panel__body">
            <div class="pb-0 mb-0" ref="tableContainer">
              <div class="input-group input-group-sm dashboard-search">
                <input
                  type="text"
                  class="form-control dashboard-search__input"
                  placeholder="Search country"
                  v-model="search"
                  aria-label="Search"
                />
              </div>
            </div>
            <div v-if="dashboardStore?.dashboardMap?.loader_status" class="row mb-4 justify-content-center">
              Loading country release data...
            </div>
            <v-data-table
              v-else-if="hasMapRows"
              :headers="headers"
              :items="dashboardStore?.dashboardMap?.map_data"
              :items-per-page="5"
              :search="search"
              @update:page="handlePageChange"
            >
              <!-- Custom rendering for the 'count' column -->
              <template v-slot:[`item.country`]="{ item }">
                <td style="width: 20%">
                  <div>
                    <span>{{ item.country }}</span>
                  </div>
                </td>
              </template>

              <!-- Custom rendering for the 'count' column -->
              <template v-slot:[`item.count`]="{ item }">
                <td :style="{ width: boxWidthInPx + 'px' }">
                  <div class="text-center">
                    <div
                      :ref="(el) => setPlotlyRef(el, item.country_number)"
                      :style="{ width: boxWidthInPx + 'px', height: '30px' }"
                    ></div>
                    <span>{{ item.count }}</span>
                  </div>
                </td>
              </template>

              <template v-slot:[`item.trend`]="{ item }">
                <td :style="{ width: boxWidthInPx + 'px', 'text-align': 'left!important' }">
                  <div class="" style="text-align: left">
                    <smallTrend
                      :data="
                        groupDataByIsoCode(
                          dashboardStore?.dashboardMap?.country_data,
                          item.iso_code_2
                        )
                      "
                      :width="boxWidthInPx"
                      :height="20"
                    />
                  </div>
                </td>
              </template>
            </v-data-table>
            <div v-else class="dashboard-empty-state">
              No country release data is available in this runtime.
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end of main-content -->
    <TourComponent :steps="steps" :is-visible="!authStore?.auth?.user?.has_taken_tour" />
  </div>
</template>
