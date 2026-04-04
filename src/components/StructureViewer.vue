<template>
  <div class="tm-viewer-wrapper">

    <Transition name="fade">
      <div v-if="loading" class="viewer-overlay">
        <span class="viewer-spinner" />
        <span>Loading structure…</span>
      </div>
    </Transition>

    <div v-if="warning" class="viewer-notice viewer-notice--warn">⚠️ {{ warning }}</div>
    <div v-if="error"   class="viewer-notice viewer-notice--error">✕ {{ error }}</div>

    <!-- Molstar canvas -->
    <div ref="containerEl" class="molstar-viewer molstar-mount" />

    <!-- Topology legend — only when TM colouring is active -->
    <Transition name="fade">
      <div v-if="ready" class="tm-legend">
        <span class="legend-label">Topology and Color Annotation</span>
        <div class="legend-chips">
          <span
            v-for="item in LEGEND"
            :key="item.label"
            class="legend-item"
            :style="{ background: item.bg, color: item.fg }"
          >{{ item.label }}</span>
        </div>
        <p class="legend-note">
          This legend follows the official tm_molstar palette from UNITMP/PDBTM.
          Side 1 is currently <strong>{{ props.side1 }}</strong>, so the
          <span style="color:#c00;font-weight:700">red</span> annotation marks
          {{ props.side1 === 'Inside' ? 'Inside' : 'Outside' }} and the
          <span style="color:#00c;font-weight:700">blue</span> annotation marks
          {{ props.side1 === 'Inside' ? 'Outside' : 'Inside' }}.
        </p>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { createTmViewer, loadWithMembraneOrientation, disposeTmViewer } from '@/composables/useTmMolstar'

// ─── Props ────────────────────────────────────────────────────────────────────

const props = defineProps({
  pdbId:               { type: String,  default: '' },
  membraneOrientation: { type: Boolean, default: true },
  side1:               { type: String,  default: 'Inside' },
  bgColor:             { type: Object,  default: () => ({ r: 255, g: 255, b: 255 }) },
  sequencePanel:       { type: Boolean, default: true },
  landscape:           { type: Boolean, default: true },
  structureUrl:        { type: String,  default: '' },
  regionDescriptorUrl: { type: String,  default: '' },
})

// ─── Emits ────────────────────────────────────────────────────────────────────

const emit = defineEmits(['loaded', 'error', 'fallback-needed'])

// ─── State ────────────────────────────────────────────────────────────────────

const containerEl = ref(null)
const loading     = ref(false)
const warning     = ref('')
const error       = ref('')
const ready       = ref(false)

let viewer      = null
let loadVersion = 0

// ─── Official UNITMP/PDBTM legend ────────────────────────────────────────────
// Matches the screenshot from the live PDBTM viewer exactly.
// "Outside" residues fall through the tmdet theme → Molstar default = black.

const LEGEND = [
  // Side colors — driven by ult_inside / ult_outside + side1 orientation
  { label: 'Inside',             bg: 'rgb(255,0,0)',     fg: '#fff' },  // ult_inside
  { label: 'Outside',            bg: 'rgb(0,0,255)',     fg: '#fff' },  // ult_outside
  // Fixed topology classes
  { label: 'Membrane (α/β)',     bg: 'rgb(255,255,0)',   fg: '#333' },  // ult_alpha / ult_beta
  { label: 'Re-entrant loop',    bg: 'rgb(255,127,0)',   fg: '#fff' },  // ult_reentrant
  { label: 'Interfacial helix',  bg: 'rgb(0,255,0)',     fg: '#333' },  // ult_ifh
  { label: 'Membrane inside',    bg: 'rgb(0,255,0)',     fg: '#333' },  // ult_membins
  { label: 'Periplasm',          bg: 'rgb(255,0,255)',   fg: '#fff' },  // ult_periplasm
  { label: 'Unknown',            bg: 'rgb(196,196,196)', fg: '#333' },  // ult_unknown
]

// ─── URL helpers ─────────────────────────────────────────────────────────────

function resolveUrls(pdbId) {
  const id = pdbId.toLowerCase()
  return {
    tmStructureUrl:      `/pdbtm/api/v1/entry/${id}.updated.cif`,
    regionDescriptorUrl: `/pdbtm/api/v1/entry/${id}.json`,
  }
}

// ─── In-place canvas updates — no reload ─────────────────────────────────────

function applyBgColor() {
  if (!viewer?.plugin?.canvas3d) return
  const { r, g, b } = props.bgColor
  viewer.plugin.canvas3d.setProps({
    renderer: { backgroundColor: (r << 16 | g << 8 | b) },
  })
}

/**
 * Toggles the sequence bar above the 3D canvas.
 *
 * plugin.layout.updateProps() is the correct internal method —
 * PluginCommands (xF) is NOT exported on window.tm_molstar.
 *
 * regionState.top:
 *   'full'   → sequence bar visible
 *   'hidden' → sequence bar hidden
 */
function applySequencePanel() {
  if (!viewer?.plugin?.layout) return
  try {
    viewer.plugin.layout.updateProps({
      regionState: {
        ...viewer.plugin.layout.state.regionState,
        top: props.sequencePanel ? 'full' : 'hidden',
      },
    })
  } catch (e) {
    console.warn('[StructureViewer] applySequencePanel error:', e)
  }
}

// ─── Full structure (re)load ──────────────────────────────────────────────────

async function init() {
  const id = props.pdbId?.trim()
  if (!containerEl.value) return

  // Empty query — tear down and reset
  if (!id) {
    if (viewer) { disposeTmViewer(viewer); viewer = null }
    containerEl.value.innerHTML = ''
    loading.value = false
    warning.value = ''
    error.value   = ''
    ready.value   = false
    return
  }

  const currentLoad = ++loadVersion
  loading.value = true
  warning.value = ''
  error.value   = ''
  ready.value   = false

  try {
    // Always create a fresh viewer on PDB ID / orientation changes
    if (viewer) { disposeTmViewer(viewer); viewer = null }
    containerEl.value.innerHTML = ''

    const nextViewer = await createTmViewer(containerEl.value)
    if (currentLoad !== loadVersion) { disposeTmViewer(nextViewer); return }
    viewer = nextViewer

    const resolved = resolveUrls(id)
    const urls = {
      structureUrl:        props.structureUrl        || resolved.tmStructureUrl,
      regionDescriptorUrl: props.regionDescriptorUrl || resolved.regionDescriptorUrl,
      side1:               props.side1,
    }

    if (props.membraneOrientation) {
      // Probe the descriptor first — cheap HEAD request
      let probeOk = false
      try {
        const probe = await fetch(urls.regionDescriptorUrl, { method: 'HEAD' })
        probeOk = probe.ok

        if (!probeOk) {
          // 404 / 500 → structure simply not in PDBTM yet
          const msg = probe.status === 404
            ? `"${id.toUpperCase()}" was not found in the PDBTM database. It may not have membrane topology data yet.`
            : `The PDBTM server returned an error (HTTP ${probe.status}) for "${id.toUpperCase()}".`

          warning.value = msg
          emit('fallback-needed', msg)
          loading.value = false
          return
        }
      } catch (networkErr) {
        warning.value = `Could not reach the PDBTM server for "${id.toUpperCase()}". Check your connection.`
        emit('fallback-needed', warning.value)
        loading.value = false
        return
      }

      // Descriptor exists — proceed with full TM load
      try {
        await loadWithMembraneOrientation(viewer, urls)
        if (currentLoad !== loadVersion) return
        ready.value = true
      } catch (tmError) {
        console.warn('[StructureViewer] membrane load failed:', tmError)
        if (currentLoad !== loadVersion) return
        warning.value = `Membrane orientation could not be applied for "${id.toUpperCase()}".`
        emit('fallback-needed', warning.value)
        return
      }
    } else {
      await viewer.loadStructureFromUrl(urls.structureUrl, 'mmcif', false)
      if (currentLoad !== loadVersion) return
    }

    // In-place settings applied after structure is in the canvas
    applyBgColor()
    applySequencePanel()
    emit('loaded')

  } catch (err) {
    console.error('[StructureViewer]', err)
    if (currentLoad === loadVersion) {
      error.value = `Failed to load "${props.pdbId?.toUpperCase()}": ${err.message}`
      emit('error', err.message)
    }
  } finally {
    if (currentLoad === loadVersion) loading.value = false
  }
}

// ─── Watchers ─────────────────────────────────────────────────────────────────

onMounted(init)

// Full reload — identity or topology orientation changed
watch(() => props.pdbId,               init)
watch(() => props.membraneOrientation,  init)
watch(() => props.side1,               init)

// Cheap in-place — no reload needed
watch(() => props.bgColor,       applyBgColor,       { deep: true })
watch(() => props.sequencePanel, applySequencePanel)

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onBeforeUnmount(() => {
  loadVersion += 1
  disposeTmViewer(viewer)
  viewer = null
})
</script>

<style scoped>
/* Wrapper — flex column so legend sits below canvas */
.tm-viewer-wrapper {
  position:       relative;
  width:          100%;
  height:         100%;
  display:        flex;
  flex-direction: column;
}

/* Canvas — grows to fill, legend gets its natural height below */
.molstar-mount {
  width:      100%;
  flex:       1 1 0;
  min-height: 0;
  position:   relative;
}

.tm-viewer-wrapper :deep(canvas) {
  width:      100% !important;
  min-height: 500px !important;
}

/* Loading overlay */
.viewer-overlay {
  position:        absolute;
  inset:           0;
  z-index:         10;
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             12px;
  background:      rgba(255, 255, 255, 0.80);
  font-size:       .95rem;
  color:           #333;
  border-radius:   inherit;
}

.viewer-spinner {
  display:          block;
  width:            28px;
  height:           28px;
  border-radius:    50%;
  border:           3px solid #ddd;
  border-top-color: #555;
  animation:        tm-spin .7s linear infinite;
  flex-shrink:      0;
}

@keyframes tm-spin { to { transform: rotate(360deg); } }

/* Notice banners */
.viewer-notice {
  padding:       8px 14px;
  border-radius: 4px;
  font-size:     .85rem;
  margin-bottom: 8px;
  line-height:   1.4;
}
.viewer-notice--warn  { background: #fff8e1; border-left: 4px solid #f5a623; color: #7a5800; }
.viewer-notice--error { background: #ffebee; border-left: 4px solid #e53935; color: #7f0000; }

/* Topology legend */
.tm-legend {
  flex-shrink: 0;
  padding:     12px 4px 8px;
  border-top:  1px solid #e3ebf3;
  margin-top:  6px;
}

.legend-label {
  display:     block;
  font-weight: 700;
  color:       #17324d;
  font-size:   .88rem;
  margin-bottom: 8px;
}

.legend-chips {
  display:   flex;
  flex-wrap: wrap;
  gap:       8px;
  margin-bottom: 10px;
}

.legend-item {
  padding:       4px 12px;
  border-radius: 6px;
  font-weight:   600;
  font-size:     .82rem;
  white-space:   nowrap;
}

.legend-note {
  margin:     0;
  color:      #56718f;
  font-size:  .80rem;
  line-height: 1.5;
}

/* Vue transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from,   .fade-leave-to     { opacity: 0; }
.tm-legend {
  flex-shrink:   0;
  padding:       12px 4px 8px;
  border-top:    1px solid #e3ebf3;
  margin-top:    6px;
}

.legend-label {
  display:       block;
  font-weight:   700;
  color:         #17324d;
  font-size:     .88rem;
  margin-bottom: 8px;
}

.legend-chips {
  display:       flex;
  flex-wrap:     wrap;
  gap:           8px;
  margin-bottom: 10px;
}

.legend-item {
  padding:       4px 12px;
  border-radius: 6px;
  font-weight:   600;
  font-size:     .82rem;
  white-space:   nowrap;
  border:        1px solid rgba(0,0,0,0.08);
}

.legend-note {
  margin:      0;
  color:       #56718f;
  font-size:   .80rem;
  line-height: 1.5;
}
</style>