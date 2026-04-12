export const basicPredictorCountColumns = [
  { title: 'TM (OPM)', value: 'TM (OPM)' },
  { title: 'TMbed TM Count', value: 'TMbed_tm_count' },
  { title: 'DeepTMHMM TM Count', value: 'DeepTMHMM_tm_count' }
]

export const extendedPredictorCountColumns = [
  { title: 'TM (OPM)', value: 'TM (OPM)' },
  { title: 'TMbed TM Count', value: 'TMbed_tm_count' },
  { title: 'DeepTMHMM TM Count', value: 'DeepTMHMM_tm_count' },
  { title: 'Hmmtop TM Count', value: 'Hmmtop_tm_count' },
  { title: 'Memsat TM Count', value: 'Memsat_tm_count' },
  { title: 'Octopus TM Count', value: 'Octopus_tm_count' },
  { title: 'Philius TM Count', value: 'Philius_tm_count' },
  { title: 'Phobius TM Count', value: 'Phobius_tm_count' },
  { title: 'Pro TM Count', value: 'Pro_tm_count' },
  { title: 'Prodiv TM Count', value: 'Prodiv_tm_count' },
  { title: 'Scampi TM Count', value: 'Scampi_tm_count' },
  { title: 'ScampiMsa TM Count', value: 'ScampiMsa_tm_count' },
  { title: 'SignalP TM Count', value: 'SignalP_tm_count' },
  { title: 'TMHMM TM Count', value: 'TMHMM_tm_count' },
  { title: 'Topcons2 TM Count', value: 'Topcons2_tm_count' },
  { title: 'TMDET TM Count', value: 'TMDET_tm_count' }
]

export const BENCHMARK_STATUS_LABELS = {
  high_confidence_subset: 'High-confidence subset',
  included_with_caution: 'Included with caution',
  excluded: 'Excluded',
  not_recommended: 'Not recommended'
}

export const SCIENTIFIC_CONFIDENCE_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None'
}

export const discrepancyDecisionFields = [
  { title: 'Group Disagreement', value: 'group_disagreement' },
  { title: 'TM Disagreement', value: 'tm_disagreement' },
  { title: 'TM Boundary Disagreement', value: 'tm_boundary_disagreement' },
  { title: 'Benchmark Decision', value: 'benchmark_status' },
  { title: 'Benchmark Recommendation', value: 'benchmark_recommended' },
  { title: 'Confidence', value: 'scientific_confidence' },
  { title: 'Context-dependent Topology', value: 'context_dependent_topology' },
  { title: 'Non-canonical Membrane Case', value: 'non_canonical_membrane_case' },
  { title: 'Multichain Context', value: 'multichain_context' },
  { title: 'Obsolete or Replaced', value: 'obsolete_or_replaced' }
]

const DECISION_TOOLTIP_KEYS = new Set(
  discrepancyDecisionFields.map((field) => field.value)
)

const TM_BOUNDARY_TOLERANCE = 5

const PROVIDER_DISPLAY_ORDER = [
  'Expert',
  'OPM',
  'MPstruc',
  'Predicted',
  'MetaMP',
  'TMAlphaFold'
]

const METHOD_DISPLAY_ORDER = [
  'DeepTMHMM',
  'TMbed',
  'TMHMM',
  'Phobius',
  'Topcons2',
  'TOPCONS',
  'CCTOP',
  'TMDET',
  'ScampiMsa',
  'Scampi',
  'Octopus',
  'Hmmtop',
  'Memsat',
  'Philius',
  'Pro',
  'Prodiv',
  'SignalP'
]

export function normalizeBenchmarkStatus(decision = {}) {
  if (typeof decision === 'string' && decision.trim()) return decision.trim()
  if (decision.benchmark_status) return decision.benchmark_status
  if (decision.high_confidence_subset) return 'high_confidence_subset'
  if (decision.include_in_benchmark) return 'included_with_caution'
  return 'excluded'
}

export function boolLabel(value, truthy = 'Yes', falsy = 'No') {
  if (value == null) return 'Not Specified'
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['yes', 'true', '1'].includes(normalized)) return truthy
    if (['no', 'false', '0'].includes(normalized)) return falsy
    if (normalized === 'not specified') return 'Not Specified'
  }
  return value ? truthy : falsy
}

export function formatList(value) {
  if (!value || (Array.isArray(value) && !value.length)) return 'Not Specified'
  if (Array.isArray(value)) return value.join('; ')
  return String(value)
}

export function formatBenchmarkDecision(decision = {}) {
  const status = normalizeBenchmarkStatus(decision)
  return BENCHMARK_STATUS_LABELS[status] || status
}

export function formatScientificConfidence(value) {
  const normalized = String(value || '').trim().toLowerCase()
  if (!normalized) return 'Not Specified'
  return SCIENTIFIC_CONFIDENCE_LABELS[normalized] || normalized
}

function normalizeText(value) {
  const text = String(value || '').trim()
  return text || null
}

function normalizeYesNoValue(value) {
  if (value == null) return null
  if (typeof value === 'boolean') return value
  const normalized = String(value).trim().toLowerCase()
  if (['yes', 'true', '1'].includes(normalized)) return true
  if (['no', 'false', '0'].includes(normalized)) return false
  return null
}

function formatListWithFallback(values, fallback = 'none') {
  const cleaned = (Array.isArray(values) ? values : [])
    .map((value) => String(value || '').trim())
    .filter(Boolean)
  return cleaned.length ? cleaned.join(', ') : fallback
}

function humanizeToken(value) {
  return String(value || '')
    .replace(/^override:/i, 'override: ')
    .replace(/^derived:/i, 'derived: ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .trim()
}

function providerSortIndex(provider) {
  const index = PROVIDER_DISPLAY_ORDER.indexOf(String(provider || '').trim())
  return index === -1 ? 999 : index
}

function methodSortIndex(method) {
  const index = METHOD_DISPLAY_ORDER.indexOf(String(method || '').trim())
  return index === -1 ? 999 : index
}

function formatSequenceContext(uniprotIds = []) {
  const ids = Array.isArray(uniprotIds)
    ? uniprotIds.map((value) => String(value || '').trim()).filter(Boolean)
    : []
  if (!ids.length) return 'Sequence context not specified'
  if (ids.length === 1) {
    return ids[0].startsWith('PDB:')
      ? `PDB-derived sequence (${ids[0].replace(/^PDB:/, '')})`
      : `UniProt ${ids[0]}`
  }
  return `${ids.length} mapped accessions: ${ids.join(', ')}`
}

function safeJsonParse(value) {
  if (!value) return null
  if (Array.isArray(value) || typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch (error) {
    return null
  }
}

function normalizeTopologySegments(segments = []) {
  return (Array.isArray(segments) ? segments : [])
    .map((segment, index) => {
      const start = Number(segment?.start)
      const end = Number(segment?.end)
      if (!Number.isFinite(start) || !Number.isFinite(end)) return null
      const label = normalizeText(segment?.label) || normalizeText(segment?.display_label) || `TM${index + 1}`
      return {
        label,
        start: Math.min(start, end),
        end: Math.max(start, end),
        length: Number(segment?.length) || Math.abs(end - start) + 1
      }
    })
    .filter(Boolean)
    .sort((left, right) => left.start - right.start)
}

function extractMembraneSegments(summary = {}) {
  const derived = summary?.derived_topology || {}
  const derivedSegments = normalizeTopologySegments(derived?.membrane_segments || [])
  if (derivedSegments.length) return derivedSegments

  const rawRegions = safeJsonParse(summary?.tm_regions_json)
  const membraneLike = (Array.isArray(rawRegions) ? rawRegions : []).filter((region) => {
    const label = String(region?.label || '').trim()
    return ['B', 'b', 'H', 'h'].includes(label)
  })
  return normalizeTopologySegments(membraneLike)
}

function summarizeSegments(segments = []) {
  if (!segments.length) return 'No membrane-segment boundaries available'
  return segments
    .map((segment, index) => `${segment.label || `TM${index + 1}`}: ${segment.start}-${segment.end}`)
    .join('; ')
}

function formatBoundaryPairSummary(leftSignature = [], rightSignature = []) {
  if (!leftSignature.length || !rightSignature.length || leftSignature.length !== rightSignature.length) {
    return null
  }
  return leftSignature
    .map((left, index) => {
      const right = rightSignature[index]
      return `TM${index + 1} ${left.start}-${left.end} vs ${right.start}-${right.end}`
    })
    .join('; ')
}

function getBoundaryComparablePredictors(candidate = {}) {
  const discrepancy = candidate?.discrepancy_summary || {}
  const tmRegions = discrepancy?.tm_regions || {}
  const tmCounts = discrepancy?.tm_counts || {}
  const opmSignature = normalizeTopologySegments(tmRegions?.opm || [])
  const opmCount = tmCounts?.opm ?? opmSignature.length ?? null
  const comparablePredictors = ['TMbed', 'DeepTMHMM', 'TMHMM', 'Phobius', 'TOPCONS', 'CCTOP', 'TMDET']

  const predictorDetails = comparablePredictors.map((source) => {
    const signature = normalizeTopologySegments(tmRegions?.[source] || [])
    const sourceCount = tmCounts?.[source] ?? (signature.length || null)
    const hasComparableCount = opmSignature.length && signature.length && signature.length === opmSignature.length
    const exceedsTolerance = hasComparableCount
      ? signatureBoundaryShiftExceedsTolerance(opmSignature, signature)
      : false
    return {
      source,
      signature,
      sourceCount,
      hasComparableCount,
      exceedsTolerance,
      comparisonSummary: hasComparableCount
        ? formatBoundaryPairSummary(opmSignature, signature)
        : null
    }
  })

  return {
    opmSignature,
    opmCount,
    predictorDetails
  }
}

function buildGroupAgreementTooltip(candidate = {}) {
  const discrepancy = candidate?.discrepancy_summary || {}
  const collapsed = discrepancy?.group_labels_for_disagreement || {}
  const entries = Object.entries(collapsed)
    .filter(([, value]) => normalizeText(value))
    .map(([source, value]) => `${humanizeToken(source)}=${value}`)
  const isDisagreement = !!(candidate?.group_disagreement ?? candidate?.has_group_disagreement ?? discrepancy?.has_group_disagreement)
  if (!entries.length) {
    return 'MetaMP could not compute a group-disagreement call because no comparable group labels were available from expert annotation, OPM, MPstruc, or the predicted class.'
  }
  if (isDisagreement) {
    return `Yes. After standardizing broad-group labels, the sources do not collapse to a single category: ${entries.join('; ')}.`
  }
  return `No. After standardizing broad-group labels, the available sources collapse to a single category: ${entries.join('; ')}.`
}

function buildTmCountAgreementTooltip(candidate = {}) {
  const discrepancy = candidate?.discrepancy_summary || {}
  const tmCounts = discrepancy?.tm_counts || {}
  const entries = Object.entries(tmCounts)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([source, value]) => `${source}=${value}`)
  const isDisagreement = !!(candidate?.tm_disagreement ?? candidate?.has_tm_disagreement ?? discrepancy?.has_tm_disagreement)
  if (!entries.length) {
    return 'MetaMP could not compute a TM-count disagreement call because no comparable transmembrane-segment counts were available.'
  }
  if (isDisagreement) {
    return `Yes. Available TM-segment counts differ across expert annotation and predictor/reference sources: ${entries.join('; ')}.`
  }
  return `No. Available TM-segment counts agree across the compared sources: ${entries.join('; ')}.`
}

function signatureBoundaryShiftExceedsTolerance(leftSignature = [], rightSignature = []) {
  if (leftSignature.length !== rightSignature.length) return false
  for (let index = 0; index < leftSignature.length; index += 1) {
    const left = leftSignature[index]
    const right = rightSignature[index]
    if (
      Math.abs(left.start - right.start) > TM_BOUNDARY_TOLERANCE ||
      Math.abs(left.end - right.end) > TM_BOUNDARY_TOLERANCE
    ) {
      return true
    }
  }
  return false
}

function buildTmBoundaryTooltip(candidate = {}) {
  const { opmSignature, opmCount, predictorDetails } = getBoundaryComparablePredictors(candidate)
  if (!opmSignature.length) {
    return 'TM-boundary disagreement was not evaluated because MetaMP could not extract parsable OPM membrane-segment coordinates from the OPM subunits field for this record.'
  }

  const comparedPairs = predictorDetails
    .filter((detail) => detail.hasComparableCount)
    .map((detail) => `OPM vs ${detail.source}`)
  const mismatchedPairs = predictorDetails
    .filter((detail) => detail.hasComparableCount && detail.exceedsTolerance)
    .map((detail) => ({
      label: `OPM vs ${detail.source}`,
      summary: detail.comparisonSummary
    }))
  const skippedPairs = predictorDetails
    .filter((detail) => !detail.hasComparableCount)
    .map((detail) => {
      if (!detail.signature.length) return `${detail.source}: no predictor boundaries available`
      return `${detail.source}: ${detail.sourceCount ?? detail.signature.length} vs OPM ${opmCount ?? opmSignature.length} segment(s)`
    })

  if (!comparedPairs.length) {
    const skippedText = skippedPairs.length
      ? ` Skipped predictors: ${skippedPairs.join('; ')}.`
      : ''
    return `TM-boundary disagreement was not evaluated because OPM exposed ${opmSignature.length} boundary segment(s), but no comparable predictor exposed boundaries with the same segment count.${skippedText}`
  }

  const discrepancy = candidate?.discrepancy_summary || {}
  const isDisagreement = !!(candidate?.tm_boundary_disagreement ?? candidate?.has_tm_boundary_disagreement ?? discrepancy?.has_tm_boundary_disagreement)
  if (isDisagreement) {
    const mismatchText = mismatchedPairs.length
      ? mismatchedPairs
          .map((item) => `${item.label}${item.summary ? ` (${item.summary})` : ''}`)
          .join('; ')
      : 'a same-count OPM/predictor pair'
    const skippedText = skippedPairs.length
      ? ` Skipped predictors: ${skippedPairs.join('; ')}.`
      : ''
    return `Yes. MetaMP compared OPM against same-count predictor boundary signatures using a ±${TM_BOUNDARY_TOLERANCE}-residue tolerance and found a mismatch for: ${mismatchText}.${skippedText}`
  }
  const skippedText = skippedPairs.length
    ? ` Skipped predictors: ${skippedPairs.join('; ')}.`
    : ''
  return `No. MetaMP compared OPM against same-count predictor boundary signatures using a ±${TM_BOUNDARY_TOLERANCE}-residue tolerance and found no mismatches across: ${comparedPairs.join(', ')}.${skippedText}`
}

function buildBenchmarkDecisionTooltip(candidate = {}) {
  const decision = candidate?.benchmark_decision || {}
  const status = normalizeBenchmarkStatus(candidate?.benchmark_status ?? decision)
  const inclusion = Array.isArray(decision?.inclusion_reasons) ? decision.inclusion_reasons : []
  const exclusion = Array.isArray(decision?.exclusion_reasons) ? decision.exclusion_reasons : []
  const reason = normalizeText(candidate?.benchmark_reason || decision?.benchmark_reason)
  const parts = [
    `Status: ${BENCHMARK_STATUS_LABELS[status] || status}.`,
  ]
  if (inclusion.length) parts.push(`Inclusion reasons: ${inclusion.join(', ')}.`)
  if (exclusion.length) parts.push(`Exclusion/caution reasons: ${exclusion.join(', ')}.`)
  if (reason) parts.push(reason)
  return parts.join(' ')
}

function buildBenchmarkRecommendationTooltip(candidate = {}) {
  const record = candidate?.record || {}
  const scientificAssessment = candidate?.scientific_assessment || record?.scientific_assessment || (candidate?.discrepancy_summary || {}).scientific_assessment || {}
  const recommended = candidate?.benchmark_recommended ?? scientificAssessment?.recommended_for_sequence_topology_benchmark
  const exclusions = Array.isArray(scientificAssessment?.benchmark_exclusion_reasons)
    ? scientificAssessment.benchmark_exclusion_reasons
    : []
  const notes = Array.isArray(scientificAssessment?.notes) ? scientificAssessment.notes : []
  if (recommended === false) {
    return `No. The scientific-assessment layer does not recommend this record for straightforward sequence-only topology benchmarking. Exclusion drivers: ${formatListWithFallback(exclusions)}.${notes.length ? ` Notes: ${notes.join(' ')}` : ''}`
  }
  return `Yes. The scientific-assessment layer did not trigger any exclusionary context-dependent, non-canonical, or replacement-based benchmark block for this record.${notes.length ? ` Notes: ${notes.join(' ')}` : ''}`
}

function buildScientificConfidenceTooltip(candidate = {}) {
  const record = candidate?.record || {}
  const scientificAssessment = candidate?.scientific_assessment || record?.scientific_assessment || (candidate?.discrepancy_summary || {}).scientific_assessment || {}
  const details = scientificAssessment?.details || {}
  const confidence = formatScientificConfidence(candidate?.scientific_confidence ?? scientificAssessment?.confidence)
  const matchedRules = Array.isArray(details?.matched_rule_ids) ? details.matched_rule_ids.map(humanizeToken) : []
  const softReasons = Array.isArray(details?.soft_review_reasons) ? details.soft_review_reasons : []
  const parts = [`Confidence is ${confidence}.`]
  parts.push(`Matched rules: ${formatListWithFallback(matchedRules)}.`)
  if (softReasons.length) parts.push(`Soft review reasons: ${softReasons.join(' ')}`)
  return parts.join(' ')
}

function buildContextFlagTooltip(candidate = {}, key) {
  const record = candidate?.record || {}
  const scientificAssessment = candidate?.scientific_assessment || record?.scientific_assessment || (candidate?.discrepancy_summary || {}).scientific_assessment || {}
  const flags = scientificAssessment?.flags || {}
  const details = scientificAssessment?.details || {}
  const notes = Array.isArray(scientificAssessment?.notes) ? scientificAssessment.notes : []
  const chainIds = Array.isArray(record?.structure_context?.chain_ids) ? record.structure_context.chain_ids : []
  const chainCount = Number(record?.structure_context?.chain_count || 0)
  const replacementTarget = normalizeText(record?.replacement_pdb_code || record?.canonical_pdb_code)

  if (key === 'context_dependent_topology') {
    if (flags?.context_dependent_topology) {
      return `Yes. MetaMP marked this record as context-dependent because it matched context signals: ${formatListWithFallback(details?.context_reasons)}.${notes.length ? ` Notes: ${notes.join(' ')}` : ''}`
    }
    return 'No. MetaMP did not find curated override or keyword-rule evidence that this topology depends on biological state or a soluble-to-membrane transition.'
  }

  if (key === 'non_canonical_membrane_case') {
    if (flags?.non_canonical_membrane_case) {
      return `Yes. MetaMP marked this as a non-canonical membrane case based on curated override and/or construct-oriented keyword rules.${notes.length ? ` Notes: ${notes.join(' ')}` : ''}`
    }
    return 'No. MetaMP did not find evidence that this entry is an engineered helper, fusion construct, or other non-canonical membrane benchmarking case.'
  }

  if (key === 'multichain_context') {
    if (flags?.multichain_context) {
      return `Yes. The deposited structure contains ${chainCount || 'multiple'} chains${chainIds.length ? ` (${chainIds.join(', ')})` : ''}, so chain-level or assembly-level interpretation may be required.`
    }
    return 'No. MetaMP did not detect a multichain structure context that would complicate per-entry topology interpretation.'
  }

  if (key === 'obsolete_or_replaced') {
    if (flags?.obsolete_or_replaced) {
      return `Yes. PDB replacement metadata marks this entry as obsolete or replaced${replacementTarget ? `, with canonical/replacement code ${replacementTarget}` : ''}.`
    }
    return 'No. PDB replacement metadata does not mark this entry as obsolete or replaced.'
  }

  return null
}

function buildDecisionTooltips(candidate = {}) {
  return {
    group_disagreement: buildGroupAgreementTooltip(candidate),
    tm_disagreement: buildTmCountAgreementTooltip(candidate),
    tm_boundary_disagreement: buildTmBoundaryTooltip(candidate),
    benchmark_status: buildBenchmarkDecisionTooltip(candidate),
    benchmark_recommended: buildBenchmarkRecommendationTooltip(candidate),
    scientific_confidence: buildScientificConfidenceTooltip(candidate),
    context_dependent_topology: buildContextFlagTooltip(candidate, 'context_dependent_topology'),
    non_canonical_membrane_case: buildContextFlagTooltip(candidate, 'non_canonical_membrane_case'),
    multichain_context: buildContextFlagTooltip(candidate, 'multichain_context'),
    obsolete_or_replaced: buildContextFlagTooltip(candidate, 'obsolete_or_replaced'),
  }
}

function buildReferenceComparisonRows(candidate = {}) {
  const record = candidate?.record || {}
  const discrepancy = candidate?.discrepancy_summary || {}
  const groupLabels = discrepancy?.group_labels || {}
  const tmCounts = discrepancy?.tm_counts || {}
  const tmRegions = discrepancy?.tm_regions || {}
  const opmSegments = normalizeTopologySegments(tmRegions?.opm || [])

  return [
    {
      layer: 'Reference',
      source: 'Expert annotation',
      provider: 'Expert',
      method: 'Group/TM expert labels',
      groupLabel: groupLabels?.expert || 'Not specified',
      tmCount: tmCounts?.expert ?? 'Not specified',
      segmentSummary: 'Expert annotations provide the benchmark TM count, not explicit residue boundaries.',
      notes: 'Static expert-reviewed reference label.'
    },
    {
      layer: 'Reference',
      source: 'OPM',
      provider: 'OPM',
      method: 'Membrane placement reference',
      groupLabel: groupLabels?.opm || 'Not specified',
      tmCount: tmCounts?.opm ?? 'Not specified',
      segmentSummary: summarizeSegments(opmSegments),
      notes: opmSegments.length
        ? `Boundary reference used for TM-boundary comparison (${opmSegments.length} segments).`
        : 'No OPM membrane-segment boundaries available.'
    },
    {
      layer: 'Reference',
      source: 'MPstruc',
      provider: 'MPstruc',
      method: 'Broad-group reference',
      groupLabel: groupLabels?.mpstruc || 'Not specified',
      tmCount: 'Not specified',
      segmentSummary: 'MPstruc contributes broad-group context, not residue-level TM boundaries.',
      notes: 'Reference broad-group source.'
    },
    {
      layer: 'MetaMP',
      source: 'MetaMP classifier',
      provider: 'MetaMP',
      method: 'Broad-group prediction',
      groupLabel: groupLabels?.predicted || 'Not specified',
      tmCount: 'Not specified',
      segmentSummary: 'Group prediction only; no TM boundaries are produced by this classifier.',
      notes: 'Machine-learning broad-group label.'
    }
  ]
}

function buildNormalizedPredictionRows(candidate = {}) {
  const record = candidate?.record || {}
  const normalizedPredictions = Array.isArray(record?.normalized_tm_predictions)
    ? [...record.normalized_tm_predictions]
    : []
  const { opmSignature } = getBoundaryComparablePredictors(candidate)

  normalizedPredictions.sort((left, right) => {
    const providerDelta = providerSortIndex(left?.provider) - providerSortIndex(right?.provider)
    if (providerDelta !== 0) return providerDelta
    const methodDelta = methodSortIndex(left?.method) - methodSortIndex(right?.method)
    if (methodDelta !== 0) return methodDelta
    return String(left?.method || '').localeCompare(String(right?.method || ''))
  })

  return normalizedPredictions.map((summary) => {
    const derived = summary?.derived_topology || {}
    const segments = extractMembraneSegments(summary)
    const tmCount = summary?.ambiguous
      ? 'Ambiguous'
      : (derived?.tm_count ?? summary?.tm_count ?? (segments.length || 'Not available'))
    const topologyLabel = normalizeText(derived?.topology_label || derived?.compact_label || derived?.reason || summary?.note)
    const methodName = String(summary?.method || '').trim()
    let boundaryNote = null
    if (['TMbed', 'DeepTMHMM', 'TMHMM', 'Phobius', 'TOPCONS', 'CCTOP', 'TMDET'].includes(methodName)) {
      if (!opmSignature.length) {
        boundaryNote = 'Boundary comparison unavailable because no parsable OPM segment coordinates were extracted.'
      } else if (!segments.length) {
        boundaryNote = 'Boundary comparison skipped because this predictor did not expose membrane-segment coordinates.'
      } else if (segments.length !== opmSignature.length) {
        boundaryNote = `Boundary comparison skipped because predictor count (${segments.length}) differs from OPM (${opmSignature.length}).`
      } else if (signatureBoundaryShiftExceedsTolerance(opmSignature, segments)) {
        boundaryNote = `Boundary mismatch against OPM beyond ±${TM_BOUNDARY_TOLERANCE} residues.`
      } else {
        boundaryNote = `Boundary agreement with OPM within ±${TM_BOUNDARY_TOLERANCE} residues.`
      }
    }
    return {
      layer: summary?.provider || 'Predictor',
      source: `${summary?.provider || 'Unknown'} ${summary?.method || 'Prediction'}`.trim(),
      provider: summary?.provider || 'Unknown',
      method: summary?.method || 'Unknown',
      groupLabel: '—',
      tmCount,
      segmentSummary: segments.length
        ? summarizeSegments(segments)
        : (topologyLabel || 'No membrane-segment boundaries available'),
      notes: [
        boundaryNote,
        topologyLabel,
        formatSequenceContext(summary?.uniprot_ids),
        summary?.prediction_kind ? `Kind: ${summary.prediction_kind}` : null,
      ].filter(Boolean).join(' | ')
    }
  })
}

export function buildPipelineComparisonRows(candidate = {}) {
  return [
    ...buildReferenceComparisonRows(candidate),
    ...buildNormalizedPredictionRows(candidate)
  ]
}

export function getDecisionTooltip(item, column) {
  const key = String(column?.value || column?.key || column || '').trim()
  if (!DECISION_TOOLTIP_KEYS.has(key)) return null
  return item?._decisionTooltips?.[key] || null
}

export function hasDecisionTooltip(column) {
  const key = String(column?.value || column?.key || column || '').trim()
  return DECISION_TOOLTIP_KEYS.has(key)
}

export function formatDecisionNotes(decision = {}) {
  if (typeof decision === 'string' && decision.trim()) return decision
  if (decision.benchmark_reason) return decision.benchmark_reason
  const inclusion = Array.isArray(decision.inclusion_reasons) ? decision.inclusion_reasons : []
  const exclusion = Array.isArray(decision.exclusion_reasons) ? decision.exclusion_reasons : []
  return formatList(decision.include_in_benchmark ? inclusion : exclusion)
}

export function hasCaution(candidate = {}) {
  const scientificAssessment = candidate.scientific_assessment || (candidate.record || {}).scientific_assessment || (candidate.discrepancy_summary || {}).scientific_assessment || {}
  const flags = candidate.scientific_flags || scientificAssessment.flags || {}
  const benchmarkDecision = candidate.benchmark_decision || {}
  const benchmarkStatusCode = normalizeBenchmarkStatus(candidate.benchmark_status ?? benchmarkDecision)
  return (
    benchmarkStatusCode !== 'high_confidence_subset' ||
    (candidate.benchmark_recommended ?? scientificAssessment.recommended_for_sequence_topology_benchmark) === false ||
    (candidate.context_dependent_topology ?? flags.context_dependent_topology) ||
    (candidate.non_canonical_membrane_case ?? flags.non_canonical_membrane_case) ||
    (candidate.multichain_context ?? flags.multichain_context) ||
    flags.obsolete_or_replaced
  )
}

export function buildDiscrepancyRow(candidate, predictorColumns = basicPredictorCountColumns) {
  const record = candidate?.record || {}
  const discrepancy = candidate?.discrepancy_summary || {}
  const scientificAssessment = candidate?.scientific_assessment || record?.scientific_assessment || discrepancy?.scientific_assessment || {}
  const flags = candidate?.scientific_flags || scientificAssessment.flags || {}
  const benchmarkDecision = candidate?.benchmark_decision || {}
  const labels = record?.annotation_lineage?.labels || {}
  const groupLabels = discrepancy?.group_labels || {}
  const tmCounts = discrepancy?.tm_counts || {}
  const groupDisagreement = candidate?.group_disagreement ?? candidate?.has_group_disagreement ?? discrepancy?.has_group_disagreement
  const tmDisagreement = candidate?.tm_disagreement ?? candidate?.has_tm_disagreement ?? discrepancy?.has_tm_disagreement
  const tmBoundaryDisagreement = candidate?.tm_boundary_disagreement ?? candidate?.has_tm_boundary_disagreement ?? discrepancy?.has_tm_boundary_disagreement
  const benchmarkRecommended = candidate?.benchmark_recommended ?? scientificAssessment.recommended_for_sequence_topology_benchmark
  const scientificConfidence = candidate?.scientific_confidence ?? scientificAssessment.confidence
  const contextDependentTopology = candidate?.context_dependent_topology ?? flags.context_dependent_topology
  const nonCanonicalMembraneCase = candidate?.non_canonical_membrane_case ?? flags.non_canonical_membrane_case
  const multichainContext = candidate?.multichain_context ?? flags.multichain_context
  const benchmarkStatusCode = normalizeBenchmarkStatus(candidate?.benchmark_status ?? benchmarkDecision)
  const predictorCountValue = (key) => {
    const value = key === 'opm'
      ? (tmCounts?.[key] ?? record?.subunit_segments)
      : tmCounts?.[key]
    return value ?? 'Not Specified'
  }

  const row = {
    Year: record.Year || record.year || candidate?.bibliography_year || 'Not Specified',
    'PDB Code': candidate?.pdb_code || record['PDB Code'] || 'Not Specified',
    review_status: candidate?.review?.status || 'open',
    resolved_group_label: record?.annotation_lineage?.resolved_group_label || 'Not Specified',
    'Group (OPM)': groupLabels.opm || labels.opm || record['Group (OPM)'] || 'Not Specified',
    'Group (MPstruc)': groupLabels.mpstruc || labels.mpstruc || record['Group (MPstruc)'] || record.group || 'Not Specified',
    'Group (Predicted)': groupLabels.predicted || labels.predicted || record['Group (Predicted)'] || 'Not Specified',
    'Group (Expert)': groupLabels.expert || labels.expert || record['Group (Expert)'] || 'Not Specified',
    'TM (Expert)': record['TM (Expert)'] ?? discrepancy?.tm_counts?.expert ?? 'Not Specified',
    group_disagreement: boolLabel(groupDisagreement),
    tm_disagreement: boolLabel(tmDisagreement),
    tm_boundary_disagreement: boolLabel(tmBoundaryDisagreement),
    has_group_disagreement: boolLabel(groupDisagreement),
    has_tm_disagreement: boolLabel(tmDisagreement),
    has_tm_boundary_disagreement: boolLabel(tmBoundaryDisagreement),
    benchmark_status: formatBenchmarkDecision(benchmarkStatusCode),
    benchmark_status_code: benchmarkStatusCode,
    benchmark_reason: formatDecisionNotes(candidate?.benchmark_reason ?? benchmarkDecision),
    benchmark_recommended: boolLabel(benchmarkRecommended),
    benchmark_recommended_bool: benchmarkRecommended,
    expert_note_count: Number(candidate?.expert_note_count ?? candidate?.expert_note_summary?.note_count ?? record?.expert_note_count ?? 0),
    latest_expert_note_excerpt: candidate?.latest_expert_note_excerpt ?? candidate?.expert_note_summary?.latest_note_excerpt ?? record?.expert_note_summary?.latest_note_excerpt ?? 'Not Specified',
    latest_expert_note_at: candidate?.latest_expert_note_at ?? candidate?.expert_note_summary?.latest_note_at ?? record?.expert_note_summary?.latest_note_at ?? null,
    scientific_confidence: formatScientificConfidence(scientificConfidence),
    scientific_confidence_code: String(scientificConfidence || '').trim().toLowerCase() || null,
    context_dependent_topology: boolLabel(contextDependentTopology),
    context_dependent_topology_bool: contextDependentTopology,
    non_canonical_membrane_case: boolLabel(nonCanonicalMembraneCase),
    non_canonical_membrane_case_bool: nonCanonicalMembraneCase,
    multichain_context: boolLabel(multichainContext),
    multichain_context_bool: multichainContext,
    obsolete_or_replaced: flags.obsolete_or_replaced ? "Yes" : "No",
    obsolete_or_replaced_bool: !!flags.obsolete_or_replaced,
    _highlight: hasCaution(candidate),
    _raw: candidate,
    _decisionTooltips: buildDecisionTooltips(candidate),
    _pipelineComparisonRows: buildPipelineComparisonRows(candidate)
  }

  predictorColumns.forEach((column) => {
    const key = column.value
    const methodName = key.replace(/_tm_count$/, '')
    row[key] = key === 'TM (OPM)'
      ? predictorCountValue('opm')
      : predictorCountValue(methodName)
  })

  return row
}

export function getColumnValue(item, column) {
  if (!item || !column) return ''
  const candidates = [
    column.value,
    column.key,
    typeof column.value === 'string' ? column.value.toLowerCase() : null,
    typeof column.key === 'string' ? column.key.toLowerCase() : null
  ].filter(Boolean)

  for (const candidateKey of candidates) {
    if (item[candidateKey] !== undefined && item[candidateKey] !== null) {
      return item[candidateKey]
    }
  }
  return ''
}

function filenameFromDisposition(disposition) {
  if (!disposition) return null
  const utfMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1])
  const basicMatch = disposition.match(/filename="?([^"]+)"?/i)
  return basicMatch?.[1] || null
}

export function downloadExportResponse(response, fallbackFilename) {
  const blob = response?.data instanceof Blob
    ? response.data
    : new Blob([response?.data ?? ''])
  const disposition = response?.headers?.['content-disposition']
  const filename = filenameFromDisposition(disposition) || fallbackFilename
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
