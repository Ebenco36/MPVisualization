<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';
import AppButton from '@/components/common/AppButton.vue'
import { useDashboardStore } from '@/stores/dashboard'
const router = useRouter()

const dashboardStore = useDashboardStore()
const pdbCode = ref('8hpk')
const viewer = ref(null)
const details = ref({})

const desserts = [
          {
            name: 'Frozen Yogurt',
            calories: 159,
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
          },
          {
            name: 'Eclair',
            calories: 262,
          },
          {
            name: 'Cupcake',
            calories: 305,
          },
          {
            name: 'Gingerbread',
            calories: 356,
          },
          {
            name: 'Jelly bean',
            calories: 375,
          },
          {
            name: 'Lollipop',
            calories: 392,
          },
          {
            name: 'Honeycomb',
            calories: 408,
          },
          {
            name: 'Donut',
            calories: 452,
          },
          {
            name: 'KitKat',
            calories: 518,
          },
        ]

const options = ref([
    {
        name: "Style",
        value: "cartoon",
        options: [
            { name: "Sphere", value: "sphere" },
            { name: "Stick", value: "stick" },
            { name: "Cartoon", value: "cartoon" },
            { name: "Cross", value: "cross" },
            { name: "Line", value: "line" },
        ]
    },
    {
        name: "Color",
        value: "spectrum",
        options: [
            { name: "By Spectrum", value: "spectrum" },
            { name: "By Chain", value: "chain" },
        ]
    },
])

const toggleFilter = ref(true)
function handleFilter() {
  toggleFilter.value = !toggleFilter.value
}

async function initializeViewer() {
    try {
    // Dynamically import 3Dmol.js library
    const mol3D = await import('3dmol/build/3Dmol.js');
    viewer.value = mol3D.createViewer(
        "display", {
            rows: 2,
            cols: 2,
            control_all: true
        },
       );
    
    } catch (error) {
    console.error('Error loading 3Dmol library:', error);
    }
}
async function fetchAndVisualizePDB() {
    try {
      // Fetch PDB data using PDB code
      const pdbData = await fetchPDBData(pdbCode.value);

      if (!viewer.value) {
          setTimeout(() => fetchAndVisualizePDB(), 100);
          return;
      }
      // Clear existing models
      viewer.value.clear();
      // Add the PDB data to the viewer
      viewer.value.addModel(pdbData, 'pdb');
      viewer.value.zoomTo(); 
      // Set visualization options
      viewer.value.setStyle({[options.value.find(option => option.name === 'Style').value]: { color: options.value.find(option => option.name === 'Color').value } });
      viewer.value.setBackgroundColor('white');

      // Zoom to the structure
      viewer.value.zoomTo();

      // Render the viewer
      viewer.value.render(function() {
          // Assuming the viewer creates canvas or other elements, find these elements
          var canvas = document.querySelector('#display canvas');
          if (canvas) {
              canvas.id = 'display-canvas';  // Assigning an ID to the canvas element
          }
      });
    } catch (error) {
      console.error('Error fetching or visualizing PDB data:', error);
    }
}

async function fetchPDBData(pdbCode) {
    const pdbUrl = `https://files.rcsb.org/download/${pdbCode}.pdb`;
    const response = await axios.get(pdbUrl);
    return response.data;
}
function updateVisualization() {
    // You can add more logic here if needed
    fetchAndVisualizePDB();
}
function handleMouseClick(event) {
    if (viewer.value && viewer.value.renderer) {
    // Get the mouse coordinates relative to the canvas
    const x = event.clientX - viewer.value.container.offsetLeft;
    const y = event.clientY - viewer.value.container.offsetTop;

    // Pick the object at the mouse position
    const picked = viewer.value.renderer.domElement.getBoundingClientRect();
    const mouseX = ((x - picked.left) / picked.width) * 2 - 1;
    const mouseY = -((y - picked.top) / picked.height) * 2 + 1;

    const raycaster = new viewer.value.Raycaster();
    raycaster.setFromCamera({ x: mouseX, y: mouseY }, viewer.value.camera);

    const intersects = raycaster.intersectObjects(viewer.value.scene.children, true);

    if (intersects.length > 0) {
        // Handle the picked object (you can access the object in intersects[0])
        const pickedObject = intersects[0].object;
        console.log('Picked Object:', pickedObject);
    }
    }
}

async function fetchProteinDetails() {
    dashboardStore?.fetchDetails(pdbCode.value).then(() => {
      let response = dashboardStore.protein_details.data
      let correctedJsonString = response.replace(/\bNaN\b/g, "null");
      details.value = JSON.parse(correctedJsonString)?.data[0]
    })
}

function parseComplexJSON(jsonString) {
  if (jsonString && (jsonString.length > 0)) {
    let jsonCompatibleString = jsonString
        .replace(/'/g, '"')  // Convert single quotes to double quotes
        .replace(/\bTrue\b/g, 'true')  // Convert True to true
        .replace(/\bFalse\b/g, 'false')  // Convert False to false
        .replace(/\bNone\b/g, 'null');  // Convert None to null

    // Parse the string into an actual JavaScript array
    let arrayList;
    try {
        arrayList = JSON.parse(jsonCompatibleString);
        return arrayList
    } catch (e) {
        console.error("Error parsing JSON!", e);
    }
  } else {
    return jsonString
  }
}

function processesList(data_string) {
    // Splitting the biologicalProcess, cellular and molecular function string into an array
    return data_string ? data_string.split('; ') : data_string;
}

function process_specie_description(data_string) {
  return data_string ? data_string.replace(/,\s*/g, " -> ") : data_string
}

function viewItem(pdb_code) {
  window.open(`/#/molecular-viewer/${pdb_code}`, '_blank');
}

onMounted(() => {
    pdbCode.value = router.currentRoute.value.params.pdb_code || '8hpk';
    initializeViewer();
    fetchAndVisualizePDB();
    fetchProteinDetails()
})
</script>
<template>
  <div class="main-content">
    <div class="row">
      <div class="col-md-12 text-right">
        <AppButton
          label="Filter"
          class="custom-btn filter"
          icon="book-icon"
          :handleClick="handleFilter"
        />
      </div>
      <div :class="toggleFilter ? 'col-md-4 col-sm-12' : 'd-none'">
        <div class="card mb-4">
            <div class="card-body">
            <div class="form-group mb-3">
                <h5>Filter Result</h5>
            </div>
            <div class="">
              <button @click="viewItem(pdbCode)" class="badge badge-info">View</button>
            </div>
            <div class="" style="margin: 0 0 auto;">
              <div id="display" style="width: 100%; height: 250px;" ></div>
            </div>
            
            <div class="form-group mb-3" v-for="(items, index) in options" :key="index">
                <label>{{ items.name }}:</label>
                <select class="form-control" v-model="items.value" @change="updateVisualization">
                    <option value="None">None</option>
                    <option :value="option.value" v-for="(option, itemindex) in items.options" :key="itemindex">
                        {{ option.name }}
                    </option>
                    <!-- Add more assembly options as needed -->
                </select>
            </div>
            </div>
        </div>
      </div>
      <div :class="toggleFilter ? 'col-md-8 col-lg-8' : 'col-md-12'">
        <div class="row">
          <div class="col-md-12">
            <div class="card mb-4">
              <div class="card-body p-0" style="overflow-y: auto;">
                <h5 class="card-title m-0 p-3">Protein Summary {{ pdbCode }} (Has pdb code been replaced ? {{ details?.is_replaced == "Replaced" ? "Yes" : "No" }})</h5>
                <div class="container content">
                    <p><strong>Name:</strong>&nbsp;
                        {{ details?.name_x }}
                    </p>

                    <p><strong>Author(s):</strong>
                        <a v-for="author in parseComplexJSON(details?.audit_author)" :key="author" :href="'https://www.rcsb.org/search?q=audit_author.name:' + author.name">
                            {{ author?.name}}, 
                        </a>
                    </p>
                    <p><strong>Group:</strong>&nbsp; {{ details?.group }}</p>
                    <p><strong>Sub-Group:</strong>&nbsp; {{ details?.subgroup }}</p>
                    <p><strong>Species:</strong>&nbsp; {{ details?.species }}</p>
                    <p><strong>Taxonomic Domain:</strong>&nbsp; {{ details?.taxonomic_domain }}</p>
                    <p><strong>Expressed in Species:</strong>&nbsp; {{ details?.expressed_in_species }}</p>

                    <p><strong>Membrane Name:</strong>&nbsp; {{ details?.membrane_name }}</p>
                    <p><strong>Family:</strong>&nbsp; {{ details?.family_name }}</p>
                    <p><strong>Super Family:</strong>&nbsp; {{ details?.family_superfamily_name }}</p>
                    <p><strong>Species Description:</strong>&nbsp; {{ process_specie_description(details?.species_description) }}</p>
                    <p><strong>Membrane Topology In:</strong>&nbsp; {{ details?.membrane_topology_in }}</p>
                    <p><strong>Membrane Topology Out:</strong>&nbsp; {{ details?.membrane_topology_out }}</p>
                    <p><strong>Polymer Composition:</strong>&nbsp; {{ details?.rcsentinfo_polymer_composition }}</p>
                  </div>
              </div>
            </div>
          </div>
        </div>


        <!-- <div class="row">
          <div class="col-md-12">
            <div class="card mb-4">
              <div class="card-body p-0" style="overflow-y: auto;">
                <h5 class="card-title m-0 p-3">Protein Functions</h5>
                <div class="row container content m-0">
                  
                  <div class="col-md-6 col-lg-4 p-1">
                    <div class=" mt-4">
                        <h4>Molecular Function</h4>
                        <ol class="list-group list-group-numbered" style="max-height: 300px; overflow: scroll;">
                          <li v-for="item in processesList(details?.molecular_function)" :key="item" class="list-group-item">{{ item }}</li>
                        </ol>
                    </div>
                  </div>

                  <div class="col-md-6 col-lg-4 p-1">
                    <div class=" mt-4">
                        <h4>Biological Process</h4>
                        <ol class="list-group list-group-numbered" style="max-height: 300px; overflow: scroll;">
                          <li v-for="item in processesList(details?.biological_process)" :key="item" class="list-group-item">{{ item }}</li>
                        </ol>
                    </div>
                  </div>

                  <div class="col-md-6 col-lg-4 p-1">
                    <div class=" mt-4">
                        <h4>Cellular Component</h4>
                        <ol class="list-group list-group-numbered" style="max-height: 300px; overflow: scroll;">
                            <li v-for="item in processesList(details?.cellular_component)" :key="item" class="list-group-item">{{ item }}</li>
                        </ol>
                    </div>
                  </div>
                  
                  <p class="pt-5"><strong>Comment:</strong>&nbsp; {{ details?.comments }}</p>
                </div>
              </div>
            </div>
          </div>
        </div> -->


        <!--Descriptions-->
        <div class="row">
          <div class="col-md-12">
            <div class="card mb-4">
              <div class="card-body p-0" style="overflow-y: auto;">
                <h5 class="card-title m-0 p-3">Experimental Information</h5>
                <div class="container content">
                    <p><strong>Experimental Method:</strong>&nbsp; {{ details?.rcsentinfo_experimental_method }}</p>
                    
                    <h5><strong>Crystal Information:</strong></h5>
                    <hr/>
                    <p><strong>Crystal Matthews Density:</strong> {{ details?.exptl_crystal_density_matthews }}</p>
                    <p><strong>Crystal Density Measure:</strong>  {{ details?.exptl_crystal_density_meas }}</p>
                    <p><strong>Crystal Growth Method:</strong> {{ details?.exptl_crystal_grow_method1 }}</p>
                    <p><strong>Crystal Growth Method:</strong>  {{ details?.exptl_crystal_grow_method2 }}</p>
                    <p><strong>Crystal Growth Temp:</strong> {{ details?.exptl_crystal_grow_temp }}</p>
                    <p><strong>Crystal Mosaicity:</strong>  {{ details?.exptl_crystal_pdbx_mosaicity }}</p>
                    <p><strong>Crystal Number:</strong> {{ details?.exptl_crystals_number }}</p>
                    <p><strong>Density Percent Sol:</strong>  {{ details?.expcrydensity_percent_sol }}</p>
                    
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="card mb-4">
              <div class="card-body p-0" style="overflow-y: auto;">
                <h5 class="card-title m-0 p-3">Citation Information</h5>
                <div class="container content">

                    <p><strong>Paper Title:</strong>&nbsp; {{ details?.struct_title }}</p>
                    <p><strong>Journal:</strong>&nbsp; {{ details?.rcspricitation_journal_abbrev }}</p>
                    <p><strong>Country:</strong>&nbsp; {{ details?.rcsb_primary_citation_country }}</p>
                    <p><strong>Citation Count:</strong>&nbsp; {{ details?.citations_count }}</p>
                </div>
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
</style>
