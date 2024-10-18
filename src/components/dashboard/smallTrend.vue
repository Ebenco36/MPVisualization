<template>
    <div ref="chart" class="chart-container"></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import vegaEmbed from 'vega-embed';

// Props
const props = defineProps({
    data: {
        type: Array,
        default: () => [
            { year: '2020', count: 10 },
            { year: '2021', value: 20 },
            { year: '2022', value: 15 }
            // Default data points
        ]
    },
    width: {
        type: [Number, String],
        default: 'container'
    },
    height: {
        type: Number,
        default: 20
    }
});

// Refs
const chart = ref(null);

// Watch for data changes
watch(() => props.data, () => renderChart(), { deep: true });

// Lifecycle hook
onMounted(() => {
    renderChart();
});

// Method to render chart
function renderChart() {
    const spec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "A simple smooth trend chart with embedded data.",
        data: {
            values: props.data
        },
        width: props.width, // Uses width from props
        height: props.height, // Uses height from props
        mark: {
            type: 'line',
            interpolate: 'monotone', // Makes the line smooth
            point: true // Removes points on the line
        },
        encoding: {
            x: {
                field: 'year',
                type: 'N',
                axis: {
                    title: null, // Remove the title on the x-axis
                    labels: true, // Remove labels on the x-axis
                    ticks: false,
                    domain: false,
                    values: [props.data[0].year, props.data[props.data.length - 1].year],
                    labelAngle: 0
                }
            },
            y: {
                field: 'count',
                type: 'quantitative',
                axis: {
                    title: null, // Remove the title on the x-axis
                    labels: false, // Remove labels on the y-axis
                    ticks: false,
                    domain: false
                }
            },
            tooltip: [
                { field: 'year', type: 'N', title: 'Year' },
                { field: 'count', type: 'quantitative', title: 'Count' }
            ]
        },
        config: {
            background: null, // Removes the background
            view: {
                stroke: null, // Removes the border around the chart
                padding: 0 // Removes any padding around the chart
            },
            axis: {
                grid: false // Removes the grid lines
            }
        }
    };

    vegaEmbed(chart.value, spec, { actions: false }); // Disables the tool menu
}
</script>

<style scoped>
.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>