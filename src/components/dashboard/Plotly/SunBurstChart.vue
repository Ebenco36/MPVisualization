<template>
    <div class="card mb-4">
        <div class="card-body">
            <div class="form-group mb-3">
                <h5>View Chart</h5>
            </div>
            {{ chartData.value }}
            <div class="">
                <p>
                    <b>
                        The graph illustrates the quantity of entries for membrane protein structures, 
                        categorized by major groups and their respective sub-groups. 
                        It provides a visual representation of the distribution and relative 
                        proportions of membrane protein metadata across different classifications.
                    </b>
                </p>
            </div>
            <div class="row">
                <div class="form-group mb-3 col-md-4">
                    <label for="" >Select Chart Type </label>
                    <select class="form-control" v-model="chart">
                        <option>select option...</option>
                        <option  value="sunburst"> SunBurst Chart </option>
                        <option  value="treemap"> TreeMap Chart </option>
                    </select>
                </div>
                <div class="form-group mb-3 col-md-4">
                    <label for="" >Chart Width </label>
                    <input class="form-control" v-model="chart_width"/>
                </div>
                <div class="form-group mb-3 col-md-4">
                    <label for="" >Chart Height </label>
                    <input class="form-control" v-model="chart_height"/>
                </div>
            </div>
            <div class="form-group text-right">
                <AppButton
                label="View Chart"
                class="btn-primary btn-large mt-3"
                :handleClick="handleFilter"
                />
            </div>
            <div class="chart-div">
                <PlotlyChart :chartData="chartData" :layout="layout" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import PlotlyChart from '../PlotlyView.vue'
import { useExtraStore } from '@/stores/extraChart'
import AppButton from '@/components/common/AppButton.vue'

const extraStore = useExtraStore()
const chartData = ref([]);
const chart = ref("");
const chart_width = ref(800);
const chart_height = ref(500);
const layout = ref({
margin: { l: 0, r: 0, b: 0, t: 0 }
});


function handleFilter(){
    getChart()
}

async function getChart() {
    let param = {
        "chart_width": chart_width.value,
        "chart_height": chart_height.value,
        "chart_type": chart.value
    }
    await extraStore?.loadExtraData(param).then(() => {
        chartData.value = extraStore.extra.dataList
    })
}

onMounted(() => {
    getChart()
});
</script>
<style scoped>
.chart-div{
    margin-left: auto; 
    margin-right: auto; 
    display: flex; 
    justify-content: center; 
    align-items: center;
    overflow: auto;
}
.js-plotly-plot{
    width: max-content!important;
    height: max-content!important;
}
</style>