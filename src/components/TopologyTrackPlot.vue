<template>
  <div class="topology-track-plot">
    <div v-if="!tracks.length" class="topology-track-plot__empty">No topology tracks available.</div>
    <template v-else>
      <div class="topology-track-plot__viewport">
        <div ref="chartEl" class="topology-track-plot__chart"></div>
      </div>
      <div class="topology-track-plot__legend">
        <span class="topology-track-plot__legend-label">Color legend:</span>
        <span class="topology-track-plot__legend-item">
          <span class="topology-track-plot__swatch topology-track-plot__swatch--membrane"></span>
          TM segment
        </span>
        <span class="topology-track-plot__legend-item">
          <span class="topology-track-plot__swatch topology-track-plot__swatch--inside"></span>
          Inside
        </span>
        <span class="topology-track-plot__legend-item">
          <span class="topology-track-plot__swatch topology-track-plot__swatch--outside"></span>
          Outside
        </span>
        <span class="topology-track-plot__legend-item">
          <span class="topology-track-plot__swatch topology-track-plot__swatch--signal"></span>
          Signal
        </span>
        <span class="topology-track-plot__legend-item">
          <span class="topology-track-plot__swatch topology-track-plot__swatch--subunit"></span>
          subunit
        </span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { getPlotly } from '@/utils/heavyLoaders'

const props = defineProps({
  tracks: {
    type: Array,
    default: () => []
  },
  sequenceLength: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: 'TM segment comparison'
  }
})

const chartEl = ref(null)

function sourceColor(source = '') {
  // console.log(source)
  const normalized = String(source).toLowerCase()
  // console.log(normalized)
  if (normalized.includes('signal'))  return '#eb8a23'
  if (normalized.includes('subunit')) return '#7c3aed'
  if (normalized.includes('inside'))  return '#5b9bd5'
  if (normalized.includes('outside')) return '#b0b0b0'
  if (normalized.includes('membrane'))return '#ffcc18'
  if (normalized.includes('H')) return '#ffcc18'
  if (normalized.includes('h')) return '#ffcc18'
  if (normalized.includes('TMDET membrane chain')) return '#ffcc18'
  return '#b0b0b0'
}

async function renderChart() {
  if (!chartEl.value || !props.tracks.length) return
  const Plotly = await getPlotly()

  const yOrder = [...new Set(props.tracks.map((item) => item.trackLabel))]
  const yLookup = Object.fromEntries(yOrder.map((label, index) => [label, yOrder.length - index]))
  const shapes = []
  const hoverX = []
  const hoverY = []
  const hoverData = []

  props.tracks.forEach((track) => {
    const yCenter = yLookup[track.trackLabel]
    ;(track.segments || []).forEach((segment) => {
      const start = Math.max(Number(segment.start || 1), 1)
      const end = Math.max(Number(segment.end || start), start)
      const length = Math.max(Number(segment.length || (end - start + 1)), 1)
      shapes.push({
        type: 'rect',
        x0: start,
        x1: end,
        y0: yCenter - 0.3,
        y1: yCenter + 0.3,
        fillcolor: sourceColor(segment.kind),
        line: {
          color: '#ffffff',
          width: 1
        }
      })
      hoverX.push(start + length / 2)
      hoverY.push(yCenter)
      hoverData.push([
        track.trackLabel,
        segment.label || 'Region',
        start,
        end,
        length,
        track.sequenceContext || 'Sequence'
      ])
    })
  })

  const trace = {
    type: 'scatter',
    mode: 'markers',
    x: hoverX,
    y: hoverY,
    marker: {
      size: 18,
      opacity: 0
    },
    customdata: hoverData,
    hovertemplate:
      '<b>%{customdata[0]}</b><br>' +
      'Region: %{customdata[1]}<br>' +
      'Range: %{customdata[2]}-%{customdata[3]}<br>' +
      'Length: %{customdata[4]} aa<br>' +
      'Context: %{customdata[5]}<extra></extra>'
  }

  const tickInterval = props.sequenceLength > 1000 ? 200 : 100
  const tickvals = [1]
  for (let tick = tickInterval; tick <= props.sequenceLength; tick += tickInterval) {
    tickvals.push(tick)
  }
  if (props.sequenceLength && tickvals[tickvals.length - 1] !== props.sequenceLength) {
    tickvals.push(props.sequenceLength)
  }

  const layout = {
    title: {
      text: props.title,
      x: 0.01,
      xanchor: 'left',
      font: {
        size: 16,
        color: '#17324d'
      }
    },
    barmode: 'overlay',
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff',
    margin: {
      l: 190,
      r: 24,
      t: 52,
      b: 56
    },
    height: Math.max(280, yOrder.length * 56 + 120),
    xaxis: {
      title: 'Residue position',
      range: [0.5, Math.max(props.sequenceLength || 1, 1) + 0.5],
      tickvals,
      tickfont: {
        size: 11,
        color: '#17324d'
      },
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      automargin: true,
      tickmode: 'array',
      tickvals: yOrder.map((label) => yLookup[label]),
      ticktext: yOrder,
      showgrid: false,
      zeroline: false
    },
    shapes,
    showlegend: false
  }

  const config = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'toggleSpikelines']
  }

  await Plotly.react(chartEl.value, [trace], layout, config)
}

onMounted(() => {
  renderChart()
})

watch(
  () => [props.tracks, props.sequenceLength, props.title],
  () => {
    renderChart()
  },
  { deep: true }
)

onBeforeUnmount(async () => {
  if (!chartEl.value) return
  const Plotly = await getPlotly()
  Plotly.purge(chartEl.value)
})
</script>

<style scoped>
.topology-track-plot__chart {
  width: 100%;
  min-height: 260px;
}

.topology-track-plot__viewport {
  max-height: 760px;
  overflow-y: auto;
  padding-right: 6px;
}

.topology-track-plot__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  margin-top: 10px;
  color: #17324d;
  font-size: 0.86rem;
}

.topology-track-plot__legend-label {
  font-weight: 700;
}

.topology-track-plot__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.topology-track-plot__swatch {
  display: inline-flex;
  width: 14px;
  height: 14px;
  border-radius: 2px;
}

.topology-track-plot__swatch--membrane {
  background: #ffcc18;
}

.topology-track-plot__swatch--inside {
  background: #5b9bd5;
}

.topology-track-plot__swatch--outside {
  background: #b0b0b0;
}

.topology-track-plot__swatch--signal {
  background: #eb8a23;
}

.topology-track-plot__swatch--subunit {
  background: #7c3aed;
}

.topology-track-plot__empty {
  padding: 18px;
  border-radius: 12px;
  background: #f7fafc;
  color: #56718f;
}
</style>
