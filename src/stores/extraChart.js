import { ref } from 'vue'
import { defineStore } from 'pinia'
import extraDataLoad from '../services/extra_chart.service'
import Swal from 'sweetalert2'

export const useExtraStore = defineStore('extra_chart', () => {

  const extra = ref({
    dataList: [],
    message: "",
    error: null
  })
  /* Load user dashboard information */

  async function loadExtraData(param) {
    extra.value.error = null
    extra.value.message = null
    await extraDataLoad.loadExtraData(param)
      .then((res) => {
        if (res) {
          let response = res?.data
          extra.value.dataList = JSON.parse(response?.data)
        }
      })
      .catch((error) => {
        console.log(error)
        extra.value.error = error
        Swal.fire({
          title: 'Error',
          text: extra.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      })
  }
  return { extra, loadExtraData }
})