import { ref } from 'vue'
import { defineStore } from 'pinia'
import EvaluationService from '../services/evaluation.service'
import Swal from 'sweetalert2'
import { getKeyList } from "../utils/helpers"

export const useEvaluationStore = defineStore('evaluation', () => {

    const evaluation = ref({
      data: [],
      ML_chart: null,
      DR_chart: null,
      dataset: null,
      accuracy_metrics: null,
      headers: [],
      error: null
    })
    const isLoading = ref(false)

    /* Load ML Response */

    async function MLPipeline(data) {
        isLoading.value = true
        const endpoint = "data-view-ML"
        await EvaluationService.postData(endpoint, data)
        .then((res) => {
            if (res) {
                let response = res?.data
                const outputArray = getKeyList(response?.data?.data).map(item => {
                    return { title: item, value: item };
                });
                evaluation.value.headers = outputArray
                evaluation.value.data = response?.data?.data
                evaluation.value.ML_chart = response?.data?.chart
                evaluation.value.DR_chart = response?.data?.DR_chart
                evaluation.value.dataset = response?.data?.dataset
                evaluation.value.accuracy_metrics = response?.data?.accuracy_metrics
                isLoading.value = false
            }
        })
        .catch((error) => {
            isLoading.value = false
            evaluation.value.error = error
            console.log(evaluation.value)
            Swal.fire({
                title: 'Error',
                text: evaluation.value?.error?.response?.data?.message,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        })
    }

    return { evaluation, MLPipeline, isLoading }

})   