import { ref } from 'vue'
import { defineStore } from 'pinia'
import WelcomeService from '../services/welcome.service'
import Swal from 'sweetalert2'

export const useWelcomeStore = defineStore('welcome', () => {

  const welcome_data = ref({
    data: [],
    error: null,
    loader_status: false
  })

  /* Load user dashboard information */

  async function loadWelcomePage(get_header = "none") {
    welcome_data.value.loader_status = true
    await WelcomeService.welcomePageContent(get_header)
      .then((res) => {
        if (res) {
          let response = res?.data
          welcome_data.value.data = response
        }
        
        welcome_data.value.loader_status = false
      })
      .catch((error) => {
        console.log(error)
        welcome_data.value.error = error
        Swal.fire({
          title: 'Error',
          text: welcome_data.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        welcome_data.value.loader_status = false
      })
  }

  return { 
    welcome_data, loadWelcomePage
  }
})