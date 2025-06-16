<template>
  <div class="container-fluid">
    <HeaderCrumbs
      :label="'Single view for ' + searchType.toUpperCase() + ' with accession code: ' + searchQuery"
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
    <!-- Footer Row -->
    <div class="row">
      <div class="col-md-6 p-1 d-flex" style="width: 100% !important">
        <div class="card p-4 border-radius-none" style="width: 100% !important">
          <!-- <h2 class="h2">{{ searchQuery }}</h2> -->
          <p class="text-sm">
            {{ searchType.toUpperCase() }} Accession:
            <a
              :href="'https://www.uniprot.org/uniprotkb/' + details?.uniprot_id + '/entry'"
              class="anchor"
              target="_blank"
              rel="noopener"
              ><strong class="badge badge-info bouncing-badge">{{ searchQuery }}</strong>
            </a>
          </p>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm">
                <strong>Protein Recommended Name: </strong>&nbsp;
                {{
                  details?.protein_recommended_name && details?.protein_recommended_name != 'null'
                    ? details.protein_recommended_name
                    : 'Not Specified'
                }}
              </p>
              <p class="text-sm">
                <strong>Protein Alternative Name: </strong>&nbsp;
                {{
                  details?.protein_alternative_name && details?.protein_alternative_name != 'null'
                    ? details.protein_alternative_name
                    : 'Not Specified'
                }}
              </p>

              <p class="text-sm">
                <strong>Associated Genes: </strong>&nbsp;
                {{
                  details?.associated_genes && details?.associated_genes != 'null'
                    ? details.associated_genes
                    : 'Not Specified'
                }}
              </p>
            </div>
            <div>
              <h3 class="h3"><strong>Taxonomy</strong></h3>
              <table class="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <th scope="row">Super Kingdom</th>
                    <td>
                      {{
                        details?.taxonomic_domain && details.taxonomic_domain !== 'null'
                          ? details.taxonomic_domain
                          : 'Not Specified'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Super Family</th>
                    <td>
                      {{
                        details?.family_superfamily_name &&
                        details.family_superfamily_name !== 'null'
                          ? details.family_superfamily_name
                          : 'Not Specified'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Family</th>
                    <td>
                      {{
                        details?.family_name && details.family_name !== 'null'
                          ? details.family_name
                          : 'Not Specified'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Sub-group</th>
                    <td>
                      {{
                        details?.subgroup && details.subgroup !== 'null'
                          ? details.subgroup
                          : 'Not Specified'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Species</th>
                    <td>
                      {{
                        details?.species && details.species !== 'null'
                          ? details.species
                          : 'Not Specified'
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <strong>Hierarchical taxonomic classification: </strong>
                <!-- {{ process_specie_description(details?.species_description || 'Not Specified') }} -->
                <!-- <TaxonomyFlow :taxonomy="parseTaxonomy(details?.species_description)" width="100%" height="fit-content"/> -->

                <div style="overflow-x: auto; white-space: nowrap; max-width: 100%">
                  <v-treeview
                    :items="buildTaxonomyPath(parseTaxonomy(details?.organism_lineage))"
                    item-title="label"
                    item-children="children"
                    open-all
                    activatable
                    density="comfortable"
                    max-width="1200"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 class="h3"><strong>Sequence Information</strong></h3>
              <p class="text-sm">
                <strong>Length:</strong>
                {{
                  details?.sequence_length && details?.sequence_length != 'null'
                    ? details.sequence_length
                    : 'Not Specified'
                }}
              </p>
              <p class="text-sm">
                <strong>Molecular Mass:</strong>
                {{
                  details?.sequence_mass && details?.sequence_mass != 'null'
                    ? details?.sequence_mass +
                      ' (in Daltons) or ' +
                      ' (' +
                      (details?.sequence_mass / 1000).toFixed(1) +
                      ' in kDa) '
                    : 'Not Specified'
                }}
              </p>
              <p class="text-sm">
                <strong>Sequence: >>></strong> &nbsp;
                <ExpandableText
                  :text="details?.sequence_sequence || ''"
                  :limit="500"
                  mode="chars"
                />
              </p>
            </div>

            <div class="row">
                    <div class="col-md-12">
                      <div class="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <strong>Biological process (UniProt): </strong>&nbsp;
                          <ExpandableText
                            :text="
                              details?.biological_process && details?.biological_process != 'null'
                                ? details.biological_process
                                : 'Not Specified'
                            "
                            :limit="100"
                          />
                          <strong>Cellular Components (UniProt): </strong>&nbsp;
                          <ExpandableText
                            :text="
                              details?.cellular_component && details?.cellular_component != 'null'
                                ? details.cellular_component
                                : 'Not Specified'
                            "
                            :limit="100"
                          />
                          <strong>Molecular Functions (UniProt): </strong>&nbsp;
                          <ExpandableText
                            :text="
                              details?.molecular_function && details?.molecular_function != 'null'
                                ? details.molecular_function
                                : 'Not Specified'
                            "
                            :limit="100"
                          />

                          <p class="text-sm">
                            <strong>Annotation Score (UniProt): </strong>&nbsp;
                            {{
                              details?.annotation_score && details?.annotation_score != 'null'
                                ? details.annotation_score
                                : 'Not Specified'
                            }}
                          </p>
                          <p class="text-sm">
                            <strong>Disease Name (UniProt) </strong>&nbsp;
                            {{
                              details?.comment_disease_name &&
                              details?.comment_disease_name != 'null'
                                ? details?.comment_disease_name
                                : 'Not Specified'
                            }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

          </div>
        </div>
      </div>
      <div class="col-md-6 p-1 d-flex" style="width: 100% !important">
        <div class="card p-4 border-radius-none" style="width: 100% !important">
          <h2 class="h3 mb-2"><strong>Summary</strong></h2>
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
                      <th>Feature
                        <span
                          class="fa fa-info-circle"
                          tabindex="0"
                          role="button"
                          data-bs-toggle="tooltip"
                        >&#9432;</span>
                      </th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(feature, index) in parseRawData(details?.extra_attributes)
                        ?.countByFeatureType"
                      :key="index"
                    >
                      <td :title="getExplanation(index)">
                        {{ index }}
                        <v-tooltip
                          activator="parent"
                          location="start"
                          max-width="300"
                        >{{getExplanation(index)}}</v-tooltip>
                      </td>
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
                      <th>Type
                        <span
                          class="fa fa-info-circle"
                          tabindex="0"
                          role="button"
                          data-bs-toggle="tooltip"
                        >&#9432;</span>
                      </th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(feature_type, index_type) in parseRawData(details?.extra_attributes)
                        ?.countByCommentType"
                      :key="index_type"
                    >
                      <td :title="getExplanation(capitalize(index_type))">
                        {{ capitalize(index_type) }}
                        <v-tooltip
                          activator="parent"
                          location="start"
                          max-width="300"
                        >{{getExplanation(capitalize(index_type))}}</v-tooltip>
                      </td>
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

                    <table class="table table-bordered table-sm">
                      <tbody>
                        <tr>
                          <th scope="row">Membrane Topology In</th>
                          <td>
                            {{
                              details?.membrane_topology_in &&
                              details.membrane_topology_in !== 'null'
                                ? details.membrane_topology_in
                                : 'Not Specified'
                            }}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Membrane Topology Out</th>
                          <td>
                            {{
                              details?.membrane_topology_out &&
                              details.membrane_topology_out !== 'null'
                                ? details.membrane_topology_out
                                : 'Not Specified'
                            }}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Polymer Composition</th>
                          <td>
                            {{
                              details?.rcsentinfo_polymer_composition &&
                              details.rcsentinfo_polymer_composition !== 'null'
                                ? details.rcsentinfo_polymer_composition
                                : 'Not Specified'
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 col-12">
                <div class="mt-4 grid grid-cols-2 gap-4">
                  <!-- {{ Object.keys(record) }} -->
                  <div
                    v-if="record && Object.keys(record).length > 0"
                    style="border: 2px solid grey; border-radius: 10px; padding: 10px"
                  >
                  
                    <h4 class="h4" style="text-align: center;"><strong>Classification</strong></h4>
                    <hr />
                    <p class="text-sm" v-for="(classification, index) in record" :key="index">
                      <span v-if="index !='Year' && index != 'PDB Code' && index != 'TM (Expert)'">
                        <strong>{{ index }}:</strong>&nbsp; {{ classification }}
                      </span>
                      
                      <span v-else-if="index == 'TM (Expert)'">
                        <hr />
                        <h2 class="h2" style="text-align: center;"><strong>TM Segments (4)</strong></h2>
                        <hr />
                        <strong>{{ index }}:</strong>&nbsp; {{ classification }}
                      </span>
                    </p>
                    <p class="text-sm">
                      <strong>TM (DeepTMHMM):</strong>&nbsp; {{ details?.DeepTMHMM_tm_count }}
                    </p>
                    <p class="text-sm">
                      <strong>TM (TMbed):</strong>&nbsp; {{ details?.TMbed_tm_count }}
                    </p>
                    <p class="text-sm">
                      <strong>TM (OPM):</strong>&nbsp; {{ details?.subunit_segments }}
                    </p>


                      <p class="text-sm">
                        <template
                          v-for="(feature, index) in parseRawData(details?.extra_attributes)?.countByFeatureType"
                          :key="index"
                        >
                          <strong
                            v-if="index.toLowerCase().includes('transmembrane')"
                          >
                          TM (UniProt):
                          </strong><span
                            v-if="index.toLowerCase().includes('transmembrane')"
                          >{{ feature }}</span>
                        </template>
                      </p>


                    
                  </div>
                  <div v-else style="border: 2px solid grey; border-radius: 10px; padding: 10px">
                    <h4 class="h4"><strong>Classification</strong></h4>
                    <p class="text-sm">
                      <span>
                        <strong>Group (OPM):</strong>&nbsp; {{ details?.group }}
                      </span>
                      <br/>
                      <span v-if="mappedGroupName">
                        <strong>Group (MPstruc):</strong>&nbsp; {{ mappedGroupName }}
                      </span>
                    </p>
                    <p class="text-sm">
                      <strong class="badge badge-info">Data Not Available</strong>
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
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import ExpandableText from '@/components/ExpandableText.vue'
// Import PDBe-Mol* CSS and plugin
import 'pdbe-molstar/build/pdbe-molstar-light.css'
import 'pdbe-molstar/build/pdbe-molstar-plugin.js'
import { useDashboardStore } from '@/stores/dashboard'
// import TaxonomyFlow from '@/components/TaxonomyFlow2.vue'
import { VTreeview } from 'vuetify/labs/VTreeview'
import { explanations } from '@/utils/explanations'
import LoaderComponent from "@/components/LoaderComponent.vue";

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
const details = ref({})

const record = ref(null)
const error = ref(null)

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
  plugins: ['membrane-orientation'],
  // defaultPreset: 'membrane-orientation'
})

// Search state
const searchType = ref('pdb')
const searchQuery = ref('')

function getExplanation(featureName) {
  return explanations[featureName] || 'No explanation available.'
}

// function process_specie_description(data_string) {
//   return data_string ? data_string.replace(/;\s*/g, ' -> ').replace(/,\s*/g, ' -> ') : data_string
// }

function parseTaxonomy(input = '') {
  return input
    ?.split(/[,;]+/) // split on commas or semicolons
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseRawData(raw) {
  // 1) if it isn’t a string, bail out
  if (typeof raw !== 'string') {
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


// Mapping dictionary
const groupMap = {
  "Alpha-helical polytopic": "TRANSMEMBRANE PROTEINS:ALPHA-HELICAL",
  "Bitopic proteins": "BITOPIC PROTEINS",
  "Beta-barrel transmembrane": "TRANSMEMBRANE PROTEINS:BETA-BARREL",
  "All alpha monotopic/peripheral": "MONOTOPIC MEMBRANE PROTEINS",
  "All beta monotopic/peripheral": "MONOTOPIC MEMBRANE PROTEINS",
  "Alpha/Beta monotopic/peripheral": "MONOTOPIC MEMBRANE PROTEINS",
  "Alpha + Beta monotopic/peripheral": "MONOTOPIC MEMBRANE PROTEINS",
  "Alpha-helical peptides": "TRANSMEMBRANE PROTEINS:ALPHA-HELICAL"
}

// Computed value for the mapped display name
const mappedGroupName = computed(() => {
  const rawName = details?.value?.famsupclasstype_type_name
  return groupMap[rawName] || rawName || null
})

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
  fetchRecord()
})

async function fetchProteinDetails() {
  try {
    await dashboardStore?.fetchDetails(searchQuery.value)

    const response = dashboardStore.protein_details.data

    let jsonString

    if (typeof response === 'string') {
      jsonString = response
    } else {
      jsonString = JSON.stringify(response)
    }

    const correctedJsonString = jsonString.replace(/\bNaN\b/g, 'null')

    const parsedData = JSON.parse(correctedJsonString)

    details.value = parsedData?.data?.[0] ?? null
  } catch (err) {
    console.error('Error fetching or parsing protein details:', err)
    // details.value = null // fallback or reset
  }
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
  dashboardStore?.getExpertAnnotation(searchQuery.value).then(() => {
    let response = dashboardStore.protein_details_new.data
    record.value = response
  })
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
