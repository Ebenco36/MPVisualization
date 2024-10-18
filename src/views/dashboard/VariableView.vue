<template>
  <div class="main-content">
    <div class="breadcrumb">
      <h1>Variables</h1>
      <ul>
        <li><a href="">Database</a></li>
        <li>Variable</li>
      </ul>
    </div>
    <div class="separator-breadcrumb border-top"></div>
    <div class="row">
      <div :class="groupClass(group.name)" v-for="(group, groupIndex) in paginatedData" :key="groupIndex">
        <div class="card" v-if="switchCards(group.name)">
          <div class="card-body">
            <div class="card-title">
              <h3 class="card-title">{{ group.name }} Data Group</h3>
            </div>
            <div class="search-container mt-3">
              <input class="form-control" type="text" v-model="group.searchQuery" @input="filterColumns(group)" placeholder="Search...">
            </div>
            <div class="accordion" :id="'accordion' + groupIndex">
              <div class="card ul-card__border-radius">
                <div class="card-header">
                  <h6 class="card-title mb-0">
                    <a class="text-default btn btn-link" data-toggle="collapse" @click.prevent="toggleAccordion(groupIndex)" title="click to open">
                        {{ group.name }}</a
                    >
                  </h6>
                </div>
                <div class="collapse" :id="'accordion-item-group' + groupIndex" :data-parent="'#accordion' + groupIndex">
                  <div class="card-body">
                        <!--new-->
                        <div class="accordion" :id="'accordion-item' + groupIndex + columnIndex" v-for="(column, columnIndex) in group.visibleColumns" :key="columnIndex">
                            <div class="card ul-card__border-radius">
                                <div class="card-header">
                                <h6 class="card-title mb-0">
                                    <a class="text-default" data-toggle="collapse" :href="'#accordion-item-item-group' + groupIndex + columnIndex">
                                        {{ column }}</a
                                    >
                                </h6>
                                </div>
                                <div class="collapse" :id="'accordion-item-item-group' + groupIndex + columnIndex" :data-parent="'#accordion-item' + groupIndex + columnIndex">
                                <div class="card-body">
                                    {{ findTextByKey(column) }}
                                </div>
                                </div>
                            </div>
                        </div>
                        

                        <nav aria-label="Page navigation" class="mt-5">
                          <ul class="pagination justify-content-center">
                            <li :class="(group.currentPage > 1) ? 'page-item' : 'page-item disabled'" @click="goBack(group)">
                              <a class="page-link" href="javascript:void(0)" tabindex="-1">
                                Previous
                              </a>
                            </li>
                            <li v-if="hasMoreData(group) || group.currentPage > 1" class="page-item">
                              <a class="page-link" href="javascript:void(0)">
                                {{ group.currentPage }} / {{ getTotalPages(group) }}
                              </a>
                            </li>
                            <li :class="hasMoreData(group) ? 'page-item' : 'page-item disabled'">
                              <a class="page-link" href="javascript:void(0)" @click="loadMoreColumns(group)">
                                Next
                              </a>
                            </li>
                          </ul>
                        </nav>
                        <!--End new-->
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
import { ref, onMounted } from 'vue';
import { useVennStore } from '@/stores/vennData'
import { useDataStore } from '@/stores/data'
import { useRoute } from 'vue-router';

const vennStore = useVennStore()
const dataStore = useDataStore()
const optionalParam = ref(undefined);
const route = useRoute();

const pageSize = 5;
const paginatedData = ref([]);

const updatePaginatedData = (data) => {
  paginatedData.value = data.map((group) => ({
    ...group,
    currentPage: ref(1),
    visibleColumns: group.columns.slice(0, pageSize)
  }));
};

const hasMoreData = (group) => group.currentPage * pageSize < group.columns.length;
const getTotalPages = (group) => Math.ceil(group.columns.length / pageSize);

const loadMoreColumns = (group) => {
  const start = group.currentPage * pageSize;
  const end = (group.currentPage + 1) * pageSize;
  group.visibleColumns = group.columns.slice(start, end);
  group.currentPage++;
};

const goBack = (group) => {
  group.currentPage = Math.max(group.currentPage - 1, 1);
  const start = (group.currentPage - 1) * pageSize;
  const end = group.currentPage * pageSize;
  group.visibleColumns = group.columns.slice(start, end);
};

function switchCards(group_name) {
  if(optionalParam.value) {
    let levels = optionalParam.value.split("-").slice(1)
    let joined_levels = levels.join(", ")
    if(group_name.toLowerCase() === joined_levels){
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

function groupClass(group_name) {
  if(optionalParam.value) {
    return {
      'col-lg-12 col-md-12 mt-5': switchCards(group_name),
      'col-lg-6 col-md-6 mt-5': !switchCards(group_name),
    }
  } else {
    return {
      'col-lg-6 col-md-6 mt-5': true,
    }
  }
}

const toggleAccordion = (index) => {
  alert("welcome")
  const accordionId = 'accordion-item-group' + index;
  const accordionElement = document.getElementById(accordionId);

  // Toggle collapse state
  if (accordionElement.classList.contains('show')) {
    accordionElement.classList.remove('show');
  } else {
    accordionElement.classList.add('show');
  }
}

const filterColumns = (group) => {
  const query = group.searchQuery.toLowerCase();
  group.visibleColumns = group.columns.filter(column => column.toLowerCase().includes(query)).slice(0, pageSize);
  group.currentPage = 1;
};

const findTextByKey = (key) => {
  const foundKey = dataStore.data.find(item => item.key === key);
  return foundKey ? foundKey.text : "Description construct in progess ...";
};

onMounted(() => {
  // Access the optional parameter
  optionalParam.value = route.params.key;
  vennStore.loadVennData().then(() => {
    updatePaginatedData(vennStore?.venn?.dataList);
  })
});
</script>
