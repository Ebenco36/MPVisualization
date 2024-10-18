import { ref } from 'vue'
import { defineStore } from 'pinia'
import ContactService from '../services/contact.service'
import Swal from 'sweetalert2'

export const useContactStore = defineStore('contact', () => {

  const contact = ref({
    contactList: [],
    message: "",
    error: null
  })
  /* Load user dashboard information */

  async function loadContactData() {
    contact.value.error = null
    contact.value.message = null
    await ContactService.loadContactData()
      .then((res) => {
        if (res) {
          let response = res?.data
          contact.value.contactList = response
        }
      })
      .catch((error) => {
        console.log(error)
        contact.value.error = error
        Swal.fire({
          title: 'Error',
          text: contact.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      })
  }

  async function submitContact(data) {
    contact.value.error = null
    contact.value.message = null
    await ContactService.postContact(data)
      .then((res) => {
        if (res) {
          let response = res?.data
          contact.value.message = response?.message
        }
      })
      .catch((error) => {
        console.log(error)
        contact.value.error = error
        Swal.fire({
          title: 'Error',
          text: contact.value.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      })
  }

  return { contact, loadContactData, submitContact }
})