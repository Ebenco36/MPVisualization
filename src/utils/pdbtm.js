export async function isPdbtmEntry(pdbId) {
  try {
    const r = await fetch(
      `https://pdbtm.unitmp.org/api/v1/entry/${pdbId.toLowerCase()}.json`,
      { method: 'HEAD' }
    )
    return r.ok
  } catch {
    return false
  }
}