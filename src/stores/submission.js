import { ref } from 'vue'
import { defineStore } from 'pinia'
import SubmissionService from '../services/submission.service'
import Swal from 'sweetalert2'

export const useSubmissionStore = defineStore('submission', () => {

  const submission = ref({
    submissionQuestion: [],
    latestSubmission: null,
    error: null,
    isSubmitting: false
  })
  /* Load user dashboard information */

  async function loadSubmissionData() {
    await SubmissionService.loadSubmissionData()
      .then((res) => {
        if (res) {
          let response = res?.data
          submission.value.feedbackQuestion = response
        }
      })
      .catch((error) => {
        console.log(error)
        submission.value.error = error
        Swal.fire({
          title: 'Error',
          text: submission.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      })
  }

  async function submitSubmission(data) {
    submission.value.isSubmitting = true
    submission.value.error = null

    return await SubmissionService.postSubmission(data)
      .then((response) => {
        submission.value.latestSubmission = response?.data ?? null
        return response?.data
      })
      .catch((error) => {
        console.log(error)
        submission.value.error = error
        throw error
      })
      .finally(() => {
        submission.value.isSubmitting = false
      })
  }

  return { submission, loadSubmissionData, submitSubmission }
})
