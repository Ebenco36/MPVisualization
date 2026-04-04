<template>
  <div class="generic-viewer-wrapper">
    <Transition name="fade">
      <div v-if="loading" class="viewer-overlay">
        <span class="viewer-spinner" />
        <span>Loading structure…</span>
      </div>
    </Transition>

    <div v-if="error" class="viewer-notice viewer-notice--error">✕ {{ error }}</div>

    <div ref="containerEl" class="molstar-mount" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { loadPdbeMolstar } from '@/utils/heavyLoaders'

const props = defineProps({
  pdbId: {
    type: String,
    default: '',
  },
  bgColor: {
    type: Object,
    default: () => ({ r: 255, g: 255, b: 255 }),
  },
  sequencePanel: {
    type: Boolean,
    default: true,
  },
  landscape: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['loaded', 'error'])

const containerEl = ref(null)
const loading = ref(false)
const error = ref('')

let viewerInstance = null
let loadVersion = 0

function buildOptions(pdbId) {
  return {
    customData: {
      url: `https://files.rcsb.org/download/${pdbId.toUpperCase()}.cif`,
      format: 'cif',
    },
    bgColor: { ...props.bgColor },
    hideControls: false,
    sequencePanel: props.sequencePanel,
    landscape: props.landscape,
    loadingOverlay: true,
    selection: false,
    selectInteraction: false,
    symmetryAnnotation: true,
    domainAnnotation: true,
    validationAnnotation: true,
    alphafoldView: false,
    plugins: [],
  }
}

function cleanupViewer() {
  if (viewerInstance?.plugin?.dispose) {
    try {
      viewerInstance.plugin.dispose()
    } catch (disposeError) {
      console.warn('[GenericStructureViewer] dispose error:', disposeError)
    }
  }

  viewerInstance = null

  if (containerEl.value) {
    containerEl.value.innerHTML = ''
  }
}

async function renderViewer() {
  const pdbId = props.pdbId?.trim()
  if (!containerEl.value) return

  if (!pdbId) {
    cleanupViewer()
    loading.value = false
    error.value = ''
    return
  }

  const currentLoad = ++loadVersion
  loading.value = true
  error.value = ''

  try {
    cleanupViewer()
    await loadPdbeMolstar()

    if (currentLoad !== loadVersion) return

    if (!window.PDBeMolstarPlugin) {
      throw new Error('PDBe Molstar plugin could not be initialized.')
    }

    viewerInstance = new window.PDBeMolstarPlugin()
    const renderOptions = buildOptions(pdbId)
    await Promise.resolve(viewerInstance.render(containerEl.value, renderOptions))

    if (currentLoad !== loadVersion) return
    emit('loaded')
  } catch (renderError) {
    console.error('[GenericStructureViewer]', renderError)
    if (currentLoad !== loadVersion) return

    error.value = `Failed to load "${pdbId.toUpperCase()}": ${renderError.message}`
    emit('error', error.value)
  } finally {
    if (currentLoad === loadVersion) {
      loading.value = false
    }
  }
}

onMounted(renderViewer)

watch(() => props.pdbId, renderViewer)
watch(() => props.sequencePanel, renderViewer)
watch(() => props.landscape, renderViewer)
watch(() => props.bgColor, renderViewer, { deep: true })

onBeforeUnmount(() => {
  loadVersion += 1
  cleanupViewer()
})
</script>

<style scoped>
.generic-viewer-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.molstar-mount {
  width: 100%;
  height: 100%;
}

.viewer-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  color: #333;
  border-radius: inherit;
}

.viewer-spinner {
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid #ddd;
  border-top-color: #555;
  animation: generic-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes generic-spin { to { transform: rotate(360deg); } }

.viewer-notice {
  padding: 8px 14px;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-bottom: 8px;
  line-height: 1.4;
}

.viewer-notice--error {
  background: #ffebee;
  border-left: 4px solid #e53935;
  color: #7f0000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
