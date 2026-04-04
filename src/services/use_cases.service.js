import AxiosCall from "../config/AxiosConf";

const buildQueryString = (params = {}) => {
  const sanitized = Object.entries(params || {}).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) {
      return acc
    }

    const normalized = typeof value === 'string' ? value.trim() : value
    if (
      normalized === '' ||
      normalized === 'undefined' ||
      normalized === 'null'
    ) {
      return acc
    }

    acc[key] = normalized
    return acc
  }, {})

  return new URLSearchParams(sanitized).toString()
}

class UseCasesService {
  /* Dashboard service */
  useCasesContent() {
    return AxiosCall({
      method: 'GET',
      path: 'use-cases'
    }, 'Bearer')
  }

  expertAnnotations() {
    return AxiosCall({
      method: 'GET',
      path: 'records'
    }, 'Bearer')
  }

  discrepancyReviews(params = {}) {
    const query = buildQueryString(params)
    return AxiosCall({
      method: 'GET',
      path: `discrepancy-reviews${query ? `?${query}` : ''}`
    }, 'Bearer')
  }

  discrepancyReviewSummary(params = {}) {
    const query = buildQueryString(params)
    return AxiosCall({
      method: 'GET',
      path: `discrepancy-reviews/summary${query ? `?${query}` : ''}`
    }, 'Bearer')
  }

  discrepancyReview(searchQuery) {
    return AxiosCall({
      method: 'GET',
      path: `discrepancy-reviews/${encodeURIComponent(searchQuery)}`
    }, 'Bearer')
  }

  exportDiscrepancyReviews(params = {}, format = 'csv') {
    const query = buildQueryString({
      ...params,
      format
    })
    return AxiosCall({
      method: 'GET',
      path: `discrepancy-reviews/export${query ? `?${query}` : ''}`,
      responseType: 'blob'
    }, 'Bearer')
  }

  updateDiscrepancyReview(searchQuery, data) {
    return AxiosCall({
      method: 'PUT',
      path: `discrepancy-reviews/${encodeURIComponent(searchQuery)}`,
      data
    }, 'Bearer')
  }

  discrepancyBenchmarkStatus() {
    return AxiosCall({
      method: 'GET',
      path: 'discrepancy-benchmark/status'
    }, 'Bearer')
  }

  dashboardCaseStudies() {
    return AxiosCall({
      method: 'GET',
      path: 'dashboard-case-studies'
    }, 'Bearer')
  }

  dashboardAddedValue() {
    return AxiosCall({
      method: 'GET',
      path: 'dashboard-added-value'
    }, 'Bearer')
  }

  exportHighConfidenceSubset(format = 'json') {
    return AxiosCall({
      method: 'GET',
      path: `discrepancy-benchmark/high-confidence?format=${encodeURIComponent(format)}`,
      responseType: 'blob'
    }, 'Bearer')
  }

  postCasesContent(data) {
    return AxiosCall({
      method: 'POST',
      path: 'use-cases',
      data: data
    }, 'Bearer')
  }
}

export default new UseCasesService();
