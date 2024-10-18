<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card mb-4">
        <div class="card-body p-2">
          <div class="row">
            <div class="col-md-12 text-center">
              <!-- <h4 class="mt-4">Data Exploration</h4> -->
              <!-- <div class="alert alert-info">
                To visually represent categorical data, set the categorical field value. For quantitative visualization, set the categorical field to '' or empty.
              </div> -->
              
            </div>
            
            <div class="col-md-6 col-lg-4 col-sm-12">
              <h5 class="mt-4">Chart Specifications</h5>
              
              <div class="form-group mb-3" v-if="experiment_method_filter?.data?.options">
                  <label for="picker1">{{ experiment_method_filter?.data?.field_name }}
                      <!-- <span class="my-tooltip-inner ml-1">
                          <i class="">?</i>
                      </span> -->
                  </label>
                  <model-list-select
                    :list="experiment_method_filter?.data?.options"
                    v-model="tab.data[`method_filter_${tab.number}`]"
                    option-value="value"
                    option-text="name"
                    placeholder="select experimental method"
                    @blur="getOtherFilter"
                  >
                </model-list-select>
                  <!--
                  <select class="form-control" v-model="tab.data[`method_filter_${tab.number}`]" @change="getOtherFilter">
                      <option value="">select option...</option>
                      <option 
                          v-for="data in experiment_method_filter?.data?.options" 
                          :key="data.value" 
                          :value="data?.value"
                      >
                          {{ data?.name }}
                      </option>
                  </select>
                -->
              </div>
              <div class="row">
                <div class="form-group col-md-6" v-if="tab.data[`other_filters_${tab.number}`]?.quantitative?.options">
                  <label>X-Axis ({{ tab.data[`other_filters_${tab.number}`]?.quantitative?.field_name }})
                      <!-- <span class="my-tooltip-inner ml-1">
                          <i class="">?</i>
                      </span> -->
                  </label>
                  <!--
                  <select class="form-control" v-model="tab.data[`x_axis_${tab.number}`]">
                    <option>select option</option>
                    <option 
                      v-for="data in tab.data[`other_filters_${tab.number}`]?.quantitative?.options" 
                      :key="data.value" 
                      :value="data?.value"
                    >{{ data?.name }}</option>
                  </select>
                -->
                  <model-list-select
                    :list="tab.data[`other_filters_${tab.number}`]?.quantitative?.options"
                    v-model="tab.data[`x_axis_${tab.number}`]"
                    option-value="value"
                    option-text="name"
                    placeholder="select x-axis"
                  >
                </model-list-select>
                </div>
                <div class="form-group col-md-6" v-if="tab.data[`other_filters_${tab.number}`]?.quantitative?.options">
                  <label>Y-Axis ({{ tab.data[`other_filters_${tab.number}`]?.quantitative?.field_name }})
                      <!-- <span class="my-tooltip-inner ml-1">
                          <i class="">?</i>
                      </span> -->
                  </label>
                  <!-- 
                  <select class="form-control" v-model="tab.data[`y_axis_${tab.number}`]">
                    <option>select option</option>
                    <option 
                      v-for="data in tab.data[`other_filters_${tab.number}`]?.quantitative?.options" 
                      :key="data.value" 
                      :value="data?.value"
                    >{{ data?.name }}</option>
                  </select>
                -->
                  <model-list-select
                    :list="tab.data[`other_filters_${tab.number}`]?.quantitative?.options"
                    v-model="tab.data[`y_axis_${tab.number}`]"
                    option-value="value"
                    option-text="name"
                    placeholder="select x-axis"
                  >
                </model-list-select>
                </div>
                <div class="col-md-12">
                  <div class="form-group mb-3" v-if="tab.data[`other_filters_${tab.number}`]?.categorical?.options">
                    <label for="picker1">Group By ({{ tab.data[`other_filters_${tab.number}`]?.categorical?.field_name }})
                      <!-- <span class="my-tooltip-inner ml-1">
                          <i class="">?</i>
                      </span> -->
                    </label>
                    <!--
                    <select class="form-control" v-model="tab.data[`categorical_${tab.number}`]">
                        <option value="">select option...</option>
                        <option 
                          v-for="data in tab.data[`other_filters_${tab.number}`]?.categorical?.options" 
                          :key="data.value" 
                          :value="data?.value"
                        >{{ data?.name }}</option>
                    </select>
                  -->
                    <model-list-select
                    :list="tab.data[`other_filters_${tab.number}`]?.categorical?.options"
                    v-model="tab.data[`categorical_${tab.number}`]"
                    option-value="value"
                    option-text="name"
                    placeholder="select categorical variable"
                  >
                </model-list-select>
                </div>
                </div>
                <div class="col-md-12 text-md-right">
                  <button class="btn btn-info blue ml-auto" @click="loadData">
                    Visualize
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-8 col-sm-12">
              <h5 class="mt-4">Chart</h5>
              <div class="col-md-12">
                
                <div class="form-group mb-3" v-if="tab.data[`other_filters_${tab.number}`]?.chart_types?.options">
                    <label for="picker1">Chart Type
                      <!-- <span class="my-tooltip-inner ml-1">
                          <i class="">?</i>
                      </span> -->
                    </label>
                    <!--
                    <select class="form-control" v-model="tab.data[`chart_types_${tab.number}`]">
                        <option value="">select option...</option>
                        <option 
                          v-for="data in tab.data[`other_filters_${tab.number}`]?.chart_types?.options" 
                          :key="data.value" 
                          :value="data?.value"
                        >{{ data?.name }}</option>
                    </select>
                  -->
                    <model-list-select
                      :list="tab.data[`other_filters_${tab.number}`]?.chart_types?.options"
                      v-model="tab.data[`chart_types_${tab.number}`]"
                      option-value="value"
                      option-text="name"
                      placeholder="select x-axis"
                    >
                  </model-list-select>
                </div>
                
                <div class="border" style="border: 1px solid grey; width: 100%;">
                  <!-- Render your chart using the fetched data -->
                  <GraphView 
                    v-if="tab.chartData && tab.chartData.chart"
                    :id="'HHHH' + tab.number" 
                    :summary="tab.chartData.chart" 
                  />
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
import GraphView from '@/components/dashboard/GraphView.vue'
import DashboardService from '@/services/dashboard.service'
import { ref, toRefs, onMounted, defineEmits } from 'vue';
import { useFilterStore } from '@/stores/filters'
import { ModelListSelect } from "vue-search-select"
import "vue-search-select/dist/VueSearchSelect.css"
import axios from 'axios';

const filters = useFilterStore()
const props = defineProps({
  tab: Object,
})
const {tab} = toRefs(props)
const experiment_method_filter = ref({})

const emit = defineEmits(["update-tab-data"]);


async function getOtherFilter() {
  console.log(tab)
  const endpoint = "method-based-filter?method_type=" + tab.value.data[`method_filter_${tab.value.number}`]
  await DashboardService.fetchData(endpoint)
  .then((res) => {
      if (res) {
          let response = res?.data
          tab.value.data[`other_filters_${tab.value.number}`] = response?.data
          updateParent()
      }
  })
  .catch((error) => {
      console.log(error)
  })
}


async function loadData() {
  const endpoint = "method-based-filter?method_type=" + tab.value.data[`method_filter_${tab.value.number}`]
  let data = {
    'x_axis': tab.value.data[`x_axis_${tab.value.number}`],
    'y_axis': tab.value.data[`y_axis_${tab.value.number}`],
    'categorical_axis': tab.value.data[`categorical_${tab.value.number}`],
    'experimental_method': tab.value.data[`method_filter_${tab.value.number}`],
    'chart_type': tab.value.data[`chart_types_${tab.value.number}`]
  }
  await DashboardService.postData(endpoint, data)
  .then((res) => {
      if (res) {
          let response = res?.data
          tab.value.chartData = response?.data
          console.log(tab.value.chartData)
      }
  })
  .catch((error) => {
      console.log(error)
  })
}

const updateParent = () => {
  emit('update-tab-data', tab.value);
};

onMounted(() => {
  filters.loadFilters().then(() => {
      tab.value.data[`experiment_method_filter_${tab.value.number}`] = filters?.filters?.data.experimental_method_list
      experiment_method_filter.value = filters?.filters?.data.experimental_method_list

  })

  getOtherFilter()

});

</script>

<style scoped>
.card{
    border-radius: 0px !important;
}
</style>