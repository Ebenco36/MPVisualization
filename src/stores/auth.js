import { ref } from 'vue'
import { defineStore } from 'pinia'
import globalFigs from '../config/constants'
import AuthService from '../services/auth.service'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const auth = ref({
    token: localStorage.getItem(globalFigs.token),
    user: JSON.parse(localStorage.getItem(globalFigs.user)),
    returnPath: null,
    isLoading: false,
    error: null
  })
  /* Setup token */

  async function loadUser() {
    const token = localStorage.getItem(globalFigs.token);
    if (token) {
      auth.value.token = token;
      await AuthService.loadUser()
        .then((res) => {
          auth.value.user = res?.data?.data
          localStorage.setItem(globalFigs.user, JSON.stringify(res?.data?.data))
        })
        .catch((error) => {
          console.error({ error })
        })
    } else {
      AuthService.logout()
    }
  }


  async function updateUser(user_id, data) {
    await AuthService.updateUser(user_id, data)
    .then((res) => {
      loadUser()
      console.log(res?.data?.message)
    })
    .catch((error) => {
      console.error({ error })
    })
  }



  async function login(userData) {
    auth.value.isLoading = true;
    /*
    setTimeout(() => {
      let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NCwiZW1haWwiOiJhZG1pbjFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJvbGExMTAwMCIsImV4cCI6MTcwMjA0NDgwMn0.Q3kOLpgjUO7oLdX6OVyOoBLHIAGBkb9CAMOJSMZdV_4'
      let user = { "name": "Oladele", "phone": "090827773882", "username": "ola200", ...userData }
      localStorage.setItem(globalFigs.token, token)
      localStorage.setItem(globalFigs.user, JSON.stringify(user))
      auth.value.user = user
      auth.value.token = token
      auth.value.isLoading = false
      // router.push('/dashboard')
      router.replace('/dashboard')
    }, 3000)
    */

    await AuthService.login(userData)
       .then(res => {
          let response = res?.data
          localStorage.setItem(globalFigs.token, response?.data?.token)
          localStorage.setItem(globalFigs.user, JSON.stringify(response?.data?.user))
          auth.value.user = response?.data?.user
          auth.value.token = response?.data?.token
          auth.value.isLoading = false
          router.replace('/welcome').then(() => {
            window.location.reload();
          });
       })
       .catch((error) => {
         auth.value.isLoading = false;
         auth.value.error = error.message;
         setTimeout(() => {
           auth.value.error = null;
         }, 3000)
       });
  }

  async function register(userData) {
    auth.value.isLoading = true;
    await AuthService.register(userData)
      .then(res => {
        let response = res?.data
        if (response.status === true) {
          auth.value.isLoading = false;
          router.replace('/login')
        }
      })
      .catch((error) => {
        auth.value.isLoading = false;
        auth.value.error = error.message;
        setTimeout(() => {
          auth.value.error = null;
        }, 3000)
      })
  }

  async function forgotPassword(userData) {
    await AuthService.forgotPassword(userData)
      .then((res) => {
        /* 
          TODO redirect to completed page or to password setup page
          
        */
        console.log(res);
      })
      .catch((error) => {
        auth.value.isLoading = false;
        auth.value.error = error.message;
        setTimeout(() => {
          auth.value.error = null;
        }, 3000)
      })
  }

  async function logout() {

    await AuthService.logout()
      .then(res => {
        let response = res?.data
        if(response.status)
          localStorage.removeItem(globalFigs.token);
          localStorage.removeItem(globalFigs.user);
          auth.value.user = null
          auth.value.token = null
          router.replace('/login')
      })
      .catch((error) => {
        auth.value.isLoading = false;
        auth.value.error = error.message;
        setTimeout(() => {
          auth.value.error = null;
        }, 3000)
      });
  }

  /* Validate user */
  /* Store user data */

  return { auth, loadUser, login, register, logout, updateUser, forgotPassword }
})