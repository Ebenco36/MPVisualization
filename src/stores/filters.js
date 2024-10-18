import { ref } from 'vue'
import { defineStore } from 'pinia'
import DashboardService from '../services/dashboard.service'
import Swal from 'sweetalert2'

export const useFilterStore = defineStore('filter', () => {

    const filters = ref({
      data: [],
      error: []
    })


    /* Load ML Response */

    async function loadFilters() {
        const endpoint = "data-view-filters"
        await DashboardService.fetchData(endpoint)
        .then((res) => {
            if (res) {
                let response = res?.data
                filters.value.data = response?.data
                console.log(response)
            }
        })
        .catch((error) => {
            console.log(error)
            filters.value.error = error
            Swal.fire({
                title: 'Error',
                text: filters.value.error,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        })
    }

    return { filters, loadFilters }

})   