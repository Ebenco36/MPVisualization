<template>
  <div class="container-fluid">
    <HeaderCrumbs
      :label="'Single view for ' + searchType + ' with accession code: ' + searchQuery"
      title=""
    />
    <div class="row">
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
                <option value="opm">OPM</option>
                <option value="swissmodel">Swiss Model</option>
                <option value="uniprot">UniProt</option>
                <option value="alphafold">Alphafold</option>
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
      <div class="col-lg-10 col-md-10 col-12 p-1">
        <div ref="viewerContainer" class="molstar-container border rounded shadow-sm"></div>
      </div>
    </div>

    <!-- Viewer Container -->
    <!-- <div class="row col-lg-10 col-md-10 col-12">
          <div ref="viewerContainer" class="molstar-container border rounded shadow-sm"></div>
          <div class="controlBox mt-3">
            <h4>Set Background</h4>
            <button @click="setBackgroundColor(255, 255, 255)">White</button>
            <button @click="setBackgroundColor(0, 0, 0)">Black</button>
  
            <h4>Toggle Controls Menu</h4>
            <button @click="toggleControls(false)">Hide</button>
            <button @click="toggleControls(true)">Show</button>
            <button @click="toggleControls()">Toggle</button>
  
            <h4>Toggle Fullscreen</h4>
            <button @click="toggleFullscreen(true)">Show Fullscreen</button>
  
            <h4>Visual Methods</h4>
            <button @click="toggleSpin(true)">Rotate</button>
            <button @click="toggleSpin(false)">Stop</button>
            <button @click="toggleSpin()">Toggle</button>
  
            <h4>Focus</h4>
            <button @click="focusOnChain('A', 14, 18)">Focus on Chain A:14-18</button>
  
            <h4>Highlight</h4>
            <button @click="highlightChain('A', 14, 18, { r: 255, g: 255, b: 0 })">
              Highlight Chain A:14-18
            </button>
            <button @click="clearHighlight()">Clear Highlight</button>
          </div>
      </div> -->

    <!-- Footer Row -->
    <div class="row">
      <div class="col-md-6 p-1 d-flex">
        <div class="card p-4 border-radius-none">
          <h2 class="h2">{{ searchQuery }}</h2>
          <p class="text-sm">
            {{ searchType.toUpperCase() }} Accession:
            <a
              :href="'https://www.uniprot.org/uniprotkb/' + searchQuery + '/entry'"
              class="anchor"
              target="_blank"
              rel="noopener"
              >{{ searchQuery }} <iconify-icon icon="line-md:external-link"></iconify-icon
            ></a>
          </p>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 class="h3">Taxonomy</h3>
              <p class="text-sm">Super Kingdom: {{ details?.taxonomic_domain }}</p>
              <p class="text-sm">Super Family: {{ details?.family_superfamily_name }}</p>
              <p class="text-sm">Family: {{ details?.family_name }}</p>
              <p class="text-sm">Sub-group: {{ details?.subgroup }}</p>
              <p class="text-sm">Species: {{ details?.species }}</p>
              <p>
                Species Description:{{ process_specie_description(details?.species_description) }}
              </p>
            </div>
            <div>
              <h3 class="h3">Sequence</h3>
              <p class="text-sm">Length: {{ details?.sequence_length }}</p>
              <p class="text-sm">Mass: {{ details?.sequence_mass }}</p>
              <p class="text-sm">Sequence: >>>{{ details?.sequence_sequence }}</p>
            </div>
          </div>


          <div class="row">
              <div class="col-md-12">
                <div class="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <strong>Biological process: </strong>&nbsp; <ExpandableText
                      :text="details?.biological_process || ''"
                      :limit="100"
                    />
                    <strong>Biological process: </strong>&nbsp; <ExpandableText
                      :text="details?.cellular_component || ''"
                      :limit="100"
                    />
                    <strong>Biological process: </strong>&nbsp; <ExpandableText
                      :text="details?.molecular_function || ''"
                      :limit="100"
                    />
                    <!-- <p class="text-sm" v-expandable="{ limit: 50 }">
                      <strong>Biological process: </strong>&nbsp; {{ details?.biological_process }}
                    </p> -->

                    <!-- <p class="text-sm">
                      <strong>Cellular Components: </strong>&nbsp; {{ details?.cellular_component }}
                    </p>

                    <p class="text-sm">
                      <strong>Molecular Functions: </strong>&nbsp; {{ details?.molecular_function }}
                    </p> -->
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      <div class="col-md-6 p-1 d-flex">
        <div class="card p-4 border-radius-none">
          <h2 class="h3 mb-2">Summary</h2>
          <div class="grid grid-cols-2 gap-4">
            <!-- <div class="row">
              <div class="col-md-6 col-6">
                <h3 class="h4">Feature Counts</h3>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    class="flex items-center"
                    v-for="(feature, index) in parseRawData(details?.extra_attributes)
                      ?.countByFeatureType"
                    :key="index"
                  >
                    <span class="mr-2">{{ index }}:</span>
                    <span class="badge variant-filled-success">{{ feature }}</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-6">
                <h3 class="h4">Other Information</h3>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    class="flex items-center"
                    v-for="(feature_type, index_type) in parseRawData(details?.extra_attributes)
                      ?.countByCommentType"
                    :key="index_type"
                  >
                    <span class="mr-2">{{ capitalize(index_type) }}:</span>
                    <span class="badge variant-filled-success">{{ feature_type }}</span>
                  </div>
                </div>
              </div>
            </div> -->
            <div class="row">
              <div class="col-md-6 col-12">
                <h3 class="h4">Feature Counts</h3>
                <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(feature, index) in parseRawData(details?.extra_attributes)
                        ?.countByFeatureType"
                      :key="index"
                    >
                      <td>{{ index }}</td>
                      <td>{{ feature }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="col-md-6 col-12">
                <h3 class="h4">Other Information</h3>
                <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(feature_type, index_type) in parseRawData(details?.extra_attributes)
                        ?.countByCommentType"
                      :key="index_type"
                    >
                      <td>{{ capitalize(index_type) }}</td>
                      <td>{{ feature_type }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 class="h4"><strong>Topology Information</strong></h4>
                    <p class="text-sm">
                      <strong>Membrane Topology In:</strong>&nbsp;
                      {{ details?.membrane_topology_in }}
                    </p>
                    <p class="text-sm">
                      <strong>Membrane Topology Out:</strong>&nbsp;
                      {{ details?.membrane_topology_out }}
                    </p>
                    <p class="text-sm">
                      <strong>Polymer Composition:</strong>&nbsp;
                      {{ details?.rcsentinfo_polymer_composition }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 col-12">
                <div class="mt-4 grid grid-cols-2 gap-4">
                  <div v-if="record && Object.keys(record).length > 0" style="border: 2px solid grey; border-radius: 10px; padding: 10px;">
                    <h4 class="h4">Classification</h4>
                    <p class="text-sm" v-for="(classification, index) in record" :key="index">
                      <strong>{{index}}:</strong>&nbsp; {{ classification }}
                    </p>

                    
                  </div>

                  <div class="row">
              <div class="col-md-12">
                <div class="mt-4 grid grid-cols-2 gap-4">
                  

                  <div>
                    <h4 class="h4"><strong>Other Informations</strong></h4>
                    <p class="text-sm">
                      <strong>Protein Alternative Name: </strong>&nbsp; {{ details?.protein_alternative_name }}
                    </p>

                    <p class="text-sm">
                      <strong>Protein Recommended Name: </strong>&nbsp; {{ details?.protein_recommended_name }}
                    </p>

                    <p class="text-sm">
                      <strong>Organism Lineage: </strong>&nbsp; {{ process_specie_description(details?.organism_lineage) }}
                    </p>

                    <p class="text-sm">
                      <strong>Associated Genes: </strong>&nbsp; {{ details?.associated_genes }}
                    </p>

                    <p class="text-sm">
                      <strong>Annotation Score: </strong>&nbsp; {{ details?.annotation_score }}
                    </p>
                    
                    <h2 class="header"><strong>Related Diseases</strong></h2>
                    <!-- <p class="text-sm">
                      <strong>Diseases: </strong>&nbsp; {{ details?.comment_disease }}
                    </p> -->

                    <p class="text-sm">
                      <strong>Disease Name </strong>&nbsp; {{ details?.comment_disease_name }}
                    </p>

                    
                  </div>
                </div>
              </div>
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import ExpandableText from '@/components/ExpandableText.vue'
// Import PDBe-Mol* CSS and plugin
import 'pdbe-molstar/build/pdbe-molstar-light.css'
import 'pdbe-molstar/build/pdbe-molstar-plugin.js'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const details = ref({})

const record    = ref(null)
const error     = ref(null)

// Viewer container reference
const viewerContainer = ref(null)
let viewerInstance = null // Viewer instance

// Reactive options for the viewer
const opts = reactive({
  customData: {
    url: 'https://alphafold.ebi.ac.uk/files/AF-O15552-F1-model_v1.cif',
    format: 'cif'
  },
  alphafoldView: true,
  bgColor: { r: 255, g: 255, b: 255 },
  hideControls: true,
  sequencePanel: true,
  landscape: true,
  loadingOverlay: true,
  selection: true,
  selectInteraction: true,
  symmetryAnnotation: true,
  domainAnnotation: true,
  validationAnnotation: true,
  plugins: ['membrane-orientation']
})

// Search state
const searchType = ref('pdb')
const searchQuery = ref('')

function process_specie_description(data_string) {
  return data_string
    ? data_string.replace(/;\s*/g, ' -> ').replace(/,\s*/g, ' -> ')
    : data_string;
}

function parseRawData(raw) {
  // 1) if it isn’t a string, bail out
  if (typeof raw !== 'string') {
    console.warn('parseRawData: expected a string, got', raw)
    return {}
  }

  // 2) trim off any whitespace
  const trimmed = raw.trim()

  // 3) only do the single→double-quote dance if it looks necessary
  let jsonString = trimmed
  if (
    trimmed.startsWith('{') &&
    trimmed.endsWith('}') &&
    trimmed.includes("'") &&
    !trimmed.includes('"')
  ) {
    jsonString = trimmed
      // turn keys:  'key':  →  "key":
      .replace(/'([^']+)'(?=\s*:)/g, '"$1"')
      // turn values: : 'val' → : "val"
      .replace(/:\s*'([^']+)'/g, ': "$1"')
  }

  // 4) try to parse
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error('parseRawData: JSON.parse failed:', e, '\ninput was:', jsonString)
    return {}
  }
}

function capitalize(s) {
  return s && String(s[0]).toUpperCase() + String(s).slice(1)
}

// Function to parse query parameters from the URL
function getQueryParams() {
  const hash = window.location.hash
  const queryString = hash.includes('?') ? hash.split('?')[1] : ''
  const params = new URLSearchParams(queryString)
  return {
    code: params.get('code'),
    type: params.get('type')
  }
}

// Watch for changes in searchType or searchQuery
watch([searchType, searchQuery], () => {
  if (searchType.value.toLowerCase() === 'pdb') {
    opts.customData.url = `https://files.rcsb.org/download/${searchQuery.value}.pdb`
    opts.customData.format = 'pdb'
  } else if (searchType.value.toLowerCase() === 'swissmodel') {
    opts.customData.url = `https://swissmodel.expasy.org/repository/uniprot/${searchQuery.value}.pdb`
    opts.customData.format = 'pdb'
  } else if (searchType.value.toLowerCase() === 'uniprot') {
    opts.customData.url = `https://www.ebi.ac.uk/pdbe/static/entry/${searchQuery.value}_updated.cif`
    opts.customData.format = 'cif'
  } else if (searchType.value.toLowerCase() === 'opm') {
    opts.customData.url = `https://biomembhub.org/shared/opm-assets/pdb/${searchQuery.value}.pdb`
    opts.customData.format = 'pdb'
  } else if (searchType.value.toLowerCase() === 'alphafold') {
    opts.customData.url = `https://alphafold.ebi.ac.uk/files/${searchQuery.value}`
    opts.customData.format = 'cif'
  }
  fetchProteinDetails()
})

async function fetchProteinDetails() {
  dashboardStore?.fetchDetails(searchQuery.value).then(() => {
    let response = dashboardStore.protein_details.data
    let correctedJsonString = response.replace(/\bNaN\b/g, 'null')
    details.value = JSON.parse(correctedJsonString)?.data[0]
  })
}

// Watch for changes in the URL's query parameters
window.addEventListener('hashchange', () => {
  const { code, type } = getQueryParams()
  if (code && type) {
    searchQuery.value = code
    searchType.value = type.toLowerCase()
  }
})

// Viewer Methods
// function setBackgroundColor(r, g, b) {
//   viewerInstance?.canvas.setBgColor({ r, g, b })
// }

// function toggleControls(show) {
//   viewerInstance?.canvas.toggleControls(show)
// }

// function toggleFullscreen(show) {
//   viewerInstance?.canvas.toggleExpanded(show)
// }

// function toggleSpin(spin) {
//   viewerInstance?.visual.toggleSpin(spin)
// }

// function focusOnChain(chain, start, end) {
//   viewerInstance?.visual.focus([{ struct_asym_id: chain, start_residue_number: start, end_residue_number: end }])
// }

// function highlightChain(chain, start, end, color) {
//   viewerInstance?.visual.highlight({
//     data: [{ struct_asym_id: chain, start_residue_number: start, end_residue_number: end }],
//     color
//   })
// }

// function clearHighlight() {
//     viewerInstance?.visual.clearHighlight()
// }

// fetch function
async function fetchRecord() {
  const API_URL = 'http://127.0.0.1:5400/api/v1/records/' + searchQuery.value
  try {
    const res = await fetch(API_URL)
    const body = await res.json()
    if (!res.ok || body.status === 'error') {
      throw new Error(body.message || 'Failed to fetch record')
    }
    record.value = body.data
  } catch (err) {
    error.value = err.message
  }
}

// Render the viewer
function renderViewer() {
  const el = viewerContainer.value
  if (!el) return

  // Clear the container
  el.innerHTML = ''

  // Create a new plugin instance
  viewerInstance = new window.PDBeMolstarPlugin()
  const optionsCopy = JSON.parse(JSON.stringify(opts))

  viewerInstance.render(el, optionsCopy)
}

// Initial render
onMounted(() => {
  fetchProteinDetails()
  const { code, type } = getQueryParams()

  if (code && type) {
    searchQuery.value = code
    searchType.value = type.toLowerCase()
  }

  fetchRecord()
  renderViewer()
})

// Watch for changes in options and re-render
watch(opts, renderViewer, { deep: true })
</script>

<style scoped>
.molstar-container {
  height: 600px;
}

@media (max-width: 768px) {
  .molstar-container {
    height: 400px;
  }
}

@media (max-width: 480px) {
  .molstar-container {
    height: 300px;
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
*{
    font-size: 11pt !important;
}
.border-radius-none{
    border-radius: 0;
}
</style>
