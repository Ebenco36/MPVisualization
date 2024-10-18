import { ref } from 'vue'
import { defineStore } from 'pinia'
import SubmissionService from '../services/submission.service'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

export const useSubmissionStore = defineStore('submission', () => {

  const router = useRouter()
  const submission = ref({
    submissionQuestion: [],
    error: null
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
    await SubmissionService.postSubmission(data)
      .then((response) => {
        return response
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

  return { submission, loadSubmissionData, submitSubmission }
})