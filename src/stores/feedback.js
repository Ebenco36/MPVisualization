import { ref } from 'vue'
import { defineStore } from 'pinia'
import FeedbackService from '../services/feedback.service'
import Swal from 'sweetalert2'

export const useFeedbackStore = defineStore('feedback', () => {

  const feedback = ref({
    feedbackQuestion: [],
    error: null
  })
  /* Load user dashboard information */

  async function loadFeedbackData() {
    await FeedbackService.loadFeedbackData()
      .then((res) => {
        if (res) {
          let response = res?.data
          feedback.value.feedbackQuestion = response
        }
      })
      .catch((error) => {
        feedback.value.error = error
        Swal.fire({
          title: 'Error',
          text: feedback.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      })
  }

  async function submitFeedback(data) {
    return await FeedbackService.postFeedback(data)
      .then((response) => {
        return response?.data
      })
      .catch((error) => {
        feedback.value.error = error
        Swal.fire({
          title: 'Error',
          text: feedback.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      })
  }

  return { feedback, loadFeedbackData, submitFeedback }
})
