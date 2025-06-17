<template>
  <div class="main-content">
    <HeaderCrumbs label="Summary Statistics Details" :title="convertToTitleCase(selected_option)" />
    <!--
      <div class="card app-card overview">
        <h2>Overview</h2>
        <div class="line"></div>
        <p>
          In progress ...
        </p>
      </div>
    -->
    <div class="row">
      <div class="col-lg-8">
        <div class="card ">
          <div class="card-body">
            <div class="card-title">
              <div class="text-muted text-center">{{title}}</div>
            </div>
            <form class="form-inline" v-if="items.length > 50" @submit.prevent="fetchGraphSummaries">
              <!-- First Select Input -->
              <div class="form-group col-md-5">
                <label for="select1" class="">From: </label>
                <select class="col-md-12 form-control" id="select1" v-model="range_filter.from">
                  <option :value="item" v-for="item in getIntervalsWithLast(items.length)" :key="item">
                    From {{ item }}
                  </option>
                </select>
              </div>

              <!-- Second Select Input -->
              <div class="form-group col-md-5">
                <label for="select2" class="">To: </label>
                <select class="col-md-12 form-control" id="select2" v-model="range_filter.to">
                  <option :value="item" v-for="item in getIntervalsWithLast(items.length)" :key="item">
                    To {{ item }}
                  </option>
                </select>
              </div>

              <!-- Button -->
              <div class="col-md-2">
                <label for="select2" class="">...</label>
                <button type="submit" class="btn btn-primary" style="color:white;">View</button>
              </div>
            </form>
            <div class="app-card data-card" id="display"></div>
          </div>
        </div>
        <div class="mt-5">
        <TableComponent
          :key="tableKey"
          :headers="headers"
          :items="items"
          :rows-per-page="10"
          :allowDownloads="true"
          :current-page="1"
          alternating
        />
      </div>
      </div>
      <div class="col-lg-4">
        <div class="card app-card data-card">
          <div class="header-view"><h5>{{ removeUnderscoreAndCapitalize(dataList?.section) }}</h5></div>
          <div class="card-main">
            <div class="data-list">
              <div class="list-item" v-for="item in dataList.data" :key="item.value" @click="getSelected(item.value)">
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="col-md-12 mb-5">
            <!--Other list-->
            <div class="accordion" :id="'accordion' + index" v-for="item, index in otherDataList" :key="index">
              <div class="card ul-card__border-radius">
                <div class="card-header">
                  <h6 class="card-title mb-0">
                    <a class="text-default btn btn-link" data-toggle="collapse" @click.prevent="toggleAccordion(index)" title="click to open">
                      {{getPageTitle(item.section)}}
                    </a>
                  </h6>
                </div>
                <div class="collapse" :id="'accordion-item-group' + index" :data-parent="'#accordion' + index">
                  <div class="card-body">
                    <div class="data-list">
                      <div class="pointer pointer-on-hover list-item" v-for="item_list in item.data" :key="item_list.value" @click="getSelected(item_list.value)">
                        {{ item_list.name }}
                      </div>
                    </div>
                  </div>
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
import dashboardService from '../../../services/dashboard.service';
import TableComponent from "@/components/TableComponent.vue";
import HeaderCrumbs from "@/components/dashboard/HeaderCrumbs.vue";
import embed from 'vega-embed'
import { useRoute } from 'vue-router'
import { ref, onMounted, toRaw } from 'vue'
import queryString from 'query-string';
const dataList = ref([
  { id: 1, name: 'Multiple Choice' },
  { id: 2, name: 'Multi-method' },
  { id: 3, name: 'X-ray' },
  { id: 4, name: 'Protein Only' },
  { id: 8, name: 'X-ray' },
  { id: 9, name: 'Protein Only' },
  { id: 5, name: 'Protein Choice' },
  { id: 6, name: 'Multiple Choice' },
  { id: 7, name: 'Multi-method' },
  { id: 10, name: 'Protein Choice' }
])
const otherDataList = ref({})
const title = ref("")

const router = useRoute()
const graph = ref([])
const basic_stats = ref(null)
const options = ref([])
const selected_option = ref(null)
const headers = ref([])
const items = ref([])
const range_filter = ref({
  "from": 0,
  "to": 50
})

const tableKey = ref(0)

function convertToTitleCase(str) {
  return (
    str 
      ? str.replace(/processed/g, "")
        .replace(/rcsentinfo/g, "").replace(/_/g, ' ')
        .toLowerCase().replace(/\b\w/g, match => match.toUpperCase()) 
      : str
  )
}

function getSelected(value) {
  if (value && Array.isArray(value)) {
    basic_stats.value = value[1];
    selected_option.value = value[1];
    fetchGraphSummaries();
  } else {
    basic_stats.value = value;
    selected_option.value = value;
    fetchGraphSummaries();
  }
}

function generateQueryString(queryParams) {
  return queryString.stringify(queryParams);
}


function checkType(variable) {
  if (typeof variable === 'string') {
    return variable
  } else if (typeof variable === 'object' && !Array.isArray(variable) && variable !== null) {
    if (variable.text && typeof variable.text == "object") {
      return variable?.text?.join(" ")
    }
    return variable?.text
  } else {
    return variable
  }
}

function getPageTitle(title){
  let text = ""
  if(title == 'data_distribution')
    text = "Data Distribution"
  if(title == 'released_structure_per_year')
    text = "Released Structure Rer Year"
  if(title == 'Other Variables')
    text = "Other Variables"
  return text
}

function fetchGraphSummaries() {
  tableKey.value += 1
  const id = router?.params?.id;
  let path = "field_selection=" + id
  let payload = {}
  if(selected_option.value) {
    path = "field_selection=" + selected_option.value
  }
  if(items.value.length > 50) {
    let from = range_filter.value?.from
    let to = range_filter.value?.to
    payload["from"] = from
    payload["to"] = to
  }

  console.log(range_filter.value?.to)
  payload = generateQueryString(payload)
  console.log(payload)
  dashboardService.summaryStats(path, payload).then(async (response) => {
      let resp = response?.data;
      graph.value = resp?.data;
      options.value = resp?.search_object;
      items.value = resp?.dataframe;
      headers.value = resp?.headers;
      dataList.value = resp?.group_dict;
      otherDataList.value = resp?.other_group_dict;
      let clonedObject = { ...graph.value };
      title.value = checkType(clonedObject.title)
      graph.value.title = null
      embed("#display", structuredClone(toRaw(graph.value)));
    })
    .catch((err) => {
      console.log("There is an error" + err);
    });
}

function getIntervals(length) {
  const intervals = [];
  for (let i = 0; i < length; i += 50) {
    intervals.push(i);
  }
  return intervals;
}

function getIntervalsWithLast(length) {
  const intervals = getIntervals(length)
  // Add the last number if it's not already included
  if (intervals[intervals.length - 1] !== length) {
    intervals.push(length);
  }
  return intervals;
}

function removeUnderscoreAndCapitalize(str = "") {
  // Split the string into words using underscores as separators
  const words = str.split("_");
  // Capitalize each word and join them back together
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  // Join the capitalized words with spaces to form the final result
  const result = capitalizedWords.join(" ");
  return result;
}

const toggleAccordion = (index) => {
  const accordionId = 'accordion-item-group' + index;
  const accordionElement = document.getElementById(accordionId);

  // Toggle collapse state
  if (accordionElement.classList.contains('show')) {
    accordionElement.classList.remove('show');
  } else {
    accordionElement.classList.add('show');
  }
}

// Load data on component mount
onMounted(() => {
  fetchGraphSummaries()
});
</script>
<style scoped>
.pointer-on-hover {
  cursor: pointer;
}
</style>
