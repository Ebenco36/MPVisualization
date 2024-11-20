<template setup>
  <div class="main-content">
    
    <HeaderCrumbs label="Summary Statistics View" title="" />
    <!-- <div class="card app-card overview">
      <h2>Summary Statistics View</h2> 
      <div class="line"></div>
    </div> -->
   
    <div class="row">
      <div 
        class="col-lg-6" 
        v-for="summary in dataList"
        :key="summary.section"
      >
        <div class="card app-card data-card">
          <div class="header-view"><h5>{{ removeUnderscoreAndCapitalize(summary.section) }}</h5></div>
          <div class="card-main">
            <div class="data-list">
              <div
                class="list-item"
                v-for="(item, index) in summary.data"
                :key="index"
                @click="handleGoto(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import dashboardService from '../../../services/dashboard.service';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

const dataList = ref([])

function handleGoto(id) {
  router.push(`/summary/${id.value}`)
}

function fetchGraphSummaries() {
  dashboardService.summaryStats("stats-data=stats-categories").then(async (response) => {
      dataList.value = response.data;
    })
    .catch((err) => {
      console.log("There is an error" + err);
    });
}

function removeUnderscoreAndCapitalize(str) {
  // Split the string into words using underscores as separators
  const words = str?.split("_");
  // Capitalize each word and join them back together
  const capitalizedWords = words?.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  // Join the capitalized words with spaces to form the final result
  const result = capitalizedWords?.join(" ");
  return result;
}

// Load data on component mount
onMounted(() => {
  fetchGraphSummaries()
});
</script>
<style lang=""></style>
