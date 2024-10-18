import { ref } from 'vue'
import { defineStore } from 'pinia'
import AboutService from '../services/about_metamp.service'
import Swal from 'sweetalert2'

export const useAboutStore = defineStore('about', () => {

  const about_data = ref({
    data: [],
    error: null,
    loader_status: false
  })

  /* Load user dashboard information */

  async function loadAboutPage(get_header = "none") {
    about_data.value.loader_status = true
    await AboutService.aboutServiceContent(get_header)
      .then((res) => {
        if (res) {
          let response = res?.data
          about_data.value.data = response
        }
        
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
    about_data, loadAboutPage
  }
})