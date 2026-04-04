import { ref } from 'vue';
import { defineStore } from 'pinia';
import UseCasesService from '../services/use_cases.service';
import Swal from 'sweetalert2';

export const useCasesStore = defineStore('use_cases', () => {
  const use_cases_data = ref({
    data: [],
    error: null,
    loader_status: false,
  });

  const expert_results = ref({
    data: [],
    error: null,
    loader_status: false,
  });

  const discrepancy_review_queue = ref({
    data: [],
    pagination: {
      page: 1,
      per_page: 25,
      total_items: 0,
      total_pages: 1,
      returned_items: 0,
      has_prev: false,
      has_next: false,
    },
    filters: {
      status: null,
      disagreement_only: false,
      search: null,
    },
    export_formats: ['json', 'csv', 'xlsx', 'tsv'],
    error: null,
    loader_status: false,
  });

  const discrepancy_review_summary = ref({
    data: null,
    error: null,
    loader_status: false,
  });

  const benchmark_status = ref({
    data: null,
    error: null,
    loader_status: false,
  });

  const case_studies = ref({
    data: null,
    error: null,
    loader_status: false,
  });

  const added_value = ref({
    data: null,
    error: null,
    loader_status: false,
  });

  const get_use_cases_chart_data = ref({
    data: [],
    error: null,
    loader_status: false,
  });

  async function loadUseCases(get_header = 'none') {
    use_cases_data.value.loader_status = true;
    try {
      const res = await UseCasesService.useCasesContent(get_header);
      if (res) {
        use_cases_data.value.data = res.data || [];
      }
    } catch (error) {
      handleError(error, use_cases_data);
    } finally {
      use_cases_data.value.loader_status = false;
    }
  }

  async function loadExpertAndMLClassifications(params = { disagreement_only: false }) {
    expert_results.value.loader_status = true;
    try {
      const payload = await loadDiscrepancyReviewQueue(params);
      expert_results.value.data = payload?.items || [];
    } catch (error) {
      handleError(error, expert_results);
    } finally {
      expert_results.value.loader_status = false;
    }
  }

  async function loadDiscrepancyReviewQueue(params = { disagreement_only: false }) {
    discrepancy_review_queue.value.loader_status = true;
    try {
      const res = await UseCasesService.discrepancyReviews(params);
      const payload = res?.data?.data || {};
      discrepancy_review_queue.value.data = payload?.items || [];
      discrepancy_review_queue.value.pagination = payload?.pagination || discrepancy_review_queue.value.pagination;
      discrepancy_review_queue.value.filters = payload?.filters || discrepancy_review_queue.value.filters;
      discrepancy_review_queue.value.export_formats = payload?.export_formats || discrepancy_review_queue.value.export_formats;
      return payload;
    } catch (error) {
      handleError(error, discrepancy_review_queue);
      return null;
    } finally {
      discrepancy_review_queue.value.loader_status = false;
    }
  }

  async function loadDiscrepancyReviewSummary(params = { disagreement_only: false }) {
    discrepancy_review_summary.value.loader_status = true;
    try {
      const res = await UseCasesService.discrepancyReviewSummary(params);
      discrepancy_review_summary.value.data = res?.data?.data || null;
      return discrepancy_review_summary.value.data;
    } catch (error) {
      handleError(error, discrepancy_review_summary, 'Discrepancy summary could not be loaded.');
      return null;
    } finally {
      discrepancy_review_summary.value.loader_status = false;
    }
  }

  async function updateDiscrepancyReview(searchQuery, payload) {
    discrepancy_review_queue.value.loader_status = true;
    try {
      const res = await UseCasesService.updateDiscrepancyReview(searchQuery, payload);
      return res?.data?.data || null;
    } catch (error) {
      handleError(error, discrepancy_review_queue);
      throw error;
    } finally {
      discrepancy_review_queue.value.loader_status = false;
    }
  }

  async function loadBenchmarkStatus() {
    benchmark_status.value.loader_status = true;
    try {
      const res = await UseCasesService.discrepancyBenchmarkStatus();
      benchmark_status.value.data = res?.data?.data || null;
      return benchmark_status.value.data;
    } catch (error) {
      handleError(error, benchmark_status, 'Benchmark status could not be loaded.');
      return null;
    } finally {
      benchmark_status.value.loader_status = false;
    }
  }

  async function loadCaseStudies() {
    case_studies.value.loader_status = true;
    try {
      const res = await UseCasesService.dashboardCaseStudies();
      case_studies.value.data = res?.data?.data || null;
      return case_studies.value.data;
    } catch (error) {
      handleError(error, case_studies, 'Case studies could not be loaded.');
      return null;
    } finally {
      case_studies.value.loader_status = false;
    }
  }

  async function loadAddedValue() {
    added_value.value.loader_status = true;
    try {
      const res = await UseCasesService.dashboardAddedValue();
      added_value.value.data = res?.data?.data || null;
      return added_value.value.data;
    } catch (error) {
      handleError(error, added_value, 'Added-value summary could not be loaded.');
      return null;
    } finally {
      added_value.value.loader_status = false;
    }
  }

  async function exportHighConfidenceSubset(format = 'json') {
    const res = await UseCasesService.exportHighConfidenceSubset(format);
    return res || null;
  }

  async function exportDiscrepancyReviewQueue(params = {}, format = 'csv') {
    const res = await UseCasesService.exportDiscrepancyReviews(params, format);
    return res || null;
  }

  async function getUseCasesChart(data) {
    get_use_cases_chart_data.value.loader_status = true;
    try {
      const res = await UseCasesService.postCasesContent(data);
      if (res) {
        get_use_cases_chart_data.value.data = res?.data || [];
      }
    } catch (error) {
      handleError(error, get_use_cases_chart_data, 'Error has occurred. We are working on this.');
    } finally {
      get_use_cases_chart_data.value.loader_status = false;
    }
  }

  function handleError(error, dataRef, customMessage = null) {
    dataRef.value.error = error;
    console.error(error);
    Swal.fire({
      title: 'Error',
      text: customMessage || error.message || 'An error occurred',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  return {
    use_cases_data,
    expert_results,
    discrepancy_review_queue,
    discrepancy_review_summary,
    benchmark_status,
    case_studies,
    added_value,
    get_use_cases_chart_data,
    loadUseCases,
    getUseCasesChart,
    loadExpertAndMLClassifications,
    loadDiscrepancyReviewQueue,
    loadDiscrepancyReviewSummary,
    updateDiscrepancyReview,
    loadBenchmarkStatus,
    loadCaseStudies,
    loadAddedValue,
    exportHighConfidenceSubset,
    exportDiscrepancyReviewQueue
  };
});
