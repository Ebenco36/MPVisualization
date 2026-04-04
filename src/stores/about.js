import { ref } from 'vue'
import { defineStore } from 'pinia'
import AboutService from '../services/about_metamp.service'
import Swal from 'sweetalert2'

export const useAboutStore = defineStore('about', () => {
  const about_data = ref({
    data: [],
    summary: { rows: [], generated_at: null },
    error: null,
    loader_status: false
  })

  async function loadAboutPage() {
    about_data.value.loader_status = true

    await Promise.all([
      AboutService.aboutServiceContent(),
      AboutService.aboutSummaryContent()
    ])
      .then(([aboutRes, summaryRes]) => {
        about_data.value.data = aboutRes?.data || {}
        about_data.value.summary = summaryRes?.data || { rows: [], generated_at: null }
        about_data.value.loader_status = false
      })
      .catch((error) => {
        console.log(error)
        about_data.value.error = error
        Swal.fire({
          title: 'Error',
          text: about_data.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        about_data.value.loader_status = false
      })
  }

  return {
    about_data,
    loadAboutPage
  }
})
