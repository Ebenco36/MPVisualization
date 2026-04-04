<template>
    <div ref="chart" class="chart-container"></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import vegaEmbed from 'vega-embed';

const props = defineProps({
    data: {
        type: Array,
        default: () => [
            { year: '2020', count: 10 },
            { year: '2021', value: 20 },
            { year: '2022', value: 15 }
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

const chart = ref(null);

watch(() => props.data, () => renderChart(), { deep: true });

onMounted(() => {
    renderChart();
});

function renderChart() {
    if (!chart.value || !props.data?.length) {
        return;
    }

    const spec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "A simple smooth trend chart with embedded data.",
        data: {
            values: props.data
        },
        width: props.width,
        height: props.height,
        mark: {
            type: 'line',
            interpolate: 'monotone',
            point: true
        },
        encoding: {
            x: {
                field: 'year',
                type: 'N',
                axis: {
                    title: null,
                    labels: true,
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
                    title: null,
                    labels: false,
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
            background: null,
            view: {
                stroke: null,
                padding: 0
            },
            axis: {
                grid: false
            }
        }
    };

    vegaEmbed(chart.value, spec, { actions: false });
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
