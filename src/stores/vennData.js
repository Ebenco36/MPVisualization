import { ref } from 'vue'
import { defineStore } from 'pinia'
import vennDataLoad from '../services/venn.service'
import Swal from 'sweetalert2'

export const useVennStore = defineStore('venn', () => {

  const venn = ref({
    dataList: [],
    message: "",
    error: null
  })
  /* Load user dashboard information */

  async function loadVennData() {
    venn.value.error = null
    venn.value.message = null
    await vennDataLoad.loadVennData()
      .then((res) => {
        if (res) {
          let response = res?.data
          venn.value.dataList = response?.data
          console.log(venn.value.dataList)
        }
      })
      .catch((error) => {
        console.log(error)
        venn.value.error = error
        Swal.fire({
          title: 'Error',
          text: venn.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      })
  }
  return { venn, loadVennData }
})