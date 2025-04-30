<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';
import AppButton from '@/components/common/AppButton.vue'
import FiltersComponent from '@/components/FiltersComponent.vue'

const router = useRouter()

const pdbCode = ref('8hpk')
const viewer = ref(null)
const display = ref(null)
const assembly = ref('None')
const model = ref('Model 1')
const symmetry = ref('None')

const content = ref({})

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
    
    {
        name: "Ligand",
        value: "ballandstick",
        options: [
            { name: "Ball & Stick", value: "ballandstick" },
            { name: "Spacefill", value: "spacefill" },
        ]
    },
    
    {
        name: "Quality",
        value: "auto",
        options: [
            { name: "Automatic", value: "auto" },
            { name: "Low", value: "low" },
            { name: "Medium", value: "medium" },
            { name: "High", value: "high" },
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
        display.value, {
            rows: 2,
            cols: 2,
            control_all: true  //mouse controls all viewers
        },
        { width: 1200, height: 600, defaultcolors: mol3D.elementColors.rasmol,});
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

    // Set visualization options
    viewer.value.setStyle({[options.value.find(option => option.name === 'Style').value]: { color: options.value.find(option => option.name === 'Color').value } });
    viewer.value.setBackgroundColor('white');

    // Apply user-selected options
    applyUserOptions();

    // Zoom to the structure
    viewer.value.zoomTo();

    // Render the viewer
    viewer.value.render();
    } catch (error) {
    console.error('Error fetching or visualizing PDB data:', error);
    }
}
function applyUserOptions() {
    // Apply user-selected options here
    // Example: Set assembly                                                                                                                                                                            
    if (assembly.value !== 'None') {
    // Apply assembly-specific settings
    }

    // Example: Set model
    if (model.value !== 'Model 1') {
    // Apply model-specific settings
    }

    // Example: Set symmetry
    if (symmetry.value !== 'None') {
    // Apply symmetry-specific settings
    }

    // Add more conditions for other options
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

async function fetchProteinData() {
    const apiEndpoint = `https://data.rcsb.org/rest/v1/core/entry/${pdbCode.value}`;

    try {
    const response = await axios.get(apiEndpoint);
        content.value = response.data
    } catch (error) {
        console.error('Error fetching protein data:', error);
    }
}

onMounted(() => {
    pdbCode.value = router.currentRoute.value.params.pdb_code || '8hpk';
    initializeViewer();
    fetchAndVisualizePDB();
    fetchProteinData()
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
      <div :class="toggleFilter ? 'col-md-3 col-sm-12' : 'd-none'">
        <div class="card mb-4">
            <div class="card-body">
            <div class="form-group mb-3">
                <h5>Filter Result</h5>
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
      <div :class="toggleFilter ? 'col-md-9 col-lg-9' : 'col-md-12'">
        <div class="row">
          <div class="col-md-12">
            <div class="card mb-4">
              <div class="card-body p-0" style="overflow-y: auto;">
                <h5 class="card-title m-0 p-3">Protein Structure</h5>
                <div ref="display"  style="text-align: center; width: 90%; height: 500px; margin: 0 auto;" ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
