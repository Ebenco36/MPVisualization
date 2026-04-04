import AxiosCall from "../config/AxiosConf";

class DashboardService {
  /* Dashboard service */
  dashBoardStats(get_header, trend_width) {
    return AxiosCall({
      method: 'GET',
      path: 'dashboard?get_header=' + get_header + '&first_leveled_width=' + trend_width
    }, 'Bearer')
  }

  dashBoardStatsMap () {
    return AxiosCall({
      method: 'GET',
      path: 'dashboard-map'
    }, 'Bearer')
  }


  dashBoardInconsistencies (width) {
    return AxiosCall({
      method: 'GET',
      path: 'dashboard-inconsistencies?width=' + width
    }, 'Bearer')
  }


  dashBoardStatsOthers () {
    return AxiosCall({
      method: 'GET',
      path: 'dashboard-others'
    }, 'Bearer')
  }

  fetchData(endpoint) {
    return AxiosCall({
      method: 'GET',
      path: endpoint
    }, 'Bearer')
  }

  postData(endpoint, data) {
    return AxiosCall({
      method: 'POST',
      path: endpoint,
      data
    }, 'Bearer')
  }

  summaryStats(search_param, payload) {
    return AxiosCall({
      method: 'GET',
      path: 'get-summary-statistics?' + search_param + "&" + payload
    }, 'Bearer')
  }

  searchMergedRecords(searchQuery) {
    const path = `search-merged-db?q=${encodeURIComponent(searchQuery)}`
    return AxiosCall({
      method: 'GET',
      path: path
    }, 'Bearer')
  }

  expertAnnotation(searchQuery) {
    const path = `records/${encodeURIComponent(searchQuery)}`
    return AxiosCall({
      method: 'GET',
      path: path
    }, 'Bearer')
  }

  recordLineage(searchQuery) {
    return AxiosCall({
      method: 'GET',
      path: `records/${encodeURIComponent(searchQuery)}/lineage`
    }, 'Bearer')
  }

  discrepancyReviews(params = {}) {
    const query = new URLSearchParams(params).toString()
    return AxiosCall({
      method: 'GET',
      path: `discrepancy-reviews${query ? `?${query}` : ''}`
    }, 'Bearer')
  }

  discrepancyReview(searchQuery) {
    return AxiosCall({
      method: 'GET',
      path: `discrepancy-reviews/${encodeURIComponent(searchQuery)}`
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

  exportDiscrepancyBenchmark(params = {}) {
    const query = new URLSearchParams(params).toString()
    return AxiosCall({
      method: 'GET',
      path: `discrepancy-benchmark/export${query ? `?${query}` : ''}`,
      responseType: params.format === 'csv' ? 'text' : 'json'
    }, 'Bearer')
  }

  exportHighConfidenceSubset(format = 'json') {
    return AxiosCall({
      method: 'GET',
      path: `discrepancy-benchmark/high-confidence?format=${encodeURIComponent(format)}`,
      responseType: format === 'csv' ? 'text' : 'json'
    }, 'Bearer')
  }
  

}

export default new DashboardService();
