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

  const get_use_cases_chart_data = ref({
    data: [],
    error: null,
    loader_status: false,
  });

  /* Load user dashboard information */
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

  async function getUseCasesChart(data) {
    console.log(data)
    get_use_cases_chart_data.value.loader_status = true;
    try {
      const res = await UseCasesService.postCasesContent(data);
      if (res) {
        get_use_cases_chart_data.value.data = res?.data || [];
        console.log(res?.data)
      }
    } catch (error) {
      handleError(error, get_use_cases_chart_data, "Error has occurred. We are working on this.");
    } finally {
      get_use_cases_chart_data.value.loader_status = false;
    }
  }

  function handleError(error, dataRef, customMessage = null) {
    dataRef.value.error = error;
    console.error(error);
    Swal.fire({
      title: 'Error',
      text: customMessage || error.message || "An error occurred",
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  return { 
    use_cases_data, 
    get_use_cases_chart_data, 
    loadUseCases, 
    getUseCasesChart 
  };
});
