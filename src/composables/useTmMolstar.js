// useTmMolstar.js

import { loadTmMolstar } from '@/utils/heavyLoaders'

export async function createTmViewer(containerEl) {
  const tm = await loadTmMolstar()
  const viewer = new tm.Viewer(containerEl, {
    layoutShowControls: false,
    layoutIsExpanded:   false,
    layoutShowSequence: true,
    layoutShowLog:      false,
    viewportShowExpand: true,
    collapseLeftPanel:  true,
  })
  return viewer
}

/**
 * Pre-flight check: fetch regionDescriptorUrl and verify it returns
 * a non-empty, valid JSON body before handing it to tm_molstar.
 * Throws a clean error if the annotation is missing so the caller
 * can fall back to GenericStructureViewer.
 */
async function assertRegionDescriptorAvailable(url) {
  let res
  try {
    res = await fetch(url)
  } catch (e) {
    throw new Error(`Network error fetching region descriptor: ${e.message}`)
  }

  if (!res.ok) {
    throw new Error(`Region descriptor not available (HTTP ${res.status}): ${url}`)
  }

  const text = await res.text()
  if (!text || !text.trim()) {
    throw new Error(`Region descriptor is empty for: ${url}`)
  }

  try {
    JSON.parse(text)
  } catch {
    throw new Error(`Region descriptor is not valid JSON: ${url}`)
  }
  // All good — tm_molstar can safely fetch it again internally
}

export async function loadWithMembraneOrientation(viewer, {
  structureUrl,
  regionDescriptorUrl,
  side1 = 'Inside',
}) {
  // Check annotation is available BEFORE giving it to tm_molstar
  await assertRegionDescriptorAvailable(regionDescriptorUrl)

  const tm = await loadTmMolstar()
  await tm.loadWithUNITMPMembraneRepresentation(viewer.plugin, {
    structureUrl,
    regionDescriptorUrl,
    side1,
  })
}

export function disposeTmViewer(viewer) {
  if (!viewer) return
  try { viewer.plugin?.dispose() }
  catch (err) { console.warn('[useTmMolstar] dispose error:', err) }
}