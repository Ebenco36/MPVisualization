import { isProxy, toRaw } from 'vue'
import Plotly from 'plotly.js-dist-min'
import embed from 'vega-embed'

const loadedScripts = new Map()
const loadedStyles = new Map()

function loadScript(src, globalName) {
  if (globalName && typeof window !== 'undefined' && window[globalName]) {
    return Promise.resolve(window[globalName])
  }

  if (!loadedScripts.has(src)) {
    loadedScripts.set(src, new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-src=\"${src}\"]`)
      if (existing) {
        if (existing.dataset.loaded === 'true' || !globalName || window[globalName]) {
          resolve(globalName ? window[globalName] : window)
          return
        }

        existing.addEventListener('load', () => resolve(globalName ? window[globalName] : window))
        existing.addEventListener('error', reject)
        return
      }

      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.dataset.src = src
      script.onload = () => {
        script.dataset.loaded = 'true'
        resolve(globalName ? window[globalName] : window)
      }
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
      document.head.appendChild(script)
    }))
  }

  return loadedScripts.get(src)
}

function loadStyle(href) {
  if (!loadedStyles.has(href)) {
    loadedStyles.set(href, new Promise((resolve, reject) => {
      const existing = document.querySelector(`link[data-href=\"${href}\"]`)
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          resolve()
          return
        }

        resolve()
        return
      }

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.dataset.href = href
      link.onload = () => {
        link.dataset.loaded = 'true'
        resolve()
      }
      link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`))
      document.head.appendChild(link)
    }))
  }

  return loadedStyles.get(href)
}

let pdbeMolstarPromise
let mol3DPromise

export async function getPlotly() {
  return Plotly
}

export async function loadPdbeMolstar() {
  if (typeof window !== 'undefined' && window.PDBeMolstarPlugin) {
    return window.PDBeMolstarPlugin
  }

  if (!pdbeMolstarPromise) {
    pdbeMolstarPromise = Promise.all([
      loadStyle('https://cdn.jsdelivr.net/npm/pdbe-molstar@3.4.0/build/pdbe-molstar-light.css'),
      loadScript('https://cdn.jsdelivr.net/npm/pdbe-molstar@3.4.0/build/pdbe-molstar-plugin.js', 'PDBeMolstarPlugin'),
    ]).then(() => window.PDBeMolstarPlugin)
  }

  return pdbeMolstarPromise
}

export async function getVegaEmbed() {
  return embed
}

function cloneChartSpec(spec) {
  if (!spec) {
    return null
  }

  const rawSpec = isProxy(spec) ? toRaw(spec) : spec

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(rawSpec)
    } catch (error) {
      console.warn('Falling back to JSON-safe chart cloning.', error)
    }
  }

  return JSON.parse(JSON.stringify(rawSpec, (_key, value) => {
    if (typeof value === 'function') {
      return undefined
    }

    if (typeof window !== 'undefined' && value === window) {
      return undefined
    }

    if (typeof document !== 'undefined' && value === document) {
      return undefined
    }

    return value
  }))
}

function resolveRenderTarget(target) {
  if (!target) {
    return null
  }

  if (typeof target === 'string') {
    return document.querySelector(target)
  }

  return target
}

async function waitForRenderableSurface(target, attempts = 12) {
  let remainingAttempts = attempts

  while (remainingAttempts > 0) {
    const rect = target.getBoundingClientRect?.()

    if (!rect || rect.width > 0) {
      return
    }

    await new Promise((resolve) => window.requestAnimationFrame(resolve))
    remainingAttempts -= 1
  }
}

export function getChartTitle(spec) {
  if (!spec) {
    return null
  }

  if (spec.layer?.[0]?.title != null) {
    return spec.layer[0].title
  }

  if (spec.vconcat?.[0]?.title != null) {
    return spec.vconcat[0].title
  }

  if (spec.hconcat?.[0]?.title != null) {
    return spec.hconcat[0].title
  }

  if (spec.concat?.[0]?.title != null) {
    return spec.concat[0].title
  }

  if (spec.marks?.[0]?.title != null) {
    return spec.marks[0].title
  }

  return spec.title ?? null
}

export function buildChartSpecForEmbed(spec) {
  const renderSpec = cloneChartSpec(spec)

  if (!renderSpec) {
    return null
  }

  if (Array.isArray(renderSpec.layer)) {
    renderSpec.layer.forEach((layer) => {
      if (layer && typeof layer === 'object' && 'title' in layer) {
        layer.title = null
      }
    })
  }

  if (Array.isArray(renderSpec.vconcat)) {
    renderSpec.vconcat.forEach((panel) => {
      if (panel && typeof panel === 'object' && 'title' in panel) {
        panel.title = null
      }
    })
  }

  if (Array.isArray(renderSpec.hconcat)) {
    renderSpec.hconcat.forEach((panel) => {
      if (panel && typeof panel === 'object' && 'title' in panel) {
        panel.title = null
      }
    })
  }

  if (Array.isArray(renderSpec.concat)) {
    renderSpec.concat.forEach((panel) => {
      if (panel && typeof panel === 'object' && 'title' in panel) {
        panel.title = null
      }
    })
  }

  if (Array.isArray(renderSpec.marks)) {
    renderSpec.marks.forEach((mark) => {
      if (mark && typeof mark === 'object' && 'title' in mark) {
        mark.title = null
      }
    })
  }

  if ('title' in renderSpec) {
    renderSpec.title = null
  }

  return renderSpec
}

export async function renderVegaChart(target, spec, options = {}) {
  // console.log(target, spec)
  if (!target || !spec) {
    return null
  }

  const resolvedTarget = resolveRenderTarget(target)
  if (!resolvedTarget) {
    return null
  }

  await waitForRenderableSurface(resolvedTarget)

  const embed = await getVegaEmbed()

  if (typeof embed !== 'function') {
    throw new Error('Vega embed loader did not resolve to a function.')
  }

  resolvedTarget.innerHTML = ''
  const result = await embed(resolvedTarget, buildChartSpecForEmbed(spec), { actions: true, ...options })

  if (result?.view) {
    await new Promise((resolve) => window.requestAnimationFrame(resolve))
    try {
      await result.view.resize().runAsync()
    } catch (error) {
      console.warn('Vega resize pass failed after embed.', error)
    }
  }

  return result
}

export async function get3DMol() {
  if (typeof window !== 'undefined' && window.$3Dmol) {
    return window.$3Dmol
  }

  if (!mol3DPromise) {
    mol3DPromise = loadScript('https://cdn.jsdelivr.net/npm/3dmol@2.0.6/build/3Dmol-min.js').then(() => window.$3Dmol)
  }

  return mol3DPromise
}










let tmMolstarPromise = null
const PDBTM_VENDOR_BASE = import.meta.env.DEV
  ? '/pdbtm/vendor/pdbtm'
  : 'https://pdbtm.unitmp.org/vendor/pdbtm'

function patchCrossOriginStyleSheets() {
  const proto = CSSStyleSheet.prototype
  const desc  = Object.getOwnPropertyDescriptor(proto, 'cssRules')
  if (!desc || proto._tmPatched) return
  const originalGet = desc.get
  Object.defineProperty(proto, 'cssRules', {
    configurable: true,
    get() {
      try { return originalGet.call(this) } catch { return [] }
    },
  })
  proto._tmPatched = true
}

function injectStylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) return Promise.resolve()
  return new Promise((resolve) => {
    const el   = document.createElement('link')
    el.rel     = 'stylesheet'
    el.href    = href
    el.onload  = resolve
    el.onerror = resolve
    document.head.appendChild(el)
  })
}

/**
 * Injects a <style> block with the ult_* fill classes that tm_molstar reads
 * from document.styleSheets to populate the eG color array.
 *
 * Without these classes rG stays empty → eG[Side1] and eG[Side2] become
 * undefined → Molstar renders those residues black.
 *
 * Color mapping (matches eG default array + ult_inside/ult_outside overrides):
 *   ult_side1    → rgb(255,100,100)  [overridden by ult_inside/ult_outside per side1]
 *   ult_side2    → rgb(100,100,255)  [overridden by ult_inside/ult_outside per side1]
 *   ult_alpha    → rgb(255,255,0)
 *   ult_beta     → rgb(255,255,0)
 *   ult_reentrant→ rgb(255,127,0)
 *   ult_ifh      → rgb(0,255,0)
 *   ult_unknown  → rgb(196,196,196)
 *   ult_membins  → rgb(0,255,0)
 *   ult_periplasm→ rgb(255,0,255)
 *   ult_inside   → rgb(255,0,0)      [used for Side1 when side1='Inside']
 *   ult_outside  → rgb(0,0,255)      [used for Side2 when side1='Inside']
 */
function injectTmColors() {
  const id = 'tm-molstar-ult-colors'
  if (document.getElementById(id)) return

  const style = document.createElement('style')
  style.id = id
  style.textContent = `
    .ult_side1     { fill: rgb(255,100,100); }
    .ult_side2     { fill: rgb(100,100,255); }
    .ult_alpha     { fill: rgb(255,255,0);   }
    .ult_beta      { fill: rgb(255,255,0);   }
    .ult_reentrant { fill: rgb(255,127,0);   }
    .ult_ifh       { fill: rgb(0,255,0);     }
    .ult_unknown   { fill: rgb(196,196,196); }
    .ult_membins   { fill: rgb(0,255,0);     }
    .ult_periplasm { fill: rgb(255,0,255);   }
    .ult_inside    { fill: rgb(255,0,0);     }
    .ult_outside   { fill: rgb(0,0,255);     }
  `
  document.head.appendChild(style)
}

export function loadTmMolstar() {
  if (tmMolstarPromise) return tmMolstarPromise

  tmMolstarPromise = new Promise((resolve, reject) => {
    if (window.tm_molstar?.Viewer) return resolve(window.tm_molstar)

    Promise.all([
      injectStylesheet(`${PDBTM_VENDOR_BASE}/css/molstar.css`),
      injectStylesheet(`${PDBTM_VENDOR_BASE}/css/molstar_viewer.css`),
    ]).then(() => {
      // 1. Inject ult_* color classes BEFORE the script runs
      injectTmColors()

      // 2. Patch cross-origin sheets so cssRules access doesn't throw
      patchCrossOriginStyleSheets()

      // 3. Load the bundle
      const s   = document.createElement('script')
      s.src     = `${PDBTM_VENDOR_BASE}/js/tm_molstar.js`
      s.onload  = () => {
        if (window.tm_molstar?.Viewer) resolve(window.tm_molstar)
        else reject(new Error('tm_molstar loaded but window.tm_molstar.Viewer not found'))
      }
      s.onerror = () => reject(new Error(`Failed to load ${PDBTM_VENDOR_BASE}/js/tm_molstar.js`))
      document.head.appendChild(s)
    })
  })

  return tmMolstarPromise
}


// let tmMolstarPromise = null
// const TM_MOLSTAR_VENDOR_BASE = 'https://pdbtm.unitmp.org/vendor/pdbtm'
// const TM_TOPOLOGY_STYLE_ID = 'tm-topology-palette'

// /**
//  * Patches CSSStyleSheet.prototype.cssRules so cross-origin sheets
//  * return [] instead of throwing SecurityError.
//  *
//  * tm_molstar.js iterates ALL document.styleSheets (including any CDN
//  * sheets like Bootstrap or Google Fonts) to read its region colour rules.
//  * Any cross-origin sheet throws on .cssRules access — this swallows those
//  * errors while letting same-origin (proxy-served) sheets return normally.
//  */
// function patchCrossOriginStyleSheets() {
//   const proto = CSSStyleSheet.prototype
//   const desc  = Object.getOwnPropertyDescriptor(proto, 'cssRules')
//   if (!desc || proto._tmPatched) return

//   const originalGet = desc.get
//   Object.defineProperty(proto, 'cssRules', {
//     configurable: true,
//     get() {
//       try {
//         return originalGet.call(this)
//       } catch {
//         return []
//       }
//     },
//   })
//   proto._tmPatched = true
// }

// /**
//  * Injects a <link> stylesheet and resolves when it has loaded.
//  * No-ops if the href is already present.
//  */
// function injectStylesheet(href) {
//   if (document.querySelector(`link[href="${href}"]`)) return Promise.resolve()
//   return new Promise((resolve) => {
//     const el   = document.createElement('link')
//     el.rel     = 'stylesheet'
//     el.href    = href
//     el.onload  = resolve
//     el.onerror = resolve  // non-fatal — layout CSS only
//     document.head.appendChild(el)
//   })
// }

// function ensureTmTopologyPaletteStyles() {
//   if (document.getElementById(TM_TOPOLOGY_STYLE_ID)) return

//   const style = document.createElement('style')
//   style.id = TM_TOPOLOGY_STYLE_ID
//   style.textContent = `
//     .ult_inside,
//     .ult_side1 {
//       fill: rgb(255, 100, 100);
//       background-color: rgb(255, 100, 100);
//       color: #ffffff;
//     }

//     .ult_outside,
//     .ult_side2 {
//       fill: rgb(100, 100, 255);
//       background-color: rgb(100, 100, 255);
//       color: #ffffff;
//     }

//     .ult_membrane,
//     .ult_alpha,
//     .ult_beta {
//       fill: rgb(255, 255, 0);
//       background-color: rgb(255, 255, 0);
//       color: #4a4300;
//     }

//     .ult_reentrant {
//       fill: rgb(255, 127, 0);
//       background-color: rgb(255, 127, 0);
//       color: #4a2300;
//     }

//     .ult_ifh,
//     .ult_membins {
//       fill: rgb(0, 255, 0);
//       background-color: rgb(0, 255, 0);
//       color: #064906;
//     }

//     .ult_unknown {
//       fill: rgb(196, 196, 196);
//       background-color: rgb(196, 196, 196);
//       color: #2f2f2f;
//     }

//     .ult_periplasm {
//       fill: rgb(255, 0, 255);
//       background-color: rgb(255, 0, 255);
//       color: #ffffff;
//     }
//   `

//   document.head.appendChild(style)
// }

// /**
//  * Loads tm_molstar.js from the official UNITMP vendor bundle once,
//  * returns window.tm_molstar.
//  * Subsequent calls return the cached promise.
//  */
// export function loadTmMolstar() {
//   ensureTmTopologyPaletteStyles()
//   patchCrossOriginStyleSheets()

//   if (tmMolstarPromise) return tmMolstarPromise

//   tmMolstarPromise = new Promise((resolve, reject) => {
//     if (window.tm_molstar?.Viewer) {
//       return resolve(window.tm_molstar)
//     }

//     // 1. Load official UNITMP CSS assets.
//     Promise.all([
//       injectStylesheet(`${TM_MOLSTAR_VENDOR_BASE}/css/molstar.css`),
//       injectStylesheet(`${TM_MOLSTAR_VENDOR_BASE}/css/molstar_viewer.css`),
//     ]).then(() => {
//       // 2. Patch AFTER CSS loads, BEFORE the script runs —
//       //    so cross-origin stylesheet iteration does not crash the viewer.
//       patchCrossOriginStyleSheets()

//       // 3. Load the official tm_molstar bundle.
//       const s   = document.createElement('script')
//       s.src     = `${TM_MOLSTAR_VENDOR_BASE}/js/tm_molstar.js`
//       s.onload  = () => {
//         if (window.tm_molstar?.Viewer) {
//           resolve(window.tm_molstar)
//         } else {
//           reject(new Error('tm_molstar loaded but window.tm_molstar.Viewer not found'))
//         }
//       }
//       s.onerror = () => reject(new Error('Failed to load official tm_molstar bundle'))
//       document.head.appendChild(s)
//     })
//   })

//   return tmMolstarPromise
// }
