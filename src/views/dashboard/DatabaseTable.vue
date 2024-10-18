<script setup>
import { ref, onMounted } from 'vue'
import TableComponent2 from '@/components/TableComponent2.vue';
import { useDashboardStore } from '@/stores/dashboard'

// Reactive state variables
const dashboardStore = useDashboardStore()
const desiredOrder = [
  'id', 'name', 'pdb_code', 'uniprot_id', 
  'comment_disease_name',
  'resolution', 'species', 'group',
  'subgroup', 'taxonomic_domain',
  'exptl_method', 'expressed_in_species',
];

function reorderArray(originalArray, desiredOrder) {
  // Remove items not present in the desired order
  const filteredArray = originalArray.filter(item => desiredOrder.includes(item));

  // Sort the filtered array based on the desired order
  const sortedArray = filteredArray.sort((a, b) => {
    return desiredOrder.indexOf(a) - desiredOrder.indexOf(b);
  });

  return sortedArray;
}

const reorderedArray = ref([])

onMounted(() => {
  dashboardStore?.loadDashboardStat("yes").then(() => {
    reorderedArray.value = reorderArray(dashboardStore.dashboard.headers, desiredOrder);
  })
  console.log(reorderedArray)

})
</script>
<template>
  <div class="main-content">
    <div class="breadcrumb">
      <h1>Database</h1>
      <ul>
        <li><a href="">Database</a></li>
        <li>Enriched MPstruc</li>
      </ul>
    </div>
    <div class="separator-breadcrumb border-top"></div>
    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="card">
          <div class="card-body">
            <div class="card-title">
              <h3 class="card-title">Enrich MPstruc Data</h3>
            </div>
            <TableComponent2 v-if="reorderedArray.length > 0" api-url="data-list" :headers="reorderedArray"
              title="Membrane Protein Entries"></TableComponent2>
            <div v-else> Loading ...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
