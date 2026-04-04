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
    _raw: candidate
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
