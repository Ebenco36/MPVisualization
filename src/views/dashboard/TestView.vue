<template>
  <div class="container-fluid">
    <HeaderCrumbs
      :label="'Single view for ' + searchType + ' with accession code: ' + searchQuery"
      title=""
    />
    <div class="row">
      <!-- Options Panel -->
      <div class="col-lg-2 col-md-2 col-12 mb-0 p-0">
        <aside class="options-panel border rounded p-3 shadow-sm">
          <h3 class="text-primary mb-3">Viewer Options</h3>

          <!-- Search Section -->
          <fieldset class="mb-4">
            <div class="mb-3">
              <label class="form-label">Search Type:</label>
              <select v-model="searchType" class="form-select form-control">
                <option value="pdb">PDB</option>
                <option value="uniprot">UniProt</option>
                <option value="cif">CIF</option>
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

          <!-- Visual Style Options -->
          <fieldset class="mb-4">
            <legend class="text-secondary">Visual Style</legend>
            <div v-for="style in visualStyles" :key="style" class="form-check">
              <input
                type="radio"
                :value="style"
                v-model="selectedVisualStyle"
                class="form-check-input"
              />
              <label class="form-check-label">{{ style }}</label>
            </div>
          </fieldset>
        </aside>
      </div>

      <!-- Viewer Container -->
      <div class="col-lg-10 col-md-10 col-12">
        <div ref="viewerContainer" class="molstar-container border rounded shadow-sm"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import 'pdbe-molstar/build/pdbe-molstar-light.css'
import 'pdbe-molstar/build/pdbe-molstar-plugin.js'

// Viewer container reference
const viewerContainer = ref(null)
let viewerInstance = null // Viewer instance

// State
const searchType = ref('pdb')
const searchQuery = ref('')
const opts = reactive({
  customData: {
    url: 'https://alphafold.ebi.ac.uk/files/AF-O15552-F1-model_v1.cif',
    format: 'cif'
  },
  bgColor: { r: 255, g: 255, b: 255 },
  sequencePanel: true,
  landscape: true
})

// Visual styles
const visualStyles = [
  'cartoon',
  'ball-and-stick',
  'carbohydrate',
  'distance-restraint',
  'ellipsoid',
  'gaussian-surface',
  'molecular-surface',
  'point',
  'putty',
  'spacefill'
]
const selectedVisualStyle = ref('cartoon') // Default visual style

// Function to apply visual style
async function setVisualStyle(style) {
  if (!viewerInstance) return

  const structures = viewerInstance.plugin.managers.structure.hierarchy.current.structures
  if (structures.length === 0) return

  // Apply the selected visual style
  await viewerInstance.plugin.builders.structure.representation.applyPreset(
    structures[0].cell.obj,
    style
  )
}

// Watch for changes in the selected visual style
watch(selectedVisualStyle, (newStyle) => {
  setVisualStyle(newStyle)
})

// Watch for changes in searchType or searchQuery
watch([searchType, searchQuery], () => {
  if (searchType.value.toLowerCase() === 'pdb') {
    opts.customData.url = `https://files.rcsb.org/download/${searchQuery.value}.pdb`
    opts.customData.format = 'pdb'
  } else if (searchType.value.toLowerCase() === 'uniprot') {
    opts.customData.url = `https://swissmodel.expasy.org/repository/uniprot/${searchQuery.value}.pdb`
    opts.customData.format = 'pdb'
  } else if (searchType.value.toLowerCase() === 'cif') {
    opts.customData.url = `https://alphafold.ebi.ac.uk/files/${searchQuery.value}`
    opts.customData.format = 'cif'
  }
  renderViewer()
})

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

  // Apply the default visual style
  setVisualStyle(selectedVisualStyle.value)
}

// Initial render
onMounted(() => {
  renderViewer()
})
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
</style>