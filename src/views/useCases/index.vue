<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import Swal from 'sweetalert2'
import { format } from 'date-fns'
import AppButton from '@/components/common/AppButton.vue'
import { useCasesStore } from '@/stores/use_cases'
import GraphView from '@/components/dashboard/GraphView.vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import StructureExpertNotesDialog from '@/components/useCases/StructureExpertNotesDialog.vue'
import DiscrepancyReviewDialog from '@/components/useCases/DiscrepancyReviewDialog.vue'
import StructureNotesRealtimeService from '@/services/structure_notes_realtime.service'
import {
  basicPredictorCountColumns,
  buildDiscrepancyRow,
  discrepancyDecisionFields,
  downloadExportResponse,
  getColumnValue,
  getDecisionTooltip,
  hasDecisionTooltip
} from '@/utils/discrepancyQueue'

const router = useRouter()
const casesStore = useCasesStore()
const search = ref('')
const page = ref(1)
const perPage = ref(10)
const exportingFormat = ref(null)
const decisionNotesDialog = ref(false)
const activeDecisionNotes = ref('')
const activeDecisionPdb = ref('')
const expandedRows = ref([])
let stopStructureNotesRealtime = null
const headers = [
  { title: 'Year', value: 'Year' },
  { title: 'PDB Code', value: 'PDB Code' },
  { title: 'Group (Expert)', value: 'Group (Expert)' },
  { title: 'TM (Expert)', value: 'TM (Expert)' },
  { title: 'Group Disagreement', value: 'group_disagreement' },
  { title: 'TM Disagreement', value: 'tm_disagreement' },
  { title: 'TM Boundary Disagreement', value: 'tm_boundary_disagreement' },
  { title: 'Benchmark Decision', value: 'benchmark_status' },
  { title: 'Benchmark Recommended', value: 'benchmark_recommended' },
  { title: 'Confidence', value: 'scientific_confidence' },
  { title: 'Review', value: 'review_action', sortable: false },
  { title: 'Notes', value: 'expert_notes', sortable: false },
  { title: 'Details', value: 'details', sortable: false },
  { title: 'Actions', value: 'actions', sortable: false }
]

const detailFields = discrepancyDecisionFields

// Reactive state
const rows = ref([])
const loading = ref(false)
const benchmarkStatus = ref(null)

const chart_width = ref(null)
const width = ref(null)
const toggleFilter = ref(true)
const useCases = ref(null)
const category = ref(null)
const features = ref([])
const chart_type = ref(null)
const chart_obj = ref(null)
const chart_trend = ref(null)
const outlier_detection_by_method = ref(null)
const outlier_detection_algorithm = ref(null)
const errors = ref([])
const view = ref(router.currentRoute.value.params?.view)
const page_title = ref('')
const queuePagination = computed(() => casesStore.discrepancy_review_queue.pagination || {
  page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  returned_items: 0,
  has_prev: false,
  has_next: false
})

const loadDiscrepancyQueue = async () => {
  loading.value = true
  try {
    const [payload] = await Promise.all([
      casesStore.loadDiscrepancyReviewQueue({
        disagreement_only: false,
        search: search.value || undefined,
        page: page.value,
        per_page: perPage.value
      }),
      casesStore.loadBenchmarkStatus()
    ])
    benchmarkStatus.value = casesStore.benchmark_status.data
    rows.value = (payload?.items || []).map((candidate) =>
      buildDiscrepancyRow(candidate, basicPredictorCountColumns)
    )
    resubscribeStructureNotesRealtime()

    if ((payload?.pagination?.total_items || 0) === 0) {
      Swal.fire({
        title: 'No Data',
        text: 'No records found for the current discrepancy search.',
        icon: 'info',
        confirmButtonText: 'OK'
      })
    }
  } catch (err) {
    console.error('Fetch failed:', err)
  } finally {
    loading.value = false
  }
}

function handleFilter() {
  toggleFilter.value = !toggleFilter.value
}

const formattedBenchmarkRelease = computed(() => {
  const releaseId = benchmarkStatus.value?.release_id
  if (!releaseId) return null
  const match = String(releaseId).match(
    /^(\\d{4})(\\d{2})(\\d{2})T(\\d{2})(\\d{2})(\\d{2})Z$/
  )
  if (!match) return releaseId
  const [, year, month, day, hour, minute, second] = match
  const utcDate = new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    )
  )
  return format(utcDate, 'MMM d, yyyy HH:mm') + ' UTC'
})

const normalizePdbCode = (value) => {
  const text = String(value || '').trim().toUpperCase()
  return text || null
}

const openRecord = (item) => {
  const pdbCode = normalizePdbCode(
    item?._raw?.record?.canonical_pdb_code ||
    item?._raw?.record?.replacement_pdb_code ||
    item?._raw?.canonical_pdb_code ||
    item?._raw?.replacement_pdb_code ||
    item?._raw?.pdb_code ||
    item?.['PDB Code']
  )
  if (!pdbCode) return
  window.open(`/#/details-2?code=${encodeURIComponent(pdbCode)}&type=pdb`, '_blank')
}

const exportDiscrepancyTable = async (format) => {
  exportingFormat.value = format
  try {
    const response = await casesStore.exportDiscrepancyReviewQueue(
      {
        disagreement_only: false,
        search: search.value || undefined
      },
      format
    )
    const extension = format === 'xlsx' ? 'xlsx' : format
    downloadExportResponse(response, `metamp_discrepancy_review_queue.${extension}`)
  } catch (error) {
    console.error('Discrepancy export failed:', error)
    Swal.fire({
      title: 'Export Failed',
      text: 'The discrepancy queue export could not be generated.',
      icon: 'error',
      confirmButtonText: 'OK'
    })
  } finally {
    exportingFormat.value = null
  }
}

function isBooleanChipColumn(column) {
  return [
    'group_disagreement',
    'tm_disagreement',
    'tm_boundary_disagreement',
    'benchmark_recommended',
    'context_dependent_topology',
    'non_canonical_membrane_case',
    'multichain_context',
    'obsolete_or_replaced'
  ].includes(column?.key || column?.value)
}

function isScientificConfidenceColumn(column) {
  return column?.key === 'scientific_confidence' || column?.value === 'scientific_confidence'
}

function chipColorForBooleanLabel(label) {
  if (label === 'Yes') return 'warning'
  if (label === 'No') return 'success'
  return 'default'
}

function chipVariantForBooleanLabel(label) {
  return label === 'Not Specified' ? 'outlined' : 'flat'
}

function benchmarkStatusChipColor(item) {
  switch (item?.benchmark_status_code) {
    case 'high_confidence_subset':
      return 'success'
    case 'included_with_caution':
      return 'warning'
    case 'not_recommended':
      return 'deep-orange'
    case 'excluded':
      return 'error'
    default:
      return 'default'
  }
}

function tooltipText(item, column) {
  return getDecisionTooltip(item, column)
}

function scientificConfidenceChipColor(item) {
  switch (item?.scientific_confidence_code) {
    case 'high':
      return 'success'
    case 'medium':
      return 'warning'
    case 'low':
      return 'deep-orange'
    case 'none':
      return 'default'
    default:
      return 'default'
  }
}

function shortenDecisionNotes(value, maxLength = 96) {
  const text = String(value || '').trim()
  if (!text || text === 'Not Specified') return 'Not Specified'
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

function openDecisionNotes(item) {
  activeDecisionNotes.value = item?.benchmark_reason || 'Not Specified'
  activeDecisionPdb.value = item?.['PDB Code'] || ''
  decisionNotesDialog.value = true
}


function itemMatchesStructureNoteUpdate(item, payload) {
  const candidateCodes = [
    item?.['PDB Code'],
    item?._raw?.record?.pdb_code,
    item?._raw?.record?.canonical_pdb_code,
    item?._raw?.canonical_pdb_code,
  ].map((value) => normalizePdbCode(value)).filter(Boolean)

  const payloadCodes = [payload?.pdb_code, payload?.canonical_pdb_code]
    .map((value) => normalizePdbCode(value))
    .filter(Boolean)

  return payloadCodes.some((value) => candidateCodes.includes(value))
}

function applyStructureNoteRealtimeUpdate(payload) {
  rows.value.forEach((item) => {
    if (itemMatchesStructureNoteUpdate(item, payload)) {
      handleExpertNotesUpdated(item, payload?.summary)
    }
  })
}

function resubscribeStructureNotesRealtime() {
  if (typeof stopStructureNotesRealtime === 'function') {
    stopStructureNotesRealtime()
    stopStructureNotesRealtime = null
  }

  const pdbCodes = rows.value.map((item) => item?.['PDB Code']).filter(Boolean)
  if (!pdbCodes.length) return

  stopStructureNotesRealtime = StructureNotesRealtimeService.subscribeToStructureNotes(
    pdbCodes,
    applyStructureNoteRealtimeUpdate
  )
}

function handleExpertNotesUpdated(item, summary) {
  const normalizedSummary = {
    note_count: Number(summary?.note_count || 0),
    open_note_count: Number(summary?.open_note_count || 0),
    latest_note_at: summary?.latest_note_at || null,
    latest_note_excerpt: summary?.latest_note_excerpt || null,
    recent_notes: Array.isArray(summary?.recent_notes) ? summary.recent_notes : [],
  }
  item.expert_note_count = normalizedSummary.note_count
  item.latest_expert_note_excerpt = normalizedSummary.latest_note_excerpt || 'Not Specified'
  if (item._raw) {
    item._raw.expert_note_summary = normalizedSummary
    item._raw.expert_note_count = normalizedSummary.note_count
    if (item._raw.record) {
      item._raw.record.expert_note_summary = normalizedSummary
      item._raw.record.expert_note_count = normalizedSummary.note_count
    }
  }
}

async function handleDiscrepancyReviewUpdated() {
  await Promise.all([fetchQueue(), fetchSummary()])
}

function rowId(item) {
  return item?.['PDB Code'] || ''
}

function isExpanded(item) {
  return expandedRows.value.includes(rowId(item))
}

function toggleExpanded(item) {
  const id = rowId(item)
  if (!id) return
  if (isExpanded(item)) {
    expandedRows.value = expandedRows.value.filter((value) => value !== id)
    return
  }
  expandedRows.value = [...expandedRows.value, id]
}

const debouncedQueueSearch = debounce(async () => {
  page.value = 1
  await loadDiscrepancyQueue()
}, 300)

function convertToTitleCase(str) {
  return str
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

function getEffectiveChartWidth() {
  const measuredWidth = Number(chart_width.value?.clientWidth || width.value || 0)
  if (Number.isFinite(measuredWidth) && measuredWidth > 320) {
    return Math.round(measuredWidth)
  }
  return 960
}

const requestCharts = async () => {
  try {
    if (features.value.length == 1) {
      alert('You must select more than one variable or leave it empty.')
      return
    }
    const chartWidth = getEffectiveChartWidth()
    width.value = chartWidth
    const data = {
      use_case: useCases.value,
      category: category.value,
      features: features.value,
      chart_type: chart_type.value,
      chart_width: chartWidth,
      chart_trend: chart_trend.value,
      outlier_detection_by_method: outlier_detection_by_method.value,
      outlier_detection_algorithm: outlier_detection_algorithm.value
    }
    await casesStore.getUseCasesChart(data)
    chart_obj.value = casesStore.get_use_cases_chart_data.data?.data
  } catch (error) {
    console.error('Error fetching data:', error)
    Swal.fire({
      title: 'Error',
      text: 'Error fetching chart data. Please try again later.',
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }
}

const fetchCharts = debounce(requestCharts, 300)

const get_features = computed(() => {
  const data = casesStore.use_cases_data.data?.data
  if (!data) return []
  return outlier_detection_by_method.value === 'EM' ? data.em_features : data.x_ray_features
})

function getDefaultFeatures(method) {
  if (method === 'EM') {
    return [
      'emt_molecular_weight',
      'reconstruction_num_particles',
      'processed_resolution'
    ]
  }

  return ['cell_length_a', 'cell_length_b', 'cell_length_c']
}

function setUseCaseDefaults(targetUseCase, options = {}) {
  const { preserveExisting = false } = options

  if (targetUseCase === 'summary_statistics') {
    category.value = preserveExisting && category.value ? category.value : 'group'
    chart_type.value = preserveExisting && chart_type.value ? chart_type.value : 'bar'
    chart_trend.value = preserveExisting && chart_trend.value ? chart_trend.value : 'No'
    return
  }

  if (targetUseCase === 'outlier_detection') {
    const method = preserveExisting && outlier_detection_by_method.value
      ? outlier_detection_by_method.value
      : 'X-ray'

    outlier_detection_by_method.value = method
    outlier_detection_algorithm.value = preserveExisting && outlier_detection_algorithm.value
      ? outlier_detection_algorithm.value
      : 'DBSCAN'

    if (!preserveExisting || !Array.isArray(features.value) || !features.value.length) {
      features.value = getDefaultFeatures(method)
    }
    return
  }

  if (targetUseCase === 'discrepancies') {
    chart_type.value = 'line'
    chart_trend.value = 'Yes'
  }
}

async function initializeCurrentUseCase(newView, options = {}) {
  const { preserveExisting = false } = options

  view.value = newView
  width.value = chart_width.value?.clientWidth || width.value || 800

  if (view.value && view.value !== 'summary_statistics') {
    useCases.value = view.value
    page_title.value = `${view.value} view`
  } else {
    useCases.value = 'summary_statistics'
    page_title.value = 'summary_statistics view'
  }

  setUseCaseDefaults(useCases.value, { preserveExisting })
  page_title.value = formatString(page_title.value)

  await nextTick()
  updateWidth()
  await requestCharts()

  if (useCases.value === 'discrepancies') {
    page.value = 1
    await loadDiscrepancyQueue()
  }
}

function formatString(input) {
  return input
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

watch(
  chart_trend,
  (new_chart_trend) => {
    if (new_chart_trend) {
      chart_type.value = 'bar'
    }
  },
  { deep: true }
)

watch(
  useCases,
  (new_use_cases) => {
    if (new_use_cases === 'outlier_detection') {
      setUseCaseDefaults('outlier_detection', { preserveExisting: true })
    }
  },
  { deep: true }
)

watch(
  outlier_detection_by_method,
  (newMethod, previousMethod) => {
    if (useCases.value !== 'outlier_detection' || !newMethod) return

    if (!Array.isArray(features.value) || !features.value.length || newMethod !== previousMethod) {
      features.value = getDefaultFeatures(newMethod)
    }
  }
)

watch(
  () => router.currentRoute.value.params?.view,
  async (newView) => {
    await initializeCurrentUseCase(newView, { preserveExisting: false })
  }
)

watch(page, async () => {
  if (useCases.value === 'discrepancies') {
    await loadDiscrepancyQueue()
  }
})

watch(perPage, async () => {
  if (useCases.value === 'discrepancies') {
    page.value = 1
    await loadDiscrepancyQueue()
  }
})

watch(search, () => {
  if (useCases.value === 'discrepancies') {
    debouncedQueueSearch()
  }
})

const updateWidth = () => {
  const nextWidth = getEffectiveChartWidth()
  const changed = nextWidth !== width.value
  width.value = nextWidth
  return changed
}

onMounted(async () => {
  await casesStore.loadUseCases()
  updateWidth()
  window.addEventListener('resize', updateWidth)
  await nextTick()

  await initializeCurrentUseCase(view.value, { preserveExisting: false })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
  debouncedQueueSearch.cancel()
  fetchCharts.cancel()
})
</script>

<template>
  <div class="main-content">
    <HeaderCrumbs :label="page_title" title="" />
    <div class="row">
      <div class="col-md-12 text-right">
        <AppButton
          label="Filter"
          class="custom-btn filter"
          icon="book-icon"
          :handleClick="handleFilter"
        />
      </div>
      <div :class="toggleFilter ? 'col-md-3 col-sm-12' : 'd-none'">
        <div class="card mb-4">
          <div class="card-body">
            <div class="form-group mb-3">
              <h5>{{ view != '' ? 'Option' : 'Use Cases' }}</h5>
            </div>
            <div class="form-group mb-3">
              <label>{{ view != '' ? 'Views' : 'Use Cases' }}:</label>
              <select
                class="form-control"
                v-model="useCases"
                :disabled="view != ''"
                :class="{ readonly: view != '' }"
              >
                <option>Select option</option>
                <option value="summary_statistics">Summary Statistics View</option>
                <option value="outlier_detection">Outlier Detection View</option>
                <option value="discrepancies">Discrepancies View</option>
                <!-- <option value="group_classification">MP Classification</option> -->
              </select>
            </div>
            <div class="form-group mb-3" v-if="useCases === 'summary_statistics'">
              <label>View Trend ? :</label>
              <select class="form-control" v-model="chart_trend">
                <option>Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div class="form-group mb-3" v-if="useCases === 'summary_statistics'">
              <label>Select Chart Type:</label>
              <select class="form-control" v-model="chart_type">
                <option>Select option</option>
                <option value="bar">Bar</option>
                <option value="line" v-if="chart_trend === 'Yes'">Line</option>
              </select>
            </div>
            <div class="form-group mb-3" v-if="useCases === 'summary_statistics'">
              <label>Group by Membrane Protein Structure (MPs) Category:</label>
              <select class="form-control" v-model="category">
                <option>Select option</option>
                <option value="group">MPs Group</option>
                <option value="taxonomic_domain">MPs Taxonomic Domain</option>
                <option value="rcsentinfo_experimental_method">MPs Experimental Methods</option>
              </select>
            </div>
            <div class="form-group mb-3" v-if="useCases === 'outlier_detection'">
              <label>Select Experimental Method:</label>
              <select class="form-control" v-model="outlier_detection_by_method">
                <option>Select option</option>
                <option value="X-ray">X-ray Crystallography (X-Ray)</option>
                <option value="EM">Cryo-Electron Microscopy (EM)</option>
                <!-- <option value="all">Both</option> -->
              </select>
            </div>

            <div class="form-group mb-3" v-if="useCases === 'outlier_detection'">
              <label>Outlier Detection Method:</label>
              <select
                ref="form_input"
                class="form-control"
                v-model="outlier_detection_algorithm"
                name="outlier_detection_algorithm"
              >
                <option
                  v-for="item in casesStore.use_cases_data.data?.data?.outlier_detection_algorithms"
                  :key="item"
                >
                  {{ item }}
                </option>
              </select>
            </div>

            <div class="form-group mb-3" v-if="useCases === 'outlier_detection'">
              <label>{{ outlier_detection_by_method }} Variables:</label>
              <select
                ref="form_input"
                :multiple="true"
                class="form-control"
                v-model="features"
                name="features"
              >
                <option v-for="item in get_features" :key="item">{{ item }}</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary" style="color: white" @click="fetchCharts">
              View
            </button>
          </div>
        </div>
      </div>
      <div :class="toggleFilter ? 'col-md-9 col-lg-9' : 'col-md-12'">
        <div class="row">
          <div class="col-md-12">
            <div class="card mb-4">
              <div class="card-body p-0" style="overflow-y: auto">
                <h5 class="card-title m-0 p-3">{{ useCases ? page_title : 'Use case title' }}</h5>
                <p class="container p-3" style="text-align: justify; font-size: 12pt">
                  This view highlights instances where a membrane‐protein entry’s metadata differs
                  between two databases. Detecting and resolving these inconsistencies is critical
                  for preserving MetaMP’s integrity, performance, and trustworthiness—ultimately
                  enabling more informed decisions and smoother operations. For each database pair,
                  discrepancies are summarized over time in a line chart, and a detailed table of
                  the selected mismatches (with full metadata) is provided for review.
                </p>
                <div class="discrepancy-figure-shell">
                  <div class="discrepancy-figure-meta">
                    <div class="discrepancy-figure-meta__title">Disagreement Trend</div>
                    <div class="discrepancy-figure-meta__text">
                      Drag across the chart to narrow the year range. Click a year marker to load the
                      matching disagreement records in the linked table.
                    </div>
                  </div>
                  <div class="discrepancy-chart-frame" ref="chart_width">
                    <GraphView
                      id="usecases"
                      :summary="chart_obj"
                      :show_loading="false"
                      :use_card="true"
                    />
                  </div>
                </div>

                <div v-if="useCases === 'discrepancies'">
                  <v-card>
                    <v-card-title>Membrane Protein Records</v-card-title>
                    <div class="px-4 pb-3" v-if="benchmarkStatus">
                      <p class="mb-2 benchmark-summary">
                        Latest benchmark release:
                        <strong>{{ formattedBenchmarkRelease }}</strong>
                        with
                        <strong>{{ benchmarkStatus.row_count }}</strong>
                        rows and
                        <strong>{{ benchmarkStatus.high_confidence_row_count }}</strong>
                        high-confidence records.
                      </p>
                      <p
                        v-if="
                          benchmarkStatus.min_bibliography_year &&
                          benchmarkStatus.max_bibliography_year
                        "
                        class="mb-2 benchmark-summary benchmark-coverage"
                      >
                        Expert-reviewed discrepancy benchmark coverage:
                        <strong>
                          {{ benchmarkStatus.min_bibliography_year }}-{{ benchmarkStatus.max_bibliography_year }}
                        </strong>
                      </p>
                    </div>
                    <div class="queue-toolbar">
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search by PDB, UniProt, group, species, or title"
                        single-line
                        hide-details
                        class="queue-search"
                      />
                      <div class="download-actions">
                        <button class="btn btn-outline-primary btn-sm" :disabled="!!exportingFormat" @click="exportDiscrepancyTable('json')">
                          JSON
                        </button>
                        <button class="btn btn-outline-primary btn-sm" :disabled="!!exportingFormat" @click="exportDiscrepancyTable('csv')">
                          CSV
                        </button>
                        <button class="btn btn-outline-primary btn-sm" :disabled="!!exportingFormat" @click="exportDiscrepancyTable('xlsx')">
                          Excel
                        </button>
                        <button class="btn btn-outline-primary btn-sm" :disabled="!!exportingFormat" @click="exportDiscrepancyTable('tsv')">
                          TSV
                        </button>
                      </div>
                    </div>
                    <div class="queue-meta px-4 pb-3">
                      Showing <strong>{{ rows.length }}</strong> of
                      <strong>{{ queuePagination.total_items }}</strong> matching records.
                    </div>
                    <v-data-table
                      :headers="headers"
                      :items="rows"
                      :loading="loading"
                      class="elevation-1"
                      :items-per-page="perPage"
                      hide-default-footer
                    >
                      <template #no-data>
                        <v-alert type="info" border="left" colored-border>
                          No records found
                        </v-alert>
                      </template>
                      <!-- Override each row -->
                      <template #item="{ item, columns }">
                        <tr
                          :class="{ 'highlight-row': item._highlight }"
                          class="queue-row"
                          @click="toggleExpanded(item)"
                        >
                          <td
                            v-for="col in columns"
                            :key="col.key"
                          >
                            <template v-if="col.key === 'actions'">
                              <button class="btn btn-sm btn-outline-secondary" @click.stop="openRecord(item)">
                                Open
                              </button>
                            </template>
                            <template v-else-if="col.key === 'details'">
                              <div class="details-toggle">
                                <span>{{ isExpanded(item) ? 'Hide' : 'View' }}</span>
                                <v-icon size="18">
                                  {{ isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                </v-icon>
                              </div>
                            </template>
                            <template v-else-if="col.key === 'benchmark_status'">
                              <v-tooltip
                                v-if="hasDecisionTooltip(col)"
                                location="top"
                                max-width="420"
                              >
                                <template #activator="{ props }">
                                  <span v-bind="props" class="tooltip-activator">
                                    <v-chip
                                      size="small"
                                      :color="benchmarkStatusChipColor(item)"
                                      variant="flat"
                                    >
                                      {{ getColumnValue(item, col) }}
                                    </v-chip>
                                  </span>
                                </template>
                                <div class="decision-tooltip">{{ tooltipText(item, col) }}</div>
                              </v-tooltip>
                              <v-chip
                                v-else
                                size="small"
                                :color="benchmarkStatusChipColor(item)"
                                variant="flat"
                              >
                                {{ getColumnValue(item, col) }}
                              </v-chip>
                            </template>
                            <template v-else-if="isScientificConfidenceColumn(col)">
                              <v-tooltip
                                v-if="hasDecisionTooltip(col)"
                                location="top"
                                max-width="420"
                              >
                                <template #activator="{ props }">
                                  <span v-bind="props" class="tooltip-activator">
                                    <v-chip
                                      size="small"
                                      :color="scientificConfidenceChipColor(item)"
                                      variant="flat"
                                    >
                                      {{ getColumnValue(item, col) }}
                                    </v-chip>
                                  </span>
                                </template>
                                <div class="decision-tooltip">{{ tooltipText(item, col) }}</div>
                              </v-tooltip>
                              <v-chip
                                v-else
                                size="small"
                                :color="scientificConfidenceChipColor(item)"
                                variant="flat"
                              >
                                {{ getColumnValue(item, col) }}
                              </v-chip>
                            </template>
                            <template v-else-if="col.key === 'expert_notes' || col.value === 'expert_notes'">
                              <StructureExpertNotesDialog
                                :pdb-code="item['PDB Code']"
                                :initial-count="item.expert_note_count"
                                :summary="item._raw?.expert_note_summary || item._raw?.record?.expert_note_summary"
                                source-context="use_cases_index_queue"
                                @updated="handleExpertNotesUpdated(item, $event)"
                              />
                            </template>
                            <template v-else-if="col.key === 'review_action' || col.value === 'review_action'">
                              <DiscrepancyReviewDialog
                                :pdb-code="item['PDB Code']"
                                :initial-review="item._raw?.review || item._raw?.record?.discrepancy_review || {}"
                                trigger-mode="button"
                                trigger-label="Review"
                                @updated="handleDiscrepancyReviewUpdated"
                              />
                            </template>
                            <template v-else>
                              <template v-if="isBooleanChipColumn(col)">
                                <v-tooltip
                                  v-if="hasDecisionTooltip(col)"
                                  location="top"
                                  max-width="420"
                                >
                                  <template #activator="{ props }">
                                    <span v-bind="props" class="tooltip-activator">
                                      <v-chip
                                        size="small"
                                        :color="chipColorForBooleanLabel(getColumnValue(item, col))"
                                        :variant="chipVariantForBooleanLabel(getColumnValue(item, col))"
                                      >
                                        {{ getColumnValue(item, col) }}
                                      </v-chip>
                                    </span>
                                  </template>
                                  <div class="decision-tooltip">{{ tooltipText(item, col) }}</div>
                                </v-tooltip>
                                <v-chip
                                  v-else
                                  size="small"
                                  :color="chipColorForBooleanLabel(getColumnValue(item, col))"
                                  :variant="chipVariantForBooleanLabel(getColumnValue(item, col))"
                                >
                                  {{ getColumnValue(item, col) }}
                                </v-chip>
                              </template>
                              <template v-else>
                                {{ getColumnValue(item, col) }}
                              </template>
                            </template>
                          </td>
                        </tr>
                        <tr v-if="isExpanded(item)" class="detail-row">
                          <td :colspan="columns.length" class="detail-cell">
                            <div class="detail-layout">
                              <div class="detail-section">
                                <div class="detail-section__title">Decision Notes</div>
                                <div class="decision-note-inline">
                                  <span class="decision-note-preview">
                                    {{ shortenDecisionNotes(item.benchmark_reason, 180) }}
                                  </span>
                                  <button
                                    v-if="item.benchmark_reason && item.benchmark_reason !== 'Not Specified'"
                                    class="btn btn-link btn-sm decision-note-button"
                                    @click.stop="openDecisionNotes(item)"
                                  >
                                    View Full Note
                                  </button>
                                </div>
                              </div>
                              <div class="detail-section">
                                <div class="detail-section__title">Expert Notes</div>
                                <div class="decision-note-inline">
                                  <span class="decision-note-preview">
                                    {{ shortenDecisionNotes(item.latest_expert_note_excerpt, 180) }}
                                  </span>
                                  <StructureExpertNotesDialog
                                    :pdb-code="item['PDB Code']"
                                    :initial-count="item.expert_note_count"
                                    :summary="item._raw?.expert_note_summary || item._raw?.record?.expert_note_summary"
                                    trigger-mode="button"
                                    trigger-label="Open Notes"
                                    source-context="use_cases_index_expanded"
                                    @updated="handleExpertNotesUpdated(item, $event)"
                                  />
                                </div>
                              </div>
                              <div class="detail-section">
                                <div class="detail-section__title">Decision Signals</div>
                                <div class="detail-grid">
                                  <div
                                    v-for="field in detailFields"
                                    :key="field.value"
                                    class="detail-card"
                                  >
                                    <div class="detail-card__label">{{ field.title }}</div>
                                    <div class="detail-card__value">
                                      <template v-if="field.value === 'benchmark_status'">
                                        <v-tooltip
                                          v-if="hasDecisionTooltip(field)"
                                          location="top"
                                          max-width="420"
                                        >
                                          <template #activator="{ props }">
                                            <span v-bind="props" class="tooltip-activator">
                                              <v-chip
                                                size="small"
                                                :color="benchmarkStatusChipColor(item)"
                                                variant="flat"
                                              >
                                                {{ getColumnValue(item, field) }}
                                              </v-chip>
                                            </span>
                                          </template>
                                          <div class="decision-tooltip">{{ tooltipText(item, field) }}</div>
                                        </v-tooltip>
                                        <v-chip
                                          v-else
                                          size="small"
                                          :color="benchmarkStatusChipColor(item)"
                                          variant="flat"
                                        >
                                          {{ getColumnValue(item, field) }}
                                        </v-chip>
                                      </template>
                                      <template v-else-if="isBooleanChipColumn(field)">
                                        <v-tooltip
                                          v-if="hasDecisionTooltip(field)"
                                          location="top"
                                          max-width="420"
                                        >
                                          <template #activator="{ props }">
                                            <span v-bind="props" class="tooltip-activator">
                                              <v-chip
                                                size="small"
                                                :color="chipColorForBooleanLabel(getColumnValue(item, field))"
                                                :variant="chipVariantForBooleanLabel(getColumnValue(item, field))"
                                              >
                                                {{ getColumnValue(item, field) }}
                                              </v-chip>
                                            </span>
                                          </template>
                                          <div class="decision-tooltip">{{ tooltipText(item, field) }}</div>
                                        </v-tooltip>
                                        <v-chip
                                          v-else
                                          size="small"
                                          :color="chipColorForBooleanLabel(getColumnValue(item, field))"
                                          :variant="chipVariantForBooleanLabel(getColumnValue(item, field))"
                                        >
                                          {{ getColumnValue(item, field) }}
                                        </v-chip>
                                      </template>
                                      <template v-else-if="isScientificConfidenceColumn(field)">
                                        <v-tooltip
                                          v-if="hasDecisionTooltip(field)"
                                          location="top"
                                          max-width="420"
                                        >
                                          <template #activator="{ props }">
                                            <span v-bind="props" class="tooltip-activator">
                                              <v-chip
                                                size="small"
                                                :color="scientificConfidenceChipColor(item)"
                                                variant="flat"
                                              >
                                                {{ getColumnValue(item, field) }}
                                              </v-chip>
                                            </span>
                                          </template>
                                          <div class="decision-tooltip">{{ tooltipText(item, field) }}</div>
                                        </v-tooltip>
                                        <v-chip
                                          v-else
                                          size="small"
                                          :color="scientificConfidenceChipColor(item)"
                                          variant="flat"
                                        >
                                          {{ getColumnValue(item, field) }}
                                        </v-chip>
                                      </template>
                                      <template v-else>
                                        {{ getColumnValue(item, field) }}
                                      </template>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="detail-section">
                                <div class="detail-section__title">Pipeline Comparison</div>
                                <div class="comparison-table-wrapper">
                                  <table class="comparison-table">
                                    <thead>
                                      <tr>
                                        <th>Layer</th>
                                        <th>Source</th>
                                        <th>Group</th>
                                        <th>TM Count</th>
                                        <th>Segments</th>
                                        <th>Notes</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr
                                        v-for="row in item._pipelineComparisonRows"
                                        :key="`${row.layer}-${row.source}-${row.method}`"
                                      >
                                        <td>{{ row.layer }}</td>
                                        <td>{{ row.source }}</td>
                                        <td>{{ row.groupLabel || '—' }}</td>
                                        <td>{{ row.tmCount }}</td>
                                        <td>{{ row.segmentSummary }}</td>
                                        <td>{{ row.notes }}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                    <div class="queue-footer">
                      <div class="queue-page-size">
                        <label for="discrepancy-page-size" class="form-label mb-1">Rows per page</label>
                        <select id="discrepancy-page-size" v-model.number="perPage" class="form-select form-select-sm">
                          <option :value="10">10</option>
                          <option :value="25">25</option>
                          <option :value="50">50</option>
                          <option :value="100">100</option>
                        </select>
                      </div>
                      <v-pagination
                        v-model="page"
                        :length="queuePagination.total_pages"
                        :total-visible="7"
                      />
                    </div>
                  </v-card>
                </div>

                <v-dialog v-model="decisionNotesDialog" max-width="760">
                  <v-card>
                    <v-card-title class="text-h6">
                      Decision Notes
                      <span v-if="activeDecisionPdb" class="decision-note-code">
                        {{ activeDecisionPdb }}
                      </span>
                    </v-card-title>
                    <v-card-text>
                      <div class="decision-note-full">
                        {{ activeDecisionNotes }}
                      </div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <button class="btn btn-primary btn-sm" @click="decisionNotesDialog = false">
                        Close
                      </button>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
canvas#display-canvas {
  top: inherit !important;
  left: inherit !important;
}
.bg-red.lighten-4 {
  background-color: #ffcdd2 !important;
}
.red-column {
  background-color: #fee;
  color: #900;
}
/* .highlight-row {
  background-color: rgba(255, 193, 7, 0.1);
} */
.queue-row {
  cursor: pointer;
}
.download-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.queue-toolbar {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 1rem 1rem;
  flex-wrap: wrap;
}
.queue-search {
  min-width: 320px;
  flex: 1 1 420px;
}
.queue-meta {
  color: #516072;
  font-size: 0.92rem;
}
.discrepancy-figure-shell {
  padding: 0 1.5rem 1.5rem;
}
.discrepancy-figure-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.9rem;
}
.discrepancy-figure-meta__title {
  font-size: 1rem;
  font-weight: 700;
  color: #213547;
}
.discrepancy-figure-meta__text {
  font-size: 0.92rem;
  color: #5f7080;
  max-width: 720px;
}
.discrepancy-chart-frame {
  padding: 1.25rem 1.25rem 0.75rem;
  border: 1px solid rgba(15, 76, 129, 0.08);
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  box-shadow: 0 10px 30px rgba(15, 76, 129, 0.04);
}
.queue-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  flex-wrap: wrap;
}
.queue-page-size {
  width: 140px;
}
.benchmark-summary {
  font-size: 0.95rem;
}
.benchmark-coverage {
  color: #6c757d;
}
.details-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #0f4c81;
  font-weight: 600;
}
.detail-row {
  background: rgba(15, 76, 129, 0.03);
}
.detail-cell {
  padding: 0 !important;
}
.detail-layout {
  padding: 1rem 1.25rem 1.25rem;
}
.detail-section {
  margin-bottom: 1rem;
}
.detail-section__title {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #516072;
  margin-bottom: 0.45rem;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.85rem;
}
.detail-card {
  padding: 0.8rem 0.9rem;
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgba(15, 76, 129, 0.08);
}
.detail-card__label {
  font-size: 0.8rem;
  color: #6b7a8a;
  margin-bottom: 0.35rem;
}
.detail-card__value {
  color: #213547;
  font-weight: 500;
  word-break: break-word;
}
.tooltip-activator {
  display: inline-flex;
}
.decision-tooltip {
  white-space: normal;
  line-height: 1.45;
  font-size: 0.92rem;
}
.decision-note-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.decision-note-preview {
  color: #516072;
  display: inline-block;
  max-width: 100%;
}
.decision-note-button {
  padding: 0;
  white-space: nowrap;
}
.decision-note-full {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #314154;
}
.comparison-table-wrapper {
  overflow-x: auto;
  border: 1px solid rgba(15, 76, 129, 0.1);
  border-radius: 16px;
  background: #fff;
}
.comparison-table {
  width: 100%;
  min-width: 960px;
  border-collapse: collapse;
}
.comparison-table th,
.comparison-table td {
  padding: 0.85rem 0.9rem;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid rgba(15, 76, 129, 0.08);
}
.comparison-table thead th {
  background: #f4f8fc;
  color: #4f6378;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.decision-note-code {
  margin-left: 0.5rem;
  color: #6c757d;
  font-size: 0.95rem;
  font-weight: 500;
}
</style>
