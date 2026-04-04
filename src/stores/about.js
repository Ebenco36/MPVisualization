import { ref } from 'vue'
import { defineStore } from 'pinia'
import AboutService from '../services/about_metamp.service'
import Swal from 'sweetalert2'

export const useAboutStore = defineStore('about', () => {
  const requestId = ref(0)
  const about_data = ref({
    data: [],
    summary: { rows: [], generated_at: null },
    error: null,
    loader_status: false
  })

  async function loadAboutPage() {
    const currentRequestId = requestId.value + 1
    requestId.value = currentRequestId
    about_data.value.loader_status = true
    about_data.value.error = null

    const [aboutResult, summaryResult] = await Promise.allSettled([
      AboutService.aboutServiceContent(),
      AboutService.aboutSummaryContent()
    ])

    if (currentRequestId !== requestId.value) {
      return
    }

    const aboutResponse = aboutResult.status === 'fulfilled' ? aboutResult.value?.data : null
    const summaryResponse = summaryResult.status === 'fulfilled' ? summaryResult.value?.data : null

    about_data.value.data = aboutResponse || {}
    about_data.value.summary = summaryResponse || { rows: [], generated_at: null }
    about_data.value.loader_status = false

    const primaryError =
      (aboutResult.status === 'rejected' && aboutResult.reason) ||
      (summaryResult.status === 'rejected' && summaryResult.reason) ||
      null

    if (primaryError) {
      console.log(primaryError)
      about_data.value.error = primaryError
      if (!aboutResponse && !summaryResponse) {
        Swal.fire({
          title: 'Error',
          text: about_data.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    }
  }

  return {
    about_data,
    loadAboutPage
  }
})
