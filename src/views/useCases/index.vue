<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import Swal from 'sweetalert2'
import AppButton from '@/components/common/AppButton.vue'
import { useCasesStore } from '@/stores/use_cases'
import GraphView from '@/components/dashboard/GraphView.vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'

const router = useRouter()
const casesStore = useCasesStore()

const chart_width = ref(null)
const width = ref(null)
const toggleFilter = ref(true)
const useCases = ref(null)
const category = ref(null)
const features = ref([])
const chart_type = ref(null)
const chart_obj = ref(null)
const chart_trend = ref(null)
const outlier_detection_by_method = ref(null)
const outlier_detection_algorithm = ref(null)
const errors = ref([])
const view = ref(router.currentRoute.value.params?.view)
const page_title = ref("")

function handleFilter() {
  toggleFilter.value = !toggleFilter.value
  fetchCharts()
}

function convertToTitleCase(str) {
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, match => match.toUpperCase())
}

const fetchCharts = debounce(async () => {
  try {
    if ((features.value).length == 1) {
      alert("You must select more than one variable or leave it empty.")
      return 
    }
    const data = {
      use_case: useCases.value,
      category: category.value,
      features: features.value,
      chart_type: chart_type.value,
      chart_width: width.value,
      chart_trend: chart_trend.value,
      outlier_detection_by_method: outlier_detection_by_method.value,
      outlier_detection_algorithm: outlier_detection_algorithm.value
    }
    await casesStore.getUseCasesChart(data)
    chart_obj.value = casesStore.get_use_cases_chart_data.data?.data
  } catch (error) {
    console.error('Error fetching data:', error)
    Swal.fire({
      title: 'Error',
      text: 'Error fetching chart data. Please try again later.',
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }
}, 300) // Debounce by 300ms

const get_features = computed(() => {
  const data = casesStore.use_cases_data.data?.data
  if (!data) return []
  return outlier_detection_by_method.value === 'EM' ? data.em_features : data.x_ray_features
})

function formatString(input) {
  return input
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

watch(chart_trend, (new_chart_trend) => {
  if (new_chart_trend) {
    chart_type.value = 'bar'
  }
}, { deep: true })

watch(useCases, (new_use_cases) => {
  if (new_use_cases == "outlier_detection") {
    outlier_detection_algorithm.value = 'DBSCAN'
    outlier_detection_by_method.value = 'X-ray'
  }
}, { deep: true })

watch(
  () => router.currentRoute.value.params?.view,
  (newView) => {
    view.value = newView;
    page_title.value = "summary_statistics" + " view"
    if (view.value != "" && view.value != "summary_statistics") {
      useCases.value = view.value
      page_title.value = view.value + " view"
    } else {
      useCases.value = "summary_statistics"
      category.value = "group"
      chart_type.value = "bar"
      chart_trend.value = "No"
    }
    page_title.value = formatString(page_title.value)
    fetchCharts()
    console.log('View updated to:', newView);
  }
);

onMounted(() => {
    casesStore.loadUseCases()
    
    const updateWidth = () => {
        if (chart_width.value) {
        width.value = chart_width.value.clientWidth
        }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)

    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth)
    })
    page_title.value = "summary_statistics" + " view"
    if (view.value != "" && view.value != "summary_statistics") {
      useCases.value = view.value
      page_title.value = view.value + " view"
    } else {
      useCases.value = "summary_statistics"
      category.value = "group"
      chart_type.value = "bar"
      chart_trend.value = "No"
    }
    page_title.value = formatString(page_title.value)
    fetchCharts()
})
</script>

<template>
  <div class="main-content">
    <HeaderCrumbs :label="page_title" title="" />
    <div class="row">
      <div class="col-md-12 text-right">
        <AppButton label="Filter" class="custom-btn filter" icon="book-icon" :handleClick="handleFilter" />
      </div>
      <div :class="toggleFilter ? 'col-md-3 col-sm-12' : 'd-none'">
        <div class="card mb-4">
          <div class="card-body">
            <div class="form-group mb-3">
              <h5>{{ ((view != '') ? "Option" : "Use Cases" )}}</h5>
            </div>
            <div class="form-group mb-3">
              <label>{{ ((view != '') ? "Views" : "Use Cases" )}}:</label>
              <select class="form-control" v-model="useCases" :disabled="(view != '')" :class="{ readonly: (view != '') }">
                <option>Select option</option>
                <option value="summary_statistics">Summary Statistics View</option>
                <option value="outlier_detection">Outlier Detection View</option>
                <option value="discrepancies">Discrepancies View</option>
                <!-- <option value="group_classification">MP Classification</option> -->
              </select>
            </div>
            <div class="form-group mb-3" v-if="useCases === 'summary_statistics'">
              <label>View Trend ? :</label>
              <select class="form-control" v-model="chart_trend">
                <option>Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div class="form-group mb-3" v-if="useCases === 'summary_statistics'">
              <label>Select Chart Type:</label>
              <select class="form-control" v-model="chart_type">
                <option>Select option</option>
                <option value="bar">Bar</option>
                <option value="line" v-if="chart_trend === 'Yes'">Line</option>
              </select>
            </div>
            <div class="form-group mb-3" v-if="useCases === 'summary_statistics'">
              <label>Group by Membrane Protein Structure (MPs) Category:</label>
              <select class="form-control" v-model="category">
                <option>Select option</option>
                <option value="group">MPs Group</option>
                <option value="taxonomic_domain">MPs Taxonomic Domain</option>
                <option value="rcsentinfo_experimental_method">MPs Experimental Methods</option>
              </select>
            </div>
            <div class="form-group mb-3" v-if="useCases === 'outlier_detection'">
              <label>Select Experimental Method:</label>
              <select class="form-control" v-model="outlier_detection_by_method">
                <option>Select option</option>
                <option value="X-ray">X-ray Crystallography (X-Ray)</option>
                <option value="EM">Cryo-Electron Microscopy (EM)</option>
                <!-- <option value="all">Both</option> -->
              </select>
            </div>
            
            <div class="form-group mb-3" v-if="useCases === 'outlier_detection'">
              <label>Outlier Detection Method:</label>
              <select ref="form_input" class="form-control" v-model="outlier_detection_algorithm" name="outlier_detection_algorithm">
                <option v-for="item in casesStore.use_cases_data.data?.data?.outlier_detection_algorithms" :key="item">{{ item }}</option>
              </select>
            </div>

            <div class="form-group mb-3" v-if="useCases === 'outlier_detection'">
              <label>{{outlier_detection_by_method}} Variables:</label>
              <select ref="form_input" :multiple="true" class="form-control" v-model="features" name="features">
                <option v-for="item in get_features" :key="item">{{ item }}</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary" style="color:white;" @click="fetchCharts">View</button>
          </div>
        </div>
      </div>
      <div :class="toggleFilter ? 'col-md-9 col-lg-9' : 'col-md-12'">
        <div class="row">
          <div class="col-md-12">
            <div class="card mb-4">
              <div class="card-body p-0" style="overflow-y: auto;">
                <h5 class="card-title m-0 p-3">{{ useCases ? page_title : 'Use case title'}}</h5>
                <div class="container content" ref="chart_width">
                  <GraphView id="usecases" :summary="chart_obj" :show_loading="false" :use_card="true" />
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
