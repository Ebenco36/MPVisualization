<template>
  <div class="container-fluid">
    <HeaderCrumbs
      :label="'Single view for ' + searchType.toUpperCase() + ' with accession code: ' + searchQuery"
      title=""
    />
    <div class="row viewer-row">
      <!-- Options Panel -->
      <div class="col-lg-2 col-md-2 col-12 mb-0 p-1 d-flex">
        <aside class="options-panel border rounded p-3 shadow-sm">
          <h3 class="text-primary mb-3">Viewer Options</h3>

          <!-- Search Section -->
          <fieldset class="mb-4">
            <!-- {{ opts.customData.url }} -->
            <!-- <legend class="text-secondary">Search Model</legend> -->
            <div class="mb-3">
              <label class="form-label">Search Type:</label>
              <select v-model="searchType" class="form-select form-control">
                <option value="pdb">PDB</option>
                <!-- <option value="opm">OPM</option>
                <option value="swissmodel">Swiss Model</option>
                <option value="uniprot">UniProt</option>
                <option value="alphafold">Alphafold</option> -->
              </select>
            </div>
            <div>
              <label class="form-label">Search Query:</label>
              <input
                v-model="searchQuery"
                class="form-control"
                :placeholder="
                  searchType === 'cif'
                    ? 'Enter .cif file name (e.g., AF-O15552-F1-model_v1.cif)'
                    : 'Enter ID (e.g., 1CBS, P12345)'
                "
              />
            </div>
          </fieldset>

          <!-- Additional Options -->
          <div class="form-check mb-3">
            <input
              type="checkbox"
              v-model="opts.alphafoldView"
              class="form-check-input"
              id="alphafoldView"
            />
            <label for="alphafoldView" class="form-check-label">Alphafold-style View</label>
          </div>

          <fieldset class="mb-4">
            <legend class="text-info small" style="font-size: 12pt !important">
              Background Color
            </legend>
            <div class="row g-2">
              <div class="col-12">
                <label class="form-label">R:</label>
                <input
                  type="number"
                  v-model.number="opts.bgColor.r"
                  min="0"
                  max="255"
                  class="form-control"
                />
              </div>
              <div class="col-12">
                <label class="form-label">G:</label>
                <input
                  type="number"
                  v-model.number="opts.bgColor.g"
                  min="0"
                  max="255"
                  class="form-control"
                />
              </div>
              <div class="col-12">
                <label class="form-label">B:</label>
                <input
                  type="number"
                  v-model.number="opts.bgColor.b"
                  min="0"
                  max="255"
                  class="form-control"
                />
              </div>
            </div>
          </fieldset>

          <!-- <fieldset class="mb-4">
                <legend class="text-secondary">Hide Canvas Controls</legend>
                <div v-for="control in availableControls" :key="control" class="form-check">
                  <input type="checkbox" :value="control" v-model="opts.hideCanvasControls" class="form-check-input" />
                  <label class="form-check-label">{{ control }}</label>
                </div>
              </fieldset> -->
          
          <div class="form-check mb-3">
            <input
              type="checkbox"
              v-model="opts.membraneOrientation"
              class="form-check-input"
              id="membraneOrientation"
            />
            <label for="membraneOrientation" class="form-check-label">
              Show Membrane Orientation
            </label>
          </div>

          <div class="form-check mb-3">
            <input
              type="checkbox"
              v-model="opts.sequencePanel"
              class="form-check-input"
              id="sequencePanel"
            />
            <label for="sequencePanel" class="form-check-label">Show Sequence Panel</label>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              v-model="opts.landscape"
              class="form-check-input"
              id="landscapeMode"
            />
            <label for="landscapeMode" class="form-check-label">Landscape Mode</label>
          </div>
        </aside>
      </div>

      <!-- Viewer Container -->
      <!-- <StructureViewer :pdb-id="searchQuery" /> -->
      <div class="col-lg-10 col-md-10 col-12 p-1">
        <div class="viewer-shell">
          <div v-if="viewerLoading" class="viewer-loading-overlay">
            <div class="viewer-spinner"></div>
            <p class="viewer-loading-text">Loading 3D protein structure...</p>
          </div>
          <!-- <div ref="viewerContainer" class="molstar-container border rounded shadow-sm"></div> -->
           <StructureViewer :pdb-id="searchQuery" class="molstar-container border rounded shadow-sm"/>
        </div>
        <div v-if="viewerError" class="alert alert-warning mt-3 mb-0" role="alert">
          {{ viewerError }}
        </div>
      </div>
    </div>
    <div class="row details-row">
      <div class="col-12 p-1">
        <div class="details-layout">
          <div class="details-main-column">
            <section class="details-card details-hero">
              <div class="details-hero__header">
                <div>
                  <p class="section-eyebrow">Structure record</p>
                  <h2 class="details-title">{{ displayTitle }}</h2>
                  <p v-if="displaySubtitle" class="details-subtitle">{{ displaySubtitle }}</p>
                </div>
                <div class="details-hero__links">
                  <span class="pill-badge">{{ searchType.toUpperCase() }} {{ searchQuery.toUpperCase() }}</span>
                  <a
                    v-if="details?.uniprot_id"
                    :href="'https://www.uniprot.org/uniprotkb/' + details?.uniprot_id + '/entry'"
                    class="pill-link"
                    target="_blank"
                    rel="noopener"
                  >
                    UniProt {{ details.uniprot_id }}
                  </a>
                </div>
              </div>
              <div v-if="heroChips.length" class="chip-list">
                <span v-for="chip in heroChips" :key="chip" class="meta-chip">{{ chip }}</span>
              </div>
              <div v-if="overviewRows.length" class="overview-grid">
                <div v-for="item in overviewRows" :key="item.label" class="overview-item">
                  <span class="overview-label">{{ item.label }}</span>
                  <span class="overview-value">{{ item.value }}</span>
                </div>
              </div>
            </section>

            <section v-if="coreTaxonomyRows.length || taxonomyTree.length" class="details-card">
              <div class="section-header">
                <div>
                  <p class="section-eyebrow">Biology</p>
                  <h3 class="section-title">Taxonomy</h3>
                </div>
              </div>
              <div v-if="coreTaxonomyRows.length" class="definition-grid">
                <div v-for="item in coreTaxonomyRows" :key="item.label" class="definition-item">
                  <span class="definition-label">{{ item.label }}</span>
                  <span class="definition-value">{{ item.value }}</span>
                </div>
              </div>
              <div v-if="taxonomyTree.length" class="taxonomy-tree">
                <v-treeview
                  :items="taxonomyTree"
                  item-title="label"
                  item-children="children"
                  open-all
                  density="comfortable"
                  max-width="1200"
                />
              </div>
            </section>

            <section v-if="sequenceInfoRows.length || hasMeaningfulValue(details?.sequence_sequence)" class="details-card">
              <div class="section-header">
                <div>
                  <p class="section-eyebrow">Sequence</p>
                  <h3 class="section-title">Protein Sequence</h3>
                </div>
              </div>
              <div v-if="sequenceInfoRows.length" class="definition-grid">
                <div v-for="item in sequenceInfoRows" :key="item.label" class="definition-item">
                  <span class="definition-label">{{ item.label }}</span>
                  <span class="definition-value">{{ item.value }}</span>
                </div>
              </div>
              <div v-if="hasMeaningfulValue(details?.sequence_sequence)" class="sequence-block">
                <div class="definition-label">Sequence</div>
                <ExpandableText :text="details?.sequence_sequence || ''" :limit="500" mode="chars" />
              </div>
            </section>

            <section v-if="tmBoundaryPlotTracks.length" class="details-card">
              <div class="section-header">
                <div>
                  <p class="section-eyebrow">Topology</p>
                  <h3 class="section-title">TM Segment Comparison Tracks</h3>
                </div>
              </div>
              <p class="details-subtitle">
                OPM reference segments and all available normalized predictor outputs are aligned on the same residue axis for direct visual comparison.
              </p>
              <TopologyTrackPlot
                :tracks="tmBoundaryPlotTracks"
                :sequence-length="tmBoundarySequenceLength"
                title="Reference and predictor topology tracks"
              />
            </section>

            <section v-if="functionalRows.length" class="details-card">
              <div class="section-header">
                <div>
                  <p class="section-eyebrow">Function</p>
                  <h3 class="section-title">Biological Context</h3>
                </div>
              </div>
              <div class="function-list">
                <div v-for="item in functionalRows" :key="item.label" class="function-item">
                  <div class="definition-label">{{ item.label }}</div>
                  <ExpandableText :text="item.value" :limit="140" />
                </div>
              </div>
            </section>
          </div>

          <aside class="details-side-column">
            <section v-if="tmPredictionSummary.available" class="details-card details-card--emphasis">
              <div class="section-header">
                <div>
                  <p class="section-eyebrow">Topology</p>
                  <h3 class="section-title">Preferred Membrane Call</h3>
                </div>
              </div>
              <div class="tm-summary-lead">
                <div class="tm-summary-count">
                  {{ tmPredictionSummary.preferred_tm_count ?? '—' }}
                </div>
                <div class="tm-summary-body">
                  <div class="tm-summary-title">
                    {{
                      tmPredictionSummary.preferred_compact_label
                      || tmPredictionSummary.preferred_topology_label
                      || 'Normalized topology summary available'
                    }}
                  </div>
                  <div v-if="preferredDerivedTopology.chain_summary" class="tm-summary-description">
                    {{ preferredDerivedTopology.chain_summary }}
                  </div>
                </div>
              </div>
              <div v-if="tmSummaryHighlights.length" class="definition-grid tm-summary-grid">
                <div v-for="item in tmSummaryHighlights" :key="item.label" class="definition-item">
                  <span class="definition-label">{{ item.label }}</span>
                  <span class="definition-value">{{ item.value }}</span>
                </div>
              </div>
              <div v-if="tmSummaryFlags.length" class="warning-chip-list mt-3">
                <span v-for="flag in tmSummaryFlags" :key="flag" class="meta-chip meta-chip--warning">
                  {{ flag }}
                </span>
              </div>
              <div v-if="topologyTrackItems.length" class="topology-track">
                <div
                  v-for="(item, index) in topologyTrackItems"
                  :key="`${item.label}-${index}`"
                  class="topology-track__item"
                  :class="`topology-track__item--${item.kind}`"
                >
                  <div class="topology-track__label">{{ item.label }}</div>
                  <div class="topology-track__range">{{ item.range }}</div>
                </div>
              </div>
              <div v-if="tmSupportingMethodChips.length" class="chip-list mt-3">
                <span v-for="chip in tmSupportingMethodChips" :key="chip" class="meta-chip">
                  {{ chip }}
                </span>
              </div>
              <div v-if="tmInterpretationNotes.length" class="stacked-definition-list mt-3">
                <div
                  v-for="(note, index) in tmInterpretationNotes"
                  :key="`${note}-${index}`"
                  class="stacked-definition"
                >
                  <span class="stacked-definition__value">{{ note }}</span>
                </div>
              </div>
            </section>

            <section
              v-if="groupComparisonRows.length || tmSegmentComparisonRows.length"
              class="details-card"
            >
              <div class="section-header">
                <div>
                  <p class="section-eyebrow">Comparison</p>
                  <h3 class="section-title">Groups & TM Segments</h3>
                </div>
              </div>
              <div v-if="groupComparisonRows.length" class="subsection-block subsection-block--flush">
                <div class="definition-label">Broad Group Assignment</div>
                <div class="table-responsive mt-2">
                  <table class="table table-sm comparison-table mb-0">
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Group</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in groupComparisonRows" :key="item.source">
                        <td>{{ item.source }}</td>
                        <td>{{ item.value }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-if="tmSegmentComparisonRows.length" class="subsection-block">
                <div class="definition-label">TM Segment Counts</div>
                <div class="table-responsive mt-2">
                  <table class="table table-sm comparison-table mb-0">
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Segments</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in tmSegmentComparisonRows" :key="item.source">
                        <td>{{ item.source }}</td>
                        <td>{{ item.value }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-if="tmSegmentNote" class="comparison-note">
                  {{ tmSegmentNote }}
                </div>
              </div>
            </section>

            <section class="details-card">
              <div class="section-header">
                <div>
                  <p class="section-eyebrow">Assessment</p>
                  <h3 class="section-title">Interpretation Notes</h3>
                </div>
              </div>
              <div class="assessment-summary" :class="{ 'assessment-summary--caution': scientificAssessmentHighlight.isCaution }">
                {{ scientificAssessmentHighlight.message }}
              </div>
              <div v-if="benchmarkContext.cautionary_note" class="soft-alert mt-3">
                {{ benchmarkContext.cautionary_note }}
              </div>
              <div v-if="benchmarkContextRowsDisplay.length" class="stacked-definition-list mt-3">
                <div v-for="item in benchmarkContextRowsDisplay" :key="item.label" class="stacked-definition">
                  <span class="stacked-definition__label">{{ item.label }}</span>
                  <span class="stacked-definition__value">{{ item.value }}</span>
                </div>
              </div>
              <div v-if="scientificAssessmentRowsDisplay.length" class="stacked-definition-list mt-3">
                <div v-for="item in scientificAssessmentRowsDisplay" :key="item.label" class="stacked-definition">
                  <span class="stacked-definition__label">{{ item.label }}</span>
                  <span class="stacked-definition__value">{{ item.value }}</span>
                </div>
              </div>
            </section>

            <section v-if="structureWarnings.length || structureContextRowsDisplay.length || externalLinks.length" class="details-card">
              <div class="section-header">
                <div>
                  <p class="section-eyebrow">Structure</p>
                  <h3 class="section-title">Context & Links</h3>
                </div>
              </div>
              <div v-if="structureWarnings.length" class="warning-chip-list mb-3">
                <span v-for="warning in structureWarnings" :key="warning" class="meta-chip meta-chip--warning">
                  {{ warning }}
                </span>
              </div>
              <div v-if="structureContextRowsDisplay.length" class="stacked-definition-list">
                <div v-for="item in structureContextRowsDisplay" :key="item.label" class="stacked-definition">
                  <span class="stacked-definition__label">{{ item.label }}</span>
                  <span class="stacked-definition__value">{{ item.value }}</span>
                </div>
              </div>
              <div class="external-links" v-if="externalLinks.length > 0">
                <div class="definition-label">External Links</div>
                <div class="link-list">
                  <a
                    v-for="link in externalLinks"
                    :key="link.label"
                    :href="link.href"
                    target="_blank"
                    rel="noopener"
                    class="pill-link"
                  >
                    {{ link.label }}
                  </a>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import ExpandableText from '@/components/ExpandableText.vue'
import TopologyTrackPlot from '@/components/TopologyTrackPlot.vue'
import { loadPdbeMolstar } from '@/utils/heavyLoaders'
import StructureViewer from '@/components/StructureViewer.vue'
import { useDashboardStore } from '@/stores/dashboard'
// import TaxonomyFlow from '@/components/TaxonomyFlow2.vue'
import { VTreeview } from 'vuetify/labs/VTreeview'
import { explanations } from '@/utils/explanations'

function buildTaxonomyPath(path) {
  if (!Array.isArray(path) || path.length === 0) return []

  const [head, ...tail] = path
  return [
    {
      label: head,
      ...(tail.length ? { children: buildTaxonomyPath(tail) } : {})
    }
  ]
}

const taxonomy = [
  {
    label: 'Animalia',
    children: [
      {
        label: 'Chordata',
        children: [
          {
            label: 'Mammalia',
            children: [
              {
                label: 'Eutheria',
                children: [
                  {
                    label: 'Primates',
                    children: [
                      {
                        label: 'Hominidae',
                        children: [
                          {
                            label: 'Homo',
                            children: [{ label: 'sapiens' }]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    label: 'Carnivora',
                    children: [
                      {
                        label: 'Felidae',
                        children: [
                          {
                            label: 'Panthera',
                            children: [{ label: 'leo' }]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

const dashboardStore = useDashboardStore()
const details = ref(null)
const record = ref(null)
const error = ref(null)
const viewerError = ref('')
const viewerLoading = ref(true)

const viewerContainer = ref(null)
let viewerInstance = null

const opts = reactive({
  customData: {
    url: '',
    format: 'cif'
  },
  alphafoldView: false,
  bgColor: { r: 255, g: 255, b: 255 },
  hideControls: false,
  sequencePanel: true,
  landscape: true,
  loadingOverlay: true,
  selection: false,
  selectInteraction: false,
  symmetryAnnotation: true,
  domainAnnotation: true,
  validationAnnotation: true,
  membraneOrientation: false,
  plugins: []
})

const searchType = ref('pdb')
const searchQuery = ref('')
const mountedReady = ref(false)
const syncingDetailsPage = ref(false)

function getExplanation(featureName) {
  return explanations[featureName] || 'No explanation available.'
}

function parseTaxonomy(input = '') {
  return input
    ?.split(/[,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getDefaultParsedValue(raw) {
  return typeof raw === 'string' && raw.trim().startsWith('[') ? [] : {}
}

function normalizePseudoJson(input) {
  return input
    .replace(/\bNaN\b/g, 'null')
    .replace(/\bNone\b/g, 'null')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, value) =>
      JSON.stringify(value.replace(/\\'/g, "'").replace(/\\"/g, '"'))
    )
}

function parseRawData(raw) {
  if (raw == null) {
    return {}
  }

  if (Array.isArray(raw) || typeof raw === 'object') {
    return raw
  }

  if (typeof raw !== 'string') {
    return {}
  }

  const trimmed = raw.trim()

  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') {
    return getDefaultParsedValue(trimmed)
  }

  if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
    return trimmed
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    try {
      return JSON.parse(normalizePseudoJson(trimmed))
    } catch (parseError) {
      console.error('parseRawData: JSON.parse failed:', parseError, '\ninput was:', trimmed)
      return getDefaultParsedValue(trimmed)
    }
  }
}

function capitalize(s) {
  return s && String(s[0]).toUpperCase() + String(s).slice(1)
}

function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

function humanizeKey(value = '') {
  return value
    .replace(/^comment_/, '')
    .split('_')
    .filter(Boolean)
    .map((segment) => capitalize(segment))
    .join(' ')
}

function countBy(items, keyGetter) {
  return ensureArray(items).reduce((accumulator, item) => {
    const key = keyGetter(item)
    if (!key) return accumulator
    accumulator[key] = (accumulator[key] || 0) + 1
    return accumulator
  }, {})
}

function hasMeaningfulValue(value) {
  if (value == null || value === '' || value === 'null' || value === 'undefined') {
    return false
  }

  if (typeof value === 'number' && Number.isNaN(value)) {
    return false
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0
  }

  return true
}

function getFirstMeaningfulValue(candidates = []) {
  return candidates.find((candidate) => hasMeaningfulValue(candidate)) ?? null
}

function formatValue(value, suffix = '') {
  if (!hasMeaningfulValue(value)) {
    return null
  }

  return suffix ? `${value}${suffix}` : String(value)
}

function shouldDisplayRowValue(value) {
  return hasMeaningfulValue(value) && value !== 'Not Specified'
}

function filterDisplayRows(rows = []) {
  return rows.filter((row) => shouldDisplayRowValue(row?.value))
}

const parsedFeatures = computed(() => ensureArray(parseRawData(details.value?.features)))

const featureCounts = computed(() => countBy(parsedFeatures.value, (feature) => feature?.type))

const commentCounts = computed(() => {
  const source = details.value || {}

  return Object.entries(source).reduce((accumulator, [key, value]) => {
    if (!key.startsWith('comment_')) {
      return accumulator
    }

    const parsedValue = parseRawData(value)

    if (Array.isArray(parsedValue) && parsedValue.length > 0) {
      accumulator[humanizeKey(key)] = parsedValue.length
      return accumulator
    }

    if (!Array.isArray(parsedValue) && hasMeaningfulValue(parsedValue)) {
      accumulator[humanizeKey(key)] = 1
    }

    return accumulator
  }, {})
})

const transmembraneFeatureCount = computed(() => {
  const entry = Object.entries(featureCounts.value).find(([label]) =>
    label?.toLowerCase().includes('transmembrane')
  )

  return entry ? entry[1] : null
})

const displayTitle = computed(() => {
  return getFirstMeaningfulValue([
    details.value?.protein_recommended_name,
    details.value?.protein_alternative_name,
    searchQuery.value?.toUpperCase()
  ]) || 'Protein record'
})

const displaySubtitle = computed(() => {
  return getFirstMeaningfulValue([
    details.value?.protein_alternative_name,
    details.value?.description
  ])
})

const overviewRows = computed(() => filterDisplayRows([
  {
    label: 'Associated Genes',
    value: details.value?.associated_genes
  },
  {
    label: 'Organism',
    value: details.value?.species
  },
  {
    label: 'Taxonomic Domain',
    value: details.value?.taxonomic_domain
  },
  {
    label: 'Polymer Composition',
    value: getFirstMeaningfulValue([
      structureContext.value?.polymer_composition,
      details.value?.rcsentinfo_polymer_composition
    ])
  }
]))

const heroChips = computed(() => {
  const chips = [
    lineage.value?.resolved_group_label,
    mappedGroupName.value,
    details.value?.family_name,
    details.value?.family_superfamily_name,
    tmPredictionSummary.value?.preferred_compact_label,
    tmPredictionSummary.value?.method_count
      ? `${tmPredictionSummary.value.method_count} TM methods available`
      : null,
    confidence.value?.annotation_score_band
      ? `${confidence.value.annotation_score_band} annotation confidence`
      : null,
    recordResolution.value?.selected_tm_count != null && recordResolution.value?.selected_tm_source
      ? `${recordResolution.value.selected_tm_count} TM segments via ${recordResolution.value.selected_tm_source}`
      : null
  ]

  return [...new Set(chips.filter((chip) => shouldDisplayRowValue(chip)))]
})

const taxonomyTree = computed(() => buildTaxonomyPath(parseTaxonomy(details.value?.organism_lineage)))

const coreTaxonomyRows = computed(() => filterDisplayRows([
  { label: 'Super Kingdom', value: details.value?.taxonomic_domain },
  { label: 'Superfamily', value: details.value?.family_superfamily_name },
  { label: 'Family', value: details.value?.family_name },
  { label: 'Sub-group', value: details.value?.subgroup },
  { label: 'Species', value: details.value?.species }
]))

const sequenceInfoRows = computed(() => {
  const mass = details.value?.sequence_mass
  return filterDisplayRows([
    { label: 'Length', value: details.value?.sequence_length },
    {
      label: 'Molecular Mass',
      value:
        shouldDisplayRowValue(mass)
          ? `${mass} Da (${(Number(mass) / 1000).toFixed(1)} kDa)`
          : null
    }
  ])
})

const functionalRows = computed(() => filterDisplayRows([
  { label: 'Biological Process', value: details.value?.biological_process },
  { label: 'Cellular Components', value: details.value?.cellular_component },
  { label: 'Molecular Functions', value: details.value?.molecular_function },
  { label: 'Disease', value: details.value?.comment_disease_name }
]))

const selectedClassificationRows = computed(() => {
  const source = details.value || {}
  const annotation = record.value || {}
  const labels = lineage.value.labels || {}

  const rows = [
    {
      label: 'PDB Code',
      value: getFirstMeaningfulValue([
        annotation['PDB Code'],
        source.pdb_code,
        source.pdbid,
        searchQuery.value?.toUpperCase()
      ])
    },
    {
      label: 'Group (OPM)',
      value: getFirstMeaningfulValue([
        labels.opm,
        annotation['Group (OPM)'],
        formatOpmAssignment(annotation),
        formatOpmAssignment(source)
      ])
    },
    {
      label: 'Group (MPstruc)',
      value: getFirstMeaningfulValue([
        labels.mpstruc,
        annotation['Group (MPstruc)'],
        annotation.group,
        formatMpstrucAssignment(annotation),
        formatMpstrucAssignment(source),
        mappedGroupName.value
      ])
    },
    {
      label: 'Group (Expert)',
      value: getFirstMeaningfulValue([
        labels.expert,
        annotation['Group (Expert)'],
        annotation.group_expert
      ])
    },
    {
      label: 'Group (Predicted)',
      value: getFirstMeaningfulValue([
        labels.predicted,
        annotation['Group (Predicted)'],
        annotation.group_predicted
      ])
    },
    {
      label: 'Family',
      value: getFirstMeaningfulValue([annotation.family_name, source.family_name])
    },
    {
      label: 'Superfamily',
      value: getFirstMeaningfulValue([
        annotation.family_superfamily_name,
        source.family_superfamily_name
      ])
    },
    {
      label: 'Membrane',
      value: getFirstMeaningfulValue([
        annotation['Membrane'],
        annotation.membrane_name,
        source.membrane_name
      ])
    },
    {
      label: 'Membrane Topology In',
      value: getFirstMeaningfulValue([
        annotation['Membrane Topology In'],
        annotation.membrane_topology_in,
        source.membrane_topology_in
      ])
    },
    {
      label: 'Membrane Topology Out',
      value: getFirstMeaningfulValue([
        annotation['Membrane Topology Out'],
        annotation.membrane_topology_out,
        source.membrane_topology_out
      ])
    },
    {
      label: 'Thickness',
      value: formatValue(getFirstMeaningfulValue([annotation.thickness, source.thickness]))
    },
    {
      label: 'Thickness Error',
      value: formatValue(
        getFirstMeaningfulValue([annotation.thicknesserror, source.thicknesserror])
      )
    },
    {
      label: 'Tilt',
      value: formatValue(getFirstMeaningfulValue([annotation.tilt, source.tilt]))
    },
    {
      label: 'Tilt Error',
      value: formatValue(getFirstMeaningfulValue([annotation.tilterror, source.tilterror]))
    },
    {
      label: 'Gibbs',
      value: formatValue(getFirstMeaningfulValue([annotation.gibbs, source.gibbs]))
    },
    {
      label: 'TM (Expert)',
      value: getFirstMeaningfulValue([annotation['TM (Expert)'], annotation.tm_expert])
    }
  ]

  return rows.filter((row) => hasMeaningfulValue(row.value))
})

function parseTmRegions(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function ensureTrackCoverage(segments, sequenceLength) {
  const normalizedSegments = ensureArray(segments)
    .map((segment) => ({
      ...segment,
      start: Number(segment?.start),
      end: Number(segment?.end),
      length: Number(segment?.length ?? ((Number(segment?.end) || 0) - (Number(segment?.start) || 0) + 1))
    }))
    .filter((segment) => Number.isFinite(segment.start) && Number.isFinite(segment.end) && segment.end >= segment.start)
    .sort((left, right) => left.start - right.start)

  if (!sequenceLength || !normalizedSegments.length) {
    return normalizedSegments
  }

  const covered = []
  let cursor = 1

  normalizedSegments.forEach((segment) => {
    if (segment.start > cursor) {
      covered.push({
        label: 'Outside',
        kind: 'outside',
        start: cursor,
        end: segment.start - 1,
        length: segment.start - cursor
      })
    }
    covered.push(segment)
    cursor = Math.max(cursor, segment.end + 1)
  })

  if (cursor <= sequenceLength) {
    covered.push({
      label: 'Outside',
      kind: 'outside',
      start: cursor,
      end: sequenceLength,
      length: sequenceLength - cursor + 1
    })
  }

  return covered
}

function formatTmRegions(value) {
  const regions = parseTmRegions(value)
  if (!regions.length) return 'Not Specified'
  return regions
    .map((region) => {
      const start = region.start ?? '?'
      const end = region.end ?? '?'
      const topology = region.topology ? ` (${region.topology})` : ''
      return `${start}-${end}${topology}`
    })
    .join(', ')
}

function formatListValue(value) {
  if (!hasMeaningfulValue(value)) return 'Not Specified'
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

function formatTimestampValue(value) {
  if (!hasMeaningfulValue(value)) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return String(value)
  return parsed.toLocaleString()
}

function formatOpmAssignment(recordLike = {}) {
  const className = getFirstMeaningfulValue([
    recordLike?.family_superfamily_classtype_name
  ])
  const typeName = getFirstMeaningfulValue([
    recordLike?.famsupclasstype_type_name
  ])

  if (hasMeaningfulValue(className) && hasMeaningfulValue(typeName)) {
    return `${className} (${typeName})`
  }

  return getFirstMeaningfulValue([className, typeName])
}

function formatMpstrucAssignment(recordLike = {}) {
  const group = getFirstMeaningfulValue([recordLike?.group, recordLike?.['Group (MPstruc)']])
  const subgroup = getFirstMeaningfulValue([recordLike?.subgroup])

  if (hasMeaningfulValue(group) && hasMeaningfulValue(subgroup)) {
    return `${group} / ${subgroup}`
  }

  return getFirstMeaningfulValue([group, subgroup])
}

const resolvedRecord = computed(() => record.value || {})
const recordResolution = computed(() => resolvedRecord.value.record_resolution || {})
const lineage = computed(() => resolvedRecord.value.annotation_lineage || {})
const provenance = computed(() => resolvedRecord.value.provenance || {})
const confidence = computed(() => provenance.value.confidence || {})
const scientificAssessment = computed(() => resolvedRecord.value.scientific_assessment || {})
const scientificFlags = computed(() => scientificAssessment.value.flags || {})
const structureContext = computed(() => resolvedRecord.value.structure_context || {})
const uiSections = computed(() => resolvedRecord.value.ui_sections || {})
const comparisonSection = computed(() => uiSections.value.comparison || {})
const tmPredictionSummary = computed(
  () => uiSections.value.tm_prediction_summary || resolvedRecord.value.tm_prediction_summary_card || {}
)
const tmInterpretations = computed(() =>
  ensureArray((uiSections.value.tm_boundaries || {}).interpretations || [])
)

function formatPredictorLabel(provider, method) {
  const parts = [provider, method].filter((part) => shouldDisplayRowValue(part))
  return parts.join(' ') || null
}

const preferredTmInterpretation = computed(() => {
  const preferred = tmPredictionSummary.value || {}
  const matchingInterpretation = tmInterpretations.value.find(
    (item) =>
      item?.provider === preferred.preferred_provider
      && item?.method === preferred.preferred_method
  )
  return matchingInterpretation || tmInterpretations.value[0] || null
})

const preferredDerivedTopology = computed(
  () => preferredTmInterpretation.value?.derived_topology || {}
)

const topologyTrackItems = computed(() =>
  ensureArray(preferredDerivedTopology.value?.topology_map || []).map((item) => ({
    label: item?.label || 'Region',
    kind: item?.kind || 'other',
    range:
      item?.start != null && item?.end != null
        ? `${item.start}-${item.end}${item?.length != null ? ` (${item.length} aa)` : ''}`
        : 'Range not specified'
  }))
)

const tmSummaryHighlights = computed(() =>
  filterDisplayRows([
    {
      label: 'Primary Method',
      value: formatPredictorLabel(
        tmPredictionSummary.value?.preferred_provider,
        tmPredictionSummary.value?.preferred_method
      )
    },
    {
      label: 'Orientation',
      value: tmPredictionSummary.value?.preferred_orientation_label
    },
    {
      label: 'Topology Class',
      value: tmPredictionSummary.value?.preferred_topology_class
    },
    {
      label: 'Supporting Methods',
      value: tmPredictionSummary.value?.method_count
    }
  ])
)

const tmSummaryFlags = computed(() => {
  const flags = []
  if (tmPredictionSummary.value?.has_structure_based_evidence) {
    flags.push('Includes structure-aware TMDET evidence')
  }
  if (tmPredictionSummary.value?.has_signal_peptide_evidence) {
    flags.push('Signal peptide evidence available')
  }
  if (tmPredictionSummary.value?.has_ambiguous_results) {
    flags.push('Some predictor mappings are ambiguous')
  }
  return flags
})

const tmSupportingMethodChips = computed(() =>
  ensureArray(tmPredictionSummary.value?.available_methods || []).slice(0, 12)
)

const tmInterpretationNotes = computed(() => {
  const derived = preferredDerivedTopology.value || {}
  const notes = []
  if (shouldDisplayRowValue(derived.chain_summary)) {
    notes.push(derived.chain_summary)
  }
  ensureArray(derived.loop_annotations).forEach((item) => {
    if (shouldDisplayRowValue(item?.summary)) {
      notes.push(item.summary)
    }
  })
  ensureArray(derived.caveats).forEach((item) => {
    if (shouldDisplayRowValue(item)) {
      notes.push(item)
    }
  })
  return [...new Set(notes)]
})

const recordResolutionRows = computed(() => {
  const rows = [
    {
      label: 'Selected Group',
      value: recordResolution.value.selected_group_label || 'Not Specified'
    },
    {
      label: 'Group Source',
      value: recordResolution.value.selected_group_source || 'Not Specified'
    },
    {
      label: 'Selected TM Count',
      value: recordResolution.value.selected_tm_count ?? 'Not Specified'
    },
    {
      label: 'TM Source',
      value: recordResolution.value.selected_tm_source || 'Not Specified'
    },
    {
      label: 'Review Status',
      value: recordResolution.value.review_status || 'open'
    },
    {
      label: 'Replacement Strategy',
      value: recordResolution.value.replacement_strategy || 'current_record'
    },
    {
      label: 'Disagreement Flags',
      value: formatListValue(recordResolution.value.disagreement_flags)
    }
  ]
  return rows
})

const recordResolutionRowsDisplay = computed(() => filterDisplayRows(recordResolutionRows.value))

const provenanceRows = computed(() => {
  const rows = [
    {
      label: 'Sources Present',
      value: formatListValue(provenance.value.sources_present)
    },
    {
      label: 'Annotation Score',
      value: confidence.value.annotation_score ?? 'Not Specified'
    },
    {
      label: 'Annotation Score Band',
      value: confidence.value.annotation_score_band || 'Not Specified'
    },
    {
      label: 'Expert vs Prediction Agreement',
      value:
        confidence.value.expert_vs_prediction_agreement == null
          ? 'Not Specified'
          : confidence.value.expert_vs_prediction_agreement
            ? 'Yes'
            : 'No'
    },
    {
      label: 'Predictor Consensus',
      value:
        confidence.value.predictor_consensus == null
          ? 'Not Specified'
          : confidence.value.predictor_consensus
            ? 'Yes'
            : 'No'
    },
    {
      label: 'Replacement Status',
      value: confidence.value.replacement_status || 'Not Specified'
    }
  ]
  return rows
})

const provenanceRowsDisplay = computed(() => filterDisplayRows(provenanceRows.value))

const lineageRows = computed(() => {
  const labels = lineage.value.labels || {}
  return [
    { label: 'Resolved Group Label', value: lineage.value.resolved_group_label || 'Not Specified' },
    { label: 'MPstruc', value: labels.mpstruc || 'Not Specified' },
    { label: 'OPM', value: labels.opm || 'Not Specified' },
    { label: 'Predicted', value: labels.predicted || 'Not Specified' },
    { label: 'Expert', value: labels.expert || 'Not Specified' },
    { label: 'Adjudicated', value: labels.adjudicated || 'Not Specified' },
    { label: 'Legacy PDB', value: lineage.value.legacy_pdb_code || 'Not Specified' },
    { label: 'Replacement PDB', value: lineage.value.replacement_pdb_code || 'Not Specified' }
  ]
})

const lineageRowsDisplay = computed(() => {
  const rows = filterDisplayRows(lineageRows.value)
  const onlyLegacyCode = rows.length === 1 && rows[0].label === 'Legacy PDB'
  return onlyLegacyCode ? [] : rows
})

const scientificAssessmentRows = computed(() => {
  return [
    {
      label: 'Sequence Benchmark Suitable',
      value: scientificFlags.value.sequence_only_topology_benchmark_suitable ? 'Yes' : 'No'
    },
    {
      label: 'State Dependent',
      value: scientificFlags.value.state_dependent ? 'Yes' : 'No'
    },
    {
      label: 'Soluble to Membrane Transition',
      value: scientificFlags.value.soluble_to_membrane_transition ? 'Yes' : 'No'
    },
    {
      label: 'Not Membrane Protein Candidate',
      value: scientificFlags.value.not_membrane_protein_candidate ? 'Yes' : 'No'
    },
    {
      label: 'Complex Ambiguity',
      value: scientificFlags.value.complex_ambiguity ? 'Yes' : 'No'
    },
    {
      label: 'Assessment Notes',
      value: formatListValue(scientificAssessment.value.notes)
    }
  ]
})

const scientificAssessmentRowsDisplay = computed(() =>
  filterDisplayRows(
    scientificAssessmentRows.value.filter((item) => {
      if (item.label === 'Sequence Benchmark Suitable') {
        return item.value === 'No'
      }

      if (item.label === 'State Dependent') {
        return item.value === 'Yes'
      }

      if (item.label === 'Soluble to Membrane Transition') {
        return item.value === 'Yes'
      }

      if (item.label === 'Not Membrane Protein Candidate') {
        return item.value === 'Yes'
      }

      if (item.label === 'Complex Ambiguity') {
        return item.value === 'Yes'
      }

      return true
    })
  )
)

const scientificAssessmentHighlight = computed(() => {
  if (scientificFlags.value.sequence_only_topology_benchmark_suitable === false) {
    return {
      message: 'Use caution: this record is not ideal for sequence-only topology benchmarking.',
      isCaution: true
    }
  }

  if (scientificAssessmentRowsDisplay.value.length > 0) {
    return {
      message: 'This record carries additional scientific caveats that may affect interpretation.',
      isCaution: true
    }
  }

  return {
    message: 'No major scientific caveats were identified for this record.',
    isCaution: false
  }
})

const tmBoundaryRows = computed(() => {
  return ensureArray(preferredDerivedTopology.value?.topology_map || []).map((item) => ({
    label: item?.label || 'Region',
    value: [
      item?.start != null && item?.end != null ? `${item.start}-${item.end}` : null,
      item?.length != null ? `${item.length} aa` : null
    ]
      .filter(Boolean)
      .join(' · ')
  }))
})

const tmBoundaryRowsDisplay = computed(() => filterDisplayRows(tmBoundaryRows.value))

const tmBoundarySequenceLength = computed(() => {
  const explicitLength = Number(details.value?.sequence_length || resolvedRecord.value?.sequence_length)
  if (Number.isFinite(explicitLength) && explicitLength > 0) {
    return explicitLength
  }
  const sequence = details.value?.sequence_sequence || ''
  return sequence.length || 0
})

const tmBoundaryPlotTracks = computed(() =>
  {
    const sequenceLength = tmBoundarySequenceLength.value
    const tracks = []
    const summary = tmPredictionSummary.value || {}
    const preferredKey = `${summary.preferred_provider || ''}::${summary.preferred_method || ''}`
    const pushTrack = (track) => {
      if (!track?.segments?.length) return
      if (tracks.some((item) => item.trackLabel === track.trackLabel)) return
      tracks.push(track)
    }

    const opmRegions = parseTmRegions(resolvedRecord.value?.opm_tm_regions).sort((left, right) => {
      if ((left.chain || '') !== (right.chain || '')) {
        return String(left.chain || '').localeCompare(String(right.chain || ''))
      }
      return (left.start || 0) - (right.start || 0)
    })

    const opmByChain = new Map()
    opmRegions.forEach((region) => {
      const key = region.chain || 'Reference'
      if (!opmByChain.has(key)) {
        opmByChain.set(key, [])
      }
      opmByChain.get(key).push({
        label: `TM${region.index || '?'}`,
        kind: 'membrane',
        start: region.start,
        end: region.end,
        length: region.length
      })
    })

    opmByChain.forEach((segments, chainLabel) => {
      pushTrack({
        trackLabel: `OPM reference · Chain ${chainLabel}`,
        sequenceContext: `Chain ${chainLabel}`,
        segments: ensureTrackCoverage(segments, sequenceLength)
      })
    })

    const orderedInterpretations = [...tmInterpretations.value].sort((left, right) => {
      const leftKey = `${left?.provider || ''}::${left?.method || ''}`
      const rightKey = `${right?.provider || ''}::${right?.method || ''}`
      const score = (item, itemKey) => {
        if (itemKey === preferredKey) return 0
        if (item?.provider === 'MetaMP' && item?.method === 'TMbed') return 1
        if (item?.provider === 'TMAlphaFold' && item?.method === 'DeepTMHMM') return 2
        if (item?.provider === 'TMAlphaFold' && item?.method === 'TMDET') return 98
        return 10
      }
      const scoreDiff = score(left, leftKey) - score(right, rightKey)
      if (scoreDiff !== 0) return scoreDiff
      return `${left?.provider || ''} ${left?.method || ''}`.localeCompare(
        `${right?.provider || ''} ${right?.method || ''}`
      )
    })

    orderedInterpretations.forEach((item) => {
        const derived = item?.derived_topology || {}
        const sourceSegments = ensureArray(derived.topology_map).length
          ? ensureArray(derived.topology_map).map((segment) => ({
            label: segment.label,
            kind: segment.kind,
            start: segment.start,
            end: segment.end,
            length: segment.length
          }))
          : parseTmRegions(item?.tm_regions_json).map((segment, index) => ({
            label: segment.label || `TM${index + 1}`,
            kind: String(segment.label || '').toLowerCase().includes('signal')
              ? 'signal'
              : String(segment.label || '').toLowerCase().includes('inside')
                ? 'inside'
                : String(segment.label || '').toLowerCase().includes('outside')
                  ? 'outside'
                  : 'membrane',
            start: segment.start,
            end: segment.end,
            length: segment.length
          }))

        const topologySegments = ensureTrackCoverage(
          sourceSegments.length
            ? sourceSegments
            : (
                item?.tm_count === 0 && sequenceLength > 0
                  ? [{
                    label: 'Outside',
                    kind: 'outside',
                    start: 1,
                    end: sequenceLength,
                    length: sequenceLength
                  }]
                  : []
              ),
          sequenceLength
        )
        if (!topologySegments.length) return

        const isPreferred =
          item?.provider === summary.preferred_provider && item?.method === summary.preferred_method
        pushTrack({
          trackLabel: [
            `${item?.provider || ''} ${item?.method || ''}`.trim(),
            isPreferred ? 'preferred' : null
          ].filter(Boolean).join(' · '),
          sequenceContext: item?.method === 'TMDET'
            ? 'Structure-aware membrane placement'
            : item?.provider === 'MetaMP'
              ? 'Local sequence prediction'
              : 'UniProt sequence prediction',
          segments: topologySegments
        })
      })

    return tracks
  }
)

const groupComparisonRows = computed(() => {
  const providedRows = ensureArray(comparisonSection.value?.group_rows || [])
  if (providedRows.length) {
    return providedRows.map((item) => ({
      source: item?.source || 'Unknown',
      value: hasMeaningfulValue(item?.value) ? item.value : 'Not available'
    }))
  }

  return [
    {
      source: 'Expert',
      value: getFirstMeaningfulValue([
        record.value?.['Group (Expert)'],
        record.value?.group_expert
      ])
    },
    {
      source: 'Predicted',
      value: getFirstMeaningfulValue([
        record.value?.['Group (Predicted)'],
        record.value?.group_predicted,
        comparisonSection.value?.group_rows?.find?.((item) => item.source === 'Predicted')?.value
      ])
    },
    {
      source: 'OPM',
      value: getFirstMeaningfulValue([
        record.value?.['Group (OPM)'],
        formatOpmAssignment(record.value),
        formatOpmAssignment(resolvedRecord.value),
        formatOpmAssignment(details.value)
      ])
    },
    {
      source: 'MPstruc',
      value: getFirstMeaningfulValue([
        lineage.value?.labels?.mpstruc,
        record.value?.['Group (MPstruc)'],
        record.value?.group,
        formatMpstrucAssignment(record.value),
        formatMpstrucAssignment(resolvedRecord.value),
        formatMpstrucAssignment(details.value),
        mappedGroupName.value
      ])
    }
  ].map((item) => ({
    source: item.source,
    value: hasMeaningfulValue(item.value) ? item.value : 'Not available'
  }))
})

const tmSegmentComparisonRows = computed(() =>
  ensureArray(comparisonSection.value?.segment_rows || [])
    .map((item) => ({
      source: item?.source || 'Unknown',
      value: hasMeaningfulValue(item?.value) ? item.value : 'Not available'
    }))
    .filter((item) => item.value !== 'Not available' || ['Expert', 'OPM'].includes(item.source))
)

const tmSegmentNote = computed(() => comparisonSection.value.segment_note || '')

const tmBoundaryTableRows = computed(() => {
  const rows = ensureArray((uiSections.value.tm_boundaries || {}).rows || [])
  return rows.map((item) => {
    const start = item.start ?? 'Not Specified'
    const end = item.end ?? 'Not Specified'
    const numericStart = Number(item.start)
    const numericEnd = Number(item.end)
    const length =
      Number.isFinite(numericStart) && Number.isFinite(numericEnd)
        ? numericEnd - numericStart + 1
        : 'Not Specified'

    return {
      source: item.source || 'Unknown',
      start,
      end,
      length,
      chain: item.chain_label || item.chain_id || item.chain || 'Sequence',
      topology: item.topology || item.label || 'TM segment'
    }
  })
})

const tmSourceStatusRowsDisplay = computed(() =>
  filterDisplayRows(
    ensureArray((uiSections.value.tm_boundaries || {}).source_status || []).map((item) => ({
      label: item.source || 'Unknown source',
      value: item.available
        ? `${item.tm_count ?? 'Not Specified'} TM count; ${item.boundary_count ?? 0} boundary row(s)`
        : 'Not available'
    }))
  )
)

const benchmarkContext = computed(() => uiSections.value.benchmark_context || {})
const benchmarkContextRowsDisplay = computed(() =>
  filterDisplayRows([
    {
      label: 'Recommended for Sequence-only Benchmark',
      value:
        benchmarkContext.value.recommended_for_sequence_topology_benchmark == null
          ? 'Not Specified'
          : benchmarkContext.value.recommended_for_sequence_topology_benchmark
            ? 'Yes'
            : 'No'
    },
    {
      label: 'Benchmark Exclusion Reasons',
      value: formatListValue(benchmarkContext.value.benchmark_exclusion_reasons)
    }
  ])
)

const liveStatusRowsDisplay = computed(() =>
  filterDisplayRows([
    {
      label: 'Annotation Reference Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).annotation_dataset_modified_at)
    },
    {
      label: 'Live Group Predictions Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).live_group_predictions_modified_at)
    },
    {
      label: 'TM Prediction Summary Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).tm_prediction_summary_modified_at)
    },
    {
      label: 'PDB Dataset Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).pdb_dataset_modified_at)
    },
    {
      label: 'OPM Dataset Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).opm_dataset_modified_at)
    },
    {
      label: 'UniProt Dataset Updated',
      value: formatTimestampValue((uiSections.value.live_status || {}).uniprot_dataset_modified_at)
    }
  ])
)

const structureWarnings = computed(() =>
  ensureArray((uiSections.value.structure_context || {}).warnings || structureContext.value.warnings || [])
)

const structureContextRows = computed(() => {
  return [
    { label: 'Chain IDs', value: formatListValue(structureContext.value.chain_ids) },
    { label: 'Chain Count', value: structureContext.value.chain_count ?? 'Not Specified' },
    { label: 'Entity IDs', value: formatListValue(structureContext.value.entity_ids) },
    { label: 'Assembly IDs', value: formatListValue(structureContext.value.assembly_ids) },
    { label: 'Polymer Composition', value: structureContext.value.polymer_composition || 'Not Specified' },
    {
      label: 'Selected Polymer Entity Types',
      value: formatListValue(structureContext.value.selected_polymer_entity_types)
    }
  ]
})

const structureContextRowsDisplay = computed(() => filterDisplayRows(structureContextRows.value))

const externalLinks = computed(() => {
  const links = resolvedRecord.value.external_links || {}
  return Object.entries(links).map(([label, href]) => ({
    label: label.toUpperCase().replace(/_/g, ' '),
    href
  }))
})

function getQueryParams() {
  const hash = window.location.hash
  const queryString = hash.includes('?') ? hash.split('?')[1] : ''
  const params = new URLSearchParams(queryString)
  return {
    code: params.get('code'),
    type: params.get('type')
  }
}

const groupMap = {
  'Alpha-helical polytopic': 'TRANSMEMBRANE PROTEINS:ALPHA-HELICAL',
  'Bitopic proteins': 'BITOPIC PROTEINS',
  'Beta-barrel transmembrane': 'TRANSMEMBRANE PROTEINS:BETA-BARREL',
  'All alpha monotopic/peripheral': 'MONOTOPIC MEMBRANE PROTEINS',
  'All beta monotopic/peripheral': 'MONOTOPIC MEMBRANE PROTEINS',
  'Alpha/Beta monotopic/peripheral': 'MONOTOPIC MEMBRANE PROTEINS',
  'Alpha + Beta monotopic/peripheral': 'MONOTOPIC MEMBRANE PROTEINS',
  'Alpha-helical peptides': 'TRANSMEMBRANE PROTEINS:ALPHA-HELICAL'
}

const mappedGroupName = computed(() => {
  const rawName = details?.value?.famsupclasstype_type_name
  return groupMap[rawName] || rawName || null
})

function buildViewerSource(type, rawQuery) {
  const normalizedType = String(type || '').toLowerCase()
  const query = String(rawQuery || '').trim()

  if (!query) {
    return null
  }

  if (normalizedType === 'pdb') {
    if (!/^[a-z0-9]{4}$/i.test(query)) {
      return {
        error: 'Please enter a valid 4-character PDB accession to render the structure viewer.'
      }
    }

    return {
      url: `https://files.rcsb.org/download/${query.toUpperCase()}.cif`,
      format: 'cif',
      alphafoldView: false,
      plugins: ['membrane-orientation'],
      membraneOrientation: true
    }
  }

  if (normalizedType === 'swissmodel') {
    return {
      url: `https://swissmodel.expasy.org/repository/uniprot/${query}.pdb`,
      format: 'pdb',
      alphafoldView: false,
      plugins: []
    }
  }

  if (normalizedType === 'uniprot') {
    return {
      url: `https://www.ebi.ac.uk/pdbe/static/entry/${query}_updated.cif`,
      format: 'cif',
      alphafoldView: false,
      plugins: []
    }
  }

  if (normalizedType === 'opm') {
    return {
      url: `https://biomembhub.org/shared/opm-assets/pdb/${query}.pdb`,
      format: 'pdb',
      alphafoldView: false,
      plugins: ['membrane-orientation'],
      membraneOrientation: true
    }
  }

  if (normalizedType === 'alphafold') {
    return {
      url: `https://alphafold.ebi.ac.uk/files/${query}`,
      format: 'cif',
      alphafoldView: true,
      plugins: []
    }
  }

  return {
    error: 'The selected structure source is not supported yet.'
  }
}

function updateViewerSource() {
  const source = buildViewerSource(searchType.value, searchQuery.value)

  if (!source) {
    viewerError.value = ''
    return false
  }

  if (source.error) {
    viewerError.value = source.error
    return false
  }

  viewerError.value = ''
  opts.customData.url = source.url
  opts.customData.format = source.format
  opts.alphafoldView = source.alphafoldView
  opts.membraneOrientation = source.membraneOrientation ?? false
  opts.plugins = source.plugins
  return true
}

async function fetchProteinDetails() {
  const query = searchQuery.value?.trim()
  if (!query || query.length < 3) {
    details.value = null
    return
  }

  try {
    await dashboardStore?.fetchDetails(query)

    const response = dashboardStore.protein_details.data
    const jsonString = typeof response === 'string' ? response : JSON.stringify(response)
    const parsedData = JSON.parse(jsonString.replace(/\bNaN\b/g, 'null'))

    details.value = parsedData?.data?.[0] ?? null
    error.value = null
  } catch (fetchError) {
    console.error('Error fetching or parsing protein details:', fetchError)
    details.value = null
    error.value = fetchError
  }
}

function handleHashChange() {
  const { code, type } = getQueryParams()
  if (code && type) {
    searchQuery.value = code
    searchType.value = type.toLowerCase()
  }
}

async function fetchRecord() {
  const query = searchQuery.value?.trim()
  if (!query || query.length < 3) {
    record.value = null
    return
  }

  try {
    await dashboardStore?.getExpertAnnotation(query)
    record.value = dashboardStore.protein_details_new.data ?? null
  } catch (fetchError) {
    console.error('Error fetching expert annotation:', fetchError)
    record.value = null
  }
}

function hideViewerLoaderAfterPaint() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      viewerLoading.value = false
    })
  })
}

async function renderViewer() {
  const el = viewerContainer.value
  if (!el || !opts.customData.url) {
    return
  }

  viewerLoading.value = true
  el.innerHTML = ''

  try {
    await loadPdbeMolstar()

    if (!window.PDBeMolstarPlugin) {
      viewerError.value = 'The molecular viewer could not be initialized in this browser session.'
      viewerLoading.value = false
      return
    }

    viewerInstance = new window.PDBeMolstarPlugin()
    const optionsCopy = JSON.parse(JSON.stringify(opts))
    const renderPromise = viewerInstance.render(el, optionsCopy)

    Promise.resolve(renderPromise)
      .then(() => {
        hideViewerLoaderAfterPaint()
      })
      .catch((renderError) => {
        console.error('Error rendering molecular viewer:', renderError)
        viewerError.value =
          'The structure viewer could not render this entry right now. The metadata below is still available.'
        viewerLoading.value = false
      })
  } catch (renderError) {
    console.error('Error rendering molecular viewer:', renderError)
    viewerError.value =
      'The structure viewer could not render this entry right now. The metadata below is still available.'
    viewerLoading.value = false
  }
}

async function syncDetailsPage() {
  const query = searchQuery.value?.trim()
  syncingDetailsPage.value = true

  if (!query || query.length < 3) {
    details.value = null
    record.value = null
    viewerError.value = ''
    viewerLoading.value = false

    if (viewerContainer.value) {
      viewerContainer.value.innerHTML = ''
    }
    syncingDetailsPage.value = false
    return
  }

  try {
    const canRenderViewer = updateViewerSource()
    await Promise.allSettled([fetchProteinDetails(), fetchRecord()])

    if (canRenderViewer) {
      await renderViewer()
    } else if (viewerContainer.value) {
      viewerContainer.value.innerHTML = ''
    }
  } finally {
    syncingDetailsPage.value = false
  }
}

watch([searchType, searchQuery], () => {
  if (!mountedReady.value) return
  syncDetailsPage()
})

onMounted(async () => {
  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
  await syncDetailsPage()
  mountedReady.value = true
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', handleHashChange)

  if (viewerContainer.value) {
    viewerContainer.value.innerHTML = ''
  }
  viewerLoading.value = false
})

watch(
  opts,
  async () => {
    if (!mountedReady.value || syncingDetailsPage.value || !opts.customData.url) return
    await renderViewer()
  },
  { deep: true }
)
</script>

<style scoped>
.details-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.95fr);
  gap: 16px;
  margin-top: 16px;
  align-items: start;
}

.viewer-row {
  align-items: stretch;
}

.details-main-column,
.details-side-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.details-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border: 1px solid #dce5ef;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(15, 45, 90, 0.06);
}

.details-card--emphasis {
  background: linear-gradient(180deg, #f6fbff 0%, #eef6ff 100%);
  border-color: #b9d3ea;
}

.details-hero {
  padding: 24px;
}

.details-hero__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.details-hero__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.section-eyebrow {
  margin: 0 0 6px;
  color: #56718f;
  font-size: 0.8rem !important;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.details-title,
.section-title {
  margin: 0;
  color: #17324d;
  font-weight: 700;
}

.details-title {
  font-size: 1.45rem !important;
}

.details-subtitle {
  margin: 8px 0 0;
  color: #5f748c;
  line-height: 1.5;
}

.section-header {
  margin-bottom: 14px;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.meta-chip,
.pill-badge,
.pill-link {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.84rem !important;
  font-weight: 600;
  line-height: 1.1;
}

.meta-chip,
.pill-badge {
  background: #edf4fb;
  color: #184772;
}

.meta-chip--warning {
  background: #fff2e1;
  color: #8c4c0d;
}

.pill-link {
  background: #0f5ba7;
  color: #ffffff;
  text-decoration: none;
}

.pill-link:hover {
  color: #ffffff;
  background: #0c4c8b;
  text-decoration: none;
}

.overview-grid,
.definition-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.overview-item,
.definition-item {
  border-radius: 12px;
  padding: 12px 14px;
  background: #f7fafc;
  border: 1px solid #e3ebf3;
}

.overview-label,
.definition-label,
.stacked-definition__label {
  display: block;
  color: #64809c;
  font-size: 0.78rem !important;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.overview-value,
.definition-value,
.stacked-definition__value {
  color: #1c3146;
  font-weight: 500;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.stacked-definition-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subsection-block {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #e7edf4;
}

.subsection-block--flush {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.stacked-definition {
  padding-bottom: 12px;
  border-bottom: 1px solid #e7edf4;
}

.tm-summary-lead {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.tm-summary-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 88px;
  border-radius: 20px;
  background: #12395b;
  color: #ffffff;
  font-size: 2rem !important;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.tm-summary-title {
  color: #163450;
  font-size: 1.05rem !important;
  font-weight: 700;
  line-height: 1.35;
}

.tm-summary-description {
  margin-top: 8px;
  color: #56718f;
  line-height: 1.55;
}

.tm-summary-grid {
  margin-top: 16px;
}

.topology-track {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.topology-track__item {
  min-width: 116px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #dce5ef;
  background: #ffffff;
}

.topology-track__item--membrane {
  background: #e8f4ea;
  border-color: #b8d6bf;
}

.topology-track__item--inside {
  background: #edf4fb;
  border-color: #c9ddf0;
}

.topology-track__item--outside {
  background: #fff5e8;
  border-color: #f0d8b5;
}

.topology-track__item--signal {
  background: #fff4db;
  border-color: #eed090;
}

.topology-track__label {
  color: #17324d;
  font-size: 0.78rem !important;
  font-weight: 700;
  text-transform: uppercase;
}

.topology-track__range {
  margin-top: 4px;
  color: #56718f;
  line-height: 1.35;
}

.stacked-definition:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.function-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.function-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f7fafc;
  border: 1px solid #e3ebf3;
}

.sequence-block,
.taxonomy-tree {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #f7fafc;
  border: 1px solid #e3ebf3;
}

.sequence-block {
  overflow: hidden;
}

.sequence-block :deep(.expandable-text) {
  display: block;
  line-height: 1.7;
  color: #1c3146;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.92rem !important;
}

.sequence-block :deep(.expandable-text__content) {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-all;
}

.sequence-block :deep(.expand-toggle) {
  display: inline-block;
  margin-top: 10px;
}

.assessment-summary {
  border-radius: 12px;
  padding: 14px 16px;
  background: #eaf6ee;
  color: #1f5935;
  font-weight: 600;
  line-height: 1.5;
}

.assessment-summary--caution {
  background: #fff4e8;
  color: #8c4c0d;
}

.soft-alert {
  border-radius: 12px;
  padding: 12px 14px;
  background: #fff8ec;
  color: #7b4d12;
  border: 1px solid #f1d4ab;
  line-height: 1.5;
}

.warning-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tm-boundary-table {
  border: 1px solid #dbe5ef;
}

.comparison-table {
  border: 1px solid #dbe5ef;
}

.comparison-table th {
  background: #edf4fb;
  color: #17324d;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.comparison-note {
  margin-top: 10px;
  color: #5f748c;
  font-size: 0.88rem !important;
  line-height: 1.5;
}

.tm-boundary-table th {
  background: #edf4fb;
  color: #17324d;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.production-card {
  border: 1px solid #d6dee8;
  border-radius: 10px;
  padding: 14px;
  height: 100%;
  background: #fbfdff;
}

.options-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border-color: #dce5ef !important;
}

.external-links {
  margin-top: 12px;
}

.link-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.viewer-shell {
  position: relative;
  height: 600px;
}

.molstar-container {
  height: 100%;
}

.viewer-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 0.375rem;
}

.viewer-spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #d8e6f5;
  border-top-color: #0d6efd;
  border-radius: 50%;
  animation: viewer-spin 0.9s linear infinite;
}

.viewer-loading-text {
  margin: 0;
  color: #234;
  font-weight: 600;
}

@keyframes viewer-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .options-panel {
    min-height: auto;
  }

  .viewer-shell {
    height: 400px;
  }

  .details-layout {
    grid-template-columns: 1fr;
  }

  .details-hero__header {
    flex-direction: column;
  }

  .details-hero__links {
    justify-content: flex-start;
  }

  .overview-grid,
  .definition-grid {
    grid-template-columns: 1fr;
  }

  .tm-summary-lead {
    grid-template-columns: 1fr;
  }

  .tm-summary-count {
    min-height: 72px;
  }

  .molstar-container {
    height: 100%;
  }
}

@media (max-width: 480px) {
  .viewer-shell {
    height: 300px;
  }

  .molstar-container {
    height: 100%;
  }
}
/* Reduce cell spacing */
table {
  border-collapse: collapse; /* Removes extra spacing between cells */
  width: 100%; /* Ensures the table takes up the full width */
}

th,
td {
  padding: 2px; /* Adjust padding to reduce spacing */
  text-align: left; /* Align text to the left */
  border: 1px solid #ddd; /* Add a border for better visibility */
}

th {
  background-color: #f4f4f4; /* Add a light background for headers */
  font-weight: bold; /* Make headers bold */
}

tr:nth-child(even) {
  background-color: #f9f9f9; /* Add alternating row colors for readability */
}

tr:hover {
  background-color: #f1f1f1; /* Highlight row on hover */
}
* {
  font-size: 11pt !important;
}
.border-radius-none {
  border-radius: 0;
}

.v-treeview-node__root {
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
}
.v-treeview-node__label {
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
}

.anchor {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #007bff;
  text-decoration: none;
  transition:
    transform 0.2s,
    color 0.3s;
}

.anchor:hover {
  color: #0056b3;
  text-decoration: underline;
}

.anchor:active {
  transform: translateY(-3px) scale(1.1);
}

.anchor:hover iconify-icon {
  animation: bounce 0.5s;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
}

.jump-animate {
  animation: jump 0.6s ease;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.bouncing-badge {
  animation: bounce 1s infinite;
}
</style>
