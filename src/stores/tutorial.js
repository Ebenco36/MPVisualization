import { ref } from 'vue'
import { defineStore } from 'pinia'
import EvaluationService from '../services/evaluation.service'
import Swal from 'sweetalert2'
import { getKeyList } from "../utils/helpers"

export const useTutorialStore = defineStore('tutorial', () => {

    const tutorial = ref({
      step: 1,
      data: [],
      chart: null,
      dataset: null,
      headers: [],
      error: null
    })

    const dimensionality_reduction_selection = ref("")
    const dimensionality_reduction_selection_options = ref({})
    const isLoading = ref(false)

    // tutorial.value.dataset = response?.data?.dataset
    function chooseDataset(dataset) {
        tutorial.value.dataset = dataset
    }

    function unsetDataset() {
        tutorial.value.dataset = null
    }
    /* Load ML Response */

    async function TutorialPipeline(endpoint, data) {
        isLoading.value = true
        await EvaluationService.postData(endpoint, data)
        .then((res) => {
            if (res) {
                let response = res?.data
                if([1, 2, 3].includes(tutorial.value.step)) {
                    const outputArray = getKeyList(response?.data).map(item => {
                        return { title: item, value: item };
                    });
                    tutorial.value.headers = outputArray
                    tutorial.value.data = response?.data
                    tutorial.value.chart = response?.chart
                } else {
                    const outputArray = getKeyList(response?.data?.data).map(item => {
                        return { title: item, value: item };
                    });
                    tutorial.value.headers = outputArray
                    tutorial.value.data = response?.data?.data
                    tutorial.value.chart = response?.data?.chart
                }

                isLoading.value = false
            }
        })
        .catch((error) => {
            isLoading.value = false
            tutorial.value.error = error
            console.log(error)
            Swal.fire({
                title: 'Error',
                text: tutorial.value?.error?.response?.data?.message,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        })
    }

    function updateStep(step_number) {
        tutorial.value.step = step_number
    }

    function updateDimensionalityReductionData(data) {
        dimensionality_reduction_selection.value = data
    }

    function updateDimensionalityReductionDataOptions(data) {
        dimensionality_reduction_selection_options.value = data
    }

    return { 
        tutorial, 
        TutorialPipeline, 
        isLoading, updateStep, 
        chooseDataset, unsetDataset,
        updateDimensionalityReductionData,
        dimensionality_reduction_selection,
        updateDimensionalityReductionDataOptions,
        dimensionality_reduction_selection_options
    }

})   