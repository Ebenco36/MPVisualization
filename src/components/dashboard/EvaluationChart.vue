<template>
  <div>
    <div :id="id" style="width: 100%;"></div>
    <div v-show="isContextMenuVisible" :style="{ top: `${rightClickPosition.y}px`, left: `${rightClickPosition.x}px` }" @mousedown="handleMouseDown" class="custom-context-menu">
      <div>
        <strong>Point Information:</strong>
      </div>
      <div v-if="selectedPoint">
        <div><strong>PDB code:</strong> {{ selectedPoint.pdb_code }}</div>
        <div><strong>Name:</strong> {{ selectedPoint.name }}</div>
      </div>
      <!--<div @click="handleProteinInformation(selectedPoint)">View protein</div>-->
    </div>
  </div>
</template>
<script setup>
import { toRaw, toRefs, watchEffect, reactive, ref } from 'vue'
import embed from 'vega-embed'
import { useRouter } from 'vue-router';

const props = defineProps({ chart: Object, id: String })

const router = useRouter();
const { chart, id } = toRefs(props)
const isContextMenuVisible = ref(false);
const rightClickPosition = reactive({ x: 0, y: 0 });
const selectedPoint = ref(null);

const handleRightClick = (event, item) => {
  event.preventDefault(); // Prevent the default context menu
  rightClickPosition.x = event.clientX;
  rightClickPosition.y = event.clientY;
  isContextMenuVisible.value = true;
  console.log(item)
  // Retrieve the selected point information
  selectedPoint.value = item;
};

const handleMouseDown = (event) => {
  // Close the custom menu when clicking outside of it
  if (!event.target.closest('.custom-context-menu')) {
    isContextMenuVisible.value = false;
    selectedPoint.value = null; // Reset selected point information
  }
};

const handleContextMenu = () => {
  isContextMenuVisible.value = false;
  selectedPoint.value = null; // Reset selected point information
};

const handleProteinInformation = (result) => {
  // Protein information
  isContextMenuVisible.value = false;
  selectedPoint.value = null; 
  // router.push('/molecular-viewer/' + result?.pdb_code)
  const newRoute = `/molecular-viewer/${result.pdb_code}`;

  // Open the URL in a new tab
  window.open(newRoute, '_blank');
};

setTimeout(() => {
  watchEffect(async () => {
    if (chart.value) {
      await embed('#'+id.value, structuredClone(toRaw(chart.value)), { actions: true }).then(result => {
        // Attach right-click event handler to the chart container
        result.view.addEventListener('contextmenu', (event, item) => {
            if (item && item.datum) {
                handleRightClick(event, item.datum)
                console.log('Clicked Point Data:', item.datum);
            } else {
                handleContextMenu()
            }
        })
      });
    }
  })
}, 100)
</script>

<style scoped>
.custom-context-menu {
  position: fixed;
  z-index: 1000;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.custom-context-menu div {
  margin: 5px 0;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
}
</style>
