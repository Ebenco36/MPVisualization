<template>
  <div v-if="vennDataTable.length > 0">
    <div class="d-flex justify-content-center">
      <highcharts :options="chartOptions" />
    </div>
    <div class="justify-content-center mt-3 mb-1">
      <router-link
        class="container"
        v-for="dataPoint in vennDataTable"
        :key="dataPoint.sets.join('-')"
        :to="'variables' + dataPoint.link"
      >
        <button v-if="dataPoint.sets.length == 1" class="badge badge-info">{{ dataPoint.sets[0] }}</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useVennStore } from '@/stores/vennData'

const vennStore = useVennStore()

const vennDataTable = ref([]);

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'venn',
      width: 400,
      height: 400,
    },
    title:null,
    //title: {
    //  text: 'Venn Diagram',
    //  style: {
    //    fontSize: 30,
    //  },
    //},
    series: [{ data: vennDataTable.value }],
    credits: {
      enabled: false,
    },
    tooltip: {
      formatter() {
        return `<strong>${this.point.sets.join(", ")}</strong><br />
                <span>Value: ${this.point.value}</span><br />
                <span>Attributes: ${this.point.attributes}</span>`;
      },
    },
    legend: {
      align: 'left',
    },
    colors: [
      '#D9DE84', '#005EB8', '#93C4F6', '#636B05'
    ],
  };
});

const getFirstThreeItemsAsString = (columns) => {
  return columns.slice(0, 3).join(', ');
};

function formatData(items) {
  vennDataTable.value = items.map((item) => ({
    sets: item.name.split(", "),
    value: item.column_count,
    attributes: "Attributes " + item.name + " : " + getFirstThreeItemsAsString(item.columns),
    link: item.route,
  }));
}

onMounted(() => {
  vennStore.loadVennData().then(() => {
    formatData(vennStore?.venn?.dataList)
  })
})
</script>
<style lang="scss" scoped>
.container {
  width: 80%;
  margin: auto;
}
.highcharts-figure,
.highcharts-data-table table {
    min-width: 320px;
    max-width: 700px;
    margin: 1em auto;
}

.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}

.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}

.highcharts-data-table th {
    font-weight: 600;
    padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
    padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
    background: #f8f8f8;
}

.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

</style>
