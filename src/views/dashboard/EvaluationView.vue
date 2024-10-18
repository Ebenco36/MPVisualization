<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useEvaluationStore } from '@/stores/evaluation'
import AppButton from '@/components/common/AppButton.vue'
import EvaluationChart from '@/components/dashboard/EvaluationChart.vue'
import FiltersComponent from '@/components/FiltersComponent.vue'

// Reactive state variables
const evaluationStore = useEvaluationStore()
const toggleFilter = ref(false)
const receivedData = ref(reactive({ /* initial object */ }));
const searchQuery = ref('');

function handleFilter() {
  toggleFilter.value = !toggleFilter.value
}
const getChildData = (data) => {
  receivedData.value = data;
  evaluationStore.MLPipeline(receivedData.value).then(() => {
    items.value = evaluationStore?.evaluation?.dataset
  })  
};

// Implement variables visuals
const items = ref([/* Your long list of items here */]);
const itemsPerPage = ref(10);
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return items.value.filter(item => item.toLowerCase().includes(query));
});

const paginatedList = computed(() => filteredItems.value.slice(startIndex.value, endIndex.value));

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

// for each selected option
/*
watchEffect(() => {
  const obj = receivedData.value;

  for (const key in obj) {
    const value = obj[key];

    watchEffect(() => {
      // This inner watchEffect will be triggered on any change in the key or value
      console.log(`Key "${key}" has changed to value "${value}"`);
      evaluationStore.MLPipeline(obj);
    });
  }
});
*/

onMounted(() => {
  evaluationStore.MLPipeline(receivedData.value).then(() => {
    items.value = evaluationStore?.evaluation?.dataset
  })  
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
        <FiltersComponent @childEvent="getChildData"/>
      </div>
      <div :class="toggleFilter ? 'col-md-9 col-lg-9' : 'col-md-12'">
        <div class="row">
          <div class="col-md-12">
            <div class="card mb-4">
              <div class="card-body p-0" style="overflow-y: auto;">
                <h5 class="card-title m-0 p-3">Machine Learning Chart <span data-target=".bd-example-modal-lg" data-toggle="modal" class="badge badge-info">View Dataset</span></h5>
                <EvaluationChart id="ML_chart" :chart="evaluationStore?.evaluation?.ML_chart" v-if="!evaluationStore.isLoading"/>
                <div v-else class="row mb-5 justify-content-center">Loading ...</div>
                <hr/>
                <div class="row p-2 text-center font-weight-bold">
                  <div class="col-md-6">calinski_harabasz: {{ evaluationStore?.evaluation?.accuracy_metrics?.calinski_harabasz }}</div>
                  <div class="col-md-6">silhouette: {{ evaluationStore?.evaluation?.accuracy_metrics?.silhouette }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="card mb-4">
              <div class="card-body p-0" style="overflow-y: auto;">
                <h5 class="card-title m-0 p-3">Dimensionality Reduction Chart</h5>
                <EvaluationChart id="DR_chart" :chart="evaluationStore?.evaluation?.DR_chart" v-if="!evaluationStore.isLoading"/>
                <div v-else class="row mb-5 justify-content-center">Loading ...</div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 col-md-12">
            <div class="card card-chart-bottom o-hidden mb-4">
              <div class="card-body">
                <!--<div class="text-muted">{{ removeUnderscoreAndCapitalize("Chart") }}</div>-->
              </div>
              <v-data-table
                :headers="evaluationStore?.evaluation?.headers"
                :items="evaluationStore?.evaluation?.data"
                items-per-page="10"
                v-if="!evaluationStore.isLoading"
              ></v-data-table>
              <div v-else class="row mb-5 justify-content-center">Loading ...</div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="display: none;">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalCenterTitle">Dataset Variables {{ items.length }}</h5>
                  <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
              </div>
              <div class="modal-body">
                <input class="form-control" v-model="searchQuery" placeholder="Search...">
                <div class="container mt-3">
                  <ol>
                    <li v-for="item in paginatedList" :key="item">{{ item }}</li>
                  </ol>
                  <nav aria-label="Page navigation" class="mt-5">
                    <ul class="pagination justify-content-center">
                      <li :class="(currentPage === 1) ? 'page-item disabled' : 'page-item'" @click="previousPage">
                        <a class="page-link" href="javascript:void(0)" tabindex="-1">
                          Previous
                        </a>
                      </li>
                      <li :class="(currentPage === totalPages) ? 'page-item disabled' : 'page-item'">
                        <a class="page-link" href="javascript:void(0)" @click="nextPage">
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div class="modal-footer">
                  <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
              </div>
          </div>
      </div>
  </div>
  </div>
</template>
<style lang=""></style>
