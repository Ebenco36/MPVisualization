<template>
    <div>
        welcome
      <highcharts :constructorType="'stockChart'" class="hc" :options="chartOptions" ref="chart"></highcharts>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        chartOptions: {
          series: [
            {
              data: [1, 2, 3]
            }
          ]
        }
      };
    }
  };
  </script>
  