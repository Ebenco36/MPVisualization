<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { debounce } from 'lodash'
import Swal from 'sweetalert2'
import { useCasesStore } from '@/stores/use_cases'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import StructureExpertNotesDialog from '@/components/useCases/StructureExpertNotesDialog.vue'
import DiscrepancyReviewDialog from '@/components/useCases/DiscrepancyReviewDialog.vue'
import StructureNotesRealtimeService from '@/services/structure_notes_realtime.service'
import {
  buildDiscrepancyRow,
  discrepancyDecisionFields,
  downloadExportResponse,
  extendedPredictorCountColumns,
  getColumnValue,
  getDecisionTooltip,
  hasDecisionTooltip
} from '@/utils/discrepancyQueue'

const casesStore = useCasesStore()
const search = ref('')
const loading = ref(false)
const exportingFormat = ref(null)
const rows = ref([])
const page = ref(1)
const perPage = ref(10)
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
  { title: 'Details', value: 'details', sortable: false }
]

const detailFields = discrepancyDecisionFields

const discrepancySummary = computed(() => casesStore.discrepancy_review_summary.data || {})
const queuePagination = computed(() => casesStore.discrepancy_review_queue.pagination || {
  page: 1,
  per_page: 10,
  total_items: 0,
  total_pages: 1,
  returned_items: 0,
  has_prev: false,
  has_next: false
})

const summaryCards = computed(() => {
  const summary = discrepancySummary.value
  const disagreements = summary.disagreement_counts || {}
  const benchmark = summary.benchmark_counts || {}
  return [
    { label: 'Discrepancy Candidates', value: summary.row_count ?? 0, tone: 'neutral' },
    { label: 'Benchmark Included', value: benchmark.included ?? 0, tone: 'success' },
    { label: 'High-confidence Subset', value: benchmark.high_confidence ?? 0, tone: 'success' },
    { label: 'Group Disagreements', value: disagreements.group ?? 0, tone: 'warning' },
    { label: 'TM Count Disagreements', value: disagreements.tm_count ?? 0, tone: 'warning' },
    { label: 'TM Boundary Disagreements', value: disagreements.tm_boundary ?? 0, tone: 'warning' }
  ]
})

const scientificFlagSummary = computed(() => {
  const counts = discrepancySummary.value.scientific_flag_counts || {}
  const labels = {
    benchmark_not_recommended: 'Benchmark not recommended',
    context_dependent_topology: 'Context-dependent topology',
    non_canonical_membrane_case: 'Non-canonical membrane case',
    multichain_context: 'Multichain context',
    obsolete_or_replaced: 'Obsolete or replaced'
  }

  return Object.entries(labels)
    .map(([key, label]) => ({ label, count: counts[key] || 0 }))
    .filter((item) => item.count > 0)
})

async function fetchQueue() {
  loading.value = true
  try {
    const payload = await casesStore.loadDiscrepancyReviewQueue({
      disagreement_only: false,
      search: search.value || undefined,
      page: page.value,
      per_page: perPage.value
    })

    rows.value = (payload?.items || []).map((candidate) =>
      buildDiscrepancyRow(candidate, extendedPredictorCountColumns)
    )
    resubscribeStructureNotesRealtime()
  } catch (error) {
    console.error('Discrepancy queue fetch failed:', error)
  } finally {
    loading.value = false
  }
}

async function fetchSummary() {
  try {
    await casesStore.loadDiscrepancyReviewSummary({
      disagreement_only: false,
      search: search.value || undefined
    })
  } catch (error) {
    console.error('Discrepancy summary fetch failed:', error)
  }
}

async function loadInitialData() {
  await Promise.all([fetchQueue(), fetchSummary()])
  if (queuePagination.value.total_items === 0) {
    Swal.fire({
      title: 'No Data',
      text: 'No discrepancy-review records found for the current search.',
      icon: 'info',
      confirmButtonText: 'OK'
    })
  }
}

async function exportQueue(format) {
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

const debouncedSearch = debounce(async () => {
  page.value = 1
  await Promise.all([fetchQueue(), fetchSummary()])
}, 300)

watch(page, async () => {
  await fetchQueue()
})

watch(perPage, async () => {
  page.value = 1
  await fetchQueue()
})

watch(search, () => {
  debouncedSearch()
})

onMounted(() => {
  loadInitialData()
})

onBeforeUnmount(() => {
  debouncedSearch.cancel()
  if (typeof stopStructureNotesRealtime === 'function') {
    stopStructureNotesRealtime()
    stopStructureNotesRealtime = null
  }
})

function isBenchmarkStatusColumn(column) {
  return column?.key === 'benchmark_status' || column?.value === 'benchmark_status'
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

function tooltipText(item, column) {
  return getDecisionTooltip(item, column)
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


function normalizePdbCode(value) {
  const text = String(value || '').trim().toUpperCase()
  return text || null
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
</script>

<template>
  <div class="main-content">
    <HeaderCrumbs
      label="AI-assisted discrepancy review and topology benchmarking"
      title=""
    />

    <div class="row mb-4 g-3">
      <div v-for="card in summaryCards" :key="card.label" class="col-md-6 col-xl-2">
        <div class="summary-card" :class="`summary-card--${card.tone}`">
          <div class="summary-card__label">{{ card.label }}</div>
          <div class="summary-card__value">{{ card.value }}</div>
        </div>
      </div>
    </div>

    <!-- <div v-if="scientificFlagSummary.length" class="row mb-4 g-3">
      <div class="col-lg-4 ms-lg-auto">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title mb-3">Scientific flags present in this queue</h5>
            <div v-if="scientificFlagSummary.length" class="flag-summary-list">
              <div v-for="item in scientificFlagSummary" :key="item.label" class="flag-summary-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.count }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <div class="card mb-4">
      <div class="card-body p-0">
        <v-card>
          <v-card-title>Discrepancy Review Queue</v-card-title>
          <div class="px-4 pb-2 text-muted text-sm">
            Rows are highlighted when MetaMP has detected benchmark caveats or when the record is excluded from the benchmark subset.
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
            <div class="queue-actions">
              <button class="btn btn-outline-primary btn-sm" :disabled="!!exportingFormat" @click="exportQueue('json')">
                JSON
              </button>
              <button class="btn btn-outline-primary btn-sm" :disabled="!!exportingFormat" @click="exportQueue('csv')">
                CSV
              </button>
              <button class="btn btn-outline-primary btn-sm" :disabled="!!exportingFormat" @click="exportQueue('xlsx')">
                Excel
              </button>
              <button class="btn btn-outline-primary btn-sm" :disabled="!!exportingFormat" @click="exportQueue('tsv')">
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
                No discrepancy-review records found.
              </v-alert>
            </template>
            <template #item="{ item, columns }">
              <tr
                :class="{ 'highlight-row': item._highlight }"
                class="queue-row"
                @click="toggleExpanded(item)"
              >
                <td v-for="col in columns" :key="col.key">
                  <template v-if="isBenchmarkStatusColumn(col)">
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
                  <template v-else-if="isBooleanChipColumn(col)">
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
                      source-context="ai_discrepancy_queue"
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
                  <template v-else-if="col.key === 'details'">
                    <div class="details-toggle">
                      <span>{{ isExpanded(item) ? 'Hide' : 'View' }}</span>
                      <v-icon size="18">
                        {{ isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                      </v-icon>
                    </div>
                  </template>
                  <template v-else>
                    {{ getColumnValue(item, col) }}
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
                          source-context="ai_discrepancy_queue_expanded"
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
                            <template v-if="isBenchmarkStatusColumn(field)">
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
              <label for="ai-queue-page-size" class="form-label mb-1">Rows per page</label>
              <select id="ai-queue-page-size" v-model.number="perPage" class="form-select form-select-sm">
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
</template>

<style scoped>
.summary-card {
  border-radius: 18px;
  padding: 1rem;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(145deg, #ffffff, #eef4ff);
  border: 1px solid rgba(15, 76, 129, 0.12);
  box-shadow: 0 12px 30px rgba(15, 76, 129, 0.08);
}

.summary-card--warning {
  background: linear-gradient(145deg, #fff8ec, #ffe8c2);
}

.summary-card--success {
  background: linear-gradient(145deg, #f2fbf3, #dcf5dd);
}

.summary-card__label {
  color: #516072;
  font-size: 0.92rem;
}

.summary-card__value {
  color: #0f4c81;
  font-size: 1.9rem;
  font-weight: 700;
}

.flag-summary-list {
  display: grid;
  gap: 0.6rem;
}

.flag-summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.45rem;
  border-bottom: 1px solid rgba(15, 76, 129, 0.08);
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

.queue-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.queue-meta {
  color: #516072;
  font-size: 0.92rem;
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

.decision-note-cell,
.decision-note-inline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
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

.decision-note-code {
  margin-left: 0.5rem;
  color: #6c757d;
  font-size: 0.95rem;
  font-weight: 500;
}

.tooltip-activator {
  display: inline-flex;
}

.decision-tooltip {
  white-space: normal;
  line-height: 1.45;
  font-size: 0.92rem;
}

/* .highlight-row {
  background-color: rgba(255, 193, 7, 0.12);
} */

.text-sm {
  font-size: 0.92rem;
}

.queue-row {
  cursor: pointer;
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
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.detail-section {
  display: grid;
  gap: 0.75rem;
}

.detail-section__title {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4f6378;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.85rem;
}

.detail-card {
  border: 1px solid rgba(15, 76, 129, 0.12);
  border-radius: 16px;
  background: #fff;
  padding: 0.9rem 1rem;
  min-height: 108px;
}

.detail-card__label {
  color: #6b7d91;
  font-size: 0.85rem;
  margin-bottom: 0.55rem;
}

.detail-card__value {
  color: #314154;
  font-weight: 500;
}

.comparison-table-wrapper {
  overflow-x: auto;
  border: 1px solid rgba(15, 76, 129, 0.1);
  border-radius: 16px;
  background: #fff;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 960px;
}

.comparison-table th,
.comparison-table td {
  padding: 0.85rem 0.9rem;
  border-bottom: 1px solid rgba(15, 76, 129, 0.08);
  text-align: left;
  vertical-align: top;
}

.comparison-table thead th {
  background: #f4f8fc;
  color: #4f6378;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
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
</style>
