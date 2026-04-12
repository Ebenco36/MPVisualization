import { ref } from 'vue'
import { defineStore } from 'pinia'
import DashboardService from '../services/dashboard.service'
import Swal from 'sweetalert2'
import { getKeyList } from "../utils/helpers"

export const useDashboardStore = defineStore('dashboard', () => {

  const dashboard = ref({
    dashData: [],
    groupGraph: null,
    membraneProteinGroup: null,
    trend: null,
    trendByMethods: null,
    headers: [],
    error: null,
    loader_status: false
  })

  const dashboardOthers = ref({
    trends_by_database_year: null,
    mean_resolution_by_year: null,
    error: null,
    loader_status: false
  })

  const dashboardMap = ref({
    map: null,
    map_data: null,
    country_data: null,
    release_structure_by_country: null,
    loader_status: false,
    error: null
  })

  const dashboardInconsistencies = ref({
    inconsistencies: null,
    loader_status: false,
    error: null
  })

  const loader_status = ref(false)
  const protein_details = ref({
    data: [],
    loader_status: false,
    error: []
  })

  const protein_details_new = ref({
    data: [],
    loader_status: false,
    error: [],
    message: null
  })

  const record_lineage = ref({
    data: null,
    loader_status: false,
    error: null
  })

  const discrepancy_review = ref({
    data: null,
    loader_status: false,
    error: null
  })

  const benchmark_status = ref({
    data: null,
    loader_status: false,
    error: null
  })

  /* Load user dashboard information */

  async function loadDashboardStat(get_header = "none", trend_width=800) {
    dashboard.value.loader_status = true
    await DashboardService.dashBoardStats(get_header, trend_width)
      .then((res) => {
        if (res) {
          let response = res?.data
          dashboard.value.dashData = response?.data
          dashboard.value.headers = getKeyList(response?.data?.items)
          if (get_header == "none") {
            dashboard.value.groupGraph = response?.group_graph_array
            dashboard.value.membraneProteinGroup = response?.membrane_group_chart
            dashboard.value.trend = response?.trend
            dashboard.value.trendByMethods = response?.trend_by_method
          }
        }
        dashboard.value.loader_status = false
      })
      .catch((error) => {
        console.log(error)
        dashboard.value.error = error
        Swal.fire({
          title: 'Error',
          text: dashboard.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        dashboard.value.loader_status = false
      })
  }

  async function loadDashboardStatOthers() {
    dashboardOthers.value.loader_status = true
    await DashboardService.dashBoardStatsOthers()
      .then((res) => {
        if (res) {
          let response = res?.data
          dashboardOthers.value.trends_by_database_year = response?.trends_by_database_year
          dashboardOthers.value.mean_resolution_by_year = response?.mean_resolution_by_year
        }
        dashboardOthers.value.loader_status = false
      })
      .catch((error) => {
        console.log(error)
        dashboard.value.error = error
        Swal.fire({
          title: 'Error',
          text: dashboard.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        dashboardOthers.value.loader_status = false
      })
  }

  async function dashBoardStatsMap() {
    dashboardMap.value.loader_status = true
    await DashboardService.dashBoardStatsMap()
      .then((res) => {
        if (res) {
          let response = res?.data
          
          dashboardMap.value.map = response?.map
          dashboardMap.value.map_data = response?.map_data
          dashboardMap.value.country_data = response?.get_country_data
          dashboardMap.value.release_structure_by_country = response?.release_by_country
          
        }
        dashboardMap.value.loader_status = false
      })
      .catch((error) => {
        console.log(error)
        dashboard.value.error = error
        Swal.fire({
          title: 'Error',
          text: dashboard.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        dashboardMap.value.loader_status = false
      })
  }

  async function loadDashboardInconsistencies(width=800) {
    dashboardInconsistencies.value.loader_status = true
    await DashboardService.dashBoardInconsistencies(width)
      .then((res) => {
        if (res) {
          let response = res?.data
          dashboardInconsistencies.value.inconsistencies = response?.inconsistencies
          
        }
        dashboardInconsistencies.value.loader_status = false
      })
      .catch((error) => {
        console.log(error)
        dashboardInconsistencies.value.error = error
        Swal.fire({
          title: 'Error',
          text: dashboard.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        dashboardInconsistencies.value.loader_status = false
      })
  }

  async function fetchDetails(pdb_code) {
    protein_details.value.loader_status = true
      const endpoint = "search-merged-db?q=" + encodeURIComponent(pdb_code)
      await DashboardService.fetchData(endpoint)
      .then((res) => {
          if (res) {
              let response = res?.data
              protein_details.value.data = response
          }
          protein_details.value.loader_status = false
      })
      .catch((error) => {
          console.log(error)
          protein_details.value.error = error
          Swal.fire({
              title: 'Error',
              text: protein_details.value.error,
              icon: 'error',
              confirmButtonText: 'OK'
          })
          protein_details.value.loader_status = false
      })
  }


  async function getExpertAnnotation(searchQuery) {
    protein_details_new.value.loader_status = true
    protein_details_new.value.error = null
    protein_details_new.value.message = null

    try {
      const res = await DashboardService.expertAnnotation(searchQuery)
      const response = res?.data || {}
      protein_details_new.value.data = response.data ?? null
      protein_details_new.value.message = response.message ?? null
      return response
    } catch (error) {
      console.log(error)
      protein_details_new.value.data = null
      protein_details_new.value.error = error
      protein_details_new.value.message = null
      Swal.fire({
        title: 'Error',
        text: protein_details_new.value.error,
        icon: 'error',
        confirmButtonText: 'OK'
      })
      throw error
    } finally {
      protein_details_new.value.loader_status = false
    }
  }

  async function getRecordLineage(searchQuery) {
    record_lineage.value.loader_status = true
    try {
      const res = await DashboardService.recordLineage(searchQuery)
      record_lineage.value.data = res?.data?.data || null
    } catch (error) {
      console.log(error)
      record_lineage.value.error = error
    } finally {
      record_lineage.value.loader_status = false
    }
  }

  async function getDiscrepancyReview(searchQuery) {
    discrepancy_review.value.loader_status = true
    try {
      const res = await DashboardService.discrepancyReview(searchQuery)
      discrepancy_review.value.data = res?.data?.data || null
    } catch (error) {
      console.log(error)
      discrepancy_review.value.error = error
      discrepancy_review.value.data = null
    } finally {
      discrepancy_review.value.loader_status = false
    }
  }

  async function updateDiscrepancyReview(searchQuery, payload) {
    discrepancy_review.value.loader_status = true
    try {
      const res = await DashboardService.updateDiscrepancyReview(searchQuery, payload)
      discrepancy_review.value.data = res?.data?.data || null
      return discrepancy_review.value.data
    } catch (error) {
      console.log(error)
      discrepancy_review.value.error = error
      throw error
    } finally {
      discrepancy_review.value.loader_status = false
    }
  }

  async function getBenchmarkStatus() {
    benchmark_status.value.loader_status = true
    try {
      const res = await DashboardService.discrepancyBenchmarkStatus()
      benchmark_status.value.data = res?.data?.data || null
    } catch (error) {
      console.log(error)
      benchmark_status.value.error = error
      benchmark_status.value.data = null
    } finally {
      benchmark_status.value.loader_status = false
    }
  }


  return { 
    dashboard, protein_details, protein_details_new,
    record_lineage, discrepancy_review, benchmark_status,
    loader_status, dashboardMap, 
    dashboardOthers, dashboardInconsistencies, 
    loadDashboardStat, dashBoardStatsMap, 
    loadDashboardStatOthers, fetchDetails, 
    loadDashboardInconsistencies, getExpertAnnotation,
    getRecordLineage, getDiscrepancyReview, updateDiscrepancyReview, getBenchmarkStatus
  }
})
