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
    const latestRequestId = ref(0)

    /* Load ML Response */

    async function MLPipeline(data) {
        const requestId = latestRequestId.value + 1
        latestRequestId.value = requestId
        isLoading.value = true
        const endpoint = "data-view-ML"
        return await EvaluationService.postData(endpoint, data)
        .then((res) => {
            if (requestId !== latestRequestId.value) {
                return null
            }
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
                evaluation.value.error = null
                isLoading.value = false
                return response
            }
            isLoading.value = false
            return null
        })
        .catch((error) => {
            if (requestId !== latestRequestId.value) {
                return null
            }
            isLoading.value = false
            evaluation.value.error = error
            console.log(evaluation.value)
            Swal.fire({
                title: 'Error',
                text: evaluation.value?.error?.response?.data?.message,
                icon: 'error',
                confirmButtonText: 'OK'
            })
            return null
        })
    }

    return { evaluation, MLPipeline, isLoading }

})   
