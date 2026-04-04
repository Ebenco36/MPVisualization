<script setup>
import { onMounted, ref } from 'vue'
import TableComponent2 from '@/components/TableComponent2.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const reorderedArray = ref([])

const desiredOrder = [
  'id',
  'name',
  'pdb_code',
  'uniprot_id',
  'comment_disease_name',
  'resolution',
  'species',
  'group',
  'subgroup',
  'taxonomic_domain',
  'exptl_method',
  'expressed_in_species',
]

function reorderArray(originalArray, order) {
  return [...(originalArray || [])]
    .filter((item) => order.includes(item))
    .sort((left, right) => order.indexOf(left) - order.indexOf(right))
}

onMounted(async () => {
  await dashboardStore.loadDashboardStat('yes')
  reorderedArray.value = reorderArray(dashboardStore.dashboard.headers, desiredOrder)
})
</script>

<template>
  <div class="database-page">
    <div class="database-page__header">
      <div>
        <h1 class="database-page__title">Database Table</h1>
        <p class="database-page__subtitle">
          Browse the full MPstruc dataset, open structure details, and add expert comments directly from each row.
        </p>
      </div>
    </div>

    <TableComponent2
      v-if="reorderedArray.length > 0"
      api-url="data-list"
      :headers="reorderedArray"
      title="Membrane Protein Entries"
    />
    <div v-else class="database-page__loading">Loading database table…</div>
  </div>
</template>

<style scoped>
.database-page {
  width: 100%;
  padding: 1rem;
}

.database-page__header {
  margin-bottom: 0.75rem;
}

.database-page__title {
  margin: 0;
  color: #16324a;
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1.15;
}

.database-page__subtitle {
  margin: 0.35rem 0 0;
  color: #607487;
  line-height: 1.5;
}

.database-page__loading {
  min-height: 220px;
  display: grid;
  place-items: center;
  color: #607487;
  font-weight: 600;
}

@media (max-width: 768px) {
  .database-page {
    padding: 0.75rem;
  }

  .database-page__title {
    font-size: 1.5rem;
  }
}
</style>
